# GraFiles
## Segundo proyecto del curso Manejo e Implementación de Archivos - Segundo Semestre 2024 | USAC - CUNOC

Este repositorio contiene todo el código fuente del proyecto GraFiles, el cual es un sistema de archivos que simula el funcionamiento de un sistema de archivos en la nube, con roles de usuario, permisos, y almacenamiento de archivos.

### Tecnologías utilizadas
- MongoDB
- Docker (Docker Compose)
- Node.js
- Nest.js
- Vue/Nuxt 3

## Instrucciones de uso

### Requisitos

Instalar las siguientes herramientas:
- Docker
- Docker Compose

### Instrucciones

1. Clonar el repositorio
2. Ejecutar el comando `docker compose up` en una terminal en la raíz del proyecto
3. Acceder a `http://localhost:3000` en un navegador para acceder a la aplicación web

### Notas

La base de datos está pre-cargada con 3 usuarios por defecto:

**2** usuarios tipo *empleado* -
**1** usuario tipo *administrador*

1. usuario: `empleado1` / contraseña: `empleado1password`
2. usuario: `empleado2` / contraseña: `empleado2password`
3. usuario: `admin` / contraseña: `adminpassword`