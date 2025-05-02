from rest_framework import serializers
from .models import Ticket
from django.contrib.auth.models import User

class TicketSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.first_name', read_only=True)
    cliente_apellido = serializers.CharField(source='cliente.last_name', read_only=True)
    cedula = serializers.CharField(source='cliente.username', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'cedula', 'cliente_nombre', 'cliente_apellido', 'prioridad', 'creado']
