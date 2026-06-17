// Events Page Script
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await api.getEvents();
        const events = response.data || [];
        const container = document.getElementById('events-container');

        if (events.length === 0) {
            container.innerHTML = '<p class="empty-state">No upcoming events available yet.</p>';
            return;
        }

        container.innerHTML = events.map(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return `
                <div class="card">
                    ${event.posterImage 
                        ? `<img src="http://localhost:5000${event.posterImage}" alt="${event.title}" class="card-image">`
                        : `<div class="card-image" style="background-color: #ddd;"></div>`
                    }
                    <div class="card-content">
                        <h3 class="card-title">${event.title}</h3>
                        <p class="card-description">${event.description}</p>
                        <div class="card-meta" style="flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                            <div>📅 ${formattedDate}</div>
                            <div>📍 ${event.venue}</div>
                            <div>🏙️ ${event.city}</div>
                            ${event.organizerName ? `<div>🏢 ${event.organizerName}</div>` : ''}
                            ${event.phone ? `<div>📞 <a href="tel:${event.phone}">${event.phone}</a></div>` : ''}
                            ${event.email ? `<div>📧 <a href="mailto:${event.email}">${event.email}</a></div>` : ''}
                        </div>
                        <div style="margin-top: 0.75rem;">
                            <button onclick="showBookingForm('event', '${event._id}', '${event.title.replace(/'/g, "\\'")}')"
                                    class="btn btn-book btn-sm">
                                📅 Register / Book
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-container').innerHTML = 
            '<p class="error-message">Failed to load events. Please try again later.</p>';
    }
});


// ===== BOOKING MODAL =====
function showBookingForm(type, itemId, itemName) {
    if (!isUserLoggedIn()) {
        window.location.href = `login.html?redirect=events.html`;
        return;
    }
    const modal = document.getElementById('booking-modal');
    const body = document.getElementById('booking-modal-body');
    body.innerHTML = `
        <h2>📅 Register for: ${itemName}</h2>
        <form id="booking-form" onsubmit="submitBooking(event, '${type}', '${itemId}', '${itemName.replace(/'/g, "\\'")}')">
            <div class="form-group">
                <label>Attendance Date *</label>
                <input type="date" id="book-checkin" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Number of Guests</label>
                <input type="number" id="book-guests" value="1" min="1" max="50">
            </div>
            <div class="form-group">
                <label>Special Requests / Notes</label>
                <textarea id="book-notes" placeholder="Any special requests..." rows="3"></textarea>
            </div>
            <div id="book-message"></div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Submit Registration</button>
        </form>`;
    modal.style.display = 'flex';
}

async function submitBooking(e, type, itemId, itemName) {
    e.preventDefault();
    const msg = document.getElementById('book-message');
    const checkInDate = document.getElementById('book-checkin').value;
    const numberOfGuests = parseInt(document.getElementById('book-guests').value) || 1;
    const specialRequests = document.getElementById('book-notes').value.trim();

    if (!checkInDate) { msg.innerHTML = '<p class="error-message">Please select a date.</p>'; return; }

    try {
        msg.innerHTML = '<p class="loading">Submitting...</p>';
        await api.createBooking({ type, itemId, checkInDate, numberOfGuests, specialRequests });
        document.getElementById('booking-modal-body').innerHTML = `
            <div style="text-align:center; padding:1.5rem;">
                <p style="font-size:3rem;">✅</p>
                <h3 style="color:#27ae60;">Registration Submitted!</h3>
                <p style="color:#666; margin-top:0.5rem;">Your registration for <strong>${itemName}</strong> has been received.</p>
                <div style="background:#f8f9fa; padding:1rem; border-radius:8px; margin:1rem 0; text-align:left; font-size:0.88rem; color:#555;">
                    <strong>What happens next?</strong><br>
                    • Our team will verify availability with the event organizer<br>
                    • You will receive a confirmation once your spot is secured<br>
                    • Check status in <a href="my-bookings.html" style="color:var(--primary-color);">My Bookings</a>
                </div>
                <button onclick="closeBookingModal()" class="btn btn-primary" style="margin-top:0.5rem;">Close</button>
            </div>`;
    } catch (error) {
        msg.innerHTML = `<p class="error-message">${error.message || 'Failed to submit.'}</p>`;
    }
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('booking-modal');
    if (e.target === modal) closeBookingModal();
});
