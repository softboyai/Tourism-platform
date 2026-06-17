// Login Page Script
document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, go to bookings
    if (isUserLoggedIn()) {
        window.location.href = 'my-bookings.html';
        return;
    }

    const form = document.getElementById('login-form');
    const msg = document.getElementById('login-message');

    // Pre-fill email if redirected with ?email=...
    const params = new URLSearchParams(window.location.search);
    if (params.get('email')) {
        document.getElementById('email').value = params.get('email');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            msg.innerHTML = '<p class="error-message">Please fill in all fields.</p>';
            return;
        }

        try {
            msg.innerHTML = '<p class="loading">Logging in...</p>';
            const response = await api.userLogin(email, password);

            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));

            msg.innerHTML = '<p class="success-message">Login successful! Redirecting...</p>';

            // Redirect to intended page if set
            const redirect = params.get('redirect') || 'my-bookings.html';
            setTimeout(() => { window.location.href = redirect; }, 800);
        } catch (error) {
            msg.innerHTML = `<p class="error-message">${error.message || 'Login failed. Please check your credentials.'}</p>`;
        }
    });
});
