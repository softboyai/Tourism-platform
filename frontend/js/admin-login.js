// Admin Login Script
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('login-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            messageDiv.innerHTML = '<p class="error-message">Please fill in all fields.</p>';
            return;
        }

        try {
            messageDiv.innerHTML = '<p class="loading">Logging in...</p>';

            const response = await api.adminLogin(email, password);

            if (response.status === 'success' && response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                messageDiv.innerHTML = '<p class="success-message">Login successful! Redirecting...</p>';
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = error.message || 'Login failed. Please check your credentials.';
            
            // Better error messages for common issues
            if (error.message && error.message.includes('fetch')) {
                errorMessage = 'Cannot connect to server. Make sure:<br>1. Backend server is running (npm run dev)<br>2. You\'re using a web server (not file://)<br>3. Check browser console (F12) for details';
            }
            
            messageDiv.innerHTML = '<p class="error-message">' + errorMessage + '</p>';
        }
    });
});

