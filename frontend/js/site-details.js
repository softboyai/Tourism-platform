// Site Details Page Script
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
                <a href="sites.html" class="btn btn-primary" style="margin-top: 2rem;">← Back to Sites</a>
            </div>
        `;
    } catch (error) {
        console.error('Error loading site details:', error);
        document.getElementById('site-details-container').innerHTML = 
            '<div class="container"><p class="error-message">Failed to load site details. Please try again later.</p></div>';
    }
});

