\c proy_desarrollo

CREATE TABLE rol (
    idRol INT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE persona (
    idUsuario INT PRIMARY KEY,
    idRol INT,
    nombre VARCHAR(50),
    email VARCHAR(50),
    contraseña VARCHAR(50),
    usuario VARCHAR(50),
    FOREIGN KEY (idRol) REFERENCES rol(idRol)
);

CREATE TABLE puntoAtencion (
    idPunto INT PRIMARY KEY,
    direccion VARCHAR(50),
    telefono INT,
    nombre VARCHAR(50)
);

CREATE TABLE ticket (
    idTicket INT PRIMARY KEY,
    idUsuario INT,
    numeroTicket VARCHAR(20),
    prioridad INT,
    fechaCreacion TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES persona(idUsuario)
);

CREATE TABLE gestion (
    idTicket INT,
    idPunto INT,
    PRIMARY KEY (idTicket, idPunto),
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY (idPunto) REFERENCES puntoAtencion(idPunto)
);
