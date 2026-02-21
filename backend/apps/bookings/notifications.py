import logging

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from .models import Booking

logger = logging.getLogger(__name__)


def queue_booking_status_email(*, booking: Booking, event: str) -> None:
    if not getattr(settings, "BOOKING_STATUS_EMAIL_ENABLED", True):
        return
    if not booking.customer_email:
        return

    booking_id = booking.id

    def _send_on_commit() -> None:
        send_booking_status_email(booking_id=booking_id, event=event)

    transaction.on_commit(_send_on_commit)


def send_booking_status_email(*, booking_id: int, event: str) -> None:
    try:
        booking = Booking.objects.select_related("service", "staff", "availability").get(pk=booking_id)
    except Booking.DoesNotExist:
        return

    try:
        status_label = _status_label(booking)
        slot_start = timezone.localtime(booking.availability.start_time).strftime("%B %d, %Y %I:%M %p")
        slot_end = timezone.localtime(booking.availability.end_time).strftime("%I:%M %p")
        lines = [
            f"Hi {booking.customer_name},",
            "",
            f"Your reservation status has been updated: {status_label}",
            "",
            f"Booking Ref: {booking.public_id}",
            f"Service: {booking.service.name}",
            f"Staff: {booking.staff.full_name}",
            f"Schedule: {slot_start} - {slot_end}",
        ]

        if booking.payment_expires_at:
            expires_text = timezone.localtime(booking.payment_expires_at).strftime("%B %d, %Y %I:%M %p")
            lines.append(f"Payment Expires At: {expires_text}")

        if event == "payment_rejected" and booking.payment_rejection_reason:
            lines.extend(
                [
                    "",
                    "Payment Rejection Reason:",
                    booking.payment_rejection_reason,
                ]
            )

        if booking.cancel_reason:
            lines.extend(
                [
                    "",
                    "Cancellation Reason:",
                    booking.cancel_reason,
                ]
            )

        lines.extend(
            [
                "",
                "If you need help, please contact Doce Amor support.",
            ]
        )

        subject = f"[Doce Amor] Booking {booking.public_id} - {status_label}"
        send_mail(
            subject=subject,
            message="\n".join(lines),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.customer_email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed sending booking status email. booking_id=%s event=%s", booking_id, event)


def _status_label(booking: Booking) -> str:
    if booking.status == Booking.Status.AWAITING_PAYMENT and booking.payment_rejection_reason:
        return "Payment Rejected"
    if booking.status == Booking.Status.AWAITING_PAYMENT:
        return "Awaiting Payment"
    if booking.status == Booking.Status.PAYMENT_SUBMITTED:
        return "Payment Submitted"
    if booking.status == Booking.Status.CONFIRMED:
        return "Confirmed"
    if booking.status == Booking.Status.COMPLETED:
        return "Completed"
    if booking.status == Booking.Status.CANCELLED:
        return "Cancelled"
    return booking.status.replace("_", " ").title()
