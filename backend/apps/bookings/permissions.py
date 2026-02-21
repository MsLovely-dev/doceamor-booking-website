from rest_framework.permissions import BasePermission

from apps.users.roles import is_admin, is_admin_or_operator


class BookingPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action in {"create", "submit_payment_proof", "cancel", "track_status"}:
            return True
        return is_admin_or_operator(request.user)


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return is_admin(request.user)


class IsAdminOrOperatorRole(BasePermission):
    def has_permission(self, request, view):
        return is_admin_or_operator(request.user)
