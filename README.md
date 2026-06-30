# Burger House 🍔

Una moderna aplicación web de comida rápida con un backend en Node.js (Express) y una base de datos en PostgreSQL. La interfaz de usuario está construida utilizando Vanilla JS, CSS puro y HTML semántico para garantizar un rendimiento óptimo y una experiencia de usuario de primera.

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar:
- [Node.js](https://nodejs.org/es/) (Versión 14 o superior)
- [PostgreSQL](https://www.postgresql.org/) y pgAdmin (para la base de datos)

## 🛠️ Pasos para levantar la App localmente

### 1. Preparar la Base de Datos
1. Abre **pgAdmin** o la consola de PostgreSQL.
2. Crea una nueva base de datos llamada `hamburguesas-bd`.
3. Abre el archivo de consultas Query Tool (`herramienta de consultas`) en esa base de datos.
4. Copia todo el contenido del archivo `esquema.sql` (ubicado en la raíz de este proyecto) y ejecútalo. Esto creará las tablas, roles, y llenará la base de datos con las hamburguesas y usuarios iniciales.

### 2. Configurar el Entorno
1. Clona o descarga este repositorio.
2. En la carpeta raíz del proyecto, asegúrate de tener un archivo `.env` configurado. Si no existe, crea uno con las siguientes credenciales (ajusta el usuario, password y puerto a los de tu instalación local de PostgreSQL):

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=hamburguesas-bd
DB_PASSWORD=tu_contraseña_aqui
DB_PORT=5432
```

### 3. Instalar Dependencias
Abre una terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```
Esto descargará las librerías necesarias como `express`, `pg` (PostgreSQL client), `cors` y `dotenv`.

### 4. Iniciar el Servidor
En la misma terminal, arranca el servidor Node.js:
```bash
node server.js
```
Verás un mensaje indicando que el servidor está corriendo.

### 5. ¡Abre la App!
Abre tu navegador web favorito y visita:
`http://localhost:3000`

¡Listo! Ya puedes navegar por el menú, agregar hamburguesas al carrito, simular el proceso de pago y registrarte usando tu app local.

## 📁 Documentación Técnica
Para aprender más sobre cómo está construido el código, lee el archivo [ARQUITECTURA.md](ARQUITECTURA.md).