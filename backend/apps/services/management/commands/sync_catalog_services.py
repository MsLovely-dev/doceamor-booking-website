import re
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.services.models import Service


ROW_PATTERN = re.compile(r"\{ Service: \"([^\"]+)\"(?P<rest>.*?)\},")
PAIR_PATTERN = re.compile(r"(?:\"([^\"]+)\"|(\w+))\s*:\s*\"([^\"]*)\"")
TITLE_PATTERN = re.compile(r'^\s*title:\s*"([^"]+)"')


def parse_price(value: str) -> Decimal | None:
    match = re.search(r"(\d+(?:\.\d{1,2})?)", value.replace(",", ""))
    if not match:
        return None
    return Decimal(match.group(1))


def infer_duration(group_title: str, service_name: str) -> int:
    lower_group = group_title.lower()
    lower_name = service_name.lower()
    if "30 minutes" in lower_group or "30 minute" in lower_group or "30 minutes" in lower_name:
        return 30
    if "20 mins" in lower_name or "20 min" in lower_name:
        return 20
    return 60


class Command(BaseCommand):
    help = "Sync frontend SERVICE_CATALOG entries into backend Service table."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Show actions without writing to DB.")
        parser.add_argument(
            "--update-existing",
            action="store_true",
            help="Update price/duration/description for existing services by name.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        update_existing = options["update_existing"]

        repo_root = self._find_repo_root()
        catalog_path = repo_root / "frontend" / "src" / "features" / "services" / "data" / "catalog.ts"
        if not catalog_path.exists():
            raise CommandError(f"Catalog file not found: {catalog_path}")

        text = catalog_path.read_text(encoding="utf-8")
        catalog_rows = self._extract_rows(text)
        if not catalog_rows:
            raise CommandError("No services parsed from frontend catalog.")

        created_count = 0
        updated_count = 0
        skipped_count = 0
        duplicate_name_count = 0
        seen_names: set[str] = set()

        context = transaction.atomic() if not dry_run else _NoOpContext()
        with context:
            for item in catalog_rows:
                name = item["name"]
                if name in seen_names:
                    duplicate_name_count += 1
                    skipped_count += 1
                    continue
                seen_names.add(name)

                defaults = {
                    "description": f"{item['section']} / {item['group']}",
                    "duration_minutes": item["duration_minutes"],
                    "price": item["price"],
                    "is_active": True,
                }

                existing = Service.objects.filter(name=name).first()
                if existing:
                    if update_existing:
                        changed = False
                        for field, value in defaults.items():
                            if getattr(existing, field) != value:
                                setattr(existing, field, value)
                                changed = True
                        if changed and not dry_run:
                            existing.save(update_fields=["description", "duration_minutes", "price", "is_active", "updated_at"])
                        if changed:
                            updated_count += 1
                        else:
                            skipped_count += 1
                    else:
                        skipped_count += 1
                    continue

                if not dry_run:
                    Service.objects.create(name=name, **defaults)
                created_count += 1

        self.stdout.write(self.style.SUCCESS("Catalog sync complete"))
        self.stdout.write(f"Parsed rows: {len(catalog_rows)}")
        self.stdout.write(f"Created: {created_count}")
        self.stdout.write(f"Updated: {updated_count}")
        self.stdout.write(f"Skipped: {skipped_count}")
        self.stdout.write(f"Duplicate catalog names skipped: {duplicate_name_count}")
        self.stdout.write("Use --update-existing to refresh existing backend services by name.")

    def _extract_rows(self, text: str):
        rows = []
        section_title = ""
        group_title = ""
        lines = text.splitlines()

        for idx, line in enumerate(lines):
            title_match = TITLE_PATTERN.match(line)
            if title_match:
                title = title_match.group(1).strip()
                window = "\n".join(lines[idx : idx + 4])
                if "groups:" in window:
                    section_title = title
                    group_title = ""
                elif "columns:" in window or "rows:" in window:
                    group_title = title

            row_match = ROW_PATTERN.search(line)
            if not row_match:
                continue

            service_name = row_match.group(1).strip()
            rest = row_match.group("rest")
            pairs = PAIR_PATTERN.findall(rest)
            other_values = [value for quoted_key, bare_key, value in pairs if (quoted_key or bare_key) != "Service"]
            price = None
            for value in other_values:
                price = parse_price(value)
                if price is not None:
                    break
            if price is None:
                price = Decimal("0.00")

            rows.append(
                {
                    "section": section_title or "Services",
                    "group": group_title or "General",
                    "name": service_name,
                    "duration_minutes": infer_duration(group_title, service_name),
                    "price": price,
                }
            )

        return rows

    def _find_repo_root(self) -> Path:
        current = Path(__file__).resolve()
        for parent in [current, *current.parents]:
            if (parent / "backend").exists() and (parent / "frontend").exists():
                return parent
        raise CommandError("Could not locate repository root containing backend/ and frontend/.")


class _NoOpContext:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False
