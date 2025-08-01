from datetime import timedelta
from django.utils import timezone
from apps.tickets.models import Ticket
from django.db.models import Q

def calcular_tiempo_espera(ticket):
    tickets_adelante = Ticket.objects.filter(
        punto=ticket.punto,
        prioridad=ticket.prioridad,
    ).filter(
        Q(fecha_emision__lt=ticket.fecha_emision) |
        Q(fecha_emision=ticket.fecha_emision, id__lt=ticket.id)
    ).order_by('fecha_emision', 'id')

    tiempo_total = timedelta(minutes=2 * tickets_adelante.count())
    return tiempo_total