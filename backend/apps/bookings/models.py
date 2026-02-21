import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone

from apps.services.models import Service

User = get_user_model()


def payment_proof_upload_path(_instance, filename: str) -> str:
    extension = filename.split(".")[-1].lower()
    return f"payment_proofs/{timezone.now():%Y/%m}/{uuid.uuid4().hex}.{extension}"


def validate_payment_proof_file_size(value):
    max_size = 5 * 1024 * 1024
    if value.size > max_size:
        raise ValidationError("Payment proof file must be 5MB or smaller.")


class Staff(models.Model):
    full_name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["full_name"]

    def __str__(self) -> str:
        return self.full_name


class Availability(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name="availabilities")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="availabilities")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_booked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_time"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_time__gt=models.F("start_time")),
                name="availability_end_after_start",
            ),
            models.UniqueConstraint(
                fields=["staff", "service", "start_time", "end_time"],
                name="uniq_staff_service_slot",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.staff} | {self.service} | {self.start_time}"


class Booking(models.Model):
    class Status(models.TextChoices):
        AWAITING_PAYMENT = "awaiting_payment", "Awaiting Payment"
        PAYMENT_SUBMITTED = "payment_submitted", "Payment Submitted"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentMethod(models.TextChoices):
        GCASH = "gcash", "GCash"
        BDO = "bdo", "BDO"

    public_id = models.UUIDField(default=uuid.uuid4, editable=False, db_index=True)
    guest_token = models.UUIDField(default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30, default="")
    notes = models.TextField(blank=True)
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name="bookings")
    staff = models.ForeignKey(Staff, on_delete=models.PROTECT, related_name="bookings")
    availability = models.OneToOneField(
        Availability, on_delete=models.PROTECT, related_name="booking"
    )
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.AWAITING_PAYMENT)
    payment_expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    payment_submitted_at = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(
        max_length=16, choices=PaymentMethod.choices, null=True, blank=True
    )
    payment_reference = models.CharField(max_length=120, null=True, blank=True)
    payment_proof_file = models.FileField(
        upload_to=payment_proof_upload_path,
        null=True,
        blank=True,
        validators=[
            validate_payment_proof_file_size,
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "pdf"]),
        ],
    )
    payment_notes = models.TextField(blank=True)
    payment_verified_at = models.DateTimeField(null=True, blank=True)
    payment_verified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="verified_bookings"
    )
    payment_rejection_reason = models.TextField(blank=True)
    cancel_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["payment_method", "payment_reference"],
                condition=models.Q(payment_reference__isnull=False)
                & ~models.Q(payment_reference="")
                & ~models.Q(status="cancelled"),
                name="uniq_active_payment_reference_per_method",
            )
        ]

    def clean(self):
        if self.availability_id and self.service_id and self.service_id != self.availability.service_id:
            raise ValidationError("Availability service does not match booking service.")
        if self.availability_id and self.staff_id and self.staff_id != self.availability.staff_id:
            raise ValidationError("Availability staff does not match booking staff.")
        if self.availability_id and self.availability.start_time < timezone.now():
            raise ValidationError("Cannot create a booking for a past availability slot.")
        if self.service_id and not self.service.is_active:
            raise ValidationError("Selected service is not active.")
        if self.staff_id and not self.staff.is_active:
            raise ValidationError("Selected staff is not active.")

    def save(self, *args, **kwargs):
        if not self.payment_expires_at and self.status in {
            self.Status.AWAITING_PAYMENT,
            self.Status.PAYMENT_SUBMITTED,
        }:
            timeout_minutes = getattr(settings, "BOOKING_PAYMENT_TIMEOUT_MINUTES", 30)
            self.payment_expires_at = timezone.now() + timedelta(minutes=timeout_minutes)
        if self.customer_email:
            self.customer_email = self.customer_email.lower()
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.customer_name} - {self.service} ({self.status})"
