\c proy_desarrollo;

-- TIPOS ENUM
CREATE TYPE tipo_rol AS ENUM ('admin', 'operador', 'cliente');
CREATE TYPE tipo_prioridad AS ENUM ('alta', 'normal');
CREATE TYPE estado_ticket AS ENUM ('esperando', 'atendiendo', 'atendido', 'cancelado');

-- USUARIOS
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    rol tipo_rol NOT NULL,
    prioridad tipo_prioridad DEFAULT 'normal',
    discapacidad BOOLEAN DEFAULT FALSE,
    f_nacimiento DATE
);

-- PUNTOS DE ATENCIÓN
CREATE TABLE punto_atencion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    direccion VARCHAR(200),
    ciudad VARCHAR(100)
);

-- TICKETS
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    codigo_ticket VARCHAR(20) UNIQUE NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_punto INTEGER NOT NULL REFERENCES punto_atencion(id) ON DELETE CASCADE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado estado_ticket DEFAULT 'esperando',
    prioridad BOOLEAN DEFAULT FALSE
);

-- TURNOS
CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,
    id_ticket INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    id_operador INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    hora_llamada TIMESTAMP,
    hora_inicio_atencion TIMESTAMP,
    hora_fin_atencion TIMESTAMP,
    numero_turno_en_tablero INTEGER
);