// Admin Dashboard Script
let currentTab = 'reports';

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Verify token is still valid by making a test request
    api.getInquiries().then(() => {
        initDashboard();
    }).catch(err => {
        if (err.message && err.message.toLowerCase().includes('token')) {
            localStorage.removeItem('adminToken');
            alert('Session expired. Please log in again.');
            window.location.href = 'admin-login.html';
        } else {
            // Other error (maybe network), still try to load dashboard
            initDashboard();
        }
    });
});

// Initialize dashboard
function initDashboard() {
    // Tab switching
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = 'admin-login.html';
    });

    // Load initial data
    switchTab('reports');
}

// Switch tabs
function switchTab(tabName) {
    currentTab = tabName;

    // Update active tab
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        }
    });

    // Show active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load data for active tab
    switch(tabName) {
        case 'reports':
            loadReport('daily');
            break;
        case 'sites':
            loadSites();
            break;
        case 'hotels':
            loadHotels();
            break;
        case 'events':
            loadEvents();
            break;
        case 'guides':
            loadGuides();
            break;
        case 'inquiries':
            loadInquiries();
            break;
    }
}

// ========== SITES MANAGEMENT ==========
async function loadSites() {
    try {
        console.log('Loading sites...');
        const response = await api.getSites();
        console.log('Sites response:', response);
        const sites = response.data || [];
        const tbody = document.getElementById('sites-table-body');

        if (sites.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No sites found.</td></tr>';
            return;
        }

        console.log(`Found ${sites.length} sites`);
        tbody.innerHTML = sites.map(site => `
            <tr>
                <td>${site.name}</td>
                <td><span class="card-category">${site.category}</span></td>
                <td>${site.city}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editSite('${site._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSite('${site._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading sites:', error);
        document.getElementById('sites-table-body').innerHTML = 
            '<tr><td colspan="4" class="error-message">Failed to load sites: ' + error.message + '</td></tr>';
    }
}

function showSiteForm(siteId = null) {
    const isEdit = !!siteId;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${isEdit ? 'Edit' : 'Add New'} Tourist Site</h2>
        <form id="site-form" onsubmit="saveSite(event, '${siteId || ''}')">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" id="site-name" required>
            </div>
            <div class="form-group">
                <label>Category *</label>
                <select id="site-category" required>
                    <option value="">Select category</option>
                    <option value="beach">Beach</option>
                    <option value="forest">Forest</option>
                    <option value="museum">Museum</option>
                    <option value="monument">Monument</option>
                    <option value="park">Park</option>
                    <option value="waterfall">Waterfall</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="cultural">Cultural</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea id="site-description" required></textarea>
            </div>
            <div class="form-group">
                <label>City *</label>
                <input type="text" id="site-city" required>
            </div>
            <div class="form-group">
                <label>Latitude *</label>
                <input type="number" step="any" id="site-lat" required>
            </div>
            <div class="form-group">
                <label>Longitude *</label>
                <input type="number" step="any" id="site-lng" required>
            </div>
            <div class="form-group">
                <label>Images</label>
                <input type="file" id="site-images" multiple accept="image/*">
                <small>You can upload multiple images (max 10)</small>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" id="site-phone" placeholder="e.g., +241 01 23 45 67">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="site-email" placeholder="e.g., contact@site.com">
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" id="site-address" placeholder="Physical address">
            </div>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Site</button>
        </form>
    `;

    if (isEdit) {
        // Load site data
        loadSiteData(siteId);
    }

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

async function loadSiteData(siteId) {
    try {
        const response = await api.getSiteById(siteId);
        const site = response.data;
        document.getElementById('site-name').value = site.name;
        document.getElementById('site-category').value = site.category;
        document.getElementById('site-description').value = site.description;
        document.getElementById('site-city').value = site.city;
        document.getElementById('site-lat').value = site.location.lat;
        document.getElementById('site-lng').value = site.location.lng;
        document.getElementById('site-phone').value = site.phone || '';
        document.getElementById('site-email').value = site.email || '';
        document.getElementById('site-address').value = site.address || '';
    } catch (error) {
        console.error('Error loading site:', error);
        alert('Failed to load site data');
    }
}

async function saveSite(e, siteId) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('site-name').value);
    formData.append('category', document.getElementById('site-category').value);
    formData.append('description', document.getElementById('site-description').value);
    formData.append('city', document.getElementById('site-city').value);
    formData.append('location', JSON.stringify({
        lat: parseFloat(document.getElementById('site-lat').value),
        lng: parseFloat(document.getElementById('site-lng').value)
    }));
    formData.append('phone', document.getElementById('site-phone').value);
    formData.append('email', document.getElementById('site-email').value);
    formData.append('address', document.getElementById('site-address').value);

    const images = document.getElementById('site-images').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        let response;
        if (siteId) {
            response = await api.updateSite(siteId, formData);
        } else {
            response = await api.createSite(formData);
        }
        
        // Check if response indicates success
        if (response.status === 'success') {
            closeModal();
            loadSites(); // Reload the list
            alert('Site saved successfully!');
        } else {
            throw new Error(response.message || 'Failed to save site');
        }
    } catch (error) {
        console.error('Error saving site:', error);
        alert('Failed to save site: ' + (error.message || 'Unknown error') + '\n\nCheck browser console (F12) for details.');
    }
}

