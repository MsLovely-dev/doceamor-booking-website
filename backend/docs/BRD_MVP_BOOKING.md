# Doceamor Booking System
## Business Requirements Document (MVP)

Version: 1.0  
Date: February 21, 2026  
Scope: Phase 1 / MVP

## 1. Purpose
Define business and system requirements for the MVP booking platform with guest booking and payment-gated confirmation.

## 2. Business Goals
1. Enable customers to book services online without account creation.
2. Protect slot inventory from unpaid booking hoarding.
3. Provide operations team/admin a clear workflow for payment verification and booking management.
4. Preserve historical data integrity for reporting and audit.

## 3. Stakeholders
1. Customer (guest)
2. Admin/Operations
3. Staff/Service provider
4. Business owner
5. Engineering team

## 4. MVP Scope
### In Scope
1. Service catalog management
2. Staff management
3. Availability slot management
4. Guest booking creation (name, contact number, email required)
5. Payment instructions display via QR (GCash, BDO)
6. Payment-gated confirmation workflow
7. Booking lifecycle management and cancellation
8. Auto-cancel unpaid bookings after timeout (default 30 minutes, configurable)
9. Historical retention for inactive staff/services and completed/cancelled bookings

### Out of Scope
1. Fully automated payment gateway integration
2. System-computed refund automation
3. Multi-timezone and per-location timezone support
4. Advanced analytics dashboards
5. Customer login/account management in MVP

## 5. Core Business Rules
1. Guest booking is allowed without login.
2. Initial status on create: `awaiting_payment`.
3. Slot is locked immediately when booking is created.
4. Admin verifies payment manually.
5. On payment verification, status transitions to `confirmed`.
6. If unpaid past timeout (default 30 minutes), booking auto-transitions to `cancelled`.
7. Auto-cancel or manual cancel releases slot for rebooking.
8. Booking can be cancelled any time before slot start time.
9. Completed bookings cannot be edited.
10. Inactive staff/services cannot be used for new bookings.
11. Inactive staff/services remain visible for historical records/reports.
12. No hard-delete of historical booking data in MVP.

## 6. Status Workflow
Primary flow:  
`awaiting_payment` -> `confirmed` -> `completed`

Alternative flow:  
`awaiting_payment` -> `cancelled`  
`confirmed` -> `cancelled` (allowed only before slot start time)

State constraints:
1. `completed` is terminal and immutable.
2. `cancelled` is terminal for operational flow (no reactivation in MVP).

## 7. Functional Requirements
### FR-01 Service Management
1. Create, list, update, deactivate services.
2. Service fields: name, description, duration, price, active flag.
3. Deactivated services are excluded from new booking options.

### FR-02 Staff Management
1. Create, list, update, deactivate staff.
2. Staff fields: full name, email, contact number, active flag.
3. Deactivated staff are excluded from new booking options.

### FR-03 Availability Management
1. Create and manage availability slots per staff and service.
2. Enforce valid time ranges (`end > start`).
3. Enforce slot uniqueness to prevent duplicates.

### FR-04 Guest Booking
1. Guest provides name, contact number, email, selected service, selected slot.
2. System creates booking with status `awaiting_payment`.
3. System locks slot at booking creation.
4. System returns payment instructions and QR references.

### FR-05 Payment Verification
1. Admin views bookings awaiting payment.
2. Admin marks booking as `confirmed` after payment validation.
3. System records payment verification timestamp and verifying admin user (if available).

### FR-06 Auto-Cancel Unpaid
1. Background job checks `awaiting_payment` bookings.
2. If elapsed time exceeds configured timeout, booking becomes `cancelled`.
3. Cancelled booking releases slot automatically.

### FR-07 Cancellation
1. Booking can be cancelled only before slot start time.
2. Cancellation releases slot.
3. Refund handling is operational/manual (no automated computation).

### FR-08 Booking Completion
1. Admin can mark confirmed bookings as `completed`.
2. Completed bookings become read-only.

## 8. Non-Functional Requirements
1. Single business timezone for all scheduling logic.
2. Concurrency-safe booking operations to avoid double-booking.
3. Data consistency across booking and slot state transitions.
4. Clear validation errors for invalid status transitions and slot usage.
5. Auditability through timestamps and history retention.

## 9. Assumptions
1. Admin backoffice exists (Django admin or equivalent UI).
2. Payment proof/verification process is manual in MVP.
3. Notification channels (email/SMS) are optional and can be phased later.

