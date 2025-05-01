from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('trabajador', 'Trabajador'),
        ('cliente', 'Cliente'),
    )
    correo = models.EmailField(unique=True)
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    rol = models.CharField(max_length=20, choices=ROLES)
    prioridad = models.BooleanField(default=False)
    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['username', 'rol']

    def __str__(self):
        return self.correo
