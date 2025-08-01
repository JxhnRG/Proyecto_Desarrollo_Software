from django.urls import path
from .views import crear_punto_atencion_default, ListaPuntosAPIView,ReporteAtencionListCreateAPIView
from .views import AnuncioListCreateAPIView, estadisticas_por_punto,obtener_anuncio_actual
urlpatterns = [
    path('crear-default/', crear_punto_atencion_default, name='crear-punto-default'),
    path('puntos/', ListaPuntosAPIView.as_view(), name='listar-puntos'),
     path('reportes/<int:punto_id>/', ReporteAtencionListCreateAPIView.as_view(), name='reportes-sede'),
     path('anuncios/', AnuncioListCreateAPIView.as_view(), name='anuncios'),
     path('estadisticas/', estadisticas_por_punto, name='estadisticas-por-punto'),
     path('anuncios/actual/', obtener_anuncio_actual, name='anuncio-actual'),
]
