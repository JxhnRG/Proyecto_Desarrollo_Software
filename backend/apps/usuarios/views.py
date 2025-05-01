# apps/usuarios/views.py
from rest_framework import generics, permissions, status
from rest_framework.views    import APIView
from rest_framework.response import Response
from django.contrib.auth     import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UsuarioSerializer
from django.contrib.auth import get_user_model


User = get_user_model()

class RegisterUsuarioView(generics.CreateAPIView):
    queryset         = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, *args, **kwargs):
        if request.user.rol != 'admin':
            return Response({'error': 'Solo los administradores pueden crear usuarios.'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)

class LoginUsuarioView(APIView):
    def post(self, request):
        correo    = request.data.get('correo')
        password  = request.data.get('password')
        user = authenticate(request, username=correo, password=password)
        if not user:
            return Response(
                {'detail': 'Credenciales incorrectas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'user': {
                'id':       user.id,
                'username': user.username,
                'correo':   user.correo,
                'rol':      user.rol,
            }
        })
