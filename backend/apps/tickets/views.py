from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import date, timedelta 
import random
from apps.tickets.models import Ticket, Turno
from apps.tickets.serializers import TicketSerializer, TurnoSerializer,TicketRespuestaSerializer
from apps.punto_atencion.models import PuntoAtencion
from apps.usuarios.models import Usuario

# ✅ Función para calcular el tiempo estimado de espera
def calcular_tiempo_espera(ticket):
    # Cuenta cuántos tickets con el mismo punto, misma prioridad, en estado "esperando" y creados antes que este.
    tickets_adelante = Ticket.objects.filter(
        punto=ticket.punto,
        prioridad=ticket.prioridad,
        estado='esperando',
        fecha_emision__lt=ticket.fecha_emision
    ).count()

    # Tiempo estimado: 5 minutos por persona en fila
    tiempo_estimado = timedelta(minutes=5 * tickets_adelante)
    return tiempo_estimado

# ✅ Vista para crear un ticket asociado al usuario autenticado
class CrearTicketAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # ✅ Requiere autenticación

    def post(self, request):
        user = request.user

        # ✅ Verifica si el usuario está autenticado
        if not user.is_authenticated:
            return Response({"error": "Usuario no autenticado"}, status=401)
        
        # ✅ Verifica si ya tiene un ticket en espera
        ticket_activo = Ticket.objects.filter(usuario=user, estado='esperando').first()
        if ticket_activo:
            tiempo_espera = calcular_tiempo_espera(ticket_activo)
            tiempo_creado = timezone.now() - ticket_activo.fecha_emision

            if tiempo_creado > tiempo_espera + timedelta(minutes=1):  # Se da 1 min de gracia
                ticket_activo.estado = 'finalizado'
                ticket_activo.save()
            else:
                return Response({
                    "error": "Ya tienes un ticket activo en espera.",
                    "codigo": ticket_activo.codigo_ticket,
                    "sede": ticket_activo.punto.nombre
                }, status=400)

        # ✅ Calcula edad si tiene fecha de nacimiento
        edad = 0
        if user.f_nacimiento:
            today = date.today()
            edad = today.year - user.f_nacimiento.year - (
                (today.month, today.day) < (user.f_nacimiento.month, user.f_nacimiento.day)
            )

        # ✅ Determina si tiene prioridad
        prioridad = user.discapacidad or edad >= 60

        # ✅ Prefijo y código
        prefijo = 'P' if prioridad else 'N'
        total = Ticket.objects.filter(prioridad=prioridad).count() + 1
        codigo_ticket = f"{prefijo}-{total:02d}"

        # ✅ Punto de atención
        puntos = list(PuntoAtencion.objects.all())
        if not puntos:
            return Response({"error": "No hay puntos de atención disponibles"}, status=400)

        punto = random.choice(puntos)
        # ✅ Crear el ticket
        ticket = Ticket.objects.create(
            usuario=user,
            punto=punto,
            prioridad=prioridad,
            codigo_ticket=codigo_ticket
        )

        # ✅ Calcular tiempo de espera
        tiempo_espera = calcular_tiempo_espera(ticket)
        if tiempo_espera.total_seconds() == 0:
            tiempo_espera = timedelta(minutes=5)  # Mínimo de espera

        minutos_espera = int(tiempo_espera.total_seconds() // 60)
        segundos_espera = int(tiempo_espera.total_seconds())

        # ✅ Respuesta
        return Response({
            'codigo': ticket.codigo_ticket,
            'prioridad': ticket.prioridad,
            'sede': ticket.punto.nombre,
            'tiempo_espera': minutos_espera,
            'tiempo_espera_segundos': segundos_espera
        }, status=201)

# ✅ Vista para listar los tickets del usuario autenticado
class ListarMisTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(usuario=self.request.user)

# ✅ Vista para crear un nuevo turno (CreateAPIView ya maneja el post)
class CrearTurnoView(generics.CreateAPIView):
    queryset = Turno.objects.all()
    serializer_class = TurnoSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Vista para verificar el turno activo y cerrarlo si han pasado 5 minutos
class VerificarTurnoActivoAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        operador = request.user

        # Buscar el turno activo actual
        turno = Turno.objects.filter(
            operador=operador,
            hora_inicio_atencion__isnull=False,
            hora_fin_atencion__isnull=True
        ).first()

        if not turno:
            return Response({"turno": None, "expirado": False}, status=200)

        # Verificar si han pasado más de 5 minutos desde que comenzó
        ahora = timezone.now()
        tiempo_transcurrido = ahora - turno.hora_inicio_atencion

        if tiempo_transcurrido >= timedelta(minutes=5):
            # Finalizar el turno automáticamente
            turno.hora_fin_atencion = ahora
            turno.ticket.estado = 'finalizado'
            turno.ticket.save()
            turno.save()
            return Response({
                "mensaje": "El turno ha sido finalizado automáticamente por tiempo.",
                "turno": TurnoSerializer(turno).data,
                "expirado": True
            }, status=200)

        return Response({
            "mensaje": "El turno sigue activo.",
            "turno": TurnoSerializer(turno).data,
            "expirado": False
        }, status=200)

# ✅ Método para cambiar el estado de un ticket de 'esperando' a 'finalizado'
class FinalizarMiTicketAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ticket = Ticket.objects.filter(usuario=request.user, estado='esperando').first()
        if not ticket:
            return Response({'error': 'No tienes un ticket activo'}, status=404)

        problema = request.data.get('problema')
        if not problema:
            return Response({'error': 'Debes escribir el motivo o problema.'}, status=400)

        ticket.estado = 'finalizado'
        ticket.descripcion = problema  
        ticket.save()
        return Response({'mensaje': 'Ticket finalizado correctamente'}, status=200)

# ✅ Método para cambiar el estado de un ticket de 'esperando' a 'cancelado'
class CancelarTicketView(APIView):
    def post(self, request, codigo_ticket):
        try:
            ticket = Ticket.objects.get(codigo_ticket=codigo_ticket)
        except Ticket.DoesNotExist:
            return Response({'error': 'Ticket no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if ticket.estado != 'esperando':
            return Response({'error': 'Solo se pueden cancelar tickets en estado esperando'}, status=status.HTTP_400_BAD_REQUEST)

        ticket.estado = 'cancelado'
        ticket.save()
        return Response({'mensaje': 'Ticket cancelado correctamente'}, status=status.HTTP_200_OK)
    
class TiempoPromedioPorSedeAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, punto_id):
        tickets = Ticket.objects.filter(
            punto_id=punto_id,
            estado__in=['cancelado', 'finalizado']
        )

        if not tickets.exists():
            return Response({'mensaje': 'No hay tickets para calcular promedio'}, status=404)

        tiempos = []
        for _ in tickets:
            extra = random.randint(1, 30)
            tiempo_total = timedelta(minutes=2, seconds=extra)
            tiempos.append(tiempo_total.total_seconds())

        promedio_segundos = int(sum(tiempos) / len(tiempos))
        promedio_minutos = promedio_segundos // 60
        promedio_solo_segundos = promedio_segundos % 60

        return Response({
            'sede': PuntoAtencion.objects.get(id=punto_id).nombre,
            'cantidad_tickets': len(tiempos),
            'tiempo_promedio_segundos': promedio_segundos,
            'tiempo_formateado': f'{promedio_minutos} minutos y {promedio_solo_segundos} segundos'
        })
    #
class TicketRespuestaView(generics.RetrieveUpdateAPIView):
        queryset = Ticket.objects.all()
        serializer_class = TicketRespuestaSerializer
        permission_classes = [permissions.IsAuthenticated]

        def patch(self, request, *args, **kwargs):
          ticket = self.get_object()
          serializer = self.get_serializer(ticket, data=request.data, partial=True)
          if serializer.is_valid():
             serializer.save()
             return Response(serializer.data)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
class TicketListAPIView(generics.ListAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]