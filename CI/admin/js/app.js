let usersData = null;
let careersData = null;
let analyticsData = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupNavigation();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Set admin name if available (mocking from localStorage or API)
    const adminName = localStorage.getItem('adminName') || 'Sridhar';
    const nameDisplay = document.getElementById('admin-name-display');
    if (nameDisplay) nameDisplay.textContent = adminName;
    
    // Initial badge fetch
    updateBadgeCounts();
    
    // Load initial page (Dashboard)
    loadPage('dashboard');
}

/**
 * Update notification and user badges once on load or on events
 */
async function updateBadgeCounts() {
    try {
        const stats = await api.get('/admin/dashboard/stats');
        const badgeUsers = document.getElementById('badge-users');
        const badgeNotifs = document.getElementById('badge-notifications');
        
        if (badgeUsers) badgeUsers.textContent = stats.pendingUsers || 0;
        if (badgeNotifs) badgeNotifs.textContent = stats.unreadNotifications || 0;
    } catch (err) {
        console.error('Failed to update badges', err);
    }
}

/**
 * Navigation logic for SPA behavior
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            
            // Update active state
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            loadPage(page);
        });
    });
}

/**
 * Load and render page content
 */
async function loadPage(page) {
    const pageTitle = document.getElementById('page-title');
    const sections = document.querySelectorAll('.admin-page');
    
    // Update Title
    pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
    
    // Show/Hide sections
    sections.forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`section-${page}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        
        // Add animated class after first animation
        targetSection.addEventListener('animationend', () => {
            targetSection.classList.add('animated');
        }, { once: true });

        // Targeted rendering for implemented pages
        if (['dashboard', 'users', 'careers'].includes(page)) {
            renderPage(page, targetSection);
        } else if (targetSection.innerHTML === '') {
            renderPage(page, targetSection);
        }
    }
}

/**
 * Router/Renderer for different pages
 */
function renderPage(page, container) {
    switch(page) {
        case 'dashboard': renderDashboard(container); break;
        case 'users':     renderUsers(container); break;
        case 'careers':   renderCareers(container); break;
        default:
            if (container.innerHTML === '') {
                container.innerHTML = `<h2 style="margin-top:20px; text-align:center; opacity:0.5;">${page.charAt(0).toUpperCase() + page.slice(1)} Module Development In Progress</h2>`;
            }
    }
}

/**
 * Dashboard Page Rendering
 */
async function renderDashboard(container) {
    const statsGrid = document.getElementById('dashboard-stats-grid');
    const chartCard = document.getElementById('dashboard-chart-card');
    const activityCard = document.getElementById('dashboard-activity-card');

    if (!statsGrid || !chartCard || !activityCard) return;

    try {
        const stats = await api.get('/admin/dashboard/stats');
        const { activity } = await api.get('/admin/dashboard/recent-activity');
        
        // Update Stats grid
        statsGrid.innerHTML = `
            <div class="card stat-card" style="border-left: 4px solid var(--accent-blue)">
                <div class="stat-icon">👥</div>
                <span class="stat-label">Total Users</span>
                <span class="stat-value counter">${stats.users || 0}</span>
                <span class="stat-trend positive">↑ 12.5%</span>
            </div>
            <div class="card stat-card" style="border-left: 4px solid var(--accent-teal)">
                <div class="stat-icon">📈</div>
                <span class="stat-label">Active Careers</span>
                <span class="stat-value counter">${stats.careers || 0}</span>
                <span class="stat-trend positive">↑ 4.2%</span>
            </div>
            <div class="card stat-card" style="border-left: 4px solid var(--accent-gold)">
                <div class="stat-icon">💰</div>
                <span class="stat-label">Monthly Rev</span>
                <span class="stat-value">$${(stats.courses * 149).toLocaleString()}</span>
                <span class="stat-trend positive">↑ 8.7%</span>
            </div>
            <div class="card stat-card" style="border-left: 4px solid var(--accent-purple)">
                <div class="stat-icon">⚡</div>
                <span class="stat-label">Conversion</span>
                <span class="stat-value">12.4%</span>
                <span class="stat-trend negative">↓ 1.2%</span>
            </div>
        `;

        // Professional SVG Area Chart
        chartCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h3 class="poppins">User Engagement Trend</h3>
                <div class="badge badge-active">Live Updates</div>
            </div>
            <div style="height:220px; width:100%; position:relative;">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="filter: drop-shadow(0 0 8px rgba(10, 132, 255, 0.2));">
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="var(--accent-blue)" stop-opacity="0.4"/>
                            <stop offset="100%" stop-color="var(--accent-blue)" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                    <path d="M0,40 L0,32 L15,28 L30,35 L45,18 L60,22 L75,10 L90,12 L100,5 L100,40 Z" fill="url(#chartGrad)"></path>
                    <path class="chart-line" d="M0,32 L15,28 L30,35 L45,18 L60,22 L75,10 L90,12 L100,5" fill="none" stroke="var(--accent-blue)" stroke-width="1.2" stroke-linecap="round"></path>
                </svg>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:16px; font-size:0.75rem; color:var(--text-muted);">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        `;

        // Activity Feed
        activityCard.innerHTML = `
            <h3 class="poppins mb-4">System Activity</h3>
            <div class="activity-feed custom-scrollbar" style="max-height: 300px; overflow-y:auto; padding-right:10px;">
                ${activity.map((act, i) => `
                    <div class="activity-item" style="animation-delay: ${i * 0.1}s">
                        <div class="activity-dot" style="background: ${getRandColor(i)}"></div>
                        <div class="activity-content">
                            <p><strong>${act.user?.name || 'Someone'}</strong> ${act.action} <span class="highlight">${act.target}</span></p>
                            <span class="time">${timeAgo(new Date(act.createdAt))}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

    } catch (err) {
        console.error("Dashboard render error:", err);
    }
}

function getRandColor(i) {
    const colors = ['var(--accent-blue)', 'var(--accent-teal)', 'var(--accent-gold)', 'var(--accent-purple)'];
    return colors[i % colors.length];
}

/**
 * User Management Page Rendering
 */
