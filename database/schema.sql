\c proy_desarrollo

-- Roles predefinidos: admin, operador, cliente
CREATE TYPE tipo_rol AS ENUM ('admin', 'operador', 'cliente');
CREATE TYPE tipo_prioridad AS ENUM ('alta', 'normal');
CREATE TYPE estado_usuario AS ENUM ('activo', 'inactivo');
CREATE TYPE estado_ticket AS ENUM ('esperando', 'atendiendo', 'atendido', 'cancelado');

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    rol tipo_rol NOT NULL,
    prioridad tipo_prioridad DEFAULT 'normal'
);

-- Tabla de puntos de atención
CREATE TABLE puntos_atencion (
    id_punto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion TEXT,
    descripcion TEXT,
    estado estado_usuario DEFAULT 'activo'
);

-- Tabla de tickets
CREATE TABLE tickets (
    id_ticket SERIAL PRIMARY KEY,
    codigo_ticket VARCHAR(20) UNIQUE NOT NULL,
    id_usuario INT NOT NULL,
    id_punto INT NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado estado_ticket DEFAULT 'esperando',
    prioridad tipo_prioridad DEFAULT 'normal',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_punto) REFERENCES puntos_atencion(id_punto)
);

-- Tabla de turnos
CREATE TABLE turnos (
    id_turno SERIAL PRIMARY KEY,
    id_ticket INT NOT NULL,
    id_operador INT NOT NULL,
    hora_llamada TIMESTAMP,
    hora_inicio_atencion TIMESTAMP,
    hora_fin_atencion TIMESTAMP,
    numero_turno_en_tablero INT,
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket),
    FOREIGN KEY (id_operador) REFERENCES usuarios(id_usuario)
);

-- Tabla de estadísticas (puede ser generada como vista si se prefiere)
CREATE TABLE estadisticas (
    id_estadistica SERIAL PRIMARY KEY,
    id_punto INT NOT NULL,
    fecha DATE NOT NULL,
    cantidad_atendidos INT DEFAULT 0,
    tiempo_promedio_atencion INTERVAL,
    porcentaje_prioritarios NUMERIC(5,2),
    FOREIGN KEY (id_punto) REFERENCES puntos_atencion(id_punto)
);

-- Tabla de anuncios / publicidad
CREATE TABLE anuncios (
    id_anuncio SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);
