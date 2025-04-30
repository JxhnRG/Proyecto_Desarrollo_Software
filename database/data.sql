INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol, prioridad)
VALUES 
('Ana', 'Pérez', 'ana.perez@example.com', 'hash1', 'cliente', 'normal'),
('Luis', 'Gómez', 'luis.gomez@example.com', 'hash2', 'cliente', 'alta'),
('Carlos', 'Ruiz', 'carlos.ruiz@example.com', 'hash3', 'operador', 'normal'),
('Marta', 'Salinas', 'marta.salinas@example.com', 'hash4', 'admin', 'normal');

INSERT INTO puntos_atencion (nombre, ubicacion, descripcion, estado)
VALUES 
('Sucursal Central', 'Av. Principal 123', 'Punto principal de atención', 'activo'),
('Sucursal Norte', 'Calle Norte 456', 'Atención en zona norte', 'activo');

INSERT INTO tickets (codigo_ticket, id_usuario, id_punto, fecha_emision, estado, prioridad)
VALUES 
('N-101', 1, 1, NOW(), 'esperando', 'normal'),
('P-001', 2, 1, NOW(), 'esperando', 'alta');

INSERT INTO turnos (id_ticket, id_operador, hora_llamada, hora_inicio_atencion, hora_fin_atencion, numero_turno_en_tablero)
VALUES 
(1, 3, NOW(), NOW() + INTERVAL '2 minutes', NOW() + INTERVAL '5 minutes', 45),
(2, 3, NOW(), NOW() + INTERVAL '3 minutes', NOW() + INTERVAL '6 minutes', 46);
