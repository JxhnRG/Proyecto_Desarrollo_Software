from rest_framework import serializers
from .models import ReporteAtencion
from .models import Anuncio

class ReporteAtencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReporteAtencion
        fields = ['id', 'punto', 'autor', 'fecha', 'retroalimentacion']
        read_only_fields = ['fecha', 'autor', 'punto']  


class AnuncioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anuncio
        fields = ['id', 'mensaje', 'creado']
