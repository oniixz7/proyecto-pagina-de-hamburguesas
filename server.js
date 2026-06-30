const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba para verificar conexión a BD
app.get('/api/test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error('Error conectando a BD:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Obtener todos los productos (para menu.html)
app.get('/api/productos', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM productos WHERE activo = TRUE');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener ofertas (para ofertas.html)
app.get('/api/ofertas', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM productos WHERE es_oferta = TRUE AND activo = TRUE');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener ofertas:', err);
        res.status(500).json({ error: 'Error al obtener ofertas' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const result = await db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE correo = $1 AND contrasena = $2', [correo, contrasena]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Error login:', err);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// Registro
app.post('/api/register', async (req, res) => {
    const { nombre, correo, contrasena, telefono } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, telefono, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, correo, rol',
            [nombre, correo, contrasena, telefono || '', 'cliente']
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Error registro:', err);
        if (err.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
});

// Guardar un pedido
app.post('/api/pedidos', async (req, res) => {
    const { usuario_id, direccion_entrega, metodo_pago, total, detalles } = req.body;
    
    try {
        // Iniciar transacción
        await db.query('BEGIN');
        
        // 1. Insertar en pedidos
        const insertPedidoQuery = `
            INSERT INTO pedidos (usuario_id, direccion_entrega, metodo_pago, total) 
            VALUES ($1, $2, $3, $4) RETURNING id
        `;
        // Si el usuario no está logueado, podemos usar un ID genérico o null si la BD lo permite, 
        // pero por ahora pasamos el que venga (usuario_id).
        const pedidoResult = await db.query(insertPedidoQuery, [usuario_id || null, direccion_entrega, metodo_pago, total]);
        const pedidoId = pedidoResult.rows[0].id;

        // 2. Insertar detalles del pedido
        const insertDetalleQuery = `
            INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) 
            VALUES ($1, $2, $3, $4)
        `;
        
        for (let item of detalles) {
            await db.query(insertDetalleQuery, [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]);
        }

        // Confirmar transacción
        await db.query('COMMIT');

        res.json({ success: true, message: 'Pedido registrado con éxito', pedido_id: pedidoId });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Error al registrar pedido:', err);
        res.status(500).json({ error: 'Error al registrar el pedido' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