async function renderUsers(container) {
    let currentPage = 1;
    let currentSearch = '';
    let currentStatus = '';
    let currentRole = '';
    let itemsPerPage = 7;

    const tbody = document.getElementById('users-tbody');
    const statsGrid = document.getElementById('users-stats-grid');
    const searchInput = document.getElementById('user-search');

    const updateUI = () => {
        // Filter locally
        let filtered = (usersData || []).filter(u => {
            const matchSearch = u.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                               u.email.toLowerCase().includes(currentSearch.toLowerCase());
            const matchStatus = !currentStatus || u.status === currentStatus;
            const matchRole = !currentRole || u.role === currentRole;
            return matchSearch && matchStatus && matchRole;
        });

        // Paginate
        const start = (currentPage - 1) * itemsPerPage;
        const slice = filtered.slice(start, start + itemsPerPage);
        
        tbody.innerHTML = slice.map(user => `
            <tr class="user-row" onclick="window.openUserPanel('${user._id}')">
                <td><input type="checkbox" onclick="event.stopPropagation()"></td>
                <td>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="avatar-circle">${user.name.charAt(0)}</div>
                        <div class="truncate">
                            <div style="font-weight:600;" class="user-name">${user.name}</div>
                            <div class="text-muted" style="font-size:0.8rem;">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-pending'}">${user.role}</span></td>
                <td><span class="badge ${user.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${user.status}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>2h ago</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); window.openUserPanel('${user._id}')">View</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" class="text-center p-4 text-muted">No users found</td></tr>';
        
        // Update stats summary only on change
        if (statsGrid && (statsGrid.innerHTML === '' || statsGrid.querySelector('.shimmer'))) {
             statsGrid.innerHTML = `
                <div class="card stat-card blue">
                    <span class="stat-label">Total Users</span>
                    <span class="stat-value">${usersData.length}</span>
                </div>
                <div class="card stat-card green">
                    <span class="stat-label">Active Users</span>
                    <span class="stat-value">${usersData.filter(u => u.status === 'Active').length}</span>
                </div>
                <div class="card stat-card gold">
                    <span class="stat-label">Pending</span>
                    <span class="stat-value">4</span>
                </div>
                <div class="card stat-card purple">
                    <span class="stat-label">Growth</span>
                    <span class="stat-value">+12%</span>
                </div>
            `;
        }

        const paginationInfo = document.getElementById('users-pagination-info');
        if (paginationInfo) paginationInfo.textContent = `Showing ${slice.length} of ${filtered.length} users`;

        const pageButtons = document.getElementById('users-page-buttons');
        if (pageButtons) {
            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            pageButtons.innerHTML = Array.from({length: totalPages}, (_, i) => i + 1)
                .map(p => `<button class="btn ${currentPage === p ? 'btn-primary' : 'btn-ghost'} btn-sm page-btn" data-page="${p}">${p}</button>`)
                .join('');
            
            pageButtons.querySelectorAll('.page-btn').forEach(btn => {
                btn.onclick = () => {
                    currentPage = parseInt(btn.getAttribute('data-page'));
                    updateUI();
                };
            });
        }
    };

    // Initial check - if structure missing, something is wrong
    if (!tbody) return;

    // Show skeletons first if no data
    if (!usersData) {
        tbody.innerHTML = Array(7).fill().map(() => `<tr class="skeleton-row"><td colspan="7"></td></tr>`).join('');
        try {
            const data = await api.get('/admin/users?limit=100');
            usersData = data.users;
        } catch (err) { console.error(err); }
    }
    
    updateUI();

    // Re-attach listeners every render to ensure they point to the latest closure
    // But better yet, use global listeners if possible. For now, replace to be safe.
    searchInput.oninput = debounce((e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        updateUI();
    }, 300);

    document.getElementById('filter-status').onchange = (e) => {
        currentStatus = e.target.value;
        currentPage = 1;
        updateUI();
    };

    document.getElementById('filter-role').onchange = (e) => {
        currentRole = e.target.value;
        currentPage = 1;
        updateUI();
    };
}

/**
 * Open User Detail Slide-in Panel
 */
window.openUserPanel = async function(userId) {
    const panel = document.getElementById('side-panel');
    const overlay = document.getElementById('overlay');
    
    document.body.style.overflow = 'hidden';
    panel.innerHTML = '<div class="loading">Loading user details...</div>';
    panel.classList.add('open');
    overlay.classList.add('show');
    
    overlay.onclick = () => {
        panel.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    try {
        const { user } = await api.get(`/admin/users/${userId}`);
        const { activity } = await api.get(`/admin/users/${userId}/activity`);
        
        panel.innerHTML = `
            <div class="panel-header mb-4" style="display:flex; justify-content:space-between; align-items:center;">
                <h3>User Profile</h3>
                <button class="btn btn-ghost btn-sm" onclick="document.getElementById('overlay').click()">✕</button>
            </div>
            
            <div class="panel-content">
                <div class="user-main-info mb-4" style="display:flex; flex-direction:column; align-items:center; text-align:center;">
                    <div class="avatar-circle" style="width:80px; height:80px; font-size:2rem; margin-bottom:16px;">${user.name.charAt(0)}</div>
                    <h4>${user.name}</h4>
                    <p class="text-muted">${user.email}</p>
                    <div class="badge ${user.status === 'Active' ? 'badge-active' : 'badge-inactive'} mt-2">${user.status}</div>
                </div>

                <div class="user-details-grid card mb-4">
                    <div class="mb-2"><strong>Role:</strong> ${user.role}</div>
                    <div class="mb-2"><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</div>
                    <div class="mb-2"><strong>Location:</strong> New York, USA</div>
                </div>

                <h4>Recent Activity</h4>
                <div class="activity-list mt-2">
                    ${activity.length > 0 ? activity.map(act => `
                        <div class="mb-2 p-2" style="font-size:0.85rem; border-bottom: 1px solid var(--border-soft);">
                            <strong>${act.action}</strong> ${act.target}<br>
                            <span class="text-muted" style="font-size:0.75rem;">${new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                    `).join('') : '<p class="text-muted">No recent activity</p>'}
                </div>

                <div class="panel-actions mt-4" style="display:grid; gap:12px;">
                    <button class="btn btn-primary" onclick="changeUserStatus('${user._id}', '${user.status === 'Active' ? 'Blocked' : 'Active'}')">
                        ${user.status === 'Active' ? 'Block User' : 'Unblock User'}
                    </button>
                    <button class="btn btn-ghost" onclick="changeUserRole('${user._id}', '${user.role === 'admin' ? 'user' : 'admin'}')">
                        Change to ${user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        panel.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
};

window.changeUserStatus = async function(id, status) {
    if(confirm(`Are you sure you want to change status to ${status}?`)) {
        await api.put(`/admin/users/${id}/status`, { status });
        window.openUserPanel(id);
        usersData = null; // Invalidate cache
        renderUsers(document.getElementById('section-users'));
        updateBadgeCounts();
    }
};

window.changeUserRole = async function(id, role) {
    if(confirm(`Are you sure you want to change role to ${role}?`)) {
        await api.put(`/admin/users/${id}/role`, { role });
        window.openUserPanel(id);
        usersData = null; // Invalidate cache
        renderUsers(document.getElementById('section-users'));
        updateBadgeCounts();
    }
};

/**
 * Debounce helper
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Time ago formatter
 */
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
}

function updateDateTime() {
    const display = document.getElementById('current-datetime-display');
    if (!display) return;
    const now = new Date();
    display.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

window.renderDashboard = renderDashboard;
window.renderUsers = renderUsers;

/**
 * Career Paths Page Rendering
 */
async function renderCareers(container) {
    const grid = document.getElementById('careers-grid');
    if (!grid) return;

    const buildCard = (career) => {
        const demand = Math.floor(Math.random() * 40) + 50;
        const enrolled = Math.floor(Math.random() * 800) + 200;
        return `
            <div class="card career-card" 
                 data-category="${career.domain || 'Tech'}" 
                 data-title="${career.name}"
                 onclick="viewCareerUsers('${career._id}', '${career.name}')"
                 style="display: flex; flex-direction: column; height: 100%;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:16px;">
                    <div>
                        <span class="badge badge-admin mb-2">${career.domain || 'Tech'}</span>
                        <h3 class="poppins" style="font-size:1.1rem; margin:0;">${career.name}</h3>
                    </div>
                </div>
                
                <div class="progress-wrap mb-4" style="flex:1;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:8px;">
                        <span class="text-muted">Market Demand</span>
                        <span style="color:var(--accent-teal); font-weight:700;">${demand}%</span>
                    </div>
                    <div class="progress-bar" style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                        <div class="progress-fill" style="width:${demand}%; height:100%; background:linear-gradient(90deg, var(--accent-blue), var(--accent-teal)); border-radius:3px;"></div>
                    </div>
                    <p class="text-muted mt-3" style="font-size:0.8rem; line-height:1.4;">
                        ${career.description || 'Comprehensive track covering essential industry skills and certifications.'}
                    </p>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:16px; border-top:1px solid var(--border-soft);">
                    <div class="stat-mini">
                        <span class="text-muted" style="font-size:0.7rem; text-transform:uppercase; letter-spacing:0.5px;">Enrolled</span>
                        <div style="font-weight:700; color:var(--text-main);">${enrolled.toLocaleString()}</div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); editCareer('${career._id}')">Edit</button>
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); deleteCareer('${career._id}')" style="color:var(--danger)">Delete</button>
                    </div>
                </div>
            </div>
        `;
    };

    const filterCareers = () => {
        const searchVal = document.getElementById('career-search').value.toLowerCase();
        const catFilter = document.getElementById('career-cat-filter').value;
        
        grid.querySelectorAll('.career-card').forEach(card => {
            const matchSearch = card.dataset.title.toLowerCase().includes(searchVal);
            const matchCat = !catFilter || card.dataset.category === catFilter;
            card.style.display = (matchSearch && matchCat) ? 'flex' : 'none';
        });
    };

    // Initial load logic
    if (!careersData) {
        grid.innerHTML = Array(6).fill().map(() => `<div class="card shimmer" style="height:220px"></div>`).join('');
        try {
            const { careers } = await api.get('/admin/career-paths');
            careersData = careers;
        } catch (err) { 
            grid.innerHTML = `<div class="error-msg">${err.message}</div>`;
            return;
        }
    }
    
    grid.innerHTML = (careersData || []).map(buildCard).join('');

    // Re-attach listeners
    const searchInp = document.getElementById('career-search');
    const catFilt = document.getElementById('career-cat-filter');
    if (searchInp) searchInp.oninput = filterCareers;
    if (catFilt) catFilt.onchange = filterCareers;
}

window.openAddCareerModal = function() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <h2 class="mb-4">Add New Career Path</h2>
        <form id="add-career-form">
            <div class="input-group">
                <label class="input-label">Path Name</label>
                <input type="text" name="name" class="input-field" placeholder="e.g. Frontend Developer" required>
            </div>
            <div class="input-group">
                <label class="input-label">Description</label>
                <textarea name="description" class="input-field" rows="3" placeholder="Overview of the path..."></textarea>
            </div>
            <div class="input-group">
                <label class="input-label">Category</label>
                <select name="domain" class="input-field">
                    <option value="Tech">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <button type="submit" class="btn btn-primary flex-1">Create Path</button>
                <button type="button" class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    
    document.getElementById('add-career-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const body = Object.fromEntries(formData.entries());
        try {
            await api.post('/admin/career-paths', body);
            closeModal();
            renderCareers(document.getElementById('section-careers'));
        } catch (err) {
            alert(err.message);
        }
    };
};

window.viewCareerUsers = async function(id, name) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    content.innerHTML = '<div class="loading">Fetching enrolled users...</div>';
    
    try {
        const { users } = await api.get(`/admin/career-paths/${id}/users`);
        content.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-4">
                <h2>Users In ${name}</h2>
                <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
            </div>
            <div class="user-list" style="max-height:400px; overflow-y:auto;">
                ${users.length > 0 ? users.map(u => `
                    <div class="p-3 border-bottom" style="display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--border-soft)">
                        <div class="avatar-circle">${u.user.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight:600;">${u.user.name}</div>
                            <div class="text-muted" style="font-size:0.8rem;">${u.user.email}</div>
                        </div>
                    </div>
                `).join('') : '<p class="text-muted">No users enrolled in this path yet.</p>'}
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
};

window.deleteCareer = async function(id) {
    if(confirm('Are you sure you want to delete this career path?')) {
        await api.delete(`/admin/career-paths/${id}`);
        renderCareers(document.getElementById('section-careers'));
    }
};

window.closeModal = function() {
    document.getElementById('modal').classList.remove('show');
    document.body.style.overflow = '';
};

window.renderCareers = renderCareers;

/**
 * Assessments Page Rendering
 */
async function renderAssessments(container) {
    container.innerHTML = `
        <div class="header-actions mb-4" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; gap:12px;">
                <select class="input-field" style="width:180px;" id="asm-filter-category">
                    <option value="">All Categories</option>
                    <option value="Tech">Technology</option>
                    <option value="Aptitude">Aptitude</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="openCreateAssessmentModal()">+ Create Assessment</button>
        </div>
        <div class="card">
            <div class="table-container">
                <table id="assessments-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Questions</th>
                            <th>Avg Score</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="loading"><td colspan="6">Loading assessments...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        const { assessments } = await api.get('/admin/assessments');
        const tbody = container.querySelector('tbody');
        
        tbody.innerHTML = assessments.map(asm => `
            <tr style="cursor:pointer" onclick="viewSubmissions('${asm._id}')">
                <td><strong>${asm.title}</strong></td>
                <td>${asm.category}</td>
                <td>${asm.questions?.length || 0} Qs</td>
                <td>${Math.floor(Math.random() * 20) + 70}%</td>
                <td>
                    <label class="switch" onclick="event.stopPropagation()">
                        <input type="checkbox" ${asm.status === 'Active' ? 'checked' : ''} onchange="toggleAsmStatus('${asm._id}', this.checked)">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); deleteAsm('${asm._id}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6" class="text-muted">No assessments found.</td></tr>';
    } catch (err) {
        container.querySelector('tbody').innerHTML = `<tr><td colspan="6" class="error-msg">${err.message}</td></tr>`;
    }
}

window.openCreateAssessmentModal = function() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    content.innerHTML = `
        <h2 class="mb-4">New Assessment</h2>
        <form id="create-asm-form">
            <div class="input-group">
                <label class="input-label">Title</label>
                <input type="text" name="title" class="input-field" required>
            </div>
            <div class="input-group">
                <label class="input-label">Category</label>
                <input type="text" name="category" class="input-field" placeholder="e.g. JavaScript" required>
            </div>
            <div id="questions-builder" class="mb-4">
                <label class="input-label">Questions</label>
                <div id="questions-list"></div>
                <button type="button" class="btn btn-ghost btn-sm mt-2" onclick="addQuestionField()">+ Add Question</button>
            </div>
            <div style="display:flex; gap:12px;">
                <button type="submit" class="btn btn-primary flex-1">Create</button>
                <button type="button" class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;

    window.addQuestionField = function() {
        const list = document.getElementById('questions-list');
        const div = document.createElement('div');
        div.className = 'card mb-2 p-3';
        div.style.background = 'rgba(255,255,255,0.03)';
        div.innerHTML = `
            <input type="text" class="input-field mb-2 q-text" placeholder="Question text" required>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <input type="text" class="input-field q-opt" placeholder="Option A" required>
                <input type="text" class="input-field q-opt" placeholder="Option B" required>
            </div>
            <input type="text" class="input-field mt-2 q-ans" placeholder="Correct Answer" required>
            <button type="button" class="btn btn-ghost btn-sm mt-2" onclick="this.parentElement.remove()" style="color:var(--danger)">Remove</button>
        `;
        list.appendChild(div);
    };

    addQuestionField(); // Start with one

    document.getElementById('create-asm-form').onsubmit = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const category = e.target.category.value;
        const questions = Array.from(document.querySelectorAll('#questions-list > div')).map(div => ({
            text: div.querySelector('.q-text').value,
            options: Array.from(div.querySelectorAll('.q-opt')).map(i => i.value),
            answer: div.querySelector('.q-ans').value
        }));

        try {
            await api.post('/admin/assessments', { title, category, questions });
            closeModal();
            renderAssessments(document.getElementById('section-assessments'));
        } catch (err) {
            alert(err.message);
        }
    };
};

window.viewSubmissions = async function(id) {
    const panel = document.getElementById('side-panel');
    const overlay = document.getElementById('overlay');
    
    panel.innerHTML = '<div class="loading">Fetching submissions...</div>';
    panel.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    try {
        const { submissions } = await api.get(`/admin/assessments/${id}/submissions`);
        panel.innerHTML = `
            <div class="mb-4" style="display:flex; justify-content:space-between; align-items:center;">
                <h3>Submissions</h3>
                <button class="btn btn-ghost btn-sm" onclick="document.getElementById('overlay').click()">✕</button>
            </div>
            <div class="submissions-list">
                ${submissions.length > 0 ? submissions.map(s => `
                    <div class="card mb-2 p-3">
                        <div style="display:flex; justify-content:space-between;">
                            <strong>${s.userName}</strong>
                            <span class="badge ${s.score > 70 ? 'badge-active' : 'badge-pending'}">${s.score}%</span>
                        </div>
                        <div class="text-muted" style="font-size:0.8rem;">Submitted: ${new Date(s.date).toLocaleDateString()}</div>
                    </div>
                `).join('') : '<p class="text-muted">No submissions found for this assessment.</p>'}
            </div>
        `;
    } catch (err) {
        panel.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
};

window.toggleAsmStatus = async function(id, status) {
    try {
        await api.put(`/admin/assessments/${id}/status`, { status: status ? 'Active' : 'Inactive' });
    } catch (err) {
        alert('Failed to update status');
    }
};

window.deleteAsm = async function(id) {
    if(confirm('Delete assessment?')) {
        await api.delete(`/admin/assessments/${id}`);
        renderAssessments(document.getElementById('section-assessments'));
    }
};

window.renderAssessments = renderAssessments;

/**
 * Job Postings Page Rendering
 */
async function renderJobs(container) {
    container.innerHTML = `
        <div class="header-actions mb-4" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; gap:12px; flex:1; min-width:300px;">
                <input type="text" class="input-field" placeholder="Search jobs..." style="width:250px;" id="job-search">
                <select class="input-field" style="width:150px;">
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                </select>
            </div>
            <button class="btn btn-gradient" onclick="openPostJobModal()">+ Post New Job</button>
        </div>
        <div id="jobs-grid" class="section-grid">
            <div class="loading">Loading jobs...</div>
        </div>
    `;

    try {
        const { jobs } = await api.get('/admin/jobs');
        const grid = document.getElementById('jobs-grid');
        
        grid.innerHTML = jobs.map(job => `
            <div class="card job-card" style="cursor:pointer" onclick="viewApplicants('${job._id}', '${job.title}')">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                    <div>
                        <h3 style="font-size:1.05rem;">${job.title}</h3>
                        <p class="text-muted" style="font-size:0.85rem;">${job.company} • ${job.location}</p>
                    </div>
                    <span class="badge ${job.status === 'Open' ? 'badge-active' : 'badge-inactive'}">${job.status}</span>
                </div>
                
                <div style="display:flex; gap:8px; margin-bottom:16px;">
                    <span class="badge badge-pending" style="font-size:0.75rem; background:rgba(255,159,10,0.1)">${job.jobType}</span>
                    <span class="badge badge-admin" style="font-size:0.75rem; background:rgba(10,132,255,0.1)">${job.experienceLevel || 'Entry'}</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="text-muted" style="font-size:0.85rem;"><strong>${Math.floor(Math.random()*25)}</strong> Applicants</span>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); toggleJobStatus('${job._id}', '${job.status}')">${job.status === 'Open' ? 'Close' : 'Reopen'}</button>
                        <button class="btn btn-ghost btn-sm" style="color:var(--danger); border-color:transparent" onclick="event.stopPropagation(); deleteJob('${job._id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('') || '<p class="text-muted">No jobs posted yet.</p>';
    } catch (err) {
        document.getElementById('jobs-grid').innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
}

