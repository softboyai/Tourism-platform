/**
 * User auth helpers — included on every page that needs nav login/logout state.
 */

function getUserToken() {
    return localStorage.getItem('userToken');
}

function getUserInfo() {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
}

function isUserLoggedIn() {
    return !!getUserToken();
}

function userLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    window.location.href = 'index.html';
}

// Render the nav user area and hide/show Admin link accordingly
function renderNavUserArea() {
    const el = document.getElementById('nav-user-area');

    // Find the Admin nav link — it's always the last <li> with class admin-link
    const adminLi = document.querySelector('.nav-menu .admin-link')?.closest('li');

    if (isUserLoggedIn()) {
        const user = getUserInfo();
        const firstName = user ? user.fullName.split(' ')[0] : 'User';

        if (el) {
            el.innerHTML = `
                <span>👤 ${firstName}</span>
                <a href="my-bookings.html">My Bookings</a>
                <a href="#" onclick="userLogout(); return false;" style="background:rgba(200,40,40,0.75); border-color:transparent;">Logout</a>
            `;
        }

        // Hide Admin link when user is logged in
        if (adminLi) adminLi.style.display = 'none';

    } else {
        if (el) {
            el.innerHTML = `
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            `;
        }

        // Show Admin link when no user is logged in
        if (adminLi) adminLi.style.display = '';
    }
}

document.addEventListener('DOMContentLoaded', renderNavUserArea);
