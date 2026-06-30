// js/api.js - Manejo de todas las peticiones fetch al backend
const API_BASE = '/api';

export const api = {
    async getProductos() {
        const response = await fetch(`${API_BASE}/productos`);
        if (!response.ok) throw new Error('Error al obtener productos');
        return response.json();
    },

    async getOfertas() {
        const response = await fetch(`${API_BASE}/ofertas`);
        if (!response.ok) throw new Error('Error al obtener ofertas');
        return response.json();
    },

    async login(correo, contrasena) {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error en login');
        return data;
    },

    async register(nombre, correo, contrasena, telefono) {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, contrasena, telefono })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error en registro');
        return data;
    },
    
    async crearPedido(pedido) {
        const response = await fetch(`${API_BASE}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear pedido');
        return data;
    }
};
