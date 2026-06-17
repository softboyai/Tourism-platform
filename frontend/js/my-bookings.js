// My Bookings Page Script
document.addEventListener('DOMContentLoaded', async () => {
    // Must be logged in
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html?redirect=my-bookings.html';
        return;
    }

    const user = getUserInfo();
    if (user) {
        document.getElementById('user-greeting').textContent =
            `Welcome back, ${user.fullName}! Here are your booking requests and their current status.`;
    }

    await loadMyBookings();
});

async function loadMyBookings() {
    const container = document.getElementById('bookings-container');
    try {
        const response = await api.getMyBookings();
        const bookings = response.data || [];

        if (bookings.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <p style="font-size: 3rem;">📋</p>
                    <h3>No bookings yet</h3>
                    <p>Browse hotels, events, or tour guides and make your first booking!</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
                        <a href="hotels.html" class="btn btn-primary">🏨 Hotels</a>
                        <a href="events.html" class="btn btn-secondary">🎉 Events</a>
                        <a href="guides.html" class="btn btn-secondary">🧑‍🏫 Tour Guides</a>
                    </div>
                </div>`;
            return;
        }

        container.innerHTML = bookings.map(b => {
            const statusColor = { pending: '#e67e22', confirmed: '#27ae60', cancelled: '#e74c3c' };
            const statusIcon = { pending: '⏳', confirmed: '✅', cancelled: '❌' };
            const typeIcon = { hotel: '🏨', event: '🎉', guide: '🧑‍🏫' };
            const date = new Date(b.checkInDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const createdDate = new Date(b.createdAt).toLocaleDateString();

            return `
                <div style="background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${statusColor[b.status]};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h3 style="margin: 0 0 0.25rem;">${typeIcon[b.type] || '📌'} ${b.itemName}</h3>
                            <p style="margin: 0; color: var(--text-light); font-size: 0.9rem; text-transform: capitalize;">${b.type} booking · Submitted on ${createdDate}</p>
                        </div>
                        <span style="background: ${statusColor[b.status]}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; white-space: nowrap;">
                            ${statusIcon[b.status]} ${b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                    </div>

                    <div style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
                        <div><strong>📅 Date:</strong> ${date}</div>
                        ${b.checkOutDate ? `<div><strong>📅 Check-out:</strong> ${new Date(b.checkOutDate).toLocaleDateString()}</div>` : ''}
                        <div><strong>👥 Guests:</strong> ${b.numberOfGuests}</div>
                    </div>

                    ${b.specialRequests ? `
                        <div style="margin-top: 0.75rem; background: #f8f9fa; padding: 0.75rem; border-radius: 6px; font-size: 0.9rem;">
                            <strong>Your notes:</strong> ${b.specialRequests}
                        </div>` : ''}

                    ${b.adminNote ? `
                        <div style="margin-top: 0.75rem; background: #e8f5e9; padding: 0.75rem; border-radius: 6px; font-size: 0.9rem; border-left: 3px solid #27ae60;">
                            <strong>💬 Response from the team:</strong> ${b.adminNote}
                        </div>` : ''}

                    ${b.status === 'pending' ? `
                        <div style="margin-top: 1rem;">
                            <button onclick="cancelBooking('${b._id}')" class="btn btn-secondary" style="font-size: 0.85rem; background: #e74c3c; color: white; border: none;">
                                Cancel Booking
                            </button>
                        </div>` : ''}
                </div>`;
        }).join('');
    } catch (error) {
        if (error.message && error.message.toLowerCase().includes('token')) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            window.location.href = 'login.html';
            return;
        }
        container.innerHTML = '<p class="error-message">Failed to load bookings. Please try again.</p>';
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        await api.cancelBooking(bookingId);
        await loadMyBookings();
    } catch (error) {
        alert('Failed to cancel booking: ' + (error.message || 'Unknown error'));
    }
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}
