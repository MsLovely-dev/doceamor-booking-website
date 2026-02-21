# Django Backend

This folder is reserved for your Django API/backend.

## Quick start

1. Create virtual environment:
   python -m venv .venv
2. Activate it:
   .venv\\Scripts\\activate
3. Install Django:
   pip install django djangorestframework django-cors-headers
4. Start project here:
   django-admin startproject config .
5. Run server:
   python manage.py runserver

## Recommended next steps

- Add `.env` and settings split (`base.py`, `dev.py`, `prod.py`)
- Configure CORS for your frontend origin
- Add app modules: `users`, `bookings`, `services`
