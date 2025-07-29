from django.urls import path
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView, ListarTodosLosTicketsView


urlpatterns = [
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  # 👈 Cambiado
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('crear-turno/', CrearTurnoView.as_view(), name='crear-turno'),
    path('', ListarTodosLosTicketsView.as_view(), name='listar_tickets'),
]

