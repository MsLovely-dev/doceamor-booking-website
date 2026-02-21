from django.contrib import admin

from .models import Availability, Booking, Staff

admin.site.register(Staff)
admin.site.register(Availability)
admin.site.register(Booking)
