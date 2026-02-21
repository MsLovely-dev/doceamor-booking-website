import os

environment = os.getenv("DJANGO_ENV", "development").lower()

if environment == "production":
    from .prod import *  # noqa: F403
else:
    from .dev import *  # noqa: F403

