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
- `GET /api/users/`
- `GET /api/services/`
- `GET /api/bookings/`

## Notes

- Default DB is SQLite.
- PostgreSQL is enabled automatically when `POSTGRES_DB` env vars are set.
