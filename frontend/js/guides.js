// Guides Page Script
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await api.getGuides();
        const guides = response.data || [];
        const container = document.getElementById('guides-container');

        if (guides.length === 0) {
            container.innerHTML = '<p class="empty-state">No tour guides available yet.</p>';
            return;
        }

        container.innerHTML = guides.map(guide => `
            <div class="card">
                <div class="card-content">
                    <h3 class="card-title">${guide.fullName}</h3>
                    <p class="card-description">
                        <strong>Languages:</strong> ${guide.languages.join(', ')}<br>
                        <strong>Fees:</strong> ${guide.fees}<br>
                        <strong>Areas Covered:</strong> ${guide.areasCovered.join(', ')}
                    </p>
                    <div class="card-meta" style="flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                        <div>📍 ${guide.city}</div>
                        ${guide.phone ? `<div>📞 ${guide.phone}</div>` : ''}
                        ${guide.whatsapp ? `<div>💬 WhatsApp: ${guide.whatsapp}</div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading guides:', error);
        document.getElementById('guides-container').innerHTML = 
            '<p class="error-message">Failed to load guides. Please try again later.</p>';
    }
});

