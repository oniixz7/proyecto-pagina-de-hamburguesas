# Arquitectura del Proyecto

Esta aplicación está diseñada bajo una arquitectura moderna de **Cliente-Servidor** separada por responsabilidades claras. El frontend es ligero (Vanilla JS) y se comunica mediante una API REST con el servidor backend en Node.js, el cual gestiona la persistencia de datos en PostgreSQL.

## 🧰 Tecnologías Utilizadas

- **Frontend:**
  - HTML5 Semántico
  - CSS3 (Variables nativas, Flexbox, Grid, Animaciones Keyframes)
  - Vanilla JavaScript (ES6 Modules, Fetch API, LocalStorage/SessionStorage)
- **Backend:**
  - Node.js
  - Express.js (Enrutamiento API y servidor de archivos estáticos)
  - `pg` (Cliente de PostgreSQL para Node)
- **Base de Datos:**
  - PostgreSQL Relacional

## 📂 Estructura de Directorios

La aplicación se divide lógicamente en los componentes que se sirven al usuario (`/public`) y la lógica pura del servidor.

```text
proyecto-pagina-de-hamburguesas/
├── .env                  # Variables de entorno (Credenciales de BD) No debe subirse a Git.
├── esquema.sql           # Script SQL con toda la estructura de la base de datos y data inicial.
├── package.json          # Lista de dependencias de Node.js (express, pg, cors, dotenv).
├── server.js             # Punto de entrada del backend. Define las rutas API (login, pedidos, productos).
├── db.js                 # Archivo de configuración que conecta Node.js con PostgreSQL usando pg.Pool.
└── public/               # Carpeta FRONTEND (Se envía al navegador)
    ├── index.html        # Landing page (Hero animado, Banners).
    ├── menu.html         # Catálogo completo de hamburguesas leídas de la BD.
    ├── ofertas.html      # Catálogo filtrado por productos con "es_oferta = true".
    ├── carrito.html      # Interfaz y formulario dinámico para enviar un pedido.
    ├── login.html        # Manejo de Tabs (Iniciar Sesión / Registrarse).
    ├── css/              # Sistema de Diseño modular
    │   ├── variables.css # Definición de la paleta (Amarillos, Rojos), tipografía y espacios.
    │   ├── base.css      # Reseteo del navegador y estilos genéricos de fuentes.
    │   ├── layout.css    # Estilos estructurales (Header, Navegación responsiva).
    │   └── components.css# Estilos de botones, inputs, animaciones y product-cards.
    └── js/               # Arquitectura Modular del Frontend
        ├── app.js        # "Router" o controlador principal. Dispara eventos al cambiar de HTML.
        ├── api.js        # Capa de abstracción. Solo este archivo usa Fetch() para comunicarse con server.js.
        ├── auth.js       # Manejo de estado de la sesión (guarda el usuario en sessionStorage).
        ├── cart.js       # Manejo de lógica del carrito (guarda items temporalmente en localStorage).
        └── ui.js         # Único archivo encargado de inyectar HTML dinámico y manipular el DOM (DOM manipulation).
```

## 🔄 Flujo de Datos Típico (Ejemplo: Pedir una hamburguesa)

1. **El Usuario** hace clic en el botón "Agregar" en la pantalla de `menu.html`.
2. `ui.js` detecta el click y llama a `cart.js` para añadir el producto a `localStorage`.
3. El usuario va a `carrito.html`, ingresa su dirección en el formulario y hace clic en "Pagar".
4. `app.js` captura el evento, lee los datos del formulario, recupera los ítems de `cart.js` y el ID del usuario de `auth.js`.
5. `app.js` envía un objeto con estos datos a `api.js`.
6. `api.js` transforma este objeto a formato JSON y hace una petición `POST` a `http://localhost:3000/api/pedidos`.
7. `server.js` recibe la petición, inicia una Transacción SQL con PostgreSQL a través de `db.js`. Guarda el Pedido padre, y hace un loop insertando cada Detalle de Pedido.
8. `server.js` responde al cliente con éxito, y la interfaz limpia el carrito mostrando un mensaje verde animado.
