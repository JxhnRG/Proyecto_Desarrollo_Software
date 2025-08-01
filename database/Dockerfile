# Usamos una imagen base oficial de Python
FROM python:3.11-slim

# Evita interacción en instalación
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Crear y usar el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependencias y código
COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Comando para recolectar estáticos antes de iniciar
RUN python manage.py collectstatic --noinput

# Comando por defecto: usar gunicorn
CMD gunicorn proy_desarrollo.wsgi:application --bind 0.0.0.0:8000