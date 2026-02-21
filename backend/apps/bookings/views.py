from rest_framework import viewsets

from .models import Availability, Booking, Staff
from .serializers import AvailabilitySerializer, BookingSerializer, StaffSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.select_related("staff", "service").all()
    serializer_class = AvailabilitySerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("service", "staff", "availability").all()
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save()
        availability = booking.availability
        if booking.status != Booking.Status.CANCELLED and not availability.is_booked:
            availability.is_booked = True
            availability.save(update_fields=["is_booked"])

    def perform_update(self, serializer):
        original = self.get_object()
        original_availability_id = original.availability_id
        original_status = original.status
        old_slot = original.availability
        updated = serializer.save()

        new_slot = updated.availability
        is_cancelled = updated.status == Booking.Status.CANCELLED

        if original_availability_id != updated.availability_id:
            if old_slot.is_booked:
                old_slot.is_booked = False
                old_slot.save(update_fields=["is_booked"])
            if not is_cancelled and not new_slot.is_booked:
                new_slot.is_booked = True
                new_slot.save(update_fields=["is_booked"])
            return

        if original_status != updated.status:
            if is_cancelled and new_slot.is_booked:
                new_slot.is_booked = False
                new_slot.save(update_fields=["is_booked"])
            if not is_cancelled and not new_slot.is_booked:
                new_slot.is_booked = True
                new_slot.save(update_fields=["is_booked"])

    def perform_destroy(self, instance):
        availability = instance.availability
        super().perform_destroy(instance)
        if availability.is_booked:
            availability.is_booked = False
            availability.save(update_fields=["is_booked"])
