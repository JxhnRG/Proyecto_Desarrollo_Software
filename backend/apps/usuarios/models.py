from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    correo = models.EmailField(unique=True)
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    rol = models.CharField(max_length=20, default='trabajador')
    prioridad = models.IntegerField(default=1)

    # Este campo reemplaza al username por correo
    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['username']  # si quieres seguir usando username como campo obligatorio

    def __str__(self):
        return self.correo