## 10. Risks and Mitigations
1. Risk: slot hoarding from unpaid bookings.
Mitigation: strict `awaiting_payment` timeout auto-cancel.
2. Risk: human error in payment verification.
Mitigation: filtered queue and auditable admin action logs.
3. Risk: timezone misunderstandings.
Mitigation: one explicit system timezone displayed in UI and API.

## 11. Success Metrics (MVP)
1. Double-booking incidents: 0.
2. Unpaid booking inventory lock duration: <= configured timeout.
3. Booking completion from create flow: measurable by status funnel.
4. Manual operations time reduced vs previous process.

---

## MVP Backlog (Epics, User Stories, Acceptance Criteria)

## Epic 1: Catalog and Staff Foundation
### US-1.1 Manage Services
As an admin, I want to manage services so customers can book valid offerings.

Acceptance Criteria:
1. Admin can create/edit/deactivate service.
2. Deactivated service does not appear in new booking API options.
3. Existing historical bookings still show service details.

### US-1.2 Manage Staff
As an admin, I want to manage staff availability participants.

Acceptance Criteria:
1. Admin can create/edit/deactivate staff.
2. Deactivated staff cannot be selected for new booking.
3. Historical bookings remain linked to inactive staff.

## Epic 2: Slot and Availability Control
### US-2.1 Create Availability Slots
As an admin, I want to define time slots per staff/service.

Acceptance Criteria:
1. Slot requires staff, service, start, end.
2. System rejects `end <= start`.
3. System rejects duplicate slot definitions per uniqueness rule.

### US-2.2 View Available Slots
As a customer, I want to view only bookable slots.

Acceptance Criteria:
1. API returns slots that are not booked and in future time.
2. Slots tied to inactive staff/service are excluded.

## Epic 3: Guest Booking + Payment-Gated Confirmation
### US-3.1 Guest Creates Booking
As a guest, I want to book without creating an account.

Acceptance Criteria:
1. Required fields: customer name, contact number, email, service, slot.
2. New booking status is `awaiting_payment`.
3. Slot is locked immediately after successful create.
4. Response includes payment instruction payload (GCash/BDO QR references).

### US-3.2 Admin Verifies Payment
As an admin, I want to confirm payment so booking becomes valid.

Acceptance Criteria:
1. Admin can move booking from `awaiting_payment` to `confirmed`.
2. Transition to `confirmed` is blocked from invalid prior states.
3. Verification event stores timestamp and actor.

## Epic 4: Auto-Cancel Protection
### US-4.1 Timeout Unpaid Bookings
As a business owner, I want unpaid bookings auto-cancelled to free inventory.

Acceptance Criteria:
1. Configurable timeout default is 30 minutes.
2. Bookings in `awaiting_payment` beyond timeout become `cancelled`.
3. Auto-cancel action releases slot.
4. Auto-cancel is idempotent and safe on retries.

## Epic 5: Cancellation and Completion Lifecycle
### US-5.1 Cancel Before Slot Start
As admin/customer support, I want controlled cancellation before schedule start.

Acceptance Criteria:
1. Cancellation is allowed only before slot start time.
2. Cancelled bookings release slot.
3. Cancelled records remain queryable historically.

### US-5.2 Complete Booking
As admin, I want to mark services rendered.

Acceptance Criteria:
1. Only `confirmed` bookings can become `completed`.
2. Completed bookings cannot be edited or cancelled.

## Epic 6: Audit, Integrity, and Reporting Readiness
### US-6.1 Preserve History
As a business owner, I need complete historical records.

Acceptance Criteria:
1. No hard delete for bookings used in history.
2. Inactive staff/services remain visible in historical output.
3. API can return records regardless of active flag for audit views.

### US-6.2 Prevent Double Booking Under Concurrency
As a system, I must enforce slot exclusivity.

Acceptance Criteria:
1. Concurrent booking attempts for same slot result in at most one success.
2. Failing attempt receives clear conflict error.
3. Data remains consistent after race condition tests.

---

## Suggested Implementation Priority
1. Epic 1 and Epic 2 (catalog/staff/availability)
2. Epic 3 (guest booking + awaiting_payment)
3. Epic 5 (status transitions and completion constraints)
4. Epic 4 (auto-cancel worker/job)
5. Epic 6 (audit hardening + concurrency tests)

## Definition of Done (MVP)
1. All above acceptance criteria met and tested.
2. API contract documented for frontend integration.
3. Admin operations for verification/cancellation/completion operational.
4. Timeout auto-cancel process deployed and monitored.

