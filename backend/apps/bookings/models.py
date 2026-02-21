from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from apps.services.models import Service


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
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    notes = models.TextField(blank=True)
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name="bookings")
    staff = models.ForeignKey(Staff, on_delete=models.PROTECT, related_name="bookings")
    availability = models.OneToOneField(
        Availability, on_delete=models.PROTECT, related_name="booking"
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        if self.availability_id and self.service_id and self.service_id != self.availability.service_id:
            raise ValidationError("Availability service does not match booking service.")
        if self.availability_id and self.staff_id and self.staff_id != self.availability.staff_id:
            raise ValidationError("Availability staff does not match booking staff.")
        if self.availability_id and self.availability.start_time < timezone.now():
            raise ValidationError("Cannot create a booking for a past availability slot.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.customer_name} - {self.service} ({self.status})"
