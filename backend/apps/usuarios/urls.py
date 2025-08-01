from django.urls import path
from .views import AdminRegistrarUsuarioView, RegistroClientePublicoView, LoginUsuarioView

urlpatterns = [
    path('admin/registrar/', AdminRegistrarUsuarioView.as_view(), name='admin-registrar-usuario'),
    path('registro/', RegistroClientePublicoView.as_view(), name='registro-cliente'),
    path('login/',    LoginUsuarioView.as_view(),    name='login'),
]
