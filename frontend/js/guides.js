// Guides Page Script
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await api.getGuides();
        const guides = response.data || [];
        const container = document.getElementById('guides-container');

        if (guides.length === 0) {
            container.innerHTML = '<p class="empty-state">No tour guides available yet.</p>';
            return;
        }

        container.innerHTML = guides.map(guide => `
            <div class="card">
                <div class="card-content">
                    <h3 class="card-title">${guide.fullName}</h3>
                    <div style="margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--text-light); line-height: 1.6;">
                        <strong>Languages:</strong> ${guide.languages.join(', ')}<br>
                        <strong>Fees:</strong> ${guide.fees}<br>
                        <strong>Areas Covered:</strong> ${guide.areasCovered.join(', ')}
                    </div>
                    <div class="card-meta" style="flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <div>📍 ${guide.city}</div>
                        ${guide.phone ? `<div>📞 ${guide.phone}</div>` : ''}
                        ${guide.whatsapp ? `<div>💬 WhatsApp: ${guide.whatsapp}</div>` : ''}
                    </div>
                    <div style="margin-top: 0.75rem;">
                        <button onclick="showBookingForm('guide', '${guide._id}', '${guide.fullName.replace(/'/g, "\\'")}')"
                                class="btn btn-book btn-sm">
                            📅 Book This Guide
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading guides:', error);
        document.getElementById('guides-container').innerHTML = 
            '<p class="error-message">Failed to load guides. Please try again later.</p>';
    }
});


// ===== BOOKING MODAL =====
function showBookingForm(type, itemId, itemName) {
    if (!isUserLoggedIn()) {
        window.location.href = `login.html?redirect=guides.html`;
        return;
    }
    const modal = document.getElementById('booking-modal');
    const body = document.getElementById('booking-modal-body');
    body.innerHTML = `
        <h2>📅 Book Guide: ${itemName}</h2>
        <form id="booking-form" onsubmit="submitBooking(event, '${type}', '${itemId}', '${itemName.replace(/'/g, "\\'")}')">
            <div class="form-group">
                <label>Start Date *</label>
                <input type="date" id="book-checkin" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>Number of Guests</label>
                <input type="number" id="book-guests" value="1" min="1" max="20">
            </div>
            <div class="form-group">
                <label>Special Requests / Tour Details</label>
                <textarea id="book-notes" placeholder="Describe what you'd like to visit, duration, etc." rows="3"></textarea>
            </div>
            <div id="book-message"></div>
            <button type="submit" class="btn btn-primary" style="width:100%;">Submit Booking Request</button>
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
                <h3 style="color:#27ae60;">Booking Submitted!</h3>
                <p style="color:#666; margin-top:0.5rem;">Your booking for <strong>${itemName}</strong> has been received.</p>
                <div style="background:#f8f9fa; padding:1rem; border-radius:8px; margin:1rem 0; text-align:left; font-size:0.88rem; color:#555;">
                    <strong>What happens next?</strong><br>
                    • Our team will contact the guide to confirm your schedule<br>
                    • You will receive a confirmation once the guide accepts<br>
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
