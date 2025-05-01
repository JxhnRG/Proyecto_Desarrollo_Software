# apps/usuarios/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = [
            'id', 'username', 'correo',
            'nombre', 'apellido',
            'rol', 'prioridad',
            'password',
        ]

    def create(self, validated_data):
        # Usa el manager de Django para crear y hashear contraseña
        return User.objects.create_user(
            username   = validated_data['username'],
            correo     = validated_data['correo'],
            password   = validated_data['password'],
            first_name = validated_data.get('nombre'),
            last_name  = validated_data.get('apellido'),
            rol        = validated_data.get('rol', 'trabajador'),
            prioridad  = validated_data.get('prioridad', 1),
        )
