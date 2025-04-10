CREATE TABLE rol (
    idRol INT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE persona (
    idUsuario INT,
    idRol INT,
    nombre VARCHAR(50),
    email VARCHAR(50),
    contraseña VARCHAR(50),
    usuario VARCHAR(50),
    PRIMARY KEY (idUsuario, idRol),
    FOREIGN KEY (idRol) REFERENCES rol(idRol)
);

CREATE TABLE puntoAtencion (
    idPunto INT PRIMARY KEY,
    direccion VARCHAR(50),
    telefono INT,
    nombre VARCHAR(50)
);

CREATE TABLE ticket (
    idTicket INT,
    id_Usuario INT,
    numeroTicket VARCHAR(20),
    prioridad INT,
    fechaCreacion TIMESTAMP,
    PRIMARY KEY (idTicket, id_Usuario),
    FOREIGN KEY (id_Usuario) REFERENCES persona(idUsuario)
);

CREATE TABLE gestion (
    idTicket INT,
    idPunto INT,
    PRIMARY KEY (idTicket, idPunto),
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY (idPunto) REFERENCES puntoAtencion(idPunto)
);
