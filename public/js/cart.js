// js/cart.js - Lógica del carrito y localStorage
export const cart = {
    getItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    saveItems(items) {
        localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new Event('cartUpdated'));
    },

    addItem(producto, precioPropio = null) {
        const items = this.getItems();
        const precio = precioPropio !== null ? precioPropio : producto.precio;
        const existingItem = items.find(item => item.id === producto.id);
        
        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            items.push({ id: producto.id, nombre: producto.nombre, precio: precio, imagen_url: producto.imagen_url, cantidad: 1 });
        }
        
        this.saveItems(items);
    },

    removeItem(id) {
        let items = this.getItems();
        items = items.filter(item => item.id !== id);
        this.saveItems(items);
    },

    updateQuantity(id, cantidad) {
        let items = this.getItems();
        const item = items.find(item => item.id === id);
        if (item) {
            item.cantidad = parseInt(cantidad, 10);
            if (item.cantidad <= 0) {
                this.removeItem(id);
                return;
            }
            this.saveItems(items);
        }
    },

    clear() {
        this.saveItems([]);
    },

    getTotal() {
        return this.getItems().reduce((total, item) => total + (item.precio * item.cantidad), 0);
    },
    
    getCount() {
        return this.getItems().reduce((count, item) => count + item.cantidad, 0);
    }
};
