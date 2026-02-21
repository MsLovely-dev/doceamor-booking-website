from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.bookings.permissions import IsAdminRole
from apps.users.roles import is_admin

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
        include_inactive = self.request.query_params.get("include_inactive")
        if include_inactive in {"1", "true", "True"} and is_admin(self.request.user):
            return queryset
        if self.request.user and self.request.user.is_staff:
            return queryset
        return queryset.filter(is_active=True)
