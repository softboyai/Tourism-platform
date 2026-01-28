// Contact Page Script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            messageDiv.innerHTML = '<p class="error-message">Please fill in all fields.</p>';
            return;
        }

        try {
            messageDiv.innerHTML = '<p class="loading">Sending message...</p>';

            const response = await api.createInquiry({ name, email, message });

            messageDiv.innerHTML = '<p class="success-message">Message sent successfully! We will get back to you soon.</p>';
            form.reset();
        } catch (error) {
            console.error('Error sending message:', error);
            messageDiv.innerHTML = '<p class="error-message">Failed to send message. Please try again later.</p>';
        }
    });
});

