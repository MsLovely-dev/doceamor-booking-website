from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Availability, Booking


def _ensure_cancellable_before_start(booking: Booking) -> None:
    if booking.availability.start_time <= timezone.now():
        raise ValidationError("Booking can only be cancelled before slot start time.")


def _release_slot(availability: Availability) -> None:
    if availability.is_booked:
        availability.is_booked = False
        availability.save(update_fields=["is_booked"])


@transaction.atomic
def create_guest_booking(*, validated_data: dict) -> Booking:
    availability = (
        Availability.objects.select_related("service", "staff")
        .select_for_update()
        .get(pk=validated_data["availability"].pk)
    )
    if availability.is_booked:
        raise ValidationError({"availability": "This slot is already booked."})
    if availability.start_time <= timezone.now():
        raise ValidationError({"availability": "Cannot book a past slot."})
    if not availability.service.is_active:
        raise ValidationError({"service": "Selected service is not active."})
    if not availability.staff.is_active:
        raise ValidationError({"staff": "Selected staff is not active."})

    if validated_data["service"].pk != availability.service_id:
        raise ValidationError({"service": "Service does not match selected availability slot."})
    if validated_data["staff"].pk != availability.staff_id:
        raise ValidationError({"staff": "Staff does not match selected availability slot."})

    booking = Booking.objects.create(
        **validated_data,
        status=Booking.Status.AWAITING_PAYMENT,
        payment_expires_at=timezone.now()
        + timedelta(minutes=getattr(settings, "BOOKING_PAYMENT_TIMEOUT_MINUTES", 30)),
    )
    availability.is_booked = True
    availability.save(update_fields=["is_booked"])
    return booking


@transaction.atomic
def submit_payment_proof(*, booking: Booking, payload: dict) -> Booking:
    locked_booking = Booking.objects.select_for_update().get(pk=booking.pk)
    if locked_booking.status != Booking.Status.AWAITING_PAYMENT:
        raise ValidationError("Payment proof can only be submitted for awaiting payment bookings.")
    if locked_booking.payment_expires_at and timezone.now() > locked_booking.payment_expires_at:
        locked_booking.status = Booking.Status.CANCELLED
        locked_booking.save(update_fields=["status", "updated_at"])
        _release_slot(locked_booking.availability)
        raise ValidationError("Payment window has expired. Booking has been cancelled.")

    locked_booking.status = Booking.Status.PAYMENT_SUBMITTED
    locked_booking.payment_method = payload["payment_method"]
    locked_booking.payment_reference = payload["payment_reference"]
    locked_booking.payment_proof_file = payload["payment_proof_file"]
    locked_booking.payment_notes = payload.get("payment_notes", "")
    locked_booking.payment_submitted_at = timezone.now()
    locked_booking.payment_rejection_reason = ""
    locked_booking.save()
    return locked_booking


@transaction.atomic
def verify_payment(*, booking: Booking, approved: bool, admin_user, admin_note: str = "") -> Booking:
    locked_booking = Booking.objects.select_for_update().get(pk=booking.pk)
    if locked_booking.status != Booking.Status.PAYMENT_SUBMITTED:
        raise ValidationError("Only payment-submitted bookings can be verified.")

    if approved:
        locked_booking.status = Booking.Status.CONFIRMED
        locked_booking.payment_verified_by = admin_user
        locked_booking.payment_verified_at = timezone.now()
        if admin_note:
            locked_booking.payment_notes = admin_note
        locked_booking.save()
        return locked_booking

    if locked_booking.payment_expires_at and timezone.now() > locked_booking.payment_expires_at:
        locked_booking.status = Booking.Status.CANCELLED
        _release_slot(locked_booking.availability)
    else:
        locked_booking.status = Booking.Status.AWAITING_PAYMENT
    locked_booking.payment_rejection_reason = admin_note
    locked_booking.save()
    return locked_booking


@transaction.atomic
def cancel_booking(*, booking: Booking, reason: str = "") -> Booking:
    locked_booking = Booking.objects.select_for_update().select_related("availability").get(pk=booking.pk)
    if locked_booking.status == Booking.Status.COMPLETED:
        raise ValidationError("Completed bookings cannot be cancelled.")
    if locked_booking.status == Booking.Status.CANCELLED:
        return locked_booking

    _ensure_cancellable_before_start(locked_booking)
    locked_booking.status = Booking.Status.CANCELLED
    locked_booking.cancel_reason = reason
    locked_booking.save(update_fields=["status", "cancel_reason", "updated_at"])
    _release_slot(locked_booking.availability)
    return locked_booking


@transaction.atomic
def complete_booking(*, booking: Booking) -> Booking:
    locked_booking = Booking.objects.select_for_update().get(pk=booking.pk)
    if locked_booking.status != Booking.Status.CONFIRMED:
        raise ValidationError("Only confirmed bookings can be marked completed.")
    locked_booking.status = Booking.Status.COMPLETED
    locked_booking.save(update_fields=["status", "updated_at"])
    return locked_booking


@transaction.atomic
def expire_unpaid_bookings() -> int:
    now = timezone.now()
    expired = (
        Booking.objects.select_for_update()
        .select_related("availability")
        .filter(status=Booking.Status.AWAITING_PAYMENT, payment_expires_at__lte=now)
    )
    count = 0
    for booking in expired:
        booking.status = Booking.Status.CANCELLED
        booking.save(update_fields=["status", "updated_at"])
        _release_slot(booking.availability)
        count += 1
    return count
