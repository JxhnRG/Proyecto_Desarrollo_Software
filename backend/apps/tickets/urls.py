from django.urls import path
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView,VerificarTurnoActivoAPIView,FinalizarMiTicketAPIView, ListarTodosLosTicketsView
from apps.tickets.views import CancelarMiTicketAPIView,CancelarTicketView,MarcarAtendiendoView
from .views import TicketRespuestaView



urlpatterns = [
    path('tickets/<int:pk>/respuesta/', TicketRespuestaView.as_view(), name='ticket-respuesta'),
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  # 👈 Cambiado
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('verificar-turno/', VerificarTurnoActivoAPIView.as_view(), name='verificar-turno'),
    path('finalizar-mi-ticket/', FinalizarMiTicketAPIView.as_view(), name='finalizar-ticket'),
    path('cancelar/', CancelarMiTicketAPIView.as_view(), name='cancelar-ticket'),
    path('', ListarTodosLosTicketsView.as_view(), name='listar_tickets'),
    path('<str:codigo_ticket>/cancelar/', CancelarTicketView.as_view(), name='cancelar-ticket'),
    path('<str:codigo_ticket>/marcar-atendiendo/', MarcarAtendiendoView.as_view(), name='marcar-atendiendo'),
    
]

