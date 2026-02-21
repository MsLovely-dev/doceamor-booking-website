from rest_framework import serializers

from .models import Availability, Booking, Staff


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ["id", "full_name", "email", "phone", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = [
            "id",
            "staff",
            "service",
            "start_time",
            "end_time",
            "is_booked",
            "created_at",
        ]
        read_only_fields = ["id", "is_booked", "created_at"]


class BookingSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        availability = attrs.get("availability") or getattr(self.instance, "availability", None)
        if availability is None:
            return attrs

        is_same_slot = self.instance and self.instance.availability_id == availability.id
        if availability.is_booked and not is_same_slot:
            raise serializers.ValidationError({"availability": "This slot is already booked."})

        return attrs

    class Meta:
        model = Booking
        fields = [
            "id",
            "customer_name",
            "customer_email",
            "notes",
            "service",
            "staff",
            "availability",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
