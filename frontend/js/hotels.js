// Hotels Page Script

function getFavorites() {
    const favs = localStorage.getItem('tourismFavorites');
    return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favs) {
    localStorage.setItem('tourismFavorites', JSON.stringify(favs));
}

function isFavorite(id) {
    return getFavorites().some(f => f._id === id);
}

let allHotels = [];

function toggleHotelFavorite(hotelId) {
    const hotel = allHotels.find(h => h._id === hotelId);
    if (!hotel) return;

    let favs = getFavorites();
    const exists = favs.find(f => f._id === hotel._id);

    if (exists) {
        favs = favs.filter(f => f._id !== hotel._id);
    } else {
        favs.push({
            _id: hotel._id,
            name: hotel.name,
            type: 'hotel',
            category: hotel.priceRange || '',
            city: hotel.city || '',
            description: hotel.address || '',
            image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : '',
            addedAt: new Date().toISOString()
        });
    }

    saveFavorites(favs);
    renderHotels();
}

function renderHotels() {
    const container = document.getElementById('hotels-container');

    if (allHotels.length === 0) {
        container.innerHTML = '<p class="empty-state">No hotels available yet.</p>';
        return;
    }

    container.innerHTML = allHotels.map(hotel => {
        const priceLabel = {
            'budget': '💰 Budget',
            'mid-range': '💵 Mid-Range',
            'luxury': '💎 Luxury'
        };
        const fav = isFavorite(hotel._id);

        return `
            <div class="card">
                ${hotel.images && hotel.images.length > 0 
                    ? `<img src="http://localhost:5000${hotel.images[0]}" alt="${hotel.name}" class="card-image">`
                    : `<div class="card-image" style="background-color: #ddd;"></div>`
                }
                <div class="card-content">
                    <span class="card-category">${priceLabel[hotel.priceRange] || hotel.priceRange}</span>
                    <h3 class="card-title">${hotel.name}</h3>
                    <p class="card-description">${hotel.address}</p>
                    <div class="card-meta" style="flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <div>📍 ${hotel.city}</div>
                        ${hotel.phone ? `<div>📞 <a href="tel:${hotel.phone}">${hotel.phone}</a></div>` : ''}
                        ${hotel.whatsapp ? `<div>💬 <a href="https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}" target="_blank">WhatsApp: ${hotel.whatsapp}</a></div>` : ''}
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
                        <button onclick="toggleHotelFavorite('${hotel._id}')" 
                                style="border: none; background: ${fav ? '#e74c3c' : '#f0f0f0'}; color: ${fav ? 'white' : '#333'}; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                            ${fav ? '❤️ Saved' : '🤍 Favorite'}
                        </button>
                        ${hotel.phone ? `<a href="tel:${hotel.phone}" style="background: #2c7a4b; color: white; padding: 0.4rem 0.8rem; border-radius: 4px; text-decoration: none; font-size: 0.85rem;">📞 Call</a>` : ''}
                        <button onclick="showBookingForm('hotel', '${hotel._id}', '${hotel.name.replace(/'/g, "\\'")}')" 
                                class="btn btn-book btn-sm">
                            📅 Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await api.getHotels();
        allHotels = response.data || [];
        renderHotels();
    } catch (error) {
        console.error('Error loading hotels:', error);
        document.getElementById('hotels-container').innerHTML = 
            '<p class="error-message">Failed to load hotels. Please try again later.</p>';
    }
});


// ===== BOOKING MODAL =====
function showBookingForm(type, itemId, itemName) {
    if (!isUserLoggedIn()) {
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname.split('/').pop())}`;
        return;
    }

    let checkoutField = '';
    if (type === 'hotel') {
        checkoutField = `
            <div class="form-group">
                <label>Check-out Date</label>
                <input type="date" id="book-checkout">
            </div>`;
    }

    const modal = document.getElementById('booking-modal');
    const body = document.getElementById('booking-modal-body');
    body.innerHTML = `
        <h2>📅 Book: ${itemName}</h2>
        <form id="booking-form" onsubmit="submitBooking(event, '${type}', '${itemId}', '${itemName.replace(/'/g, "\\'")}')">
            <div class="form-group">
                <label>${type === 'hotel' ? 'Check-in Date *' : type === 'event' ? 'Attendance Date *' : 'Start Date *'}</label>
                <input type="date" id="book-checkin" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            ${checkoutField}
            <div class="form-group">
                <label>Number of Guests</label>
                <input type="number" id="book-guests" value="1" min="1" max="50">
            </div>
            <div class="form-group">
                <label>Special Requests / Notes</label>
                <textarea id="book-notes" placeholder="Any special requests or questions..." rows="3"></textarea>
            </div>
            <div id="book-message"></div>
            <button type="submit" class="btn btn-book" style="width:100%;">Submit Booking Request</button>
        </form>
    `;
    modal.style.display = 'flex';
}

async function submitBooking(e, type, itemId, itemName) {
    e.preventDefault();
    const msg = document.getElementById('book-message');
    const checkInDate = document.getElementById('book-checkin').value;
    const checkOutDateEl = document.getElementById('book-checkout');
    const checkOutDate = checkOutDateEl ? checkOutDateEl.value : null;
    const numberOfGuests = parseInt(document.getElementById('book-guests').value) || 1;
    const specialRequests = document.getElementById('book-notes').value.trim();

    if (!checkInDate) {
        msg.innerHTML = '<p class="error-message">Please select a date.</p>';
        return;
    }

    try {
        msg.innerHTML = '<p class="loading">Submitting booking...</p>';
        await api.createBooking({ type, itemId, checkInDate, checkOutDate, numberOfGuests, specialRequests });
        document.getElementById('booking-modal-body').innerHTML = `
            <div style="text-align:center; padding:1.5rem;">
                <p style="font-size:3rem;">✅</p>
                <h3 style="color:#1a7a3c;">Booking Request Submitted!</h3>
                <p style="color:#666; margin-top:0.5rem;">Your booking for <strong>${itemName}</strong> has been received.</p>
                <div style="background:#f8f9fa; padding:1rem; border-radius:8px; margin:1rem 0; text-align:left; font-size:0.88rem; color:#555;">
                    <strong>What happens next?</strong><br>
                    • Our team will coordinate with the hotel on your behalf<br>
                    • You will receive a confirmation once availability is verified<br>
                    • Check your booking status in <a href="my-bookings.html" style="color:var(--primary-color);">My Bookings</a>
                </div>
                <button onclick="closeBookingModal()" class="btn btn-primary" style="margin-top:0.5rem;">Close</button>
            </div>`;
    } catch (error) {
        msg.innerHTML = `<p class="error-message">${error.message || 'Failed to submit booking.'}</p>`;
    }
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('booking-modal');
    if (e.target === modal) closeBookingModal();
});
