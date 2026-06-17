// API Configuration – change this when deploying (e.g. your backend URL)
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

    // Add Authorization header — prefer user token, fall back to admin token
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const token = userToken || adminToken;
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401 && data.message && data.message.toLowerCase().includes('token')) {
                if (userToken) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userInfo');
                    if (!window.location.pathname.includes('login')) {
                        window.location.href = 'login.html';
                    }
                } else if (adminToken) {
                    localStorage.removeItem('adminToken');
                    if (window.location.pathname.includes('admin-dashboard')) {
                        alert('Session expired. Please log in again.');
                        window.location.href = 'admin-login.html';
                    }
                }
            }
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

    // User Auth
    register: (data) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    userLogin: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),
    getProfile: () => apiRequest('/auth/me'),

    // Bookings (user)
    createBooking: (data) => apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMyBookings: () => {
        // Use user token explicitly
        const token = localStorage.getItem('userToken');
        return fetch(`${API_BASE_URL}/bookings/mine`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
            return data;
        });
    },
    cancelBooking: (id) => {
        const token = localStorage.getItem('userToken');
        return fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to cancel booking');
            return data;
        });
    },

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
    replyToInquiry: (id, adminReply) => apiRequest(`/admin/inquiries/${id}/reply`, {
        method: 'PUT',
        body: JSON.stringify({ adminReply }),
    }),
    deleteInquiry: (id) => apiRequest(`/admin/inquiries/${id}`, { method: 'DELETE' }),

    // Bookings (Admin)
    getAdminBookings: () => apiRequest('/admin/bookings'),
    updateBookingStatus: (id, status, adminNote) => apiRequest(`/admin/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, adminNote }),
    }),
    deleteAdminBooking: (id) => apiRequest(`/admin/bookings/${id}`, { method: 'DELETE' }),

    // Reports
    getReport: (type) => apiRequest(`/admin/reports?type=${type}`),
    
    getReportPDF: (type) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/admin/reports/pdf?type=${type}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            if (!res.ok) throw new Error('Failed to generate PDF');
            return res.blob();
        });
    },
};