window.openPostJobModal = function() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <h2 class="mb-4">Post New Job</h2>
        <form id="post-job-form">
            <div class="input-group">
                <label class="input-label">Job Title</label>
                <input type="text" name="title" class="input-field" placeholder="e.g. Senior Software Engineer" required>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="input-group">
                    <label class="input-label">Company</label>
                    <input type="text" name="company" class="input-field" placeholder="Company name" required>
                </div>
                <div class="input-group">
                    <label class="input-label">Location</label>
                    <input type="text" name="location" class="input-field" placeholder="City, Country" required>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="input-group">
                    <label class="input-label">Type</label>
                    <select name="jobType" class="input-field">
                        <option value="Full-time">Full-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="input-label">Level</label>
                    <select name="experienceLevel" class="input-field">
                        <option value="Entry">Entry</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label class="input-label">Description</label>
                <textarea name="description" class="input-field" rows="4" placeholder="Job responsibilities and requirements..."></textarea>
            </div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <button type="submit" class="btn btn-primary flex-1">Post Job</button>
                <button type="button" class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    
    document.getElementById('post-job-form').onsubmit = async (e) => {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.target).entries());
        try {
            await api.post('/admin/jobs', body);
            closeModal();
            renderJobs(document.getElementById('section-jobs'));
        } catch (err) { alert(err.message); }
    };
};

