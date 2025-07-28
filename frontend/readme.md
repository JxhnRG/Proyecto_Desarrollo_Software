# Flujo del Frontend - Gestión de Turnos

Este documento describe el flujo general de la interfaz de usuario del sistema de gestión de turnos, desarrollado con React y CoreUI.

## Estructura General

El sistema ofrece una página de acceso principal desde donde los usuarios pueden elegir si son **Trabajadores** o **Clientes**. A partir de ahí, se les redirige a diferentes vistas según su rol.

---

## Página Inicial

- **Ruta**: [`/seleccionacceso`](http://localhost:3000/seleccionacceso)
- Esta página es la entrada inicial donde los usuarios seleccionan su tipo de acceso:
  - **Trabajador** → Redirige a la página de login para trabajadores.
  - **Cliente** → Redirige a la página de login para clientes.

---

## 1. Flujo para Trabajadores

### Inicio de Sesión

- **Ruta**: [`/login`](http://localhost:3000/login)
- Autenticación mediante **usuario** y **contraseña**.
- Después de una autenticación exitosa:
  - Redirección a la página de gestión de turnos del trabajador: [`/gestionar-turnos`](http://localhost:3000/gestionar-turnos) (en desarrollo). (cabe aclarar que esto todavia no se implementa.)

### Registro de Trabajadores

- Solo accesible para usuarios con rol de **admin**.
- **Ruta**: [`/creartrabajador`](http://localhost:3000/creartrabajador)
- Campos del formulario:
  - Correo electrónico
  - Usuario
  - Nombre
  - Apellido
  - Contraseña
  - Rol (admin, trabajador, cliente)
- Se puede crear mas administradores desde este apartado. 
---

## 2. Flujo para Clientes

### Inicio de Sesión para Clientes

- **Ruta**: [`/accesocliente`](http://localhost:3000/accesocliente)
- Formulario con un único campo: **Cédula** (no requiere contraseña).
- Después de una autenticación exitosa:
  - **Ruta de Redirección**: Página de gestión de solicitudes de turnos para clientes (se **debe** completar).

### Registro de Clientes

- **Ruta**: [`/registroclientes`](http://localhost:3000/registroclientes)
- Disponible para clientes no registrados.
- Campos del formulario:
  - Nombre
  - Apellido
  - Cédula (username)
  - Correo electrónico
  - prioridad (booleano) (Si quieren pueden cambiar el label por "¿discapacidad?")

- Este registro utiliza una API pública sin requerir autenticación con token.

---

## Notas Técnicas

- todo esto fue usando la plantilla escogida por ustedes. Hago este Readme con el animo de ayudarlos a entender como pense mas o menos el proyecto, cualquier duda por whatsapp
la buena 👍

