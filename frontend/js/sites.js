// Sites Page Script
let allSites = [];

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

    container.innerHTML = sites.map(site => `
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