window.viewApplicants = async function(id, title) {
    const panel = document.getElementById('side-panel');
    const overlay = document.getElementById('overlay');
    panel.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    panel.innerHTML = `
        <div class="p-4">
            <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-4">
                <h3>Applicants - ${title}</h3>
                <button class="btn btn-ghost btn-sm" onclick="document.getElementById('overlay').click()">✕</button>
            </div>
            <div class="applicants-list">
                <p class="text-muted">Loading applicants...</p>
            </div>
        </div>
    `;
    
    try {
        const { applicants } = await api.get(`/admin/jobs/${id}/applicants`);
        panel.querySelector('.applicants-list').innerHTML = applicants.length > 0 ? applicants.map(a => `
            <div class="card mb-3 p-3">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:600;">${a.name}</div>
                        <div class="text-muted" style="font-size:0.8rem;">Applied: ${new Date(a.appliedAt).toLocaleDateString()}</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" onclick="window.location.href='${a.resumeUrl}'">Resume</button>
                </div>
            </div>
        `).join('') : '<p class="text-muted">No applications received yet.</p>';
    } catch (err) {
        panel.querySelector('.applicants-list').innerHTML = '<p class="text-muted">No applicants data available.</p>';
    }
};

window.toggleJobStatus = async function(id, currentStatus) {
    const nextStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
    try {
        await api.put(`/admin/jobs/${id}/status`, { status: nextStatus });
        renderJobs(document.getElementById('section-jobs'));
    } catch (err) {
        alert('Failed to update status');
    }
};

