// Homepage Script
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load stats
        const [sitesRes, hotelsRes, eventsRes, guidesRes] = await Promise.all([
            api.getSites(),
            api.getHotels(),
            api.getEvents(),
            api.getGuides(),
        ]);

        // Update stats
        document.getElementById('sites-count').textContent = sitesRes.count || 0;
        document.getElementById('hotels-count').textContent = hotelsRes.count || 0;
        document.getElementById('events-count').textContent = eventsRes.count || 0;
        document.getElementById('guides-count').textContent = guidesRes.count || 0;

        // Load featured sites (first 6)
        const sites = sitesRes.data || [];
        const featuredSites = sites.slice(0, 6);
        const featuredContainer = document.getElementById('featured-sites');

        if (featuredSites.length === 0) {
            featuredContainer.innerHTML = '<p class="empty-state">No tourist sites available yet.</p>';
        } else {
            featuredContainer.innerHTML = featuredSites.map(site => `
                <div class="card" onclick="window.location.href='site-details.html?id=${site._id}'">
                    ${site.images && site.images.length > 0 
                        ? `<img src="http://localhost:5000${site.images[0]}" alt="${site.name}" class="card-image">`
                        : `<div class="card-image" style="background-color: #ddd;"></div>`
                    }
                    <div class="card-content">
                        <span class="card-category">${site.category}</span>
                        <h3 class="card-title">${site.name}</h3>
                        <p class="card-description">${site.description}</p>
                        <div class="card-meta">
                            <span>📍 ${site.city}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading homepage data:', error);
        document.getElementById('featured-sites').innerHTML = 
            '<p class="error-message">Failed to load data. Please try again later.</p>';
    }
});

