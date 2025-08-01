from django.urls import path
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView,VerificarTurnoActivoAPIView,FinalizarMiTicketAPIView
from apps.tickets.views import TiempoPromedioPorSedeAPIView
from apps.tickets.views import TicketRespuestaView, TicketListAPIView,CancelarTicketView



urlpatterns = [
    
    path('<str:codigo_ticket>/cancelar/', CancelarTicketView.as_view(), name='cancelar-ticket'),
    path('tickets/<int:pk>/respuesta/', TicketRespuestaView.as_view(), name='ticket-respuesta'),
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('crear-turno/', CrearTurnoView.as_view(), name='crear-turno'),
    path('verificar-turno/', VerificarTurnoActivoAPIView.as_view(), name='verificar-turno'),
    path('finalizar-mi-ticket/', FinalizarMiTicketAPIView.as_view(), name='finalizar-ticket'),
    path('admin/tiempo-promedio/<int:punto_id>/', TiempoPromedioPorSedeAPIView.as_view(), name='tiempo-promedio'),
    path('', TicketListAPIView.as_view(), name='listar-tickets'),
]
print("✅ URLs de tickets cargadas correctamente")