window.deleteJob = async function(id) {
    if(confirm('Delete job posting?')) {
        await api.delete(`/admin/jobs/${id}`);
        renderJobs(document.getElementById('section-jobs'));
    }
};

window.renderJobs = renderJobs;

/**
 * Courses Page Rendering
 */
async function renderCourses(container) {
    container.innerHTML = `
        <div class="header-actions mb-4" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; gap:12px;">
                <input type="text" class="input-field" placeholder="Search courses..." style="width:250px;">
                <select class="input-field" style="width:150px;">
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <button class="btn btn-gradient" onclick="openAddCourseModal()">+ Add New Course</button>
        </div>
        <div id="courses-grid" class="section-grid">
            <div class="loading">Loading courses...</div>
        </div>
    `;

    try {
        const { courses } = await api.get('/admin/courses');
        const grid = document.getElementById('courses-grid');
        
        grid.innerHTML = courses.map(course => `
            <div class="card course-card" style="cursor:pointer" onclick="viewCourseStudents('${course._id}', '${course.name}')">
                <div style="height:120px; background:rgba(255,255,255,0.03); border-radius:12px; margin-bottom:16px; overflow:hidden; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-soft);">
                    <img src="https://via.placeholder.com/300x120?text=${encodeURIComponent(course.name)}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">
                </div>
                <div>
                    <span class="badge badge-admin mb-2">${course.platform || 'General'}</span>
                    <h3 style="font-size:1.05rem; margin-bottom:4px;">${course.name}</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                        <span class="text-muted" style="font-size:0.85rem;"><strong>${Math.floor(Math.random()*150)}</strong> Students</span>
                        <span style="color:var(--accent-teal); font-weight:700;">$${course.price || 0}</span>
                    </div>
                </div>
                <div style="display:flex; gap:8px; margin-top:20px;">
                    <button class="btn btn-ghost btn-sm flex-1" onclick="event.stopPropagation(); editCourse('${course._id}')">Edit</button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--danger); border-color:transparent" onclick="event.stopPropagation(); deleteCourse('${course._id}')">Delete</button>
                </div>
            </div>
        `).join('') || '<p class="text-muted">No courses found.</p>';
    } catch (err) {
        document.getElementById('courses-grid').innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
}

window.openAddCourseModal = function() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    content.innerHTML = `
        <h2 class="mb-4">Add New Course</h2>
        <form id="add-course-form">
            <div class="input-group">
                <label class="input-label">Course Name</label>
                <input type="text" name="name" class="input-field" required>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="input-group">
                    <label class="input-label">Platform</label>
                    <input type="text" name="platform" class="input-field" placeholder="e.g. Udemy" required>
                </div>
                <div class="input-group">
                    <label class="input-label">Price ($)</label>
                    <input type="number" name="price" class="input-field" value="0">
                </div>
            </div>
            <div class="input-group">
                <label class="input-label">URL</label>
                <input type="url" name="url" class="input-field" placeholder="https://...">
            </div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <button type="submit" class="btn btn-primary flex-1">Create Course</button>
                <button type="button" class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('add-course-form').onsubmit = async (e) => {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.target).entries());
        try {
            await api.post('/admin/courses', body);
            closeModal();
            renderCourses(document.getElementById('section-courses'));
        } catch (err) { alert(err.message); }
    };
};

window.viewCourseStudents = async function(id, name) {
    const panel = document.getElementById('side-panel');
    const overlay = document.getElementById('overlay');
    panel.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    panel.innerHTML = `
        <div class="p-4">
            <div style="display:flex; justify-content:space-between; align-items:center;" class="mb-4">
                <h3>Students - ${name}</h3>
                <button class="btn btn-ghost btn-sm" onclick="document.getElementById('overlay').click()">✕</button>
            </div>
            <div id="students-list">
                <p class="text-muted">Loading students...</p>
            </div>
        </div>
    `;
    
    try {
        const { students } = await api.get(`/admin/courses/${id}/students`);
        document.getElementById('students-list').innerHTML = students.length > 0 ? students.map(s => `
            <div class="card mb-3 p-3">
                <div style="font-weight:600;">${s.user.name}</div>
                <div class="text-muted" style="font-size:0.8rem;">Enrolled: ${new Date(s.enrolledAt).toLocaleDateString()}</div>
            </div>
        `).join('') : '<p class="text-muted">No students enrolled yet.</p>';
    } catch (err) {
        document.getElementById('students-list').innerHTML = '<p class="text-muted">No student data available.</p>';
    }
};

window.deleteCourse = async function(id) {
    if(confirm('Delete course?')) {
        await api.delete(`/admin/courses/${id}`);
        renderCourses(document.getElementById('section-courses'));
    }
};

window.renderCourses = renderCourses;

/**
 * Notifications Page Rendering
 */
async function renderNotifications(container) {
    let currentFilter = 'all';

    const fetchAndRender = async () => {
        container.innerHTML = `
            <div class="header-actions mb-4" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:12px;">
                    <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="setNotifFilter('all')">All</button>
                    <button class="btn ${currentFilter === 'unread' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="setNotifFilter('unread')">Unread</button>
                </div>
                <div style="display:flex; gap:12px;">
                    <button class="btn btn-ghost btn-sm" onclick="markAllAsRead()">Mark all as read</button>
                    <button class="btn btn-gradient btn-sm" onclick="openSendNotificationModal()">+ Send Notification</button>
                </div>
            </div>
            <div id="notifs-list" class="card">
                <div class="loading">Loading notifications...</div>
            </div>
        `;

        try {
            const { notifications } = await api.get(`/admin/notifications?filter=${currentFilter}`);
            const list = document.getElementById('notifs-list');
            
            list.innerHTML = notifications.length > 0 ? notifications.map(n => `
                <div class="p-4 border-bottom" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-soft); background: ${n.read ? 'transparent' : 'rgba(10,132,255,0.05)'}">
                    <div style="display:flex; gap:16px; align-items:center;">
                        <div class="avatar-circle" style="background:${n.type === 'alert' ? 'var(--danger)' : 'var(--accent-blue)'}; width:40px; height:40px;">
                            ${n.type === 'alert' ? '!' : 'i'}
                        </div>
                        <div>
                            <div style="font-weight:600; color: ${n.read ? 'var(--text-muted)' : 'var(--text-main)'}">${n.message}</div>
                            <div class="text-muted" style="font-size:0.8rem;">${timeAgo(new Date(n.createdAt))}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        ${!n.read ? `<button class="btn btn-ghost btn-sm" onclick="markAsRead('${n._id}')">Mark read</button>` : ''}
                        <button class="btn btn-ghost btn-sm text-danger" onclick="deleteNotif('${n._id}')">Delete</button>
                    </div>
                </div>
            `).join('') : '<div class="p-8 text-center text-muted">No notifications found.</div>';
        } catch (err) {
            document.getElementById('notifs-list').innerHTML = `<div class="p-4 error-msg">${err.message}</div>`;
        }
    };

    window.setNotifFilter = (f) => { currentFilter = f; fetchAndRender(); };
    window.markAsRead = async (id) => { 
        await api.put(`/admin/notifications/${id}/read`); 
        updateBadgeCounts();
        fetchAndRender(); 
    };
    window.markAllAsRead = async () => { 
        await api.put('/admin/notifications/read-all'); 
        updateBadgeCounts();
        fetchAndRender(); 
    };
    window.deleteNotif = async (id) => { 
        if(confirm('Delete?')) { 
            await api.delete(`/admin/notifications/${id}`); 
            updateBadgeCounts();
            fetchAndRender(); 
        } 
    };

    fetchAndRender();
}

window.openSendNotificationModal = function() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    content.innerHTML = `
        <h2 class="mb-4">Send Notification</h2>
        <form id="send-notif-form">
            <div class="input-group">
                <label class="input-label">Target User (Leave empty for all)</label>
                <input type="text" name="userId" class="input-field" placeholder="User ID">
            </div>
            <div class="input-group">
                <label class="input-label">Message</label>
                <textarea name="message" class="input-field" rows="3" required></textarea>
            </div>
            <div class="input-group">
                <label class="input-label">Type</label>
                <select name="type" class="input-field">
                    <option value="info">Information</option>
                    <option value="alert">Alert / Warning</option>
                    <option value="success">Success</option>
                </select>
            </div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <button type="submit" class="btn btn-primary flex-1">Send</button>
                <button type="button" class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('send-notif-form').onsubmit = async (e) => {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.target).entries());
        try {
            await api.post('/notifications', body); // Global endpoint
            closeModal();
            renderNotifications(document.getElementById('section-notifications'));
        } catch (err) { alert(err.message); }
    };
};

