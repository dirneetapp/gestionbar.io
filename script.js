// Script principal para la carta de Bar Sergio's
// Este archivo maneja la carga y visualización de categorías y productos

// Variables globales
let currentCategory = null;

// Función para inicializar la aplicación
function initApp() {
    // Inicializar almacenamiento local
    initializeLocalStorage();
    
    // Cargar categorías
    loadCategories();
    
    // Configurar eventos
    setupEventListeners();
}

// Función para cargar categorías
function loadCategories() {
    const categoryList = document.getElementById('categoryList');
    
    if (!categoryList) return;
    
    // Limpiar lista
    categoryList.innerHTML = '';
    
    // Obtener categorías
    const categories = LocalStorageManager.getCategories();
    
    if (!categories || categories.length === 0) {
        categoryList.innerHTML = '<div class="empty-message">No hay categorías disponibles</div>';
        return;
    }
    
    // Ordenar categorías
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    
    // Crear elemento para cada categoría
    sortedCategories.forEach(category => {
        if (!category.isActive) return;
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.id = category.id;
        
        categoryItem.innerHTML = `
            <i class="fas fa-${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        categoryItem.addEventListener('click', () => {
            selectCategory(category.id);
        });
        
        categoryList.appendChild(categoryItem);
    });
    
    // Seleccionar primera categoría por defecto
    if (sortedCategories.length > 0 && sortedCategories[0].isActive) {
        selectCategory(sortedCategories[0].id);
    }
}

// Función para seleccionar categoría
function selectCategory(categoryId) {
    // Actualizar categoría actual
    currentCategory = categoryId;
    
    // Actualizar selección visual
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === categoryId) {
            item.classList.add('active');
        }
    });
    
    // Cargar productos de la categoría
    loadProducts(categoryId);
}

// Función para cargar productos
function loadProducts(categoryId) {
    const productGrid = document.getElementById('productGrid');
    
    if (!productGrid) return;
    
    // Limpiar contenedor
    productGrid.innerHTML = '';
    
    // Obtener productos
    const productsData = LocalStorageManager.getProducts();
    
    if (!productsData || !productsData[categoryId]) {
        productGrid.innerHTML = '<div class="empty-message">No hay productos en esta categoría</div>';
        return;
    }
    
    // Filtrar productos disponibles
    const categoryProducts = productsData[categoryId].filter(product => product.isAvailable !== false);
    
    if (categoryProducts.length === 0) {
        productGrid.innerHTML = '<div class="empty-message">No hay productos disponibles en esta categoría</div>';
        return;
    }
    
    // Crear elemento para cada producto
    categoryProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        if (product.isSpecialOffer) {
            productCard.classList.add('special-offer');
        }
        
        // Obtener nombre y descripción del producto
        const nombre = product.nombre || product.name;
        const descripcion = product.descripcion || product.description;
        const precio = product.precio || product.price;
        
        // Crear badges para características especiales
        let badgesHTML = '';
        if (product.isSpecialOffer) {
            badgesHTML += '<span class="product-badge badge-special">Especial</span>';
        }
        if (product.isVegetarian) {
            badgesHTML += '<span class="product-badge badge-vegetarian">Vegetariano</span>';
        }
        if (product.isVegan) {
            badgesHTML += '<span class="product-badge badge-vegan">Vegano</span>';
        }
        if (product.isGlutenFree) {
            badgesHTML += '<span class="product-badge badge-gluten-free">Sin Gluten</span>';
        }
        
        // Crear HTML para alérgenos
        let allergensHTML = '';
        if (product.allergens && product.allergens.length > 0) {
            allergensHTML = `
                <div class="allergens-container">
                    ${product.allergens.map(allergen => `
                        <span class="allergen-tag">${allergen}</span>
                    `).join('')}
                </div>
            `;
        }
        
        // Crear HTML para nivel de picante
        let spicyHTML = '';
        if (product.spicyLevel) {
            const level = parseInt(product.spicyLevel);
            spicyHTML = `
                <div class="spicy-level">
                    <span class="spicy-level-text">Picante:</span>
                    <div class="spicy-indicator">
                        ${Array(3).fill().map((_, i) => `
                            <span class="spicy-dot ${i < level ? '' : 'inactive'}"></span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        productCard.innerHTML = `
            <div class="product-info">
                <h3 class="product-title">${nombre}</h3>
                <p class="product-description">${descripcion}</p>
                <div class="product-price">${precio}</div>
                ${allergensHTML}
                ${spicyHTML}
            </div>
            <div class="product-badges">
                ${badgesHTML}
            </div>
        `;
        
        productCard.addEventListener('click', () => {
            showProductDetails(product);
        });
        
        productGrid.appendChild(productCard);
    });
}

// Función para mostrar detalles de producto
function showProductDetails(product) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Obtener nombre y descripción del producto
    const nombre = product.nombre || product.name;
    const descripcion = product.descripcion || product.description;
    const precio = product.precio || product.price;
    
    // Crear badges para características especiales
    let badgesHTML = '';
    if (product.isSpecialOffer) {
        badgesHTML += '<span class="product-badge badge-special">Especial</span>';
    }
    if (product.isVegetarian) {
        badgesHTML += '<span class="product-badge badge-vegetarian">Vegetariano</span>';
    }
    if (product.isVegan) {
        badgesHTML += '<span class="product-badge badge-vegan">Vegano</span>';
    }
    if (product.isGlutenFree) {
        badgesHTML += '<span class="product-badge badge-gluten-free">Sin Gluten</span>';
    }
    
    // Crear HTML para alérgenos
    let allergensHTML = '';
    if (product.allergens && product.allergens.length > 0) {
        allergensHTML = `
            <div class="product-detail-section">
                <h4>Alérgenos</h4>
                <div class="allergens-container">
                    ${product.allergens.map(allergen => `
                        <span class="allergen-tag">${allergen}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Crear HTML para nivel de picante
    let spicyHTML = '';
    if (product.spicyLevel) {
        const level = parseInt(product.spicyLevel);
        spicyHTML = `
            <div class="product-detail-section">
                <h4>Nivel de Picante</h4>
                <div class="spicy-level">
                    <div class="spicy-indicator">
                        ${Array(3).fill().map((_, i) => `
                            <span class="spicy-dot ${i < level ? '' : 'inactive'}"></span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Contenido del modal
    modal.innerHTML = `
        <div class="modal-content animate-slide-up">
            <button class="modal-close">&times;</button>
            <div class="product-detail-header">
                <h2>${nombre}</h2>
                <div class="product-badges">
                    ${badgesHTML}
                </div>
            </div>
            <div class="product-detail-body">
                <p class="product-detail-description">${descripcion}</p>
                <div class="product-detail-price">${precio}</div>
                ${allergensHTML}
                ${spicyHTML}
            </div>
        </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(modal);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Configurar evento para cerrar
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(modal);
        });
    }
    
    // También cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
}

// Función para cerrar modal
function closeModal(modal) {
    // Animar cierre
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.classList.remove('animate-slide-up');
        content.classList.add('animate-fade-out');
        
        setTimeout(() => {
            document.body.removeChild(modal);
            // Restaurar scroll
            document.body.style.overflow = '';
        }, 300);
    } else {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
}

// Función para configurar event listeners
function setupEventListeners() {
    // Alternar modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

// Función para alternar modo oscuro
function toggleDarkMode() {
    const body = document.body;
    const icon = document.querySelector('#darkModeToggle i');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Guardar preferencia
    const preferences = LocalStorageManager.getUserPreferences() || {};
    preferences.darkMode = body.classList.contains('dark-mode');
    LocalStorageManager.saveUserPreferences(preferences);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
