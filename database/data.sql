-- Tabla: rol
INSERT INTO rol (idRol, nombre) VALUES
(1, 'Administrador'),
(2, 'Soporte'),
(3, 'Cliente'),
(4, 'Supervisor'),
(5, 'Técnico');

-- Tabla: persona
INSERT INTO persona (idUsuario, idRol, nombre, email, contraseña, usuario) VALUES
(1, 1, 'Ana González', 'ana.gonzalez@email.com', 'admin123', 'ana_admin'),
(2, 2, 'Carlos Pérez', 'carlos.perez@email.com', 'soporte456', 'carlos_sp'),
(3, 3, 'Lucía Martínez', 'lucia.martinez@email.com', 'cliente789', 'lucia_m'),
(4, 4, 'María Torres', 'maria.torres@email.com', 'sup321', 'maria_sup'),
(5, 5, 'Javier Ruiz', 'javier.ruiz@email.com', 'tec654', 'javier_tec');

-- Tabla: puntoAtencion
INSERT INTO puntoAtencion (idPunto, direccion, telefono, nombre) VALUES
(1, 'Av. Siempre Viva 123', 1123456789, 'Sucursal Norte'),
(2, 'Calle Falsa 456', 1134567890, 'Sucursal Sur'),
(3, 'Av. Rivadavia 789', 1145678901, 'Sucursal Centro'),
(4, 'Mitre 101', 1156789012, 'Sucursal Oeste'),
(5, 'Belgrano 202', 1167890123, 'Sucursal Este');

-- Tabla: ticket
INSERT INTO ticket (idTicket, idUsuario, numeroTicket, prioridad, fechaCreacion) VALUES
(1, 3, 'TCK-0001', 2, '2025-04-10 09:00:00'),
(2, 3, 'TCK-0002', 1, '2025-04-10 10:30:00'),
(3, 2, 'TCK-0003', 3, '2025-04-10 11:15:00'),
(4, 5, 'TCK-0004', 2, '2025-04-10 12:45:00'),
(5, 4, 'TCK-0005', 1, '2025-04-10 14:00:00');

-- Tabla: gestion
INSERT INTO gestion (idTicket, idPunto) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);