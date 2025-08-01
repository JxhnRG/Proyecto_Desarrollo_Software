from django.urls import get_resolver
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", " Proyecto_Desarrollo_Software.settings")
django.setup()
resolver = get_resolver()
for pattern in resolver.url_patterns:
    print(pattern)
