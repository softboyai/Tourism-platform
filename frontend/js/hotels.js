// Hotels Page Script
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await api.getHotels();
        const hotels = response.data || [];
        const container = document.getElementById('hotels-container');

        if (hotels.length === 0) {
            container.innerHTML = '<p class="empty-state">No hotels available yet.</p>';
            return;
        }

        container.innerHTML = hotels.map(hotel => {
            const priceLabel = {
                'budget': '💰 Budget',
                'mid-range': '💵 Mid-Range',
                'luxury': '💎 Luxury'
            };

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
                            ${hotel.phone ? `<div>📞 ${hotel.phone}</div>` : ''}
                            ${hotel.whatsapp ? `<div>💬 WhatsApp: ${hotel.whatsapp}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading hotels:', error);
        document.getElementById('hotels-container').innerHTML = 
            '<p class="error-message">Failed to load hotels. Please try again later.</p>';
    }
});

