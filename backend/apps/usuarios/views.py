from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UsuarioSerializer

User = get_user_model()


# ✅ Vista para que un administrador cree usuarios manualmente
class AdminRegistrarUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAdminUser]  # ✅ Solo accesible por usuarios con rol de admin

    def post(self, request, *args, **kwargs):
        # ✅ Verificamos explícitamente el rol, además del permiso
        if request.user.rol != 'admin':
            return Response(
                {'error': 'Solo los administradores pueden crear usuarios.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


# ✅ Vista pública para que cualquier persona cree un usuario tipo cliente
class RegistroClientePublicoView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]  # ✅ Público

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['rol'] = 'cliente'  # ✅ Se fuerza el rol 'cliente' para evitar abusos

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


# ✅ Vista para login que devuelve tokens JWT y datos del usuario
class LoginUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]  # ✅ No requiere autenticación previa

    def post(self, request):
        correo = request.data.get('correo')
        password = request.data.get('password')

        # 🔐 Autenticación usando correo como nombre de usuario
        user = authenticate(request, username=correo, password=password)

        if not user:
            return Response(
                {'detail': 'Credenciales incorrectas'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Generamos los tokens JWT
        refresh = RefreshToken.for_user(user)

        # ✅ Devolvemos los tokens junto con los datos del usuario
        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'usuario': {
                'id':           user.id,
                'username':     user.username,
                'correo':       user.correo,
                'nombre':       user.nombre,
                'apellido':     user.apellido,
                'rol':          user.rol,
                'prioridad':    user.prioridad,
                'discapacidad': user.discapacidad,
                'f_nacimiento': user.f_nacimiento,
            }
        })
