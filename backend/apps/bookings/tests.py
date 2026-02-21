from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.bookings.models import Availability, Booking, Staff
from apps.services.models import Service
from apps.users.roles import ROLE_ADMIN, ROLE_OPERATOR


class BookingFlowTests(APITestCase):
    def setUp(self):
        Group.objects.get_or_create(name=ROLE_ADMIN)
        Group.objects.get_or_create(name=ROLE_OPERATOR)
        self.service = Service.objects.create(
            name="Hair Styling",
            duration_minutes=60,
            price="500.00",
            is_active=True,
        )
        self.staff = Staff.objects.create(
            full_name="Test Staff",
            email="staff@example.com",
            phone="09170000000",
            is_active=True,
        )
        self.availability = Availability.objects.create(
            staff=self.staff,
            service=self.service,
            start_time=timezone.now() + timedelta(hours=2),
            end_time=timezone.now() + timedelta(hours=3),
        )

    def _create_role_user(self, username: str, role: str):
        User = get_user_model()
        user = User.objects.create_user(
            username=username,
            email=f"{username}@example.com",
            password="password123",
            is_staff=True,
        )
        group = Group.objects.get(name=role)
        user.groups.add(group)
        return user

    def test_guest_booking_create_locks_slot(self):
        payload = {
            "customer_name": "Guest",
            "customer_email": "guest@example.com",
            "customer_phone": "09171234567",
            "notes": "N/A",
            "service": self.service.id,
            "staff": self.staff.id,
            "availability": self.availability.id,
        }

        response = self.client.post("/api/bookings/", data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], Booking.Status.AWAITING_PAYMENT)
        self.availability.refresh_from_db()
        self.assertTrue(self.availability.is_booked)

    def test_guest_submit_payment_proof_requires_identity(self):
        booking = Booking.objects.create(
            customer_name="Guest",
            customer_email="guest@example.com",
            customer_phone="09171234567",
            service=self.service,
            staff=self.staff,
            availability=self.availability,
            status=Booking.Status.AWAITING_PAYMENT,
            payment_expires_at=timezone.now() + timedelta(minutes=30),
        )
        self.availability.is_booked = True
        self.availability.save(update_fields=["is_booked"])

        dummy_file = SimpleUploadedFile("proof.jpg", b"fake-image-bytes", content_type="image/jpeg")
        response = self.client.post(
            f"/api/bookings/{booking.public_id}/submit-payment-proof/",
            data={
                "customer_email": "wrong@example.com",
                "guest_token": booking.guest_token,
                "payment_method": Booking.PaymentMethod.GCASH,
                "payment_reference": "REF-001",
                "payment_proof_file": dummy_file,
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_operator_can_verify_payment(self):
        booking = Booking.objects.create(
            customer_name="Guest",
            customer_email="guest@example.com",
            customer_phone="09171234567",
            service=self.service,
            staff=self.staff,
            availability=self.availability,
            status=Booking.Status.PAYMENT_SUBMITTED,
            payment_expires_at=timezone.now() + timedelta(minutes=30),
            payment_method=Booking.PaymentMethod.GCASH,
            payment_reference="REF-002",
        )
        self.availability.is_booked = True
        self.availability.save(update_fields=["is_booked"])

        operator_user = self._create_role_user("operator", ROLE_OPERATOR)
        self.client.force_authenticate(operator_user)

        response = self.client.post(
            f"/api/bookings/{booking.public_id}/verify-payment/",
            data={"approved": True, "admin_note": "Verified"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.CONFIRMED)

    def test_staff_without_role_cannot_verify_payment(self):
        booking = Booking.objects.create(
            customer_name="Guest",
            customer_email="guest@example.com",
            customer_phone="09171234567",
            service=self.service,
            staff=self.staff,
            availability=self.availability,
            status=Booking.Status.PAYMENT_SUBMITTED,
            payment_expires_at=timezone.now() + timedelta(minutes=30),
            payment_method=Booking.PaymentMethod.GCASH,
            payment_reference="REF-003",
        )
        User = get_user_model()
        plain_staff = User.objects.create_user(
            username="plainstaff",
            email="plainstaff@example.com",
            password="password123",
            is_staff=True,
        )
        self.client.force_authenticate(plain_staff)

        response = self.client.post(
            f"/api/bookings/{booking.public_id}/verify-payment/",
            data={"approved": True},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_public_track_status_requires_valid_identity(self):
        booking = Booking.objects.create(
            customer_name="Guest",
            customer_email="guest@example.com",
            customer_phone="09171234567",
            service=self.service,
            staff=self.staff,
            availability=self.availability,
            status=Booking.Status.AWAITING_PAYMENT,
            payment_expires_at=timezone.now() + timedelta(minutes=30),
        )

        failed = self.client.post(
            f"/api/bookings/{booking.public_id}/track-status/",
            data={"customer_email": "wrong@example.com", "guest_token": booking.guest_token},
            format="json",
        )
        self.assertEqual(failed.status_code, status.HTTP_403_FORBIDDEN)

        success = self.client.post(
            f"/api/bookings/{booking.public_id}/track-status/",
            data={"customer_email": "guest@example.com", "guest_token": booking.guest_token},
            format="json",
        )
        self.assertEqual(success.status_code, status.HTTP_200_OK)
        self.assertIn("status", success.data)
        self.assertIn("public_id", success.data)
        self.assertNotIn("customer_email", success.data)


class CatalogAndAvailabilityFilterTests(APITestCase):
    def setUp(self):
        Group.objects.get_or_create(name=ROLE_ADMIN)
        Group.objects.get_or_create(name=ROLE_OPERATOR)
        self.service = Service.objects.create(
            name="Nails",
            duration_minutes=60,
            price="300.00",
            is_active=True,
        )
        self.staff_active = Staff.objects.create(
            full_name="Active Staff",
            email="active.staff@example.com",
            is_active=True,
        )
        self.staff_inactive = Staff.objects.create(
            full_name="Inactive Staff",
            email="inactive.staff@example.com",
            is_active=False,
        )

    def _create_role_user(self, username: str, role: str):
        User = get_user_model()
        user = User.objects.create_user(
            username=username,
            email=f"{username}@example.com",
            password="password123",
            is_staff=True,
        )
        group = Group.objects.get(name=role)
        user.groups.add(group)
        return user

    def test_public_staff_list_returns_active_only(self):
        response = self.client.get("/api/bookings/staff/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        emails = [item["email"] for item in response.data]
        self.assertIn("active.staff@example.com", emails)
        self.assertNotIn("inactive.staff@example.com", emails)

    def test_admin_staff_list_can_include_inactive(self):
        admin_user = self._create_role_user("adminuser", ROLE_ADMIN)
        self.client.force_authenticate(admin_user)

        response = self.client.get("/api/bookings/staff/?include_inactive=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        emails = [item["email"] for item in response.data]
        self.assertIn("active.staff@example.com", emails)
        self.assertIn("inactive.staff@example.com", emails)

    def test_public_availability_default_unbooked_and_active_only(self):
        booked = Availability.objects.create(
            staff=self.staff_active,
            service=self.service,
            start_time=timezone.now() + timedelta(hours=2),
            end_time=timezone.now() + timedelta(hours=3),
            is_booked=True,
        )
        unbooked = Availability.objects.create(
            staff=self.staff_active,
            service=self.service,
            start_time=timezone.now() + timedelta(hours=4),
            end_time=timezone.now() + timedelta(hours=5),
            is_booked=False,
        )
        Availability.objects.create(
            staff=self.staff_inactive,
            service=self.service,
            start_time=timezone.now() + timedelta(hours=6),
            end_time=timezone.now() + timedelta(hours=7),
            is_booked=False,
        )

        response = self.client.get("/api/bookings/availability/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = [item["id"] for item in response.data]
        self.assertIn(unbooked.id, ids)
        self.assertNotIn(booked.id, ids)

    def test_public_availability_supports_is_booked_filter(self):
        booked = Availability.objects.create(
            staff=self.staff_active,
            service=self.service,
            start_time=timezone.now() + timedelta(hours=2),
            end_time=timezone.now() + timedelta(hours=3),
            is_booked=True,
        )
        unbooked = Availability.objects.create(
            staff=self.staff_active,
            service=self.service,
            start_time=timezone.now() + timedelta(hours=4),
            end_time=timezone.now() + timedelta(hours=5),
            is_booked=False,
        )

        response = self.client.get("/api/bookings/availability/?is_booked=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = [item["id"] for item in response.data]
        self.assertIn(booked.id, ids)
        self.assertNotIn(unbooked.id, ids)
