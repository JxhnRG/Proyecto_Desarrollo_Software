from django.urls import path
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView,VerificarTurnoActivoAPIView,FinalizarMiTicketAPIView, ListarTodosLosTicketsView
<<<<<<< HEAD
from apps.tickets.views import CancelarMiTicketAPIView,CancelarTicketView,MarcarAtendiendoView
=======
from apps.tickets.views import CancelarMiTicketAPIView 
>>>>>>> 41cb762939c50b5773b21d9a3ae822ade603cbe8



urlpatterns = [
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  # 👈 Cambiado
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('crear-turno/', CrearTurnoView.as_view(), name='crear-turno'),
    path('verificar-turno/', VerificarTurnoActivoAPIView.as_view(), name='verificar-turno'),
    path('finalizar-mi-ticket/', FinalizarMiTicketAPIView.as_view(), name='finalizar-ticket'),
    path('cancelar/', CancelarMiTicketAPIView.as_view(), name='cancelar-ticket'),
    path('', ListarTodosLosTicketsView.as_view(), name='listar_tickets'),
<<<<<<< HEAD
    path('<str:codigo_ticket>/cancelar/', CancelarTicketView.as_view(), name='cancelar-ticket'),
    path('<str:codigo_ticket>/marcar-atendiendo/', MarcarAtendiendoView.as_view(), name='marcar-atendiendo'),
=======
>>>>>>> 41cb762939c50b5773b21d9a3ae822ade603cbe8
]