async function deleteSite(siteId) {
    if (!confirm('Are you sure you want to delete this site?')) return;

    try {
        await api.deleteSite(siteId);
        loadSites();
        alert('Site deleted successfully!');
    } catch (error) {
        console.error('Error deleting site:', error);
        alert('Failed to delete site');
    }
}

function editSite(siteId) {
    showSiteForm(siteId);
}

// ========== HOTELS MANAGEMENT ==========
async function loadHotels() {
    try {
        const response = await api.getHotels();
        const hotels = response.data || [];
        const tbody = document.getElementById('hotels-table-body');

        if (hotels.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No hotels found.</td></tr>';
            return;
        }

        tbody.innerHTML = hotels.map(hotel => `
            <tr>
                <td>${hotel.name}</td>
                <td>${hotel.priceRange}</td>
                <td>${hotel.city}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editHotel('${hotel._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteHotel('${hotel._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading hotels:', error);
        document.getElementById('hotels-table-body').innerHTML = 
            '<tr><td colspan="4" class="error-message">Failed to load hotels.</td></tr>';
    }
}

function showHotelForm(hotelId = null) {
    const isEdit = !!hotelId;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${isEdit ? 'Edit' : 'Add New'} Hotel</h2>
        <form id="hotel-form" onsubmit="saveHotel(event, '${hotelId || ''}')">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" id="hotel-name" required>
            </div>
            <div class="form-group">
                <label>Price Range *</label>
                <select id="hotel-price-range" required>
                    <option value="">Select price range</option>
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-Range</option>
                    <option value="luxury">Luxury</option>
                </select>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="text" id="hotel-phone" required>
            </div>
            <div class="form-group">
                <label>WhatsApp</label>
                <input type="text" id="hotel-whatsapp">
            </div>
            <div class="form-group">
                <label>Address *</label>
                <input type="text" id="hotel-address" required>
            </div>
            <div class="form-group">
                <label>City *</label>
                <input type="text" id="hotel-city" required>
            </div>
            <div class="form-group">
                <label>Latitude *</label>
                <input type="number" step="any" id="hotel-lat" required>
            </div>
            <div class="form-group">
                <label>Longitude *</label>
                <input type="number" step="any" id="hotel-lng" required>
            </div>
            <div class="form-group">
                <label>Images</label>
                <input type="file" id="hotel-images" multiple accept="image/*">
            </div>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Hotel</button>
        </form>
    `;

    if (isEdit) {
        loadHotelData(hotelId);
    }

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

async function loadHotelData(hotelId) {
    try {
        const response = await api.getHotelById(hotelId);
        const hotel = response.data;
        document.getElementById('hotel-name').value = hotel.name;
        document.getElementById('hotel-price-range').value = hotel.priceRange;
        document.getElementById('hotel-phone').value = hotel.phone;
        document.getElementById('hotel-whatsapp').value = hotel.whatsapp || '';
        document.getElementById('hotel-address').value = hotel.address;
        document.getElementById('hotel-city').value = hotel.city;
        document.getElementById('hotel-lat').value = hotel.location.lat;
        document.getElementById('hotel-lng').value = hotel.location.lng;
    } catch (error) {
        console.error('Error loading hotel:', error);
        alert('Failed to load hotel data');
    }
}

async function saveHotel(e, hotelId) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('hotel-name').value);
    formData.append('priceRange', document.getElementById('hotel-price-range').value);
    formData.append('phone', document.getElementById('hotel-phone').value);
    formData.append('whatsapp', document.getElementById('hotel-whatsapp').value);
    formData.append('address', document.getElementById('hotel-address').value);
    formData.append('city', document.getElementById('hotel-city').value);
    formData.append('location', JSON.stringify({
        lat: parseFloat(document.getElementById('hotel-lat').value),
        lng: parseFloat(document.getElementById('hotel-lng').value)
    }));

    const images = document.getElementById('hotel-images').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        let response;
        if (hotelId) {
            response = await api.updateHotel(hotelId, formData);
        } else {
            response = await api.createHotel(formData);
        }
        
        if (response.status === 'success') {
            closeModal();
            loadHotels();
            alert('Hotel saved successfully!');
        } else {
            throw new Error(response.message || 'Failed to save hotel');
        }
    } catch (error) {
        console.error('Error saving hotel:', error);
        alert('Failed to save hotel: ' + (error.message || 'Unknown error') + '\n\nCheck browser console (F12) for details.');
    }
}

