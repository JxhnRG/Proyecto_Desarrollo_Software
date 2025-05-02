from django.db import models
from django.conf import settings

class Ticket(models.Model):
    cliente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    prioridad = models.BooleanField(default=False)
    cedula = models.CharField(max_length=20, unique=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.numero} - {self.cliente.username}'
