// Favorites Page Script

// Get favorites from localStorage
function getFavorites() {
    const favs = localStorage.getItem('tourismFavorites');
    return favs ? JSON.parse(favs) : [];
}

// Save favorites to localStorage
function saveFavorites(favs) {
    localStorage.setItem('tourismFavorites', JSON.stringify(favs));
}

// Add to favorites
function addToFavorites(item) {
    const favs = getFavorites();
    // Check if already exists
    const exists = favs.find(f => f._id === item._id && f.type === item.type);
    if (!exists) {
        favs.push({
            _id: item._id,
            name: item.name,
            type: item.type, // 'site' or 'hotel'
            category: item.category || '',
            city: item.city || '',
            description: item.description || '',
            image: item.image || '',
            addedAt: new Date().toISOString()
        });
        saveFavorites(favs);
        return true;
    }
    return false;
}

// Remove from favorites
function removeFromFavorites(id, type) {
    let favs = getFavorites();
    favs = favs.filter(f => !(f._id === id && f.type === type));
    saveFavorites(favs);
    loadFavorites(); // Reload the page
}

// Check if item is in favorites
function isFavorite(id, type) {
    const favs = getFavorites();
    return favs.some(f => f._id === id && f.type === type);
}

// Load and display favorites
function loadFavorites() {
    const favs = getFavorites();
    const container = document.getElementById('favorites-container');

    if (favs.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites" style="grid-column: 1 / -1;">
                <h3>No favorites yet</h3>
                <p style="color: #999; margin-bottom: 1.5rem;">Browse tourist sites and hotels, then click the ❤️ button to save them here.</p>
                <a href="sites.html" class="btn btn-primary">Browse Tourist Sites</a>
            </div>
        `;
        return;
    }

    container.innerHTML = favs.map(fav => `
        <div class="card">
            ${fav.image 
                ? `<img src="http://localhost:5000${fav.image}" alt="${fav.name}" class="card-image">`
                : `<div class="card-image" style="background-color: #ddd; display: flex; align-items: center; justify-content: center; font-size: 3rem;">${fav.type === 'site' ? '🏝️' : '🏨'}</div>`
            }
            <div class="card-content">
                <span class="card-category">${fav.type === 'site' ? '🏝️ Site' : '🏨 Hotel'} • ${fav.category || fav.city}</span>
                <h3 class="card-title">${fav.name}</h3>
                <p class="card-description">${fav.description ? fav.description.substring(0, 100) + '...' : ''}</p>
                <div class="card-meta">
                    <span>📍 ${fav.city}</span>
                    <span>Added: ${new Date(fav.addedAt).toLocaleDateString()}</span>
                </div>
                <div class="fav-actions">
                    <button class="btn-contact" onclick="showContactForm('${fav._id}', '${fav.name.replace(/'/g, "\\'")}', '${fav.type}')">📩 Contact</button>
                    <button class="btn-fav-remove" onclick="removeFromFavorites('${fav._id}', '${fav.type}')">🗑️ Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show contact form for a specific place
function showContactForm(placeId, placeName, placeType) {
    const modalBody = document.getElementById('contact-modal-body');
    modalBody.innerHTML = `
        <h2>📩 Contact About: ${placeName}</h2>
        <p style="color: #666; margin-bottom: 1rem;">Send an inquiry about this ${placeType}. We'll get back to you soon.</p>
        <form id="fav-contact-form" onsubmit="submitContactForm(event, '${placeId}', '${placeName}', '${placeType}')">
            <div class="form-group">
                <label>Your Name *</label>
                <input type="text" id="contact-name" required placeholder="Enter your full name">
            </div>
            <div class="form-group">
                <label>Your Email *</label>
                <input type="email" id="contact-email" required placeholder="Enter your email">
            </div>
            <div class="form-group">
                <label>Message *</label>
                <textarea id="contact-message" required placeholder="I'm interested in visiting ${placeName}. I would like to know more about..." rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Send Inquiry</button>
        </form>
    `;

    const modal = document.getElementById('contact-modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// Submit contact form
async function submitContactForm(e, placeId, placeName, placeType) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const fullMessage = `[Inquiry about ${placeType}: ${placeName}] ${message}`;

    try {
        await api.createInquiry({
            name: name,
            email: email,
            message: fullMessage
        });

        document.getElementById('contact-modal-body').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: #2c7a4b;">✅ Message Sent!</h2>
                <p style="margin-top: 1rem; color: #666;">Your inquiry about <strong>${placeName}</strong> has been submitted. We'll get back to you soon.</p>
                <button class="btn btn-primary" onclick="closeContactModal()" style="margin-top: 1.5rem;">Close</button>
            </div>
        `;
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        alert('Failed to send message: ' + error.message);
    }
}

// Close contact modal
function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contact-modal');
    if (e.target === modal) {
        closeContactModal();
    }
});

// Load on page ready
document.addEventListener('DOMContentLoaded', loadFavorites);
