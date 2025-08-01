from django.http import JsonResponse
from .models import PuntoAtencion
from rest_framework import generics, permissions
from .models import ReporteAtencion, Anuncio
from .serializers import ReporteAtencionSerializer
from apps.punto_atencion.serializers import ReporteAtencionSerializer,AnuncioSerializer
from apps.tickets.models import Ticket, Turno
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count


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
class ListaPuntosAPIView(APIView):
    def get(self, request):
        puntos = PuntoAtencion.objects.all().values('id', 'nombre', 'direccion', 'ciudad')
        return Response(puntos)

class ReporteAtencionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReporteAtencionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        punto_id = self.kwargs['punto_id']
        return ReporteAtencion.objects.filter(punto_id=punto_id)

    def perform_create(self, serializer):
        punto_id = self.kwargs['punto_id']
        serializer.save(
            punto_id=punto_id,
            autor=self.request.user
        )

class AnuncioListCreateAPIView(generics.ListCreateAPIView):
    queryset = Anuncio.objects.all().order_by('-creado')[:1]  # solo el último
    serializer_class = AnuncioSerializer
    permission_classes = [permissions.IsAdminUser] 



@api_view(['GET'])
        # @permission_classes([IsAuthenticated])  # Comentado temporalmente para testing
def estadisticas_por_punto(request):
            """
            Vista detallada para obtener estadísticas completas por punto de atención
            """
            try:
                # Obtener todos los puntos de atención
                puntos = PuntoAtencion.objects.all()
                estadisticas = []
                
                for punto in puntos:
                    # Estadísticas básicas de tickets
                    total_tickets = Ticket.objects.filter(punto=punto).count()
                    tickets_hoy = Ticket.objects.filter(
                        punto=punto,
                        fecha_emision__date=timezone.now().date()
                    ).count()
                    
                    # Tickets por estado
                    tickets_esperando = Ticket.objects.filter(punto=punto, estado='esperando').count()
                    tickets_atendiendo = Ticket.objects.filter(punto=punto, estado='atendiendo').count()
                    tickets_finalizados = Ticket.objects.filter(punto=punto, estado='finalizado').count()
                    tickets_cancelados = Ticket.objects.filter(punto=punto, estado='cancelado').count()
                    
                    # Tickets por prioridad
                    tickets_prioritarios = Ticket.objects.filter(punto=punto, prioridad=True).count()
                    tickets_normales = Ticket.objects.filter(punto=punto, prioridad=False).count()
                    
                    # Estadísticas de turnos
                    turnos_totales = Turno.objects.filter(ticket__punto=punto).count()
                    turnos_completados = Turno.objects.filter(
                        ticket__punto=punto,
                        hora_fin_atencion__isnull=False
                    ).count()
                    turnos_en_proceso = Turno.objects.filter(
                        ticket__punto=punto,
                        hora_inicio_atencion__isnull=False,
                        hora_fin_atencion__isnull=True
                    ).count()
                    
                    # Tiempo promedio de atención (solo turnos completados)
                    tiempo_promedio_minutos = 0
                    tiempos_detalle = []
                    turnos_con_tiempo = Turno.objects.filter(
                        ticket__punto=punto,
                        hora_inicio_atencion__isnull=False,
                        hora_fin_atencion__isnull=False
                    )
                    
                    if turnos_con_tiempo.exists():
                        tiempos = []
                        for turno in turnos_con_tiempo:
                            tiempo_atencion = turno.hora_fin_atencion - turno.hora_inicio_atencion
                            minutos = tiempo_atencion.total_seconds() / 60
                            tiempos.append(minutos)
                            tiempos_detalle.append({
                                'ticket': turno.ticket.codigo_ticket,
                                'tiempo_minutos': round(minutos, 2)
                            })
                        tiempo_promedio_minutos = sum(tiempos) / len(tiempos)
                    
                    # Tickets en los últimos 7 días
                    hace_7_dias = timezone.now() - timedelta(days=7)
                    tickets_ultima_semana = Ticket.objects.filter(
                        punto=punto,
                        fecha_emision__gte=hace_7_dias
                    ).count()
                    
                    # Estadísticas por día de la última semana
                    tickets_por_dia = []
                    for i in range(7):
                        fecha = timezone.now().date() - timedelta(days=i)
                        tickets_dia = Ticket.objects.filter(
                            punto=punto,
                            fecha_emision__date=fecha
                        ).count()
                        # También por estado en ese día
                        esperando_dia = Ticket.objects.filter(
                            punto=punto,
                            fecha_emision__date=fecha,
                            estado='esperando'
                        ).count()
                        finalizados_dia = Ticket.objects.filter(
                            punto=punto,
                            fecha_emision__date=fecha,
                            estado='finalizado'
                        ).count()
                        cancelados_dia = Ticket.objects.filter(
                            punto=punto,
                            fecha_emision__date=fecha,
                            estado='cancelado'
                        ).count()
                        
                        tickets_por_dia.append({
                            'fecha': fecha.strftime('%Y-%m-%d'),
                            'fecha_legible': fecha.strftime('%d/%m'),
                            'dia_semana': fecha.strftime('%A'),
                            'total': tickets_dia,
                            'esperando': esperando_dia,
                            'finalizados': finalizados_dia,
                            'cancelados': cancelados_dia
                        })
                    
                    # Hora pico (hora con más tickets emitidos)
                    hora_pico = 0
                    tickets_por_hora_detalle = []
                    try:
                        from django.db import connection
                        if 'sqlite' in connection.vendor:
                            tickets_por_hora = Ticket.objects.filter(punto=punto).extra(
                                select={'hora': "strftime('%%H', fecha_emision)"}
                            ).values('hora').annotate(
                                total=Count('id')
                            ).order_by('-total')
                        else:
                            tickets_por_hora = Ticket.objects.filter(punto=punto).extra(
                                select={'hora': 'EXTRACT(hour FROM fecha_emision)'}
                            ).values('hora').annotate(
                                total=Count('id')
                            ).order_by('-total')
                        
                        # Crear distribución por horas
                        for i in range(24):
                            hora_tickets = tickets_por_hora.filter(hora=i).first()
                            cantidad = hora_tickets['total'] if hora_tickets else 0
                            tickets_por_hora_detalle.append({
                                'hora': f"{i:02d}:00",
                                'cantidad': cantidad
                            })
                        
                        if tickets_por_hora.exists():
                            hora_pico = int(tickets_por_hora.first()['hora'])
                            
                    except Exception as e:
                        print(f"Error calculando hora pico: {e}")
                    
                    # Estadísticas de rendimiento
                    tasa_finalizacion = (tickets_finalizados / total_tickets * 100) if total_tickets > 0 else 0
                    tasa_cancelacion = (tickets_cancelados / total_tickets * 100) if total_tickets > 0 else 0
                    
                    # Tickets más recientes
                    tickets_recientes = Ticket.objects.filter(punto=punto).order_by('-fecha_emision')[:5]
                    tickets_recientes_data = []
                    for ticket in tickets_recientes:
                        tickets_recientes_data.append({
                            'codigo': ticket.codigo_ticket,
                            'estado': ticket.estado,
                            'prioridad': 'Prioritaria' if ticket.prioridad else 'Normal',
                            'fecha': ticket.fecha_emision.strftime('%d/%m/%Y %H:%M'),
                            'usuario': ticket.usuario.nombre if hasattr(ticket.usuario, 'nombre') else ticket.usuario.username
                        })
                    
                    estadisticas.append({
                        'punto_id': punto.id,
                        'punto_nombre': punto.nombre,
                        'punto_direccion': punto.direccion or '',
                        'punto_ciudad': punto.ciudad or '',
                        'resumen': {
                            'total_tickets': total_tickets,
                            'tickets_hoy': tickets_hoy,
                            'tickets_ultima_semana': tickets_ultima_semana,
                            'tiempo_promedio_atencion': round(tiempo_promedio_minutos, 2),
                            'hora_pico': f"{hora_pico:02d}:00",
                            'tasa_finalizacion': round(tasa_finalizacion, 1),
                            'tasa_cancelacion': round(tasa_cancelacion, 1),
                            'eficiencia': round((tickets_finalizados / (tickets_finalizados + tickets_cancelados) * 100), 1) if (tickets_finalizados + tickets_cancelados) > 0 else 0
                        },
                        'tickets_por_estado': {
                            'esperando': tickets_esperando,
                            'atendiendo': tickets_atendiendo,
                            'finalizados': tickets_finalizados,
                            'cancelados': tickets_cancelados,
                        },
                        'tickets_por_prioridad': {
                            'prioritarios': tickets_prioritarios,
                            'normales': tickets_normales,
                        },
                        'turnos': {
                            'total': turnos_totales,
                            'completados': turnos_completados,
                            'en_proceso': turnos_en_proceso,
                            'pendientes': turnos_totales - turnos_completados - turnos_en_proceso,
                            'tiempos_detalle': tiempos_detalle[:10]  # Solo los primeros 10
                        },
                        'tickets_por_dia': list(reversed(tickets_por_dia)),  # Del más antiguo al más reciente
                        'tickets_por_hora': tickets_por_hora_detalle,
                        'tickets_recientes': tickets_recientes_data,
                        'rendimiento': {
                            'total_atenciones': tickets_finalizados + tickets_cancelados,
                            'promedio_diario': round((total_tickets / 7), 1) if total_tickets > 0 else 0,
                            'pico_actividad': f"{hora_pico:02d}:00-{(hora_pico+1):02d}:00"
                        }
                    })
                
                return Response({
                    'success': True,
                    'estadisticas': estadisticas,
                    'total_puntos': len(puntos),
                    'timestamp': timezone.now().isoformat(),
                    'resumen_general': {
                        'total_tickets_sistema': sum([e['resumen']['total_tickets'] for e in estadisticas]),
                        'total_puntos_activos': len([e for e in estadisticas if e['resumen']['total_tickets'] > 0]),
                        'promedio_eficiencia': round(sum([e['resumen']['eficiencia'] for e in estadisticas]) / len(estadisticas), 1) if estadisticas else 0
                    }
                })
                
            except Exception as e:
                # Mejor manejo de errores
                import traceback
                error_details = {
                    'error': str(e),
                    'traceback': traceback.format_exc()
                }
                print(f"Error en estadisticas_por_punto: {error_details}")
                return Response({
                    'success': False,
                    'error': str(e),
                    'details': error_details
                }, status=500)
#obtener anuncio actual
@api_view(['GET'])
def obtener_anuncio_actual(request):
    anuncio = Anuncio.objects.order_by('-creado').first()
    if anuncio:
        return Response({'mensaje': anuncio.mensaje})
    return Response({'mensaje': ''})