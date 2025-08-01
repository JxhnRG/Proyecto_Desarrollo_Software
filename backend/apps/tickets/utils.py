from datetime import timedelta
from django.db.models import Q
from apps.tickets.models import Ticket

def calcular_tiempo_espera(ticket):
    tickets_adelante = Ticket.objects.filter(
        punto=ticket.punto,
        prioridad=ticket.prioridad,
        estado='esperando'
    ).filter(
        Q(fecha_emision__lt=ticket.fecha_emision) |
        Q(fecha_emision=ticket.fecha_emision, id__lt=ticket.id)
    ).count()

    return timedelta(minutes=2 * tickets_adelante)
