// Módulo de almacenamiento local para Bar Sergio's
// Este archivo maneja todas las operaciones de localStorage

// Objeto global para gestionar el almacenamiento local
const LocalStorageManager = {
    // Claves para localStorage
    KEYS: {
        CATEGORIES: 'bar_sergios_categories',
        PRODUCTS: 'bar_sergios_products',
        SETTINGS: 'bar_sergios_settings',
        TABLES: 'bar_sergios_tables',
        ORDERS: 'bar_sergios_orders',
        ACCESS_COUNTER: 'bar_sergios_access_counter',
        USER_PREFERENCES: 'bar_sergios_user_preferences',
        LAST_VISIT: 'bar_sergios_last_visit'
    },
    
    // Incrementar contador de accesos
    incrementAccessCounter: function() {
        let counter = this.getAccessCounter() || 0;
        counter++;
        localStorage.setItem(this.KEYS.ACCESS_COUNTER, counter);
        return counter;
    },
    
    // Obtener contador de accesos
    getAccessCounter: function() {
        const counter = localStorage.getItem(this.KEYS.ACCESS_COUNTER);
        return counter ? parseInt(counter) : 0;
    },
    
    // Guardar categorías
    saveCategories: function(categories) {
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    },
    
    // Obtener categorías
    getCategories: function() {
        const data = localStorage.getItem(this.KEYS.CATEGORIES);
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar productos
    saveProducts: function(products) {
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    },
    
    // Obtener productos
    getProducts: function() {
        const data = localStorage.getItem(this.KEYS.PRODUCTS);
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar configuración
    saveSettings: function(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },
    
    // Obtener configuración
    getSettings: function() {
        const data = localStorage.getItem(this.KEYS.SETTINGS);
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar mesas
    saveTables: function(tables) {
        localStorage.setItem(this.KEYS.TABLES, JSON.stringify(tables));
    },
    
    // Obtener mesas
    getTables: function() {
        const data = localStorage.getItem(this.KEYS.TABLES);
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar pedidos
    saveOrders: function(orders) {
        localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    },
    
    // Obtener pedidos
    getOrders: function() {
        const data = localStorage.getItem(this.KEYS.ORDERS);
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar preferencias de usuario
    saveUserPreferences: function(preferences) {
        localStorage.setItem(this.KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    },
    
    // Obtener preferencias de usuario
    getUserPreferences: function() {
        const data = localStorage.getItem(this.KEYS.USER_PREFERENCES);
        return data ? JSON.parse(data) : null;
    },
    
    // Registrar visita
    recordVisit: function() {
        const now = new Date().toISOString();
        localStorage.setItem(this.KEYS.LAST_VISIT, now);
        return now;
    },
    
    // Obtener última visita
    getLastVisit: function() {
        return localStorage.getItem(this.KEYS.LAST_VISIT);
    },
    
    // Exportar todos los datos
    exportData: function() {
        return {
            categories: this.getCategories(),
            products: this.getProducts(),
            settings: this.getSettings(),
            tables: this.getTables(),
            orders: this.getOrders(),
            accessCounter: this.getAccessCounter(),
            userPreferences: this.getUserPreferences(),
            lastVisit: this.getLastVisit(),
            exportDate: new Date().toISOString()
        };
    },
    
    // Importar datos
    importData: function(data) {
        if (data.categories) this.saveCategories(data.categories);
        if (data.products) this.saveProducts(data.products);
        if (data.settings) this.saveSettings(data.settings);
        if (data.tables) this.saveTables(data.tables);
        if (data.orders) this.saveOrders(data.orders);
        if (data.accessCounter) localStorage.setItem(this.KEYS.ACCESS_COUNTER, data.accessCounter);
        if (data.userPreferences) this.saveUserPreferences(data.userPreferences);
        if (data.lastVisit) localStorage.setItem(this.KEYS.LAST_VISIT, data.lastVisit);
        
        return true;
    },
    
    // Limpiar todos los datos
    clearAll: function() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

// Función para inicializar el almacenamiento local
function initializeLocalStorage() {
    // Incrementar contador de accesos
    const counter = LocalStorageManager.incrementAccessCounter();
    
    // Actualizar contador en la interfaz
    const counterElement = document.getElementById('accessCounter');
    if (counterElement) {
        counterElement.querySelector('span').textContent = `Pax: ${counter}`;
    }
    
    // Registrar visita
    LocalStorageManager.recordVisit();
    
    // Inicializar datos si no existen
    initializeDataIfNeeded();
    
    // Cargar preferencias de usuario
    loadUserPreferences();
}

// Función para inicializar datos si no existen
function initializeDataIfNeeded() {
    // Verificar si existen categorías
    if (!LocalStorageManager.getCategories()) {
        // Crear categorías predeterminadas
        const defaultCategories = [
            { id: 'desayunos', name: 'Desayunos', icon: 'coffee', order: 1, isActive: true },
            { id: 'bocadillos', name: 'Bocadillos', icon: 'bread-slice', order: 2, isActive: true },
            { id: 'vermuts', name: 'Vermuts', icon: 'glass-martini-alt', order: 3, isActive: true },
            { id: 'tapas', name: 'Tapas', icon: 'utensils', order: 4, isActive: true },
            { id: 'torradas', name: 'Torradas', icon: 'pizza-slice', order: 5, isActive: true },
            { id: 'tablas', name: 'Tablas', icon: 'cheese', order: 6, isActive: true },
            { id: 'especiales', name: 'Especiales', icon: 'star', order: 7, isActive: true },
            { id: 'croquetas', name: 'Croquetas', icon: 'circle', order: 8, isActive: true },
            { id: 'postres', name: 'Postres', icon: 'ice-cream', order: 9, isActive: true },
            { id: 'tapasmes', name: 'Tapas del Mes', icon: 'calendar-alt', order: 10, isActive: true }
        ];
        
        LocalStorageManager.saveCategories(defaultCategories);
    }
    
    // Verificar si existen productos
    if (!LocalStorageManager.getProducts()) {
        // Crear productos predeterminados
        const defaultProducts = {
            desayunos: [
                { id: 'cafe_leche', nombre: 'Café con Leche', descripcion: 'Café espresso con leche caliente', precio: '1.50 €', isAvailable: true },
                { id: 'cafe_solo', nombre: 'Café Solo', descripcion: 'Café espresso intenso', precio: '1.20 €', isAvailable: true },
                { id: 'tostada_tomate', nombre: 'Tostada con Tomate', descripcion: 'Tostada con tomate rallado y aceite de oliva', precio: '2.00 €', isAvailable: true },
                { id: 'tostada_mantequilla', nombre: 'Tostada con Mantequilla y Mermelada', descripcion: 'Tostada con mantequilla y mermelada a elegir', precio: '2.20 €', isAvailable: true },
                { id: 'croissant', nombre: 'Croissant', descripcion: 'Croissant recién horneado', precio: '1.50 €', isAvailable: true },
                { id: 'zumo_naranja', nombre: 'Zumo de Naranja Natural', descripcion: 'Zumo de naranja recién exprimido', precio: '2.50 €', isAvailable: true }
            ],
            bocadillos: [
                { id: 'bocadillo_jamon', nombre: 'Bocadillo de Jamón Serrano', descripcion: 'Pan crujiente con jamón serrano', precio: '4.50 €', isAvailable: true },
                { id: 'bocadillo_tortilla', nombre: 'Bocadillo de Tortilla', descripcion: 'Pan con tortilla de patatas casera', precio: '4.00 €', isAvailable: true },
                { id: 'bocadillo_queso', nombre: 'Bocadillo de Queso', descripcion: 'Pan con queso manchego', precio: '3.80 €', isAvailable: true },
                { id: 'bocadillo_vegetal', nombre: 'Bocadillo Vegetal', descripcion: 'Pan con lechuga, tomate, cebolla, atún y mayonesa', precio: '4.20 €', isAvailable: true },
                { id: 'bocadillo_lomo', nombre: 'Bocadillo de Lomo', descripcion: 'Pan con lomo a la plancha y pimientos', precio: '4.80 €', isAvailable: true }
            ],
            vermuts: [
                { id: 'vermut_casero', nombre: 'Vermut Casero', descripcion: 'Vermut elaborado en casa', precio: '2.50 €', isAvailable: true, isSpecialOffer: true },
                { id: 'vermut_rojo', nombre: 'Vermut Rojo', descripcion: 'Vermut rojo con aceituna y naranja', precio: '3.00 €', isAvailable: true },
                { id: 'vermut_blanco', nombre: 'Vermut Blanco', descripcion: 'Vermut blanco con limón', precio: '3.00 €', isAvailable: true }
            ],
            tapas: [
                { id: 'patatas_bravas', nombre: 'Patatas Bravas', descripcion: 'Patatas fritas con salsa brava picante', precio: '4.50 €', isAvailable: true, spicyLevel: 2 },
                { id: 'calamares_romana', nombre: 'Calamares a la Romana', descripcion: 'Calamares rebozados con limón', precio: '6.50 €', isAvailable: true, allergens: ['Gluten', 'Moluscos'] },
                { id: 'boquerones_vinagre', nombre: 'Boquerones en Vinagre', descripcion: 'Boquerones marinados en vinagre y ajo', precio: '5.00 €', isAvailable: true, allergens: ['Pescado'] },
                { id: 'ensaladilla_rusa', nombre: 'Ensaladilla Rusa', descripcion: 'Ensaladilla con patata, zanahoria, guisantes y mayonesa', precio: '4.80 €', isAvailable: true },
                { id: 'croquetas_jamon', nombre: 'Croquetas Caseras', descripcion: 'Croquetas caseras de jamón', precio: '5.50 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'] },
                { id: 'pulpo_gallega', nombre: 'Pulpo a la Gallega', descripcion: 'Pulpo con pimentón, aceite de oliva y sal', precio: '9.50 €', isAvailable: true, allergens: ['Moluscos'] }
            ],
            torradas: [
                { id: 'torrada_jamon_queso', nombre: 'Torrada de Jamón y Queso', descripcion: 'Pan tostado con jamón serrano y queso fundido', precio: '5.50 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'] },
                { id: 'torrada_escalivada', nombre: 'Torrada de Escalivada', descripcion: 'Pan tostado con pimientos y berenjenas asadas', precio: '5.00 €', isAvailable: true, allergens: ['Gluten'], isVegetarian: true, isVegan: true },
                { id: 'torrada_sobrasada', nombre: 'Torrada de Sobrasada', descripcion: 'Pan tostado con sobrasada y miel', precio: '4.80 €', isAvailable: true, allergens: ['Gluten'] }
            ],
            tablas: [
                { id: 'tabla_quesos', nombre: 'Tabla de Quesos', descripcion: 'Selección de quesos variados con nueces y mermelada', precio: '12.00 €', isAvailable: true, allergens: ['Lácteos', 'Frutos secos'], isVegetarian: true },
                { id: 'tabla_ibericos', nombre: 'Tabla de Ibéricos', descripcion: 'Selección de embutidos ibéricos', precio: '14.00 €', isAvailable: true },
                { id: 'tabla_mixta', nombre: 'Tabla Mixta', descripcion: 'Selección de quesos e ibéricos', precio: '15.00 €', isAvailable: true, allergens: ['Lácteos'] }
            ],
            especiales: [
                { id: 'hamburguesa_casera', nombre: 'Hamburguesa Casera', descripcion: 'Hamburguesa de ternera con queso, lechuga y tomate', precio: '8.50 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'] },
                { id: 'sandwich_club', nombre: 'Sándwich Club', descripcion: 'Sándwich con pollo, bacon, lechuga, tomate y mayonesa', precio: '7.50 €', isAvailable: true, allergens: ['Gluten', 'Huevo'] },
                { id: 'huevos_rotos', nombre: 'Huevos Rotos con Jamón', descripcion: 'Huevos fritos sobre patatas con jamón ibérico', precio: '9.00 €', isAvailable: true, allergens: ['Huevo'] }
            ],
            croquetas: [
                { id: 'croquetas_jamon_ibericas', nombre: 'Croquetas de Jamón', descripcion: 'Croquetas caseras de jamón ibérico (6 uds)', precio: '6.00 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'] },
                { id: 'croquetas_boletus', nombre: 'Croquetas de Boletus', descripcion: 'Croquetas caseras de boletus (6 uds)', precio: '6.50 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'], isVegetarian: true },
                { id: 'croquetas_queso_azul', nombre: 'Croquetas de Queso Azul', descripcion: 'Croquetas caseras de queso azul (6 uds)', precio: '6.50 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'], isVegetarian: true },
                { id: 'croquetas_pollo', nombre: 'Croquetas de Pollo', descripcion: 'Croquetas caseras de pollo (6 uds)', precio: '6.00 €', isAvailable: true, allergens: ['Gluten', 'Lácteos'] }
            ],
            postres: [
                { id: 'flan_casero', nombre: 'Flan Casero', descripcion: 'Flan casero con caramelo', precio: '4.00 €', isAvailable: true, allergens: ['Lácteos', 'Huevo'], isVegetarian: true },
                { id: 'tarta_queso', nombre: 'Tarta de Queso', descripcion: 'Tarta de queso casera', precio: '4.50 €', isAvailable: true, allergens: ['Lácteos', 'Huevo', 'Gluten'], isVegetarian: true },
                { id: 'crema_catalana', nombre: 'Crema Catalana', descripcion: 'Crema catalana con azúcar caramelizado', precio: '4.50 €', isAvailable: true, allergens: ['Lácteos', 'Huevo'], isVegetarian: true },
                { id: 'fruta_tiempo', nombre: 'Fruta del Tiempo', descripcion: 'Selección de fruta fresca', precio: '3.50 €', isAvailable: true, isVegetarian: true, isVegan: true, isGlutenFree: true }
            ],
            tapasmes: [
                { id: 'tapa_mes_1', nombre: 'Tapa del Mes 1', descripcion: 'Consulte nuestra tapa especial del mes', precio: '6.50 €', isAvailable: true, isSpecialOffer: true },
                { id: 'tapa_mes_2', nombre: 'Tapa del Mes 2', descripcion: 'Consulte nuestra segunda tapa especial del mes', precio: '7.00 €', isAvailable: true, isSpecialOffer: true }
            ]
        };
        
        LocalStorageManager.saveProducts(defaultProducts);
    }
    
    // Verificar si existe configuración
    if (!LocalStorageManager.getSettings()) {
        // Crear configuración predeterminada
        const defaultSettings = {
            restaurantName: 'Bar Sergio\'s',
            address: 'Calle Principal 123, Ciudad',
            phone: '123-456-789',
            email: 'info@barsergios.com',
            taxRate: 10,
            currency: '€',
            language: 'es',
            theme: 'light',
            features: {
                enableReservations: true,
                enableOnlineOrders: false,
                enableRatings: true,
                enableAllergenInfo: true,
                enableNutritionalInfo: false,
                enableDarkMode: false
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        LocalStorageManager.saveSettings(defaultSettings);
    }
    
    // Verificar si existen mesas
    if (!LocalStorageManager.getTables()) {
        // Crear mesas predeterminadas
        const defaultTables = [
            { id: 'mesa_1', name: 'Mesa 1', capacity: 4, isActive: true, type: 'table' },
            { id: 'mesa_2', name: 'Mesa 2', capacity: 4, isActive: true, type: 'table' },
            { id: 'mesa_3', name: 'Mesa 3', capacity: 2, isActive: true, type: 'table' },
            { id: 'mesa_4', name: 'Mesa 4', capacity: 6, isActive: true, type: 'table' },
            { id: 'mesa_5', name: 'Mesa 5', capacity: 4, isActive: true, type: 'table' },
            { id: 'mesa_6', name: 'Mesa 6', capacity: 2, isActive: true, type: 'table' },
            { id: 'barra_1', name: 'Barra 1', capacity: 1, isActive: true, type: 'bar' },
            { id: 'barra_2', name: 'Barra 2', capacity: 1, isActive: true, type: 'bar' },
            { id: 'barra_3', name: 'Barra 3', capacity: 1, isActive: true, type: 'bar' },
            { id: 'barra_4', name: 'Barra 4', capacity: 1, isActive: true, type: 'bar' },
            { id: 'barra_5', name: 'Barra 5', capacity: 1, isActive: true, type: 'bar' }
        ];
        
        LocalStorageManager.saveTables(defaultTables);
    }
}

// Función para cargar preferencias de usuario
function loadUserPreferences() {
    const preferences = LocalStorageManager.getUserPreferences();
    
    if (preferences) {
        // Aplicar modo oscuro si está habilitado
        if (preferences.darkMode) {
            document.body.classList.add('dark-mode');
            
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                const icon = darkModeToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        }
    }
}
