// js/auth.js - Lógica de estado de sesión
export const auth = {
    getUser() {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    login(userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('authStateChanged'));
    },

    logout() {
        sessionStorage.removeItem('user');
        window.dispatchEvent(new Event('authStateChanged'));
    },

    isLoggedIn() {
        return this.getUser() !== null;
    }
};
