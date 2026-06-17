// Site Details Page Script

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

let currentSite = null;

function toggleFavoriteSite() {
    if (!currentSite) return;
    let favs = getFavorites();
    const exists = favs.find(f => f._id === currentSite._id);

    if (exists) {
        favs = favs.filter(f => f._id !== currentSite._id);
    } else {
        favs.push({
            _id: currentSite._id,
            name: currentSite.name,
            type: 'site',
            category: currentSite.category || '',
            city: currentSite.city || '',
            description: currentSite.description || '',
            image: currentSite.images && currentSite.images.length > 0 ? currentSite.images[0] : '',
            addedAt: new Date().toISOString()
        });
    }

    saveFavorites(favs);
    updateFavButton();
}

function updateFavButton() {
    const btn = document.getElementById('fav-btn');
    if (!btn || !currentSite) return;
    const fav = isFavorite(currentSite._id);
    btn.textContent = fav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
    btn.style.background = fav ? '#e74c3c' : '#f0f0f0';
    btn.style.color = fav ? 'white' : '#333';
}

function showContactForm() {
    if (!currentSite) return;
    const modal = document.getElementById('contact-modal');
    const body = document.getElementById('contact-modal-body');
    body.innerHTML = `
        <h2>📩 Contact About: ${currentSite.name}</h2>
        <p style="color: #666; margin-bottom: 1rem;">Send an inquiry about this site. We'll get back to you soon.</p>
        <form id="site-contact-form" onsubmit="submitSiteContact(event)">
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
                <textarea id="contact-message" required placeholder="I'm interested in visiting ${currentSite.name}..." rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Send Inquiry</button>
        </form>
    `;
    modal.style.display = 'flex';
    modal.classList.add('show');
}

async function submitSiteContact(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    try {
        await api.createInquiry({
            name: name,
            email: email,
            message: `[Inquiry about site: ${currentSite.name}] ${message}`
        });

        document.getElementById('contact-modal-body').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2 style="color: #2c7a4b;">✅ Message Sent!</h2>
                <p style="margin-top: 1rem; color: #666;">Your inquiry about <strong>${currentSite.name}</strong> has been submitted.</p>
                <button class="btn btn-primary" onclick="closeContactModal()" style="margin-top: 1.5rem;">Close</button>
            </div>
        `;
    } catch (error) {
        alert('Failed to send: ' + error.message);
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const siteId = urlParams.get('id');

    if (!siteId) {
        document.getElementById('site-details-container').innerHTML = 
            '<div class="container"><p class="error-message">Site ID not provided.</p></div>';
        return;
    }

    try {
        const response = await api.getSiteById(siteId);
        const site = response.data;
        currentSite = site;

        const fav = isFavorite(site._id);
        const container = document.getElementById('site-details-container');
        container.innerHTML = `
            <section class="detail-header">
                <div class="container">
                    <h1>${site.name}</h1>
                    <p><span class="card-category">${site.category}</span> • 📍 ${site.city}</p>
                </div>
            </section>

            <div class="container">
                <div class="detail-content">
                    <div>
                        ${site.images && site.images.length > 0 
                            ? `<div class="detail-images">
                                ${site.images.map(img => 
                                    `<img src="http://localhost:5000${img}" alt="${site.name}">`
                                ).join('')}
                               </div>`
                            : ''
                        }
                        <h2>Description</h2>
                        <p style="margin-bottom: 2rem; line-height: 1.8;">${site.description}</p>
                    </div>

                    <div class="detail-info">
                        <div class="info-item">
                            <div class="info-label">Category</div>
                            <div>${site.category}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">City</div>
                            <div>${site.city}</div>
                        </div>
                        ${site.phone 
                            ? `<div class="info-item">
                                <div class="info-label">Phone</div>
                                <div><a href="tel:${site.phone}">${site.phone}</a></div>
                               </div>`
                            : ''
                        }
                        ${site.email 
                            ? `<div class="info-item">
                                <div class="info-label">Email</div>
                                <div><a href="mailto:${site.email}">${site.email}</a></div>
                               </div>`
                            : ''
                        }
                        ${site.address 
                            ? `<div class="info-item">
                                <div class="info-label">Address</div>
                                <div>${site.address}</div>
                               </div>`
                            : ''
                        }
                        ${site.location 
                            ? `<div class="info-item">
                                <div class="info-label">Location</div>
                                <div>Lat: ${site.location.lat}, Lng: ${site.location.lng}</div>
                                <a href="https://www.google.com/maps?q=${site.location.lat},${site.location.lng}" 
                                   target="_blank" class="btn btn-secondary" style="margin-top: 0.5rem;">
                                    View on Map
                                </a>
                               </div>`
                            : ''
                        }
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
                    <button id="fav-btn" onclick="toggleFavoriteSite()" 
                            style="border: none; background: ${fav ? '#e74c3c' : '#f0f0f0'}; color: ${fav ? 'white' : '#333'}; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-size: 1rem;">
                        ${fav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                    </button>
                    <button onclick="showContactForm()" 
                            style="border: none; background: #2c7a4b; color: white; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-size: 1rem;">
                        📩 Contact About This Place
                    </button>
                    <a href="sites.html" class="btn btn-secondary">← Back to Sites</a>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading site details:', error);
        document.getElementById('site-details-container').innerHTML = 
            '<div class="container"><p class="error-message">Failed to load site details. Please try again later.</p></div>';
    }
});

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contact-modal');
    if (e.target === modal) closeContactModal();
});

