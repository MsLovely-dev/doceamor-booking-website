from django.contrib.auth.models import Group

ROLE_ADMIN = "admin"
ROLE_OPERATOR = "operator"


def ensure_default_roles() -> None:
    Group.objects.get_or_create(name=ROLE_ADMIN)
    Group.objects.get_or_create(name=ROLE_OPERATOR)


def has_role(user, role: str) -> bool:
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    if not user.is_staff:
        return False
    return user.groups.filter(name=role).exists()


def is_admin(user) -> bool:
    return has_role(user, ROLE_ADMIN)


def is_operator(user) -> bool:
    return has_role(user, ROLE_OPERATOR)


def is_admin_or_operator(user) -> bool:
    return is_admin(user) or is_operator(user)

