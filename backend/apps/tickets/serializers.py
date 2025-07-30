from rest_framework import serializers
from .models import Ticket, Turno

class TicketSerializer(serializers.ModelSerializer):
    codigo_ticket = serializers.CharField(read_only=True)
    punto_nombre = serializers.CharField(source='punto.nombre', read_only=True)
    posicion_en_fila = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'codigo_ticket',
            'prioridad',
            'punto_nombre',
            'posicion_en_fila',
            'estado',
            'fecha_emision',
        ]

    def get_posicion_en_fila(self, obj):
        tickets_adelante = Ticket.objects.filter(
            punto=obj.punto,
            prioridad=obj.prioridad,
            estado='esperando',
            fecha_emision__lt=obj.fecha_emision
        ).count()
        return tickets_adelante


class TurnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turno
        fields = '__all__'
