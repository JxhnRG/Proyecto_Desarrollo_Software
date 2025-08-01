from django.db import models
from django.conf import settings
from rest_framework import serializers



class PuntoAtencion(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre

class ReporteAtencion(models.Model):
    punto = models.ForeignKey(PuntoAtencion, on_delete=models.CASCADE, related_name='reportes')
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    retroalimentacion = models.TextField()
    
    def __str__(self):
        return f"Reporte para {self.punto.nombre} - {self.fecha.strftime('%Y-%m-%d')}"

class Anuncio(models.Model):
    mensaje = models.TextField()
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Anuncio del {self.creado.strftime("%Y-%m-%d %H:%M:%S")}'