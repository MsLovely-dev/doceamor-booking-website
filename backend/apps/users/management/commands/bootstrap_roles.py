from django.core.management.base import BaseCommand

from apps.users.roles import ensure_default_roles


class Command(BaseCommand):
    help = "Create default authorization roles (admin, operator)."

    def handle(self, *args, **options):
        ensure_default_roles()
        self.stdout.write(self.style.SUCCESS("Roles ensured: admin, operator"))

