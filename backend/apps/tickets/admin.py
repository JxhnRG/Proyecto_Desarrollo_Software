from django.contrib import admin
from .models import Ticket, Turno

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('codigo_ticket', 'usuario', 'punto', 'estado', 'prioridad', 'mostrar_fecha_emision', 'descripcion')

    def mostrar_fecha_emision(self, obj):
        return obj.fecha_emision.strftime('%Y-%m-%d %H:%M:%S')  # <-- Aquí incluimos los segundos
    mostrar_fecha_emision.short_description = 'Fecha de emisión'

