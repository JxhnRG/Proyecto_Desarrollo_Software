from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework import generics, permissions, status


class CrearTicketPorCedulaView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cedula = request.data.get('cedula')
        User = get_user_model()

        if not cedula:
            return Response({'error': 'La cédula es requerida'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cliente = User.objects.get(username=cedula)
        except User.DoesNotExist:
            return Response({'error': 'Cliente no registrado'}, status=status.HTTP_404_NOT_FOUND)

        prioridad = cliente.prioridad
        ticket = Ticket.objects.create(cliente=cliente, prioridad=prioridad, cedula=cedula)
        return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
