from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AvailabilityViewSet, BookingViewSet, StaffViewSet

router = DefaultRouter()
router.register("staff", StaffViewSet, basename="staff")
router.register("availability", AvailabilityViewSet, basename="availability")
router.register("", BookingViewSet, basename="booking")

urlpatterns = [
    path("", include(router.urls)),
]
