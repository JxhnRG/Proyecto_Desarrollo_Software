# apps/usuarios/urls.py
from django.urls import path
from .views import RegisterUsuarioView, LoginUsuarioView

urlpatterns = [
    path('registro/', RegisterUsuarioView.as_view(), name='registro'),
    path('login/',    LoginUsuarioView.as_view(),    name='login'),
]
