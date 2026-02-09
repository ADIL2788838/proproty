/**
 * SF Real Estate - Auth System
 * Handles Login, Register, Logout and Session Check
 */

const SESSION_KEY = 'sf_user_session';

const auth = {
    // Check if user is logged in
    getUser: () => {
        const userStr = localStorage.getItem(SESSION_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Login function
    login: (email, password) => {
        const user = db.findUser(email, password);
        if (user) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            return user;
        }
        return null;
    },

    // Register function
    register: (name, email, password, role) => {
        const newUser = { name, email, password, role };
        return db.addUser(newUser);
    },

    // Logout
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    },

    // Redirect if not logged in
    requireAuth: () => {
        if (!auth.getUser()) {
            window.location.href = 'auth.html';
        }
    }
};

// --- DOM Event Listeners for auth.html ---

document.addEventListener('DOMContentLoaded', () => {

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const user = auth.login(email, password);
            if (user) {
                // Redirect based on role
                window.location.href = 'dashboard.html';
            } else {
                const error = document.getElementById('loginError');
                error.style.display = 'block';
            }
        });
    }

    // Register Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;

            const user = auth.register(name, email, password, role);
            if (user) {
                alert('Registration Successful! Please Login.');
                switchTab('login');
            }
        });
    }
});
