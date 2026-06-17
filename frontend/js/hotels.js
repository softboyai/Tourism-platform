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
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                        <button onclick="toggleHotelFavorite('${hotel._id}')" 
                                style="border: none; background: ${fav ? '#e74c3c' : '#f0f0f0'}; color: ${fav ? 'white' : '#333'}; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                            ${fav ? '❤️ Saved' : '🤍 Favorite'}
                        </button>
                        ${hotel.phone ? `<a href="tel:${hotel.phone}" style="background: #2c7a4b; color: white; padding: 0.4rem 0.8rem; border-radius: 4px; text-decoration: none; font-size: 0.85rem;">📞 Call</a>` : ''}
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

