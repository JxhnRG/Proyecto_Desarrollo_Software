from django.contrib.auth.models import AbstractUser
from django.db import models


# ✅ Modelo personalizado de usuario que hereda de AbstractUser
class Usuario(AbstractUser):
    # ✅ Definición de roles posibles
    ROLES = (
        ('admin', 'Administrador'),
        ('trabajador', 'Trabajador'),
        ('cliente', 'Cliente'),
    )

    # ✅ Campo de correo como identificador único para login
    correo = models.EmailField(unique=True)

    # ✅ Campos personales
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)

    # ✅ Rol del usuario (admin, trabajador, cliente)
    rol = models.CharField(max_length=20, choices=ROLES)

    # ✅ Si el usuario tiene prioridad (puedes calcular esto dinámicamente si quieres)
    prioridad = models.BooleanField(default=False)

    # ✅ Indica si el usuario tiene alguna discapacidad
    discapacidad = models.BooleanField(default=False)

    # ✅ Fecha de nacimiento (opcional)
    f_nacimiento = models.DateField(null=True, blank=True)

    # ✅ Establece el campo que se usará para autenticarse (correo en lugar de username)
    USERNAME_FIELD = 'correo'

    # ✅ Campos requeridos al crear un usuario vía createsuperuser
    REQUIRED_FIELDS = ['username', 'rol']

    def __str__(self):
        return self.correo  # ✅ Para representar el objeto con su correo