window.renderNotifications = renderNotifications;

const fallbackData = {
    pageViews: 48320,
    uniqueUsers: 12840,
    avgSession: '4m 32s',
    bounceRate: '38%',
    dailyUsers: [120,145,132,189,201,178,220,195,240,215,198,230,260,245],
    roleDistribution: { admin: 12, user: 88 },
    enrollmentTrend: [40,55,48,72,68,91,85,110,98,125,140,132,158,170],
    topPaths: [
        { name:'Full Stack Dev', enrolled:1240 },
        { name:'Data Science',   enrolled:980  },
        { name:'UI/UX Design',   enrolled:760  },
        { name:'DevOps',         enrolled:540  },
        { name:'Cybersecurity',  enrolled:430  }
    ]
};

/**
 * Analytics Page Rendering
 */
async function renderAnalytics(container) {
    container.innerHTML = `
        <div class="header-actions mb-4" style="display:flex; justify-content:space-between; align-items:center;">
            <h2>System Analytics</h2>
            <div style="display:flex; gap:12px;">
                <button class="btn btn-ghost" onclick="renderAnalytics(document.getElementById('section-analytics'))">Refresh</button>
                <button class="btn btn-ghost" onclick="alert('Exporting Report...')">Export Report</button>
            </div>
        </div>

        <div id="analytics-overview" class="grid-stats mb-4">
            <div class="loading">Loading metrics...</div>
        </div>

        <div class="section-grid">
            <div class="card" id="bar-chart-wrap">
                <h3>Daily Active Users</h3>
                <div class="mt-4" style="height:220px;">
                    <svg id="bar-chart" width="100%" height="220" viewBox="0 0 700 220" preserveAspectRatio="none"></svg>
                </div>
            </div>
            <div class="card" id="line-chart-wrap">
                <h3>Enrollment Trend</h3>
                <div class="mt-4" style="height:220px;">
                    <svg id="line-chart" width="100%" height="200" viewBox="0 0 700 200">
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
                                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                        <path id="area-fill" fill="url(#lineGrad)"/>
                        <path id="line-path" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <div class="card" id="donut-wrap">
                <h3>User Role Distribution</h3>
                <div class="donut mt-4" id="role-donut"></div>
                <div class="chart-legend">
                    <span style="color:#0A84FF">● Admin</span>
                    <span style="color:#30D158">● User</span>
                </div>
            </div>
            <div class="card">
                <h3>Top Career Paths</h3>
                <div id="top-paths-list" class="mt-4"></div>
            </div>
        </div>
    `;

    try {
        let data;
        try {
            const overview = await api.get('/admin/analytics/overview');
            const userActivity = await api.get('/admin/analytics/user-activity');
            const roleDist = await api.get('/admin/analytics/role-distribution');
            const topPaths = await api.get('/admin/analytics/top-career-paths');
            
            data = {
                pageViews: overview.pageViews,
                uniqueUsers: overview.uniqueUsers,
                avgSession: overview.avgSessionTime,
                bounceRate: overview.bounceRate,
                dailyUsers: userActivity.data,
                roleDistribution: { 
                    admin: (roleDist.data[roleDist.labels.indexOf('admin')] || 12),
                    user: (roleDist.data[roleDist.labels.indexOf('user')] || 88)
                },
                enrollmentTrend: [40,55,48,72,68,91,85,110,98,125,140,132,158,170], // Fallback if not in API
                topPaths: topPaths
            };
        } catch (e) {
            console.warn('Analytics API failed, using fallback', e);
            data = fallbackData;
        }

        // Render Stats
        document.getElementById('analytics-overview').innerHTML = `
            <div class="card stat-card blue">
                <span class="stat-label">Page Views</span>
                <span class="stat-value">${data.pageViews.toLocaleString()}</span>
            </div>
            <div class="card stat-card green">
                <span class="stat-label">Unique Users</span>
                <span class="stat-value">${data.uniqueUsers.toLocaleString()}</span>
            </div>
            <div class="card stat-card gold">
                <span class="stat-label">Avg Session</span>
                <span class="stat-value">${data.avgSession}</span>
            </div>
            <div class="card stat-card purple">
                <span class="stat-label">Bounce Rate</span>
                <span class="stat-value">${data.bounceRate}</span>
            </div>
        `;

        // Render Bar Chart
        try { renderBarChart(data.dailyUsers); } catch(err) { console.error(err); }
        
        // Render Line Chart
        try { renderLineChart(data.enrollmentTrend); } catch(err) { console.error(err); }
        
        // Render Donut
        try { renderDonutChart(data.roleDistribution); } catch(err) { console.error(err); }

        // Render Top Paths
        document.getElementById('top-paths-list').innerHTML = data.topPaths.slice(0, 5).map(p => `
            <div class="mb-3">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                    <span>${p.name}</span>
                    <span class="text-muted">${p.enrolled || p.count}</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                    <div style="width:${(p.enrolled || p.count) / 1500 * 100}%; height:100%; background:var(--accent-blue);"></div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        container.innerHTML = `<div class="p-8 text-center text-muted">Analytics failed to load. Please try again.</div>`;
    }
}

function renderBarChart(data) {
    const svg = document.getElementById('bar-chart');
    if (!svg) return;
    const width = 700;
    const height = 220;
    const barSpacing = 10;
    const barWidth = (width / data.length) - barSpacing;
    const max = Math.max(...data) * 1.1;

    svg.innerHTML = data.map((d, i) => {
        const barHeight = (d / max) * height;
        const x = i * (barWidth + barSpacing);
        const y = height - barHeight;
        return `
            <rect x="${x}" y="${height}" width="${barWidth}" height="${barHeight}" 
                  fill="url(#barGrad)" rx="4" style="transform: scaleY(0); transform-origin: bottom; transition: transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s">
                <animate attributeName="y" from="${height}" to="${y}" dur="0.6s" fill="freeze" />
            </rect>
        `;
    }).join('') + `
        <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
        </defs>
    `;

    requestAnimationFrame(() => {
        svg.querySelectorAll('rect').forEach(rect => rect.style.transform = 'scaleY(1)');
    });
}

function renderLineChart(data) {
    const path = document.getElementById('line-path');
    const fill = document.getElementById('area-fill');
    if (!path) return;
    
    const width = 700;
    const height = 200;
    const max = Math.max(...data) * 1.2;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d / max) * height;
        return {x, y};
    });

    const d = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    path.setAttribute('d', d);
    fill.setAttribute('d', d + ` L ${width} ${height} L 0 ${height} Z`);

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)';
        path.style.strokeDashoffset = '0';
    });
}

function renderDonutChart(dist) {
    const donut = document.getElementById('role-donut');
    if (!donut) return;
    const adminPercent = (dist.admin / (dist.admin + dist.user)) * 100;
    donut.style.setProperty('--admin-pct', adminPercent);
}

window.renderAnalytics = renderAnalytics;

/**
 * Skills Page Rendering
 */
async function renderSkills(container) {
    container.innerHTML = `
        <div class="header-actions mb-4" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; gap:12px;">
                <input type="text" class="input-field" placeholder="Search skills..." style="width:250px;">
            </div>
            <button class="btn btn-primary" onclick="openAddSkillModal()">+ Add New Skill</button>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Skill</th>
                            <th>Category</th>
                            <th>Demand Level</th>
                            <th>Trending</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="skills-tbody">
                        <tr class="loading"><td colspan="5">Loading skills...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        const { skills } = await api.get('/admin/skills');
        const tbody = document.getElementById('skills-tbody');
        
        tbody.innerHTML = skills.map(s => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.category}</td>
                <td><span class="badge ${s.demandLevel === 'High' ? 'badge-active' : 'badge-pending'}">${s.demandLevel}</span></td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${s.trending ? 'checked' : ''} onchange="toggleSkillTrending('${s._id}', this.checked)">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="deleteSkill('${s._id}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-muted">No skills found.</td></tr>';
    } catch (err) {
        document.getElementById('skills-tbody').innerHTML = `<tr><td colspan="5" class="error-msg">${err.message}</td></tr>`;
    }
}

window.openAddSkillModal = function() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    content.innerHTML = `
        <h2 class="mb-4">Add Skill</h2>
        <form id="add-skill-form">
            <div class="input-group">
                <label class="input-label">Skill Name</label>
                <input type="text" name="name" class="input-field" required>
            </div>
            <div class="input-group">
                <label class="input-label">Category</label>
                <input type="text" name="category" class="input-field" placeholder="e.g. Frontend" required>
            </div>
            <div class="input-group">
                <label class="input-label">Demand Level</label>
                <select name="demandLevel" class="input-field">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div style="display:flex; gap:12px; margin-top:24px;">
                <button type="submit" class="btn btn-primary flex-1">Add Skill</button>
                <button type="button" class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('add-skill-form').onsubmit = async (e) => {
        e.preventDefault();
        const body = Object.fromEntries(new FormData(e.target).entries());
        try {
            await api.post('/admin/skills', body);
            closeModal();
            renderSkills(document.getElementById('section-skills'));
        } catch (err) { alert(err.message); }
    };
};

window.toggleSkillTrending = async (id, trending) => {
    await api.put(`/admin/skills/${id}`, { trending });
};

window.deleteSkill = async (id) => {
    if(confirm('Delete skill?')) {
        await api.delete(`/admin/skills/${id}`);
        renderSkills(document.getElementById('section-skills'));
    }
};

/**
 * Feedback Page Rendering
 */
async function renderFeedback(container) {
    container.innerHTML = `
        <div class="header-actions mb-4">
            <div style="display:flex; gap:12px;">
                <button class="btn btn-primary btn-sm">All Feedback</button>
                <button class="btn btn-ghost btn-sm">Pending</button>
            </div>
        </div>
        <div id="feedback-list" class="section-grid">
            <div class="loading">Loading feedback...</div>
        </div>
    `;

    try {
        const { feedbacks } = await api.get('/admin/feedback');
        const list = document.getElementById('feedback-list');
        
        list.innerHTML = feedbacks.map(f => `
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                    <div>
                        <div style="font-weight:600;">${f.user?.name || 'Anonymous'}</div>
                        <div class="text-muted" style="font-size:0.8rem;">${new Date(f.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style="color:var(--accent-gold);">
                        ${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}
                    </div>
                </div>
                <p style="font-size:0.9rem; line-height:1.5; margin-bottom:16px;">"${f.message}"</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge ${f.status === 'Resolved' ? 'badge-active' : 'badge-pending'}">${f.status}</span>
                    <div style="display:flex; gap:8px;">
                        ${f.status !== 'Resolved' ? `<button class="btn btn-ghost btn-sm" onclick="resolveFeedback('${f._id}')">Resolve</button>` : ''}
                        <button class="btn btn-ghost btn-sm" onclick="replyFeedback('${f._id}')">Reply</button>
                    </div>
                </div>
            </div>
        `).join('') || '<p class="text-muted">No feedback received yet.</p>';
    } catch (err) {
        document.getElementById('feedback-list').innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
}

window.resolveFeedback = async (id) => {
    await api.put(`/admin/feedback/${id}/status`, { status: 'Resolved' });
    renderFeedback(document.getElementById('section-feedback'));
};

window.replyFeedback = (id) => {
    const modal = document.getElementById('modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
    document.getElementById('modal-content').innerHTML = `
        <h2>Reply to Feedback</h2>
        <textarea class="input-field mt-4" rows="4" placeholder="Type your reply..."></textarea>
        <div class="mt-4" style="display:flex; gap:12px;">
            <button class="btn btn-primary flex-1" onclick="closeModal()">Send Reply</button>
            <button class="btn btn-ghost flex-1" onclick="closeModal()">Cancel</button>
        </div>
    `;
};

window.renderSkills = renderSkills;
window.renderFeedback = renderFeedback;
