// Dashboard Controller

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth
    auth.requireAuth();

    const user = auth.getUser();
    if (!user) return; // Should have redirected

    // 2. Populate Header
    document.getElementById('userName').textContent = `Welcome, ${user.name}`;
    document.getElementById('userRole').textContent = `Role: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;

    // 3. Render View based on Role
    renderDashboard(user);

    // 4. Initialize Forms
    initForms(user);
});

function renderDashboard(user) {
    // Hide all sections first
    document.querySelectorAll('.dashboard-section').forEach(el => el.classList.remove('active'));

    switch (user.role) {
        case 'admin':
            document.getElementById('admin-dashboard').classList.add('active');
            renderAdminView();
            break;
        case 'seller':
            document.getElementById('seller-dashboard').classList.add('active');
            renderSellerView(user.id);
            break;
        case 'buyer':
            document.getElementById('buyer-dashboard').classList.add('active');
            break;
        case 'construction':
            document.getElementById('construction-dashboard').classList.add('active');
            break;
    }
}

// --- ADMIN VIEW ---
function renderAdminView() {
    const tbody = document.getElementById('admin-tbody');
    const properties = db.getProperties(); // Get all
    tbody.innerHTML = '';

    properties.forEach(prop => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prop.title}</td>
            <td>${prop.type} (${prop.mode})</td>
            <td>PKR ${prop.price.toLocaleString()}</td>
            <td>Seller ID: ${prop.sellerId}</td>
            <td><span class="status-badge status-${prop.status}">${prop.status}</span></td>
            <td>
                ${prop.status === 'pending' ? `
                    <button onclick="updateStatus(${prop.id}, 'approved')" style="color:green; cursor:pointer; margin-right:10px;">Approve</button>
                    <button onclick="updateStatus(${prop.id}, 'rejected')" style="color:red; cursor:pointer;">Reject</button>
                ` : '-'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStatus(id, status) {
    db.updatePropertyStatus(id, status);
    renderAdminView(); // Re-render
}

// --- SELLER VIEW ---
function renderSellerView(sellerId) {
    const tbody = document.getElementById('seller-tbody');
    const properties = db.getProperties().filter(p => p.sellerId === sellerId);
    tbody.innerHTML = '';

    if (properties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No properties listed yet.</td></tr>';
        return;
    }

    properties.forEach(prop => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prop.title}</td>
            <td>${prop.type}</td>
            <td><span class="status-badge status-${prop.status}">${prop.status}</span></td>
            <td>PKR ${prop.price.toLocaleString()}</td>
            <td>${prop.dateAdded || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function showAddPropertyForm() {
    document.getElementById('seller-list-view').style.display = 'none';
    document.getElementById('add-property-form').style.display = 'block';
}

function hideAddPropertyForm() {
    document.getElementById('seller-list-view').style.display = 'block';
    document.getElementById('add-property-form').style.display = 'none';
}

// --- FORM HANDLING ---
function initForms(user) {
    const propForm = document.getElementById('propertyForm');
    if (propForm) {
        propForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newProp = {
                sellerId: user.id,
                title: document.getElementById('propTitle').value,
                type: document.getElementById('propType').value,
                mode: document.getElementById('propMode').value,
                price: parseInt(document.getElementById('propPrice').value),
                city: document.getElementById('propCity').value,
                area: document.getElementById('propArea').value,
                image: document.getElementById('propImage').value,
                description: document.getElementById('propDesc').value,
                isFeatured: false
            };

            db.addProperty(newProp);
            alert('Property Submitted! Waiting for Admin Approval.');
            propForm.reset();
            hideAddPropertyForm();
            renderSellerView(user.id);
        });
    }
}
