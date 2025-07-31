from django.urls import path
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView,VerificarTurnoActivoAPIView,FinalizarMiTicketAPIView, ListarTodosLosTicketsView
from apps.tickets.views import CancelarMiTicketAPIView 



urlpatterns = [
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  # 👈 Cambiado
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('crear-turno/', CrearTurnoView.as_view(), name='crear-turno'),
    path('verificar-turno/', VerificarTurnoActivoAPIView.as_view(), name='verificar-turno'),
    path('finalizar-mi-ticket/', FinalizarMiTicketAPIView.as_view(), name='finalizar-ticket'),
    path('cancelar/', CancelarMiTicketAPIView.as_view(), name='cancelar-ticket'),
    path('', ListarTodosLosTicketsView.as_view(), name='listar_tickets'),
]

