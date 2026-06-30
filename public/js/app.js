import { api } from './api.js';
import { auth } from './auth.js';
import { cart } from './cart.js';
import { ui } from './ui.js';

// js/app.js - Orquestador principal
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar UI (nav, badge, auth state)
    ui.updateNav();

    // Escuchar cambios en el carrito y auth
    window.addEventListener('cartUpdated', () => ui.updateNav());
    window.addEventListener('authStateChanged', () => {
        ui.updateNav();
        // Si estamos en login y nos logueamos exitosamente, redirigir
        if (window.location.pathname.includes('login.html') && auth.isLoggedIn()) {
            window.location.href = 'index.html';
        }
    });

    // Enrutador simple basado en la página actual
    const path = window.location.pathname;

    if (path.includes('menu.html')) {
        loadMenu();
    } else if (path.includes('ofertas.html')) {
        loadOfertas();
    } else if (path.includes('login.html')) {
        setupTabs();
        setupLogin();
        setupRegistro();
    } else if (path.includes('carrito.html')) {
        setupCarrito();
    }
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

async function loadMenu() {
    try {
        const productos = await api.getProductos();
        ui.renderProducts(productos, 'menu-grid', false);
    } catch (error) {
        ui.showAlert('Error cargando el menú', 'error');
    }
}

async function loadOfertas() {
    try {
        const ofertas = await api.getOfertas();
        ui.renderProducts(ofertas, 'ofertas-grid', true);
    } catch (error) {
        ui.showAlert('Error cargando las promociones', 'error');
    }
}

function setupLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const correo = document.getElementById('login-correo').value;
        const contrasena = document.getElementById('login-contrasena').value;
        const btnSubmit = form.querySelector('button[type="submit"]');
        
        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Iniciando...';
            const data = await api.login(correo, contrasena);
            auth.login(data.user);
            ui.showAlert('¡Bienvenido de vuelta!', 'success');
        } catch (error) {
            ui.showAlert(error.message, 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Entrar a mi cuenta';
        }
    });
}

function setupRegistro() {
    const form = document.getElementById('registro-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('reg-nombre').value;
        const correo = document.getElementById('reg-correo').value;
        const contrasena = document.getElementById('reg-contrasena').value;
        const telefono = document.getElementById('reg-telefono').value;
        const btnSubmit = form.querySelector('button[type="submit"]');

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Registrando...';
            const data = await api.register(nombre, correo, contrasena, telefono);
            auth.login(data.user);
            ui.showAlert('¡Registro exitoso!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
        } catch (error) {
            ui.showAlert(error.message, 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Crear Cuenta';
        }
    });
}

function setupCarrito() {
    const container = document.getElementById('cart-container');
    const totalEl = document.getElementById('cart-total');
    const btnCheckout = document.getElementById('btn-checkout');

    function renderCart() {
        const items = cart.getItems();
        container.innerHTML = '';
        const formContainer = document.getElementById('checkout-form-container');

        if (items.length === 0) {
            container.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
            totalEl.textContent = 'S/ 0.00';
            btnCheckout.disabled = true;
            if (formContainer) formContainer.style.display = 'none';
            return;
        }

        btnCheckout.disabled = false;
        if (formContainer) formContainer.style.display = 'block';

        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.imagen_url}" alt="${item.nombre}" class="cart-img">
                <div class="cart-details">
                    <h4>${item.nombre}</h4>
                    <p class="price">S/ ${Number(item.precio).toFixed(2)}</p>
                </div>
                <div class="cart-actions">
                    <input type="number" class="qty-input" value="${item.cantidad}" min="1" data-id="${item.id}">
                    <button class="btn-remove" data-id="${item.id}">🗑️</button>
                </div>
            `;
            container.appendChild(row);
        });

        totalEl.textContent = `S/ ${cart.getTotal().toFixed(2)}`;

        // Attach events
        container.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                cart.updateQuantity(parseInt(e.target.dataset.id), e.target.value);
                renderCart(); // Re-render
            });
        });

        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.removeItem(parseInt(e.target.dataset.id));
                renderCart();
            });
        });
    }

    renderCart();

    btnCheckout.addEventListener('click', async () => {
        if (!auth.isLoggedIn()) {
            ui.showAlert('Debes iniciar sesión para realizar tu pedido', 'error');
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
        }

        const direccion = document.getElementById('checkout-direccion').value;
        const pago = document.getElementById('checkout-pago').value;

        if (!direccion || !direccion.trim()) {
            ui.showAlert('Por favor, ingresa una dirección de entrega', 'error');
            return;
        }

        const user = auth.getUser();
        const items = cart.getItems();
        const payload = {
            usuario_id: user.id,
            direccion_entrega: direccion.trim(),
            metodo_pago: pago,
            total: cart.getTotal(),
            detalles: items.map(i => ({
                producto_id: i.id,
                cantidad: i.cantidad,
                precio_unitario: i.precio
            }))
        };

        try {
            btnCheckout.disabled = true;
            btnCheckout.textContent = 'Procesando...';
            await api.crearPedido(payload);
            cart.clear();
            ui.showAlert('¡Pedido realizado con éxito!', 'success');
            renderCart();
            document.getElementById('checkout-direccion').value = '';
            btnCheckout.textContent = 'Pagar Pedido';
        } catch (error) {
            ui.showAlert('Error al procesar el pedido', 'error');
            btnCheckout.disabled = false;
            btnCheckout.textContent = 'Pagar Pedido';
        }
    });
}
