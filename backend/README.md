# Django Backend

Backend is set up with Django + Django REST Framework + CORS support.

## Stack

- Django
- Django REST Framework
- django-cors-headers
- python-dotenv

## Quick start

1. Create virtual environment:
   `python -m venv .venv`
2. Activate it (PowerShell):
   `.venv\Scripts\Activate.ps1`
3. Install dependencies:
   `pip install -r requirements.txt`
4. Create env file:
   `Copy-Item .env.example .env`
5. Apply migrations:
   `python manage.py migrate`
6. Run development server:
   `python manage.py runserver`

## Settings

- `config/settings/base.py`: shared settings
- `config/settings/dev.py`: development settings
- `config/settings/prod.py`: production settings
- `config/settings/__init__.py`: auto-selects by `DJANGO_ENV`

## API routes

- `GET /api/health/`
- `GET|POST /api/services/`
- `GET|PUT|PATCH|DELETE /api/services/{id}/`
- `POST /api/bookings/` (guest create)
- `POST /api/bookings/{public_id}/submit-payment-proof/` (guest)
- `POST /api/bookings/{public_id}/track-status/` (guest with `customer_email + guest_token`)
- `POST /api/bookings/{public_id}/cancel/` (guest/admin)
- `POST /api/bookings/{public_id}/verify-payment/` (admin/operator)
- `POST /api/bookings/{public_id}/complete/` (admin/operator)
- `GET|POST /api/bookings/staff/` (admin only)
- `GET|PUT|PATCH|DELETE /api/bookings/staff/{id}/`
- `GET|POST /api/bookings/availability/` (public read for bookable slots)
- `GET|PUT|PATCH|DELETE /api/bookings/availability/{id}/`

## Role model

- `admin`: full backoffice control
- `operator`: booking operations (`verify-payment`, `complete`, booking list/retrieve)
- both roles are managed using Django Groups

## Notes

- Default DB is SQLite.
- PostgreSQL is enabled automatically when `POSTGRES_DB` env vars are set.
- To import frontend catalog services into backend DB, run:
  `python manage.py sync_catalog_services`
  optional flags:
  `--dry-run`, `--update-existing`
