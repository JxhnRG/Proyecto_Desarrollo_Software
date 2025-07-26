from django.urls import path
from .views import crear_punto_atencion_default

urlpatterns = [
    path('crear-default/', crear_punto_atencion_default, name='crear-punto-default'),
]
