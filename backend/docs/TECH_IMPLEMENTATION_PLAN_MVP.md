# Doceamor Booking System
## Technical Implementation Plan (Mapped to Current Django Code)

Version: 1.0  
Date: February 21, 2026

## 1. Purpose
Translate the approved BRD into concrete backend implementation tasks mapped to the current Django models/viewsets.

## 2. Current vs Target Summary
### Current (already implemented)
1. Core models exist: `Service`, `Staff`, `Availability`, `Booking`
2. CRUD endpoints exist via DRF `ModelViewSet`
3. Slot-lock flag `Availability.is_booked` exists
4. Slot uniqueness and time checks exist

### Target (required by BRD)
1. Replace initial booking state with `awaiting_payment`
2. Add payment timeout auto-cancel after 30 minutes (configurable)
3. Enforce status transition rules (`awaiting_payment -> confirmed -> completed`, cancel paths)
4. Prevent inactive service/staff from new bookings
5. Add guest contact number requirement
6. Add payment verification metadata (who/when)
7. Protect completed bookings from edits/deletes
8. Add query endpoints/filters aligned with frontend flow

---

## 3. Change Set by Layer

## A. Data Model Changes
Files:
1. `backend/apps/bookings/models.py`
2. `backend/apps/services/models.py`
3. `backend/apps/bookings/migrations/*.py` (new)

Planned updates:
1. `Booking.Status`
Current: `pending, confirmed, completed, cancelled`  
Target: `awaiting_payment, confirmed, completed, cancelled`

2. `Booking` fields to add:
1. `customer_phone` (`CharField`, required)
2. `payment_expires_at` (`DateTimeField`, indexed)
3. `payment_verified_at` (`DateTimeField`, null=True, blank=True)
4. `payment_verified_by` (`ForeignKey` to user model, null=True, blank=True, `on_delete=SET_NULL`)
5. Optional: `cancel_reason` (`TextField`, blank=True)

3. `Booking` business logic in model/service layer:
1. set `payment_expires_at = created_at + timeout_minutes`
2. guard invalid transitions
3. disallow updates once `completed`

4. `Availability` data integrity hardening:
1. keep `is_booked` as denormalized lock flag for fast lookup
2. ensure it is always synchronized in transactional operations

5. `Service`/`Staff` activity checks:
1. keep `is_active`
2. enforce in booking creation that selected service/staff are active

---

## B. API and Serializer Changes
Files:
1. `backend/apps/bookings/serializers.py`
2. `backend/apps/bookings/views.py`
3. `backend/apps/bookings/urls.py`
4. `backend/apps/services/views.py`

Planned updates:
1. `BookingSerializer`
1. add `customer_phone`
2. mark `payment_expires_at`, `payment_verified_at`, `payment_verified_by` read-only for guests
3. validate service/staff activity
4. validate slot is future and unbooked
5. enforce transition rules on update:
`awaiting_payment -> confirmed/cancelled`
`confirmed -> completed/cancelled`
`completed -> (no transitions)`
`cancelled -> (no transitions)`

2. `BookingViewSet`
1. `perform_create`: always create with `awaiting_payment` for public/guest flow
2. atomic lock on availability row (`select_for_update`) to prevent races
3. prevent PATCH/PUT on completed bookings
4. prevent DELETE for completed bookings (soft-cancel flow instead)
5. add custom actions:
`POST /api/bookings/{id}/verify-payment/`
`POST /api/bookings/{id}/cancel/`
`POST /api/bookings/{id}/complete/`

3. `AvailabilityViewSet` filters
1. add query params: `service`, `staff`, `date`, `is_booked`
2. default customer-facing list should return only future, unbooked, active-related slots

4. `ServiceViewSet` and `StaffViewSet`
1. default list for public flow only returns `is_active=True`
2. admin endpoints may include all (via permission or query flag)

---

## C. Background Job Design (Auto-Cancel)
Recommended MVP approach: Django management command + scheduler.

Files to add:
1. `backend/apps/bookings/management/commands/expire_unpaid_bookings.py`
2. `backend/apps/bookings/services.py` (domain functions reused by API + command)
3. `backend/config/settings/base.py` (timeout settings)

Settings:
1. `BOOKING_PAYMENT_TIMEOUT_MINUTES=30`
2. `BOOKING_TIMEZONE=<single business timezone>`

