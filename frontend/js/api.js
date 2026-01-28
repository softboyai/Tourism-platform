// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add Authorization header if token exists
    const token = localStorage.getItem('adminToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// API Functions
const api = {
    // Sites
    getSites: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/sites${queryString ? '?' + queryString : ''}`);
    },
    getSiteById: (id) => apiRequest(`/sites/${id}`),

    // Hotels
    getHotels: () => apiRequest('/hotels'),
    getHotelById: (id) => apiRequest(`/hotels/${id}`),

    // Events
    getEvents: () => apiRequest('/events'),
    getEventById: (id) => apiRequest(`/events/${id}`),

    // Guides
    getGuides: () => apiRequest('/guides'),
    getGuideById: (id) => apiRequest(`/guides/${id}`),

    // Inquiries
    createInquiry: (data) => apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Admin Auth
    adminLogin: (email, password) => apiRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),

    // Admin CRUD (require authentication)
    // Sites
    createSite: (formData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/sites`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to create site');
            }
            return data;
        });
    },
    updateSite: (id, formData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/sites/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update site');
            }
            return data;
        });
    },
    deleteSite: (id) => apiRequest(`/sites/${id}`, { method: 'DELETE' }),

    // Hotels
    createHotel: (formData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/hotels`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to create hotel');
            }
            return data;
        });
    },
    updateHotel: (id, formData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/hotels/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update hotel');
            }
            return data;
        });
    },
    deleteHotel: (id) => apiRequest(`/hotels/${id}`, { method: 'DELETE' }),

    // Events
    createEvent: (formData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to create event');
            }
            return data;
        });
    },
    updateEvent: (id, formData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update event');
            }
            return data;
        });
    },
    deleteEvent: (id) => apiRequest(`/events/${id}`, { method: 'DELETE' }),

    // Guides
    createGuide: (data) => apiRequest('/guides', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateGuide: (id, data) => apiRequest(`/guides/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteGuide: (id) => apiRequest(`/guides/${id}`, { method: 'DELETE' }),

    // Inquiries (Admin)
    getInquiries: () => apiRequest('/admin/inquiries'),
};

