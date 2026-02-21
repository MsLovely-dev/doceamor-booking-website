from django.core.management.base import BaseCommand

from apps.bookings.services import expire_unpaid_bookings


class Command(BaseCommand):
    help = "Auto-cancel expired unpaid bookings and release their slots."

    def handle(self, *args, **options):
        expired_count = expire_unpaid_bookings()
        self.stdout.write(self.style.SUCCESS(f"Expired bookings processed: {expired_count}"))

