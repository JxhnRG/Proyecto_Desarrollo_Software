from django.urls import path
from .views import CrearTicketPorCedulaView

urlpatterns = [
    path('crear/', CrearTicketPorCedulaView.as_view(), name='crear-tickets-cedula'),
]
