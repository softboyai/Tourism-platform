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