Command behavior:
1. find bookings where:
`status='awaiting_payment'` and `payment_expires_at <= now()`
2. in batches, atomic update to `cancelled`
3. release linked `Availability.is_booked`
4. idempotent (safe to run repeatedly)
5. emit logs for observability

Scheduling:
1. run every 1-5 minutes using:
1. Windows Task Scheduler / cron (MVP)
2. optional Celery beat (Phase 2+)

---

## D. Permissions and Role Boundaries (MVP-light)
Files:
1. `backend/config/settings/base.py`
2. `backend/apps/bookings/views.py`
3. `backend/apps/services/views.py`

Plan:
1. keep guest create path open only for booking create + availability read
2. restrict admin/state-changing actions (`verify-payment`, `complete`, staff/service management)
3. if auth is deferred, isolate admin endpoints under separate route namespace and temporary token guard

---

## E. API Contract (MVP Endpoints)
Public/Guest:
1. `GET /api/services/` (active only)
2. `GET /api/bookings/availability/?service=&date=` (bookable slots)
3. `POST /api/bookings/` (creates `awaiting_payment`, returns payment instructions + expiry)

Admin/Operations:
1. `GET /api/bookings/?status=awaiting_payment`
2. `POST /api/bookings/{id}/verify-payment/`
3. `POST /api/bookings/{id}/cancel/`
4. `POST /api/bookings/{id}/complete/`
5. CRUD for `services`, `staff`, `availability`

---

## 4. Transaction and Concurrency Design
Critical paths:
1. booking creation
2. verify payment
3. cancel/auto-cancel

Implementation strategy:
1. wrap each critical action in `transaction.atomic()`
2. lock target `Availability` row with `select_for_update()`
3. re-check slot state inside transaction before update
4. return HTTP `409 Conflict` when slot already taken

---

## 5. Migration Plan
1. Create schema migration:
1. status choices update
2. add new booking fields
3. add indexes (`status`, `payment_expires_at`, `created_at`)

2. Data migration:
1. map legacy `pending` -> `awaiting_payment`
2. backfill `payment_expires_at` for existing unpaid bookings using `created_at + timeout`

3. Deploy sequence:
1. deploy code compatible with both old/new status values
2. run migration
3. switch write path to new statuses/actions
4. remove compatibility fallback in next release

---

## 6. Test Plan
Files to add:
1. `backend/apps/bookings/tests/test_models.py`
2. `backend/apps/bookings/tests/test_serializers.py`
3. `backend/apps/bookings/tests/test_viewsets.py`
4. `backend/apps/bookings/tests/test_expire_unpaid_bookings.py`

### Unit tests
1. booking status transition validation
2. completed booking immutability
3. service/staff active checks
4. slot booking and release behavior
5. payment expiry calculation

### API tests
1. guest can create booking with required fields
2. booking create returns `awaiting_payment` + expiry
3. cannot book inactive service/staff
4. cannot book already-booked slot
5. verify-payment transitions correctly
6. complete only from confirmed
7. cancellation blocked after slot start

### Concurrency tests
1. two parallel create requests same slot -> one success, one conflict
2. simultaneous verify/cancel on same booking resolves consistently

### Job tests
1. unpaid expired bookings auto-cancel and release slot
2. non-expired unpaid bookings unchanged
3. command idempotency

---

## 7. Implementation Sequence (Execution Order)
1. Model and migration changes (`Booking` statuses/fields)
2. Domain service functions for transitions and slot lock handling
3. Serializer/viewset transition enforcement + custom actions
4. Availability/service/staff public filters for active + bookable data
5. Auto-cancel management command + settings
6. End-to-end test suite
7. API docs update for frontend integration

---

## 8. Definition of Done (Technical)
1. All BRD status rules enforced by code and tests
2. No double-booking under concurrent requests
3. Auto-cancel worker reliably frees stale unpaid slots
4. Completed bookings are immutable
5. Public endpoints support guest flow end-to-end
6. Test suite green for unit/API/job/concurrency cases

---

## 9. Immediate Next Implementation Ticket Set
1. T1: Replace `pending` with `awaiting_payment` and add booking payment fields
2. T2: Implement booking transition service + custom DRF actions
3. T3: Add unpaid expiry command and timeout setting
4. T4: Add active-only/public availability filtering
5. T5: Add full tests for transitions, expiry, and concurrency

