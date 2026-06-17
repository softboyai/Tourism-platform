// Sites Page Script
let allSites = [];

// Get favorites from localStorage
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

function toggleFavorite(site) {
    let favs = getFavorites();
    const exists = favs.find(f => f._id === site._id);

    if (exists) {
        favs = favs.filter(f => f._id !== site._id);
    } else {
        favs.push({
            _id: site._id,
            name: site.name,
            type: 'site',
            category: site.category || '',
            city: site.city || '',
            description: site.description || '',
            image: site.images && site.images.length > 0 ? site.images[0] : '',
            addedAt: new Date().toISOString()
        });
    }

    saveFavorites(favs);
    renderSites(allSites);
}

// Load sites
async function loadSites() {
    try {
        const params = {};
        const search = document.getElementById('search').value.trim();
        const category = document.getElementById('category').value;
        const city = document.getElementById('city').value.trim();

        if (search) params.search = search;
        if (category) params.category = category;
        if (city) params.city = city;

        const response = await api.getSites(params);
        allSites = response.data || [];
        renderSites(allSites);
    } catch (error) {
        console.error('Error loading sites:', error);
        document.getElementById('sites-container').innerHTML = 
            '<p class="error-message">Failed to load sites. Please try again later.</p>';
    }
}

// Render sites
function renderSites(sites) {
    const container = document.getElementById('sites-container');

    if (sites.length === 0) {
        container.innerHTML = '<p class="empty-state">No sites found matching your criteria.</p>';
        return;
    }

    container.innerHTML = sites.map(site => {
        const fav = isFavorite(site._id);
        return `
            <div class="card">
                <div style="cursor: pointer;" onclick="window.location.href='site-details.html?id=${site._id}'">
                    ${site.images && site.images.length > 0 
                        ? `<img src="http://localhost:5000${site.images[0]}" alt="${site.name}" class="card-image">`
                        : `<div class="card-image" style="background-color: #ddd;"></div>`
                    }
                </div>
                <div class="card-content">
                    <span class="card-category">${site.category}</span>
                    <h3 class="card-title">${site.name}</h3>
                    <p class="card-description">${site.description}</p>
                    <div class="card-meta" style="flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <span>📍 ${site.city}</span>
                        ${site.phone ? `<span>📞 <a href="tel:${site.phone}">${site.phone}</a></span>` : ''}
                        ${site.email ? `<span>📧 <a href="mailto:${site.email}">${site.email}</a></span>` : ''}
                        ${site.address ? `<span>🏠 ${site.address}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                        <button onclick="toggleFavorite(allSites.find(s => s._id === '${site._id}'))" 
                                style="border: none; background: ${fav ? '#e74c3c' : '#f0f0f0'}; color: ${fav ? 'white' : '#333'}; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                            ${fav ? '❤️ Saved' : '🤍 Favorite'}
                        </button>
                        <a href="site-details.html?id=${site._id}" style="background: #2c7a4b; color: white; padding: 0.4rem 0.8rem; border-radius: 4px; text-decoration: none; font-size: 0.85rem;">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    loadSites();

    // Debounce search input
    let searchTimeout;
    document.getElementById('search').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadSites, 500);
    });

    document.getElementById('category').addEventListener('change', loadSites);
    document.getElementById('city').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(loadSites, 500);
    });
});

