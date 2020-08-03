from django.contrib import admin

# Register your models here.
from .models import Email, User

class Admin(admin.ModelAdmin):
    filter_horizontal = ("mail",)

admin.site.register(User)
admin.site.register(Email)
