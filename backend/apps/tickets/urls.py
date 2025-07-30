from django.urls import path
<<<<<<< HEAD
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView,VerificarTurnoActivoAPIView,FinalizarMiTicketAPIView
=======
from apps.tickets.views import CrearTicketAPIView, ListarMisTicketsView, CrearTurnoView,
>>>>>>> 3daaf74a9b7d37d32a2e8c0cc31b3538c653cf7c


urlpatterns = [
    path('crear/', CrearTicketAPIView.as_view(), name='crear-ticket'),  # 👈 Cambiado
    path('mis-tickets/', ListarMisTicketsView.as_view(), name='mis-tickets'),
    path('crear-turno/', CrearTurnoView.as_view(), name='crear-turno'),
<<<<<<< HEAD
    path('verificar-turno/', VerificarTurnoActivoAPIView.as_view(), name='verificar-turno'),
    path('finalizar-mi-ticket/', FinalizarMiTicketAPIView.as_view(), name='finalizar-ticket'),
=======
    
>>>>>>> 3daaf74a9b7d37d32a2e8c0cc31b3538c653cf7c
]

