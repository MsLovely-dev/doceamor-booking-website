from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.bookings.permissions import IsAdminRole

from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        queryset = Service.objects.all()
        if self.request.user and self.request.user.is_staff:
            return queryset
        return queryset.filter(is_active=True)