async function deleteHotel(hotelId) {
    if (!confirm('Are you sure you want to delete this hotel?')) return;

    try {
        await api.deleteHotel(hotelId);
        loadHotels();
        alert('Hotel deleted successfully!');
    } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('Failed to delete hotel');
    }
}

function editHotel(hotelId) {
    showHotelForm(hotelId);
}

// ========== EVENTS MANAGEMENT ==========
async function loadEvents() {
    try {
        const response = await api.getEvents();
        const events = response.data || [];
        const tbody = document.getElementById('events-table-body');

        if (events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No events found.</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(event => {
            const date = new Date(event.date).toLocaleDateString();
            return `
                <tr>
                    <td>${event.title}</td>
                    <td>${date}</td>
                    <td>${event.venue}</td>
                    <td>${event.city}</td>
                    <td class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="editEvent('${event._id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-table-body').innerHTML = 
            '<tr><td colspan="5" class="error-message">Failed to load events.</td></tr>';
    }
}

function showEventForm(eventId = null) {
    const isEdit = !!eventId;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${isEdit ? 'Edit' : 'Add New'} Event</h2>
        <form id="event-form" onsubmit="saveEvent(event, '${eventId || ''}')">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" id="event-title" required>
            </div>
            <div class="form-group">
                <label>Date *</label>
                <input type="datetime-local" id="event-date" required>
            </div>
            <div class="form-group">
                <label>Venue *</label>
                <input type="text" id="event-venue" required>
            </div>
            <div class="form-group">
                <label>Description *</label>
                <textarea id="event-description" required></textarea>
            </div>
            <div class="form-group">
                <label>City *</label>
                <input type="text" id="event-city" required>
            </div>
            <div class="form-group">
                <label>Poster Image</label>
                <input type="file" id="event-poster" accept="image/*">
            </div>
            <div class="form-group">
                <label>Organizer Name</label>
                <input type="text" id="event-organizer" placeholder="e.g., Tourism Office">
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" id="event-phone" placeholder="e.g., +241 01 23 45 67">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="event-email" placeholder="e.g., events@example.com">
            </div>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Event</button>
        </form>
    `;

    if (isEdit) {
        loadEventData(eventId);
    }

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

async function loadEventData(eventId) {
    try {
        const response = await api.getEventById(eventId);
        const event = response.data;
        document.getElementById('event-title').value = event.title;
        // Convert date to datetime-local format
        const date = new Date(event.date);
        document.getElementById('event-date').value = date.toISOString().slice(0, 16);
        document.getElementById('event-venue').value = event.venue;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-city').value = event.city;
        document.getElementById('event-organizer').value = event.organizerName || '';
        document.getElementById('event-phone').value = event.phone || '';
        document.getElementById('event-email').value = event.email || '';
    } catch (error) {
        console.error('Error loading event:', error);
        alert('Failed to load event data');
    }
}

async function saveEvent(e, eventId) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('event-title').value);
    formData.append('date', new Date(document.getElementById('event-date').value).toISOString());
    formData.append('venue', document.getElementById('event-venue').value);
    formData.append('description', document.getElementById('event-description').value);
    formData.append('city', document.getElementById('event-city').value);
    formData.append('organizerName', document.getElementById('event-organizer').value);
    formData.append('phone', document.getElementById('event-phone').value);
    formData.append('email', document.getElementById('event-email').value);

    const poster = document.getElementById('event-poster').files[0];
    if (poster) {
        formData.append('posterImage', poster);
    }

    try {
        let response;
        if (eventId) {
            response = await api.updateEvent(eventId, formData);
        } else {
            response = await api.createEvent(formData);
        }
        
        if (response.status === 'success') {
            closeModal();
            loadEvents();
            alert('Event saved successfully!');
        } else {
            throw new Error(response.message || 'Failed to save event');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        alert('Failed to save event: ' + (error.message || 'Unknown error') + '\n\nCheck browser console (F12) for details.');
    }
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        await api.deleteEvent(eventId);
        loadEvents();
        alert('Event deleted successfully!');
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
    }
}

function editEvent(eventId) {
    showEventForm(eventId);
}

// ========== GUIDES MANAGEMENT ==========
async function loadGuides() {
    try {
        const response = await api.getGuides();
        const guides = response.data || [];
        const tbody = document.getElementById('guides-table-body');

        if (guides.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No guides found.</td></tr>';
            return;
        }

        tbody.innerHTML = guides.map(guide => `
            <tr>
                <td>${guide.fullName}</td>
                <td>${guide.languages.join(', ')}</td>
                <td>${guide.city}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editGuide('${guide._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGuide('${guide._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading guides:', error);
        document.getElementById('guides-table-body').innerHTML = 
            '<tr><td colspan="4" class="error-message">Failed to load guides.</td></tr>';
    }
}

function showGuideForm(guideId = null) {
    const isEdit = !!guideId;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>${isEdit ? 'Edit' : 'Add New'} Tour Guide</h2>
        <form id="guide-form" onsubmit="saveGuide(event, '${guideId || ''}')">
            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" id="guide-name" required>
            </div>
            <div class="form-group">
                <label>Languages (comma-separated) *</label>
                <input type="text" id="guide-languages" placeholder="e.g., French, English, Spanish" required>
            </div>
            <div class="form-group">
                <label>Fees *</label>
                <input type="text" id="guide-fees" placeholder="e.g., 50,000 XAF/day" required>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="text" id="guide-phone" required>
            </div>
            <div class="form-group">
                <label>WhatsApp</label>
                <input type="text" id="guide-whatsapp">
            </div>
            <div class="form-group">
                <label>Areas Covered (comma-separated) *</label>
                <input type="text" id="guide-areas" placeholder="e.g., Port-Gentil, Libreville, Omboué" required>
            </div>
            <div class="form-group">
                <label>City *</label>
                <input type="text" id="guide-city" required>
            </div>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Guide</button>
        </form>
    `;

    if (isEdit) {
        loadGuideData(guideId);
    }

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

async function loadGuideData(guideId) {
    try {
        const response = await api.getGuideById(guideId);
        const guide = response.data;
        document.getElementById('guide-name').value = guide.fullName;
        document.getElementById('guide-languages').value = guide.languages.join(', ');
        document.getElementById('guide-fees').value = guide.fees;
        document.getElementById('guide-phone').value = guide.phone;
        document.getElementById('guide-whatsapp').value = guide.whatsapp || '';
        document.getElementById('guide-areas').value = guide.areasCovered.join(', ');
        document.getElementById('guide-city').value = guide.city;
    } catch (error) {
        console.error('Error loading guide:', error);
        alert('Failed to load guide data');
    }
}

async function saveGuide(e, guideId) {
    e.preventDefault();

    const data = {
        fullName: document.getElementById('guide-name').value,
        languages: document.getElementById('guide-languages').value.split(',').map(l => l.trim()).filter(l => l),
        fees: document.getElementById('guide-fees').value,
        phone: document.getElementById('guide-phone').value,
        whatsapp: document.getElementById('guide-whatsapp').value,
        areasCovered: document.getElementById('guide-areas').value.split(',').map(a => a.trim()).filter(a => a),
        city: document.getElementById('guide-city').value
    };

    try {
        if (guideId) {
            await api.updateGuide(guideId, data);
        } else {
            await api.createGuide(data);
        }
        closeModal();
        loadGuides();
        alert('Guide saved successfully!');
    } catch (error) {
        console.error('Error saving guide:', error);
        alert('Failed to save guide: ' + (error.message || 'Unknown error'));
    }
}

async function deleteGuide(guideId) {
    if (!confirm('Are you sure you want to delete this guide?')) return;

    try {
        await api.deleteGuide(guideId);
        loadGuides();
        alert('Guide deleted successfully!');
    } catch (error) {
        console.error('Error deleting guide:', error);
        alert('Failed to delete guide');
    }
}

function editGuide(guideId) {
    showGuideForm(guideId);
}

// ========== INQUIRIES MANAGEMENT ==========
async function loadInquiries() {
    try {
        const response = await api.getInquiries();
        const inquiries = response.data || [];
        const tbody = document.getElementById('inquiries-table-body');

        if (inquiries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No inquiries found.</td></tr>';
            return;
        }

        tbody.innerHTML = inquiries.map(inquiry => {
            const date = new Date(inquiry.createdAt).toLocaleDateString();
            const statusBadge = inquiry.status === 'replied' 
                ? '<span style="background:#27ae60;color:white;padding:2px 8px;border-radius:4px;font-size:0.8rem;">Replied</span>'
                : '<span style="background:#e67e22;color:white;padding:2px 8px;border-radius:4px;font-size:0.8rem;">Pending</span>';
            return `
                <tr>
                    <td>${inquiry.name}</td>
                    <td>${inquiry.email}</td>
                    <td>${inquiry.message.substring(0, 80)}${inquiry.message.length > 80 ? '...' : ''}</td>
                    <td>${statusBadge}</td>
                    <td>${date}</td>
                    <td class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="showInquiryDetails('${inquiry._id}')">View</button>
                        <button class="btn btn-sm btn-primary" onclick="showReplyForm('${inquiry._id}')" ${inquiry.status === 'replied' ? 'disabled' : ''}>Reply</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteInquiry('${inquiry._id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading inquiries:', error);
        document.getElementById('inquiries-table-body').innerHTML = 
            '<tr><td colspan="6" class="error-message">Failed to load inquiries.</td></tr>';
    }
}

function showInquiryDetails(inquiryId) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '<p>Loading...</p>';
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.classList.add('show');

    api.getInquiries().then(response => {
        const inquiry = (response.data || []).find(i => i._id === inquiryId);
        if (!inquiry) {
            modalBody.innerHTML = '<p>Inquiry not found.</p>';
            return;
        }
        const date = new Date(inquiry.createdAt).toLocaleString();
        modalBody.innerHTML = `
            <h2>Inquiry Details</h2>
            <div style="margin-bottom: 1rem;">
                <p><strong>From:</strong> ${inquiry.name} (${inquiry.email})</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Status:</strong> ${inquiry.status === 'replied' ? '✅ Replied' : '⏳ Pending'}</p>
            </div>
            <div style="background:#f8f9fa;padding:1rem;border-radius:8px;margin-bottom:1rem;">
                <strong>Message:</strong>
                <p style="margin-top:0.5rem;">${inquiry.message}</p>
            </div>
            ${inquiry.adminReply ? `
                <div style="background:#e8f5e9;padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <strong>Admin Reply:</strong>
                    <p style="margin-top:0.5rem;">${inquiry.adminReply}</p>
                    <small style="color:#666;">Replied on: ${new Date(inquiry.repliedAt).toLocaleString()}</small>
                </div>
            ` : ''}
            ${inquiry.status !== 'replied' ? `
                <button class="btn btn-primary" onclick="closeModal(); showReplyForm('${inquiry._id}')">Reply to this inquiry</button>
            ` : ''}
        `;
    });
}

function showReplyForm(inquiryId) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>Reply to Inquiry</h2>
        <form id="reply-form" onsubmit="sendReply(event, '${inquiryId}')">
            <div class="form-group">
                <label>Your Reply *</label>
                <textarea id="reply-message" required rows="5" placeholder="Type your reply here..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Reply</button>
        </form>
    `;
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

async function sendReply(e, inquiryId) {
    e.preventDefault();
    const adminReply = document.getElementById('reply-message').value.trim();
    if (!adminReply) {
        alert('Please enter a reply message.');
        return;
    }

    try {
        const response = await api.replyToInquiry(inquiryId, adminReply);
        closeModal();
        loadInquiries();
        if (response.emailSent) {
            alert('Reply sent successfully! Email delivered to the visitor.');
        } else {
            alert('Reply saved! Note: ' + (response.message || 'Email not configured — visitor will not receive an email. Configure SMTP in .env to enable email delivery.'));
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        alert('Failed to send reply: ' + (error.message || 'Unknown error'));
    }
}

async function deleteInquiry(inquiryId) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
        await api.deleteInquiry(inquiryId);
        loadInquiries();
        alert('Inquiry deleted successfully!');
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        alert('Failed to delete inquiry');
    }
}

// ========== MODAL UTILITIES ==========
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.getElementById('modal-body').innerHTML = '';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========== REPORTS ==========
let currentReportType = 'daily';

async function loadReport(type) {
    currentReportType = type;

    // Update toggle buttons
    document.getElementById('btn-daily').classList.toggle('active', type === 'daily');
    document.getElementById('btn-weekly').classList.toggle('active', type === 'weekly');

    const container = document.getElementById('report-content');
    container.innerHTML = '<div class="report-loading">Loading report...</div>';

    try {
        const response = await api.getReport(type);
        const data = response.data;

        const periodLabel = type === 'daily' ? 'Today' : 'Last 7 Days';
        const fromDate = new Date(data.period.from).toLocaleString();
        const toDate = new Date(data.period.to).toLocaleString();

        container.innerHTML = `
            <div class="report-summary">
                <h3>📋 ${periodLabel} Report</h3>
                <p class="period">Period: ${fromDate} — ${toDate}</p>
            </div>

            <h3 style="margin: 1.5rem 0 1rem; color: #333;">New Records (${periodLabel})</h3>
            <div class="report-cards">
                <div class="report-card">
                    <div class="card-icon">🏝️</div>
                    <div class="card-value">${data.newRecords.sites}</div>
                    <div class="card-label">New Sites</div>
                    <div class="card-total">Total: ${data.totals.sites}</div>
                </div>
                <div class="report-card">
                    <div class="card-icon">🏨</div>
                    <div class="card-value">${data.newRecords.hotels}</div>
                    <div class="card-label">New Hotels</div>
                    <div class="card-total">Total: ${data.totals.hotels}</div>
                </div>
                <div class="report-card">
                    <div class="card-icon">🎉</div>
                    <div class="card-value">${data.newRecords.events}</div>
                    <div class="card-label">New Events</div>
                    <div class="card-total">Total: ${data.totals.events}</div>
                </div>
                <div class="report-card">
                    <div class="card-icon">🧑‍🏫</div>
                    <div class="card-value">${data.newRecords.guides}</div>
                    <div class="card-label">New Guides</div>
                    <div class="card-total">Total: ${data.totals.guides}</div>
                </div>
                <div class="report-card">
                    <div class="card-icon">📩</div>
                    <div class="card-value">${data.newRecords.inquiries}</div>
                    <div class="card-label">New Inquiries</div>
                    <div class="card-total">Total: ${data.totals.inquiries}</div>
                </div>
                <div class="report-card" style="border-left-color: #e67e22;">
                    <div class="card-icon">📊</div>
                    <div class="card-value">${data.newRecords.total}</div>
                    <div class="card-label">Total New Activity</div>
                    <div class="card-total">All Records: ${data.totals.total}</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading report:', error);
        container.innerHTML = `<div class="report-loading" style="color: #e74c3c;">Failed to load report: ${error.message}</div>`;
    }
}

function printReport() {
    window.print();
}

async function downloadPDF() {
    try {
        const btn = document.querySelector('[onclick="downloadPDF()"]');
        btn.textContent = '⏳ Generating...';
        btn.disabled = true;

        const blob = await api.getReportPDF(currentReportType);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tourism-report-${currentReportType}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        btn.textContent = '📥 Download PDF';
        btn.disabled = false;
    } catch (error) {
        console.error('PDF download error:', error);
        alert('Failed to download PDF: ' + error.message);
        const btn = document.querySelector('[onclick="downloadPDF()"]');
        btn.textContent = '📥 Download PDF';
        btn.disabled = false;
    }
}

