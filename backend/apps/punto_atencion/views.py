from django.http import JsonResponse
from .models import PuntoAtencion


# ✅ Vista basada en función para crear un punto de atención por defecto
def crear_punto_atencion_default(request):
    # ✅ Solo permitimos solicitudes GET
    if request.method == 'GET':
        # ✅ Verificamos si ya existe al menos un punto de atención
        if PuntoAtencion.objects.exists():
            return JsonResponse({'mensaje': 'Ya existe un punto de atención.'})

        # ✅ Creamos un nuevo punto con valores por defecto
        punto = PuntoAtencion.objects.create(
            nombre='Principal',
            direccion='Calle 123 #45-67',
            ciudad='Cali'
        )

        # ✅ Retornamos respuesta con los datos del nuevo punto
        return JsonResponse({
            'mensaje': 'Punto de atención creado.',
            'punto': {
                'id': punto.id,
                'nombre': punto.nombre,
                'direccion': punto.direccion,
                'ciudad': punto.ciudad,
            }
        })

    # ❌ Si el método no es GET, devolvemos error 405 (Method Not Allowed)
    return JsonResponse({'error': 'Método no permitido'}, status=405)
