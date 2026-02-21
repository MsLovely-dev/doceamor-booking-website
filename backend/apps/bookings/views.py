from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Availability, Booking, Staff
from .permissions import BookingPermission, IsAdminOrOperatorRole, IsAdminRole
from .serializers import (
    AvailabilitySerializer,
    BookingPublicStatusSerializer,
    BookingCreateResponseSerializer,
    BookingCreateSerializer,
    BookingSerializer,
    CancelBookingSerializer,
    CompleteBookingSerializer,
    StaffSerializer,
    SubmitPaymentProofSerializer,
    TrackBookingStatusRequestSerializer,
    VerifyPaymentSerializer,
)
from .services import cancel_booking, complete_booking, create_guest_booking, submit_payment_proof, verify_payment
from apps.users.roles import is_admin_or_operator


class StaffViewSet(viewsets.ModelViewSet):
    serializer_class = StaffSerializer
    permission_classes = [IsAdminRole]
    queryset = Staff.objects.all()


class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        queryset = Availability.objects.select_related("staff", "service")
        if is_admin_or_operator(self.request.user):
            return queryset

        date_filter = self.request.query_params.get("date")
        service_filter = self.request.query_params.get("service")
        staff_filter = self.request.query_params.get("staff")

        queryset = queryset.filter(
            is_booked=False,
            start_time__gt=timezone.now(),
            service__is_active=True,
            staff__is_active=True,
        )
        if date_filter:
            queryset = queryset.filter(start_time__date=date_filter)
        if service_filter:
            queryset = queryset.filter(service_id=service_filter)
        if staff_filter:
            queryset = queryset.filter(staff_id=staff_filter)
        return queryset


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("service", "staff", "availability", "payment_verified_by")
    serializer_class = BookingSerializer
    permission_classes = [BookingPermission]
    lookup_field = "public_id"

    def get_queryset(self):
        queryset = super().get_queryset()
        if is_admin_or_operator(self.request.user):
            status_filter = self.request.query_params.get("status")
            if status_filter:
                queryset = queryset.filter(status=status_filter)
            return queryset
        if self.action in {"submit_payment_proof", "cancel", "track_status"}:
            return queryset
        return queryset.none()

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        if self.action == "submit_payment_proof":
            return SubmitPaymentProofSerializer
        if self.action == "verify_payment":
            return VerifyPaymentSerializer
        if self.action == "cancel":
            return CancelBookingSerializer
        if self.action == "complete":
            return CompleteBookingSerializer
        if self.action == "track_status":
            return TrackBookingStatusRequestSerializer
        return BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = create_guest_booking(validated_data=serializer.validated_data)

        response_payload = {
            "public_id": booking.public_id,
            "guest_token": booking.guest_token,
            "status": booking.status,
            "payment_expires_at": booking.payment_expires_at,
            "payment_methods": [choice.value for choice in Booking.PaymentMethod],
        }
        output = BookingCreateResponseSerializer(response_payload)
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response(
            {"detail": "Direct booking updates are not allowed. Use workflow actions."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"detail": "Deletion is disabled. Use cancel action for audit-safe workflow."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(methods=["post"], detail=True, permission_classes=[AllowAny], url_path="submit-payment-proof")
    def submit_payment_proof(self, request, public_id=None):
        booking = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data
        if payload["customer_email"].lower() != booking.customer_email.lower():
            return Response({"detail": "Booking identity verification failed."}, status=403)
        if payload["guest_token"] != booking.guest_token:
            return Response({"detail": "Booking identity verification failed."}, status=403)

        updated = submit_payment_proof(booking=booking, payload=payload)
        return Response(
            {
                "public_id": str(updated.public_id),
                "status": updated.status,
                "payment_submitted_at": updated.payment_submitted_at,
                "message": "Payment proof submitted. Awaiting admin verification.",
            }
        )

    @action(methods=["post"], detail=True, permission_classes=[IsAdminOrOperatorRole], url_path="verify-payment")
    def verify_payment(self, request, public_id=None):
        booking = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data
        updated = verify_payment(
            booking=booking,
            approved=payload["approved"],
            admin_user=request.user,
            admin_note=payload.get("admin_note", ""),
        )
        return Response(BookingSerializer(updated).data)

    @action(methods=["post"], detail=True, permission_classes=[AllowAny], url_path="cancel")
    def cancel(self, request, public_id=None):
        booking = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        if not is_admin_or_operator(request.user):
            if payload.get("customer_email", "").lower() != booking.customer_email.lower():
                return Response({"detail": "Booking identity verification failed."}, status=403)
            if payload.get("guest_token") != booking.guest_token:
                return Response({"detail": "Booking identity verification failed."}, status=403)

        updated = cancel_booking(booking=booking, reason=payload.get("reason", ""))
        return Response(BookingSerializer(updated).data)

    @action(methods=["post"], detail=True, permission_classes=[IsAdminOrOperatorRole], url_path="complete")
    def complete(self, request, public_id=None):
        booking = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated = complete_booking(booking=booking)
        return Response(BookingSerializer(updated).data)

    @action(methods=["post"], detail=True, permission_classes=[AllowAny], url_path="track-status")
    def track_status(self, request, public_id=None):
        booking = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        if payload["customer_email"].lower() != booking.customer_email.lower():
            return Response({"detail": "Booking identity verification failed."}, status=403)
        if payload["guest_token"] != booking.guest_token:
            return Response({"detail": "Booking identity verification failed."}, status=403)

        return Response(BookingPublicStatusSerializer(booking).data)
