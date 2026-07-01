import { cart } from './cart.js';
import { auth } from './auth.js';

// js/ui.js - Responsable de toda manipulación del DOM
export const ui = {
    renderProducts(productos, containerId, isOferta = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        if (productos.length === 0) {
            container.innerHTML = '<p class="empty-msg">No hay productos disponibles por el momento.</p>';
            return;
        }

        productos.forEach((producto, index) => {
            const article = document.createElement('article');
            article.className = 'product-card animate-pop';
            article.style.animationDelay = `${index * 0.1}s`;
            
            const precioNormal = Number(producto.precio).toFixed(2);
            let priceHTML = `<p class="product-price">S/ ${precioNormal}</p>`;
            let precioFinal = producto.precio;

            if (isOferta && producto.precio_oferta) {
                const precioPromo = Number(producto.precio_oferta).toFixed(2);
                priceHTML = `
                    <p class="product-price" style="text-decoration: line-through; color: #999; font-size: 1rem; margin-bottom: 0;">S/ ${precioNormal}</p>
                    <p class="product-price" style="color: var(--primary);">S/ ${precioPromo}</p>
                `;
                precioFinal = producto.precio_oferta;
            }

            article.innerHTML = `
                <img class="product-img" src="${producto.imagen_url}" alt="${producto.nombre}">
                <div class="product-info">
                    <h3>${producto.nombre}</h3>
                    <p class="product-desc">${producto.descripcion || 'Deliciosa hamburguesa preparada al momento con los mejores ingredientes.'}</p>
                    ${priceHTML}
                    <button class="btn btn-primary btn-add" style="width: 100%;" data-id="${producto.id}" data-name="${producto.nombre}" data-price="${precioFinal}" data-img="${producto.imagen_url}">ORDENAR !</button>
                </div>
            `;
            container.appendChild(article);
        });

        // Add event listeners to buttons
        const addButtons = container.querySelectorAll('.btn-add');
        addButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const data = e.target.dataset;
                cart.addItem({
                    id: parseInt(data.id),
                    nombre: data.name,
                    precio: parseFloat(data.price),
                    imagen_url: data.img
                });
                this.showAlert(`${data.name} agregado al carrito!`, 'success');
            });
        });
    },

    updateNav() {
        const badge = document.querySelector('.nav-badge');
        if (badge) {
            badge.textContent = cart.getCount();
        }

        const user = auth.getUser();
        const profileLink = document.getElementById('nav-profile');

        if (user) {
            if (profileLink) {
                profileLink.textContent = `Hola, ${user.nombre.split(' ')[0]}`;
                profileLink.href = "javascript:void(0)";
                profileLink.style.pointerEvents = "none";
                
                if (!document.getElementById('btn-logout')) {
                    const logoutLink = document.createElement('a');
                    logoutLink.id = 'btn-logout';
                    logoutLink.href = '#';
                    logoutLink.textContent = '(Cerrar Sesión)';
                    logoutLink.style.marginLeft = '0.5rem';
                    logoutLink.style.color = 'var(--primary)';
                    logoutLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        auth.logout();
                        window.location.href = 'index.html'; // Redirect to home on logout
                    });
                    profileLink.parentNode.appendChild(logoutLink);
                }
            }
        } else {
            if (profileLink) {
                profileLink.textContent = 'Iniciar Sesión';
                profileLink.href = "login.html";
                profileLink.style.pointerEvents = "auto";
                const logoutLink = document.getElementById('btn-logout');
                if (logoutLink) logoutLink.remove();
            }
        }
    },

    showAlert(message, type = 'info') {
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        
        document.body.appendChild(alertBox);
        
        // Animación de entrada
        setTimeout(() => alertBox.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            alertBox.classList.remove('show');
            setTimeout(() => alertBox.remove(), 300);
        }, 3000);
    }
};
