from django.contrib import admin
from .models import PuntoAtencion

@admin.register(PuntoAtencion)
class PuntoAtencionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion', 'ciudad')
