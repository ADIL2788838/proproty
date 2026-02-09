/**
 * SF Real Estate - Mock Database & Data Layer
 * Handles all CRUD operations using LocalStorage
 */

const DB_KEY = 'sf_real_estate_db';

const initialData = {
    users: [
        { id: 1, name: 'Sohail Ahmed (Admin)', email: 'admin@zainabbuilders.com', password: '123', role: 'admin' },
        { id: 2, name: 'Zainab Builders', email: 'Sohailahmedzproperty@gmail.com', password: '123', role: 'seller', phone: '0334-9467334' },
        { id: 3, name: 'Zara Buyer', email: 'buyer@test.com', password: '123', role: 'buyer', phone: '0321-7654321' },

        { id: 4, name: 'BuildIt Construction', email: 'construction@sf.com', password: '123', role: 'construction', phone: '042-111222333', serviceType: 'General Construction' }
    ],
    properties: [
        {
            id: 101,
            sellerId: 2,
            title: 'Luxury Villa in Bahria Town',
            type: 'House',
            mode: 'Sale',
            price: 50000000,
            city: 'Karachi',
            area: 'Bahria Town',
            description: '500 Sq Yd luxury villa with 5 bedrooms, swimming pool, and servant quarter.',
            image: 'https://images.unsplash.com/photo-1628151016892-35327aa4972e?q=80&w=2070&auto=format&fit=crop',
            status: 'approved',
            isFeatured: true,
            dateAdded: '2026-02-01'
        },
        {
            id: 102,
            sellerId: 2,
            title: '1 Kanal Plot in DHA Phase 8',
            type: 'Plot',
            mode: 'Sale',
            price: 35000000,
            city: 'Lahore',
            area: 'DHA Phase 8',
            description: 'Prime location plot near park and mosque.',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop',
            status: 'pending',
            isFeatured: false,
            dateAdded: '2026-02-08'
        }
    ],
    services: [
        {
            id: 201,
            companyId: 4,
            title: 'Home Construction Service',
            description: 'Grey structure and finishing with A+ material.',
            priceRange: '3500 - 4500 per sq ft'
        }
    ]
};

const db = {
    init: () => {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify(initialData));
            console.log('Database initialized.');
        }
    },

    getAll: () => {
        return JSON.parse(localStorage.getItem(DB_KEY)) || initialData;
    },

    save: (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    // --- Users ---
    addUser: (user) => {
        const data = db.getAll();
        user.id = Date.now();
        data.users.push(user);
        db.save(data);
        return user;
    },

    findUser: (email, password) => {
        const data = db.getAll();
        return data.users.find(u => u.email === email && u.password === password);
    },

    // --- Properties ---
    getProperties: () => {
        return db.getAll().properties;
    },

    addProperty: (property) => {
        const data = db.getAll();
        property.id = Date.now();
        property.status = 'pending'; // Default status
        property.dateAdded = new Date().toISOString().split('T')[0];
        data.properties.push(property);
        db.save(data);
        return property;
    },

    updatePropertyStatus: (id, status) => {
        const data = db.getAll();
        const prop = data.properties.find(p => p.id == id); // loose equality for string/number
        if (prop) {
            prop.status = status;
            db.save(data);
        }
    },

    // --- Services ---
    getServices: () => {
        return db.getAll().services;
    },

    addService: (service) => {
        const data = db.getAll();
        service.id = Date.now();
        data.services.push(service);
        db.save(data);
        return service;
    }
};

// Initialize on load
db.init();
