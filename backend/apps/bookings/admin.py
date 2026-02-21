from django.contrib import admin

from .models import Availability, Booking, Staff


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "email", "is_active", "created_at")
    search_fields = ("full_name", "email")
    list_filter = ("is_active",)


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ("id", "staff", "service", "start_time", "end_time", "is_booked")
    list_filter = ("is_booked", "service")
    search_fields = ("staff__full_name", "service__name")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "public_id",
        "customer_name",
        "customer_email",
        "status",
        "payment_method",
        "payment_expires_at",
        "created_at",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("customer_name", "customer_email", "payment_reference")
    readonly_fields = ("public_id", "guest_token", "payment_verified_at", "payment_verified_by")
