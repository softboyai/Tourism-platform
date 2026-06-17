// Register Page Script
document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, go to bookings
    if (isUserLoggedIn()) {
        window.location.href = 'my-bookings.html';
        return;
    }

    const form = document.getElementById('register-form');
    const msg = document.getElementById('register-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!fullName || !email || !password) {
            msg.innerHTML = '<p class="error-message">Please fill in all required fields.</p>';
            return;
        }

        if (password.length < 6) {
            msg.innerHTML = '<p class="error-message">Password must be at least 6 characters.</p>';
            return;
        }

        if (password !== confirmPassword) {
            msg.innerHTML = '<p class="error-message">Passwords do not match.</p>';
            return;
        }

        try {
            msg.innerHTML = '<p class="loading">Creating account...</p>';
            const response = await api.register({ fullName, email, password, phone });

            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));

            msg.innerHTML = '<p class="success-message">Account created! Redirecting...</p>';
            setTimeout(() => { window.location.href = 'my-bookings.html'; }, 1000);
        } catch (error) {
            msg.innerHTML = `<p class="error-message">${error.message || 'Registration failed. Please try again.'}</p>`;
        }
    });
});
