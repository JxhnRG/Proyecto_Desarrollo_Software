from django.urls import path
from .views import crear_punto_atencion_default, estadisticas_por_punto

urlpatterns = [
    path('crear-default/', crear_punto_atencion_default, name='crear-punto-default'),
    path('estadisticas/', estadisticas_por_punto, name='estadisticas-por-punto'),
]
