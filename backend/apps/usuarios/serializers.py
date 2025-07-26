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
            'discapacidad', 'f_nacimiento',
            'password',
        ]
        extra_kwargs = {
            'rol': {'required': True},
        }

    def validate_rol(self, value):
        roles_validos = ['admin', 'trabajador', 'cliente']
        if value not in roles_validos:
            raise serializers.ValidationError(f"Rol inválido. Debe ser uno de: {', '.join(roles_validos)}.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username      = validated_data['username'],
            correo        = validated_data['correo'],
            password      = validated_data['password'],
            nombre        = validated_data['nombre'],
            apellido      = validated_data['apellido'],
            rol           = validated_data.get('rol', 'trabajador'),
            prioridad     = validated_data.get('prioridad', False),
            discapacidad  = validated_data.get('discapacidad', False),
            f_nacimiento  = validated_data.get('f_nacimiento', None),
        )
