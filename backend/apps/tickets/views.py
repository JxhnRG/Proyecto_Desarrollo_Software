from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date

from apps.tickets.models import Ticket, Turno
from apps.tickets.serializers import TicketSerializer, TurnoSerializer
from apps.punto_atencion.models import PuntoAtencion
from apps.usuarios.models import Usuario


# ✅ Vista para crear un ticket asociado al usuario autenticado
class CrearTicketAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # ✅ Requiere autenticación

    def post(self, request):
        user = request.user

        # ✅ Verifica si el usuario está autenticado
        if not user.is_authenticated:
            return Response({"error": "Usuario no autenticado"}, status=401)

        # ✅ Obtiene la fecha actual y calcula la edad si hay fecha de nacimiento
        edad = 0
        if user.f_nacimiento:
            today = date.today()
            edad = today.year - user.f_nacimiento.year - (
                (today.month, today.day) < (user.f_nacimiento.month, user.f_nacimiento.day)
            )

        # ✅ Determina si el usuario tiene prioridad (por discapacidad o edad ≥ 60)
        prioridad = user.discapacidad or edad >= 60

        # ✅ Asigna prefijo según la prioridad
        prefijo = 'P' if prioridad else 'N'

        # ✅ Cuenta tickets existentes con misma prioridad para generar nuevo código
        total = Ticket.objects.filter(prioridad=prioridad).count() + 1
        codigo_ticket = f"{prefijo}-{total:02d}"

        # ✅ Selecciona el primer punto de atención disponible
        punto = PuntoAtencion.objects.first()
        if not punto:
            return Response({"error": "No hay puntos de atención disponibles"}, status=400)

        # ✅ Crea y guarda el nuevo ticket
        ticket = Ticket.objects.create(
            usuario=user,
            punto=punto,
            prioridad=prioridad,
            codigo_ticket=codigo_ticket
        )

        # ✅ Retorna respuesta con código generado y prioridad
        return Response({
            "mensaje": "Ticket generado correctamente",
            "codigo": ticket.codigo_ticket,
            "prioridad": ticket.prioridad
        }, status=201)


# ✅ Vista para listar los tickets del usuario autenticado
class ListarMisTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ✅ Retorna solo los tickets del usuario autenticado
        return Ticket.objects.filter(usuario=self.request.user)


# ✅ Vista para crear un nuevo turno (CreateAPIView ya maneja el post)
class CrearTurnoView(generics.CreateAPIView):
    queryset = Turno.objects.all()
    serializer_class = TurnoSerializer
    permission_classes = [permissions.IsAuthenticated]
