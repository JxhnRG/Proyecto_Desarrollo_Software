from django.urls import path
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView


urlpatterns = [
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  # 👈 Cambiado
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('crear-turno/', CrearTurnoView.as_view(), name='crear-turno'),
]

