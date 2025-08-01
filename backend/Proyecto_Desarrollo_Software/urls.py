
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('apps.usuarios.urls')),
    path('api/tickets/', include('apps.tickets.urls')),
    path('api/punto-atencion/', include('apps.punto_atencion.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('api/punto/', include('apps.punto_atencion.urls')),
]
