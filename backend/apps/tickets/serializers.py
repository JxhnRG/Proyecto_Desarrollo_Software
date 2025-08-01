from rest_framework import serializers
from .models import Ticket, Turno
from apps.tickets.utils import calcular_tiempo_espera
from datetime import date, timedelta 
from rest_framework import serializers
from apps.tickets.models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    codigo_ticket = serializers.CharField(read_only=True)
    punto_nombre = serializers.CharField(source='punto.nombre', read_only=True)
    posicion_en_fila = serializers.SerializerMethodField()
    tiempo_estimado_segundos = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'codigo_ticket',
            'prioridad',
            'punto_nombre',
            'posicion_en_fila',
            'estado',
            'fecha_emision',
            'tiempo_estimado_segundos', 
        ]

    def get_posicion_en_fila(self, obj):
        tickets_adelante = Ticket.objects.filter(
            punto=obj.punto,
            prioridad=obj.prioridad,
            estado='esperando',
            fecha_emision__lt=obj.fecha_emision
        ).count()
        return tickets_adelante + 1  # Se suma 1 para incluirse a sí mismo

    def get_tiempo_estimado_segundos(self, obj):
        tickets_adelante = Ticket.objects.filter(
            punto=obj.punto,
            prioridad=obj.prioridad,
            estado='esperando',
            fecha_emision__lt=obj.fecha_emision
        ).count()
        return (tickets_adelante + 1) * 120  # 2 minutos por ticket


class TurnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turno
        fields = '__all__'

class TicketRespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id','codigo_ticket', 'punto', 'prioridad', 'descripcion', 'respuesta']
        depth = 1  # Para mostrar nombre del punto de atención si es FK