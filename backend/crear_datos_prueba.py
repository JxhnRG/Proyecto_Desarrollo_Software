"""
Script para crear datos de prueba para las estadísticas
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone
import random

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Proyecto_Desarrollo_Software.settings')
django.setup()

from apps.punto_atencion.models import PuntoAtencion
from apps.usuarios.models import Usuario
from apps.tickets.models import Ticket, Turno

def crear_datos_prueba():
    print("Creando datos de prueba...")
    
    # Crear puntos de atención
    punto1, created = PuntoAtencion.objects.get_or_create(
        nombre='Principal',
        defaults={
            'direccion': 'Calle 123 #45-67',
            'ciudad': 'Cali'
        }
    )
    if created:
        print(f"✅ Punto de atención creado: {punto1.nombre}")
    else:
        print(f"ℹ️ Punto de atención ya existe: {punto1.nombre}")
    
    punto2, created = PuntoAtencion.objects.get_or_create(
        nombre='Sucursal Norte',
        defaults={
            'direccion': 'Carrera 15 #80-25',
            'ciudad': 'Cali'
        }
    )
    if created:
        print(f"✅ Punto de atención creado: {punto2.nombre}")
    else:
        print(f"ℹ️ Punto de atención ya existe: {punto2.nombre}")
    
    # Crear usuarios de prueba si no existen
    usuarios = []
    for i in range(5):
        usuario, created = Usuario.objects.get_or_create(
            correo=f'usuario{i+1}@test.com',
            defaults={
                'username': f'usuario{i+1}',
                'nombre': f'Usuario{i+1}',
                'apellido': f'Apellido{i+1}',
                'rol': 'cliente',
                'discapacidad': i % 3 == 0,  # Algunos con discapacidad
                'f_nacimiento': datetime(1990 + i, 1, 1).date()
            }
        )
        usuarios.append(usuario)
        if created:
            print(f"✅ Usuario creado: {usuario.correo}")
    
    # Crear operadores
    operador, created = Usuario.objects.get_or_create(
        correo='operador@test.com',
        defaults={
            'username': 'operador',
            'nombre': 'Operador',
            'apellido': 'Test',
            'rol': 'trabajador'
        }
    )
    if created:
        print(f"✅ Operador creado: {operador.correo}")
    
    # Crear tickets de prueba
    estados = ['esperando', 'atendiendo', 'finalizado', 'cancelado']
    puntos = [punto1, punto2]
    
    print("Creando tickets de prueba...")
    for i in range(30):
        # Fecha aleatoria en los últimos 7 días
        dias_atras = random.randint(0, 6)
        fecha_emision = timezone.now() - timedelta(days=dias_atras, hours=random.randint(0, 23))
        
        prioridad = random.choice([True, False])
        estado = random.choice(estados)
        punto = random.choice(puntos)
        usuario = random.choice(usuarios)
        
        # Generar código de ticket
        prefijo = 'P' if prioridad else 'N'
        codigo = f"{prefijo}-{i+1:02d}"
        
        ticket, created = Ticket.objects.get_or_create(
            codigo_ticket=codigo,
            defaults={
                'usuario': usuario,
                'punto': punto,
                'prioridad': prioridad,
                'estado': estado,
                'descripcion': f'Problema de prueba {i+1}',
                'fecha_emision': fecha_emision
            }
        )
        
        if created:
            print(f"  ✅ Ticket creado: {ticket.codigo_ticket} - {ticket.estado}")
            
            # Crear turno si el ticket está finalizado
            if estado in ['finalizado', 'atendiendo']:
                inicio = fecha_emision + timedelta(minutes=random.randint(5, 30))
                fin = inicio + timedelta(minutes=random.randint(2, 15)) if estado == 'finalizado' else None
                
                turno, turno_created = Turno.objects.get_or_create(
                    ticket=ticket,
                    defaults={
                        'operador': operador,
                        'hora_llamada': inicio - timedelta(minutes=2),
                        'hora_inicio_atencion': inicio,
                        'hora_fin_atencion': fin,
                        'numero_turno_en_tablero': i + 1
                    }
                )
                if turno_created:
                    print(f"    ✅ Turno creado para ticket {ticket.codigo_ticket}")
    
    print("\n🎉 Datos de prueba creados exitosamente!")
    print(f"📊 Total puntos de atención: {PuntoAtencion.objects.count()}")
    print(f"👥 Total usuarios: {Usuario.objects.count()}")
    print(f"🎫 Total tickets: {Ticket.objects.count()}")
    print(f"🔄 Total turnos: {Turno.objects.count()}")

if __name__ == '__main__':
    crear_datos_prueba()
