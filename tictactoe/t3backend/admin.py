from django.contrib import admin
from .models import T3Game


class T3GameAdmin(admin.ModelAdmin):
    list_display = ("winner", "p1", "p2")


admin.site.register(T3Game, T3GameAdmin)
