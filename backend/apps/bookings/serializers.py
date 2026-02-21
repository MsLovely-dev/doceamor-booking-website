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


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "customer_name",
            "customer_email",
            "customer_phone",
            "notes",
            "service",
            "staff",
            "availability",
        ]


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "public_id",
            "customer_name",
            "customer_email",
            "customer_phone",
            "notes",
            "service",
            "staff",
            "availability",
            "status",
            "payment_expires_at",
            "payment_submitted_at",
            "payment_method",
            "payment_reference",
            "payment_notes",
            "payment_verified_at",
            "payment_verified_by",
            "payment_rejection_reason",
            "cancel_reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "public_id",
            "payment_expires_at",
            "payment_submitted_at",
            "payment_verified_at",
            "payment_verified_by",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {"payment_reference": {"write_only": True}}


class BookingCreateResponseSerializer(serializers.Serializer):
    public_id = serializers.UUIDField()
    guest_token = serializers.UUIDField()
    status = serializers.ChoiceField(choices=Booking.Status.choices)
    payment_expires_at = serializers.DateTimeField()
    payment_methods = serializers.ListField(child=serializers.CharField(), read_only=True)


class SubmitPaymentProofSerializer(serializers.Serializer):
    customer_email = serializers.EmailField()
    guest_token = serializers.UUIDField()
    payment_method = serializers.ChoiceField(choices=Booking.PaymentMethod.choices)
    payment_reference = serializers.CharField(max_length=120)
    payment_proof_file = serializers.FileField()
    payment_notes = serializers.CharField(required=False, allow_blank=True)


class VerifyPaymentSerializer(serializers.Serializer):
    approved = serializers.BooleanField()
    admin_note = serializers.CharField(required=False, allow_blank=True)


class CancelBookingSerializer(serializers.Serializer):
    customer_email = serializers.EmailField(required=False)
    guest_token = serializers.UUIDField(required=False)
    reason = serializers.CharField(required=False, allow_blank=True)


class CompleteBookingSerializer(serializers.Serializer):
    pass


class TrackBookingStatusRequestSerializer(serializers.Serializer):
    customer_email = serializers.EmailField()
    guest_token = serializers.UUIDField()


class BookingPublicStatusSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)
    staff_name = serializers.CharField(source="staff.full_name", read_only=True)
    start_time = serializers.DateTimeField(source="availability.start_time", read_only=True)
    end_time = serializers.DateTimeField(source="availability.end_time", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "public_id",
            "status",
            "service_name",
            "staff_name",
            "start_time",
            "end_time",
            "payment_expires_at",
            "payment_submitted_at",
            "payment_verified_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
