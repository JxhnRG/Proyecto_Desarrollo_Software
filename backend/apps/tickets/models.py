from django.db import models
from django.contrib.auth import get_user_model
from apps.punto_atencion.models import PuntoAtencion

User = get_user_model()  # ✅ Usamos el modelo de usuario personalizado


# ✅ Modelo para representar los tickets de atención
class Ticket(models.Model):
    # ✅ Opciones de estado del ticket
    ESTADO_CHOICES = [
        ('esperando', 'Esperando'),
        ('atendiendo', 'Atendiendo'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ]

    # ✅ Opciones descriptivas de prioridad (no se usan directamente en el campo `prioridad`)
    PRIORIDAD_CHOICES = [
        ('normal', 'Normal'),
        ('prioritaria', 'Prioritaria'),
    ]

    # ✅ Código único del ticket (ej. P-01, N-02)
    codigo_ticket = models.CharField(max_length=20, unique=True)

    # ✅ Usuario asociado al ticket
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    # ✅ Punto de atención donde se emitió el ticket
    punto = models.ForeignKey(PuntoAtencion, on_delete=models.CASCADE)

    # ✅ Fecha y hora de emisión automática al crear
    fecha_emision = models.DateTimeField(auto_now_add=True)

    # ✅ Estado actual del ticket (por defecto: esperando)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='esperando')

    # ✅ Si el ticket tiene prioridad (True = prioritaria, False = normal)
    prioridad = models.BooleanField(default=False)

    def __str__(self):
        return self.codigo_ticket  # ✅ Muestra el código al imprimir el objeto


# ✅ Modelo para representar los turnos de atención asignados a los tickets
class Turno(models.Model):
    # ✅ Ticket asociado a este turno
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)

    # ✅ Operador (usuario) que atiende este turno
    operador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='turnos_operador')

    # ✅ Hora en la que se llama al ticket
    hora_llamada = models.DateTimeField(null=True, blank=True)

    # ✅ Hora de inicio de la atención
    hora_inicio_atencion = models.DateTimeField(null=True, blank=True)

    # ✅ Hora de finalización de la atención
    hora_fin_atencion = models.DateTimeField(null=True, blank=True)

    # ✅ Número con el que el turno aparece en el tablero (pantalla)
    numero_turno_en_tablero = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'Turno {self.pk} - Ticket {self.ticket.codigo_ticket}'  # ✅ Representación legible

