// Panel de Administración para Bar Sergio's
// Este archivo implementa todas las funcionalidades del panel de administración

// Función de inicialización global que será llamada desde admin-access.js
function initAdminPanel() {
    // Crear instancia del panel y inicializarlo
    window.AdminPanel = new AdminPanel();
    window.AdminPanel.initialize();
    window.AdminPanel.open();
}

class AdminPanel {
    constructor() {
        this.isOpen = false;
        this.activeTab = 'categories';
        this.editingCategoryId = null;
        this.editingProductId = null;
        this.editingProductCategory = null;
    }

    // Inicializar el panel de administración
    initialize() {
        // Crear el panel si no existe
        this.createAdminPanel();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Cargar datos iniciales
        this.loadInitialData();
    }

    // Crear el panel de administración
    createAdminPanel() {
        // Verificar si ya existe
        if (document.getElementById('adminPanel')) return;
        
        // Crear el elemento del panel
        const adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.className = 'admin-panel';
        adminPanel.style.display = 'none';
        
        // Estructura HTML del panel
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h2>Panel de Administración</h2>
                <button id="closeAdminBtn" class="admin-close-btn">&times;</button>
            </div>
            <div class="admin-tabs">
                <button class="admin-tab-btn active" data-tab="categories">Categorías</button>
                <button class="admin-tab-btn" data-tab="products">Productos</button>
                <button class="admin-tab-btn" data-tab="settings">Configuración</button>
                <button class="admin-tab-btn" data-tab="export">Exportar</button>
                <button class="admin-tab-btn" data-tab="tpv">TPV</button>
                <button class="admin-tab-btn" data-tab="stats">Estadísticas</button>
            </div>
            <div class="admin-content">
                <!-- Pestaña de Categorías -->
                <div class="admin-tab-content active" id="categories-tab">
                    <h3>Gestión de Categorías</h3>
                    <div class="admin-actions">
                        <button id="addCategoryBtn" class="admin-btn">Añadir Categoría</button>
                    </div>
                    <div class="admin-list" id="categoriesList">
                        <!-- Las categorías se cargarán dinámicamente -->
                    </div>
                </div>

                <!-- Pestaña de Productos -->
                <div class="admin-tab-content" id="products-tab">
                    <h3>Gestión de Productos</h3>
                    <div class="admin-actions">
                        <button id="addProductBtn" class="admin-btn">Añadir Producto</button>
                        <select id="filterCategorySelect" class="admin-select">
                            <option value="">Todas las categorías</option>
                        </select>
                    </div>
                    <div class="admin-list" id="productsList">
                        <!-- Los productos se cargarán dinámicamente -->
                    </div>
                </div>

                <!-- Pestaña de Configuración -->
                <div class="admin-tab-content" id="settings-tab">
                    <h3>Configuración</h3>
                    <form id="settingsForm" class="admin-form">
                        <div class="admin-form-group">
                            <label for="restaurantName">Nombre del Restaurante</label>
                            <input type="text" id="restaurantName" class="admin-input">
                        </div>
                        <div class="admin-form-group">
                            <label for="restaurantAddress">Dirección</label>
                            <input type="text" id="restaurantAddress" class="admin-input">
                        </div>
                        <div class="admin-form-group">
                            <label for="restaurantPhone">Teléfono</label>
                            <input type="text" id="restaurantPhone" class="admin-input">
                        </div>
                        <div class="admin-form-group">
                            <label for="restaurantEmail">Email</label>
                            <input type="email" id="restaurantEmail" class="admin-input">
                        </div>
                        <div class="admin-form-group">
                            <label for="taxRate">Tasa de Impuestos (%)</label>
                            <input type="number" id="taxRate" class="admin-input" min="0" max="100">
                        </div>
                        <div class="admin-form-group">
                            <label>Características</label>
                            <div class="admin-checkbox-group">
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="enableReservations">
                                    Habilitar Reservas
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="enableOnlineOrders">
                                    Habilitar Pedidos Online
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="enableRatings">
                                    Habilitar Valoraciones
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="enableAllergenInfo">
                                    Mostrar Información de Alérgenos
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="enableNutritionalInfo">
                                    Mostrar Información Nutricional
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="enableDarkMode">
                                    Habilitar Modo Oscuro
                                </label>
                            </div>
                        </div>
                        <button type="submit" class="admin-btn admin-btn-primary">Guardar Configuración</button>
                    </form>
                </div>

                <!-- Pestaña de Exportación -->
                <div class="admin-tab-content" id="export-tab">
                    <h3>Exportar Datos</h3>
                    <div class="admin-export-options">
                        <div class="admin-export-option">
                            <h4>Exportar Todo</h4>
                            <p>Exporta todos los datos de la aplicación en un único archivo.</p>
                            <button id="exportAllBtn" class="admin-btn">Exportar Todo</button>
                        </div>
                        <div class="admin-export-option">
                            <h4>Exportar por Componentes</h4>
                            <p>Exporta componentes individuales de la aplicación.</p>
                            <div class="admin-export-components">
                                <button id="exportCategoriesBtn" class="admin-btn admin-btn-small">Categorías</button>
                                <button id="exportProductsBtn" class="admin-btn admin-btn-small">Productos</button>
                                <button id="exportSettingsBtn" class="admin-btn admin-btn-small">Configuración</button>
                                <button id="exportTablesBtn" class="admin-btn admin-btn-small">Mesas</button>
                                <button id="exportOrdersBtn" class="admin-btn admin-btn-small">Pedidos</button>
                            </div>
                        </div>
                        <div class="admin-export-option">
                            <h4>Exportar Archivos de la Aplicación</h4>
                            <p>Exporta los archivos fuente de la aplicación para su implementación.</p>
                            <div class="admin-export-files">
                                <button id="exportHtmlBtn" class="admin-btn admin-btn-small">HTML</button>
                                <button id="exportCssBtn" class="admin-btn admin-btn-small">CSS</button>
                                <button id="exportJsBtn" class="admin-btn admin-btn-small">JavaScript</button>
                                <button id="exportAllFilesBtn" class="admin-btn admin-btn-primary">Exportar Todos los Archivos</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pestaña de TPV -->
                <div class="admin-tab-content" id="tpv-tab">
                    <h3>Terminal Punto de Venta</h3>
                    <p>Gestione pedidos, mesas y comandas desde el Terminal Punto de Venta.</p>
                    <button class="admin-btn" id="openTPVBtn">Abrir TPV</button>
                </div>

                <!-- Pestaña de Estadísticas -->
                <div class="admin-tab-content" id="stats-tab">
                    <h3>Estadísticas</h3>
                    <div class="admin-stats-container">
                        <div class="admin-stats-card">
                            <h4>Visitas</h4>
                            <div class="admin-stats-value" id="statsVisits">0</div>
                        </div>
                        <div class="admin-stats-card">
                            <h4>Productos</h4>
                            <div class="admin-stats-value" id="statsProducts">0</div>
                        </div>
                        <div class="admin-stats-card">
                            <h4>Categorías</h4>
                            <div class="admin-stats-value" id="statsCategories">0</div>
                        </div>
                        <div class="admin-stats-card">
                            <h4>Pedidos</h4>
                            <div class="admin-stats-value" id="statsOrders">0</div>
                        </div>
                    </div>
                    <div class="admin-stats-charts">
                        <div class="admin-stats-chart">
                            <h4>Productos Más Populares</h4>
                            <div class="chart-container" id="popularProductsChart">
                                <canvas id="popularProductsCanvas"></canvas>
                            </div>
                        </div>
                        <div class="admin-stats-chart">
                            <h4>Ventas por Categoría</h4>
                            <div class="chart-container" id="categorySalesChart">
                                <canvas id="categorySalesCanvas"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(adminPanel);
        
        // Añadir estilos si no existen
        this.addAdminStyles();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Cerrar panel
        document.getElementById('closeAdminBtn').addEventListener('click', () => {
            this.close();
        });
        
        // Cambiar de pestaña
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTab(e.target.dataset.tab);
            });
        });
        
        // Botón añadir categoría
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.showCategoryForm();
        });
        
        // Botón añadir producto
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.showProductForm();
        });
        
        // Filtro de categorías para productos
        document.getElementById('filterCategorySelect').addEventListener('change', (e) => {
            this.filterProducts(e.target.value);
        });
        
        // Formulario de configuración
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        // Botones de exportación
        document.getElementById('exportAllBtn').addEventListener('click', () => {
            this.exportAll();
        });
        
        document.getElementById('exportCategoriesBtn').addEventListener('click', () => {
            this.exportCategories();
        });
        
        document.getElementById('exportProductsBtn').addEventListener('click', () => {
            this.exportProducts();
        });
        
        document.getElementById('exportSettingsBtn').addEventListener('click', () => {
            this.exportSettings();
        });
        
        document.getElementById('exportTablesBtn').addEventListener('click', () => {
            this.exportTables();
        });
        
        document.getElementById('exportOrdersBtn').addEventListener('click', () => {
            this.exportOrders();
        });
        
        document.getElementById('exportHtmlBtn').addEventListener('click', () => {
            this.exportHtml();
        });
        
        document.getElementById('exportCssBtn').addEventListener('click', () => {
            this.exportCss();
        });
        
        document.getElementById('exportJsBtn').addEventListener('click', () => {
            this.exportJs();
        });
        
        document.getElementById('exportAllFilesBtn').addEventListener('click', () => {
            this.exportAllFiles();
        });
        
        // Botón abrir TPV
        document.getElementById('openTPVBtn').addEventListener('click', () => {
            this.openTPV();
        });
    }

    // Cargar datos iniciales
    loadInitialData() {
        // Cargar categorías
        this.loadCategories();
        
        // Cargar productos
        this.loadProducts();
        
        // Cargar configuración
        this.loadSettings();
        
        // Cargar estadísticas
        this.loadStats();
    }

    // Abrir el panel
    open() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
            setTimeout(() => {
                adminPanel.classList.add('admin-panel-visible');
            }, 10);
            this.isOpen = true;
            
            // Recargar datos por si han cambiado
            this.loadInitialData();
        }
    }

    // Cerrar el panel
    close() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.remove('admin-panel-visible');
            setTimeout(() => {
                adminPanel.style.display = 'none';
            }, 300);
            this.isOpen = false;
        }
    }

    // Cambiar de pestaña
    changeTab(tabId) {
        // Actualizar botones de pestañas
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
        
        // Actualizar contenido de pestañas
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
        
        // Actualizar pestaña activa
        this.activeTab = tabId;
    }

    // Cargar categorías
    loadCategories() {
        const categoriesList = document.getElementById('categoriesList');
        if (!categoriesList) return;
        
        // Limpiar lista
        categoriesList.innerHTML = '';
        
        // Obtener categorías
        const categories = LocalStorageManager.getCategories();
        
        if (!categories || categories.length === 0) {
            categoriesList.innerHTML = '<div class="admin-empty-message">No hay categorías disponibles</div>';
            return;
        }
        
        // Ordenar categorías
        const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
        
        // Crear elemento para cada categoría
        sortedCategories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'admin-list-item';
            categoryItem.dataset.id = category.id;
            
            categoryItem.innerHTML = `
                <div class="admin-list-item-content">
                    <div class="admin-list-item-icon">
                        <i class="fas fa-${category.icon}"></i>
                    </div>
                    <div class="admin-list-item-info">
                        <div class="admin-list-item-title">${category.name}</div>
                        <div class="admin-list-item-subtitle">Orden: ${category.order}</div>
                    </div>
                    <div class="admin-list-item-status">
                        <span class="admin-status ${category.isActive ? 'admin-status-active' : 'admin-status-inactive'}">
                            ${category.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>
                <div class="admin-list-item-actions">
                    <button class="admin-btn admin-btn-small admin-btn-edit" data-id="${category.id}">Editar</button>
                    <button class="admin-btn admin-btn-small admin-btn-delete" data-id="${category.id}">Eliminar</button>
                </div>
            `;
            
            // Añadir a la lista
            categoriesList.appendChild(categoryItem);
        });
        
        // Configurar eventos para botones de editar y eliminar
        document.querySelectorAll('.admin-btn-edit[data-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showCategoryForm(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.admin-btn-delete[data-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteCategory(btn.dataset.id);
            });
        });
        
        // Actualizar selector de categorías en la pestaña de productos
        this.updateCategorySelect();
    }

    // Actualizar selector de categorías
    updateCategorySelect() {
        const filterCategorySelect = document.getElementById('filterCategorySelect');
        if (!filterCategorySelect) return;
        
        // Guardar valor actual
        const currentValue = filterCategorySelect.value;
        
        // Limpiar opciones excepto la primera
        while (filterCategorySelect.options.length > 1) {
            filterCategorySelect.remove(1);
        }
        
        // Obtener categorías
        const categories = LocalStorageManager.getCategories();
        
        if (categories && categories.length > 0) {
            // Ordenar categorías
            const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
            
            // Añadir opciones
            sortedCategories.forEach(category => {
                if (category.isActive) {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    filterCategorySelect.appendChild(option);
                }
            });
        }
        
        // Restaurar valor si existe
        if (currentValue) {
            filterCategorySelect.value = currentValue;
        }
    }

    // Mostrar formulario de categoría
    showCategoryForm(categoryId = null) {
        // Guardar ID de categoría en edición
        this.editingCategoryId = categoryId;
        
        // Obtener categoría si se está editando
        let category = null;
        if (categoryId) {
            const categories = LocalStorageManager.getCategories() || [];
            category = categories.find(c => c.id === categoryId);
            
            if (!category) {
                alert('Categoría no encontrada');
                return;
            }
        }
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.id = 'categoryFormModal';
        
        // Contenido del modal
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>${categoryId ? 'Editar Categoría' : 'Añadir Categoría'}</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="categoryForm" class="admin-form">
                        <div class="admin-form-group">
                            <label for="categoryName">Nombre</label>
                            <input type="text" id="categoryName" class="admin-input" value="${category ? category.name : ''}" required>
                        </div>
                        <div class="admin-form-group">
                            <label for="categoryIcon">Icono</label>
                            <input type="text" id="categoryIcon" class="admin-input" value="${category ? category.icon : 'utensils'}" required>
                            <div class="admin-form-help">Nombre del icono de Font Awesome (ej: utensils, coffee, pizza-slice)</div>
                        </div>
                        <div class="admin-form-group">
                            <label for="categoryOrder">Orden</label>
                            <input type="number" id="categoryOrder" class="admin-input" value="${category ? category.order : ''}" min="1" required>
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-checkbox">
                                <input type="checkbox" id="categoryActive" ${category && category.isActive ? 'checked' : ''}>
                                Categoría Activa
                            </label>
                        </div>
                    </form>
                </div>
                <div class="admin-modal-footer">
                    <button class="admin-btn admin-btn-cancel">Cancelar</button>
                    <button class="admin-btn admin-btn-primary" id="saveCategoryBtn">Guardar</button>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(modal);
        
        // Eventos
        modal.querySelector('.admin-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.admin-btn-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#saveCategoryBtn').addEventListener('click', () => {
            this.saveCategory();
            document.body.removeChild(modal);
        });
    }

    // Guardar categoría
    saveCategory() {
        // Obtener valores del formulario
        const name = document.getElementById('categoryName').value.trim();
        const icon = document.getElementById('categoryIcon').value.trim();
        const order = parseInt(document.getElementById('categoryOrder').value);
        const isActive = document.getElementById('categoryActive').checked;
        
        // Validar
        if (!name || !icon || isNaN(order)) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        // Obtener categorías existentes
        const categories = LocalStorageManager.getCategories() || [];
        
        if (this.editingCategoryId) {
            // Actualizar categoría existente
            const index = categories.findIndex(c => c.id === this.editingCategoryId);
            
            if (index !== -1) {
                categories[index] = {
                    ...categories[index],
                    name,
                    icon,
                    order,
                    isActive
                };
            }
        } else {
            // Crear nueva categoría
            const newCategory = {
                id: 'category_' + Date.now(),
                name,
                icon,
                order,
                isActive
            };
            
            categories.push(newCategory);
        }
        
        // Guardar cambios
        LocalStorageManager.saveCategories(categories);
        
        // Recargar categorías
        this.loadCategories();
        
        // Limpiar ID de edición
        this.editingCategoryId = null;
    }

    // Eliminar categoría
    deleteCategory(categoryId) {
        if (!confirm('¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.')) {
            return;
        }
        
        // Obtener categorías
        const categories = LocalStorageManager.getCategories() || [];
        
        // Filtrar categoría
        const updatedCategories = categories.filter(c => c.id !== categoryId);
        
        // Guardar cambios
        LocalStorageManager.saveCategories(updatedCategories);
        
        // Recargar categorías
        this.loadCategories();
    }

    // Cargar productos
    loadProducts(filterCategoryId = '') {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;
        
        // Limpiar lista
        productsList.innerHTML = '';
        
        // Obtener productos
        const productsData = LocalStorageManager.getProducts();
        
        if (!productsData) {
            productsList.innerHTML = '<div class="admin-empty-message">No hay productos disponibles</div>';
            return;
        }
        
        // Convertir a array plano
        let allProducts = [];
        Object.keys(productsData).forEach(categoryId => {
            if (!filterCategoryId || categoryId === filterCategoryId) {
                productsData[categoryId].forEach(product => {
                    allProducts.push({
                        ...product,
                        categoryId
                    });
                });
            }
        });
        
        if (allProducts.length === 0) {
            productsList.innerHTML = '<div class="admin-empty-message">No hay productos disponibles</div>';
            return;
        }
        
        // Obtener categorías para mostrar nombres
        const categories = LocalStorageManager.getCategories() || [];
        const categoryNames = {};
        categories.forEach(category => {
            categoryNames[category.id] = category.name;
        });
        
        // Crear elemento para cada producto
        allProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'admin-list-item';
            productItem.dataset.id = product.id;
            
            // Obtener nombre y descripción del producto
            const nombre = product.nombre || product.name;
            const descripcion = product.descripcion || product.description;
            const precio = product.precio || product.price;
            
            productItem.innerHTML = `
                <div class="admin-list-item-content">
                    <div class="admin-list-item-info">
                        <div class="admin-list-item-title">${nombre}</div>
                        <div class="admin-list-item-subtitle">${descripcion}</div>
                        <div class="admin-list-item-meta">
                            <span class="admin-list-item-price">${precio}</span>
                            <span class="admin-list-item-category">${categoryNames[product.categoryId] || 'Sin categoría'}</span>
                        </div>
                    </div>
                    <div class="admin-list-item-status">
                        <span class="admin-status ${product.isAvailable !== false ? 'admin-status-active' : 'admin-status-inactive'}">
                            ${product.isAvailable !== false ? 'Disponible' : 'No disponible'}
                        </span>
                    </div>
                </div>
                <div class="admin-list-item-actions">
                    <button class="admin-btn admin-btn-small admin-btn-edit" data-id="${product.id}" data-category="${product.categoryId}">Editar</button>
                    <button class="admin-btn admin-btn-small admin-btn-delete" data-id="${product.id}" data-category="${product.categoryId}">Eliminar</button>
                </div>
            `;
            
            // Añadir a la lista
            productsList.appendChild(productItem);
        });
        
        // Configurar eventos para botones de editar y eliminar
        document.querySelectorAll('.admin-btn-edit[data-id][data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showProductForm(btn.dataset.id, btn.dataset.category);
            });
        });
        
        document.querySelectorAll('.admin-btn-delete[data-id][data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deleteProduct(btn.dataset.id, btn.dataset.category);
            });
        });
    }

    // Filtrar productos por categoría
    filterProducts(categoryId) {
        this.loadProducts(categoryId);
    }

    // Mostrar formulario de producto
    showProductForm(productId = null, categoryId = null) {
        // Guardar IDs en edición
        this.editingProductId = productId;
        this.editingProductCategory = categoryId;
        
        // Obtener producto si se está editando
        let product = null;
        if (productId && categoryId) {
            const productsData = LocalStorageManager.getProducts() || {};
            const categoryProducts = productsData[categoryId] || [];
            product = categoryProducts.find(p => p.id === productId);
            
            if (!product) {
                alert('Producto no encontrado');
                return;
            }
        }
        
        // Obtener categorías para el selector
        const categories = LocalStorageManager.getCategories() || [];
        const activeCategories = categories.filter(c => c.isActive);
        
        if (activeCategories.length === 0) {
            alert('Debe crear al menos una categoría activa antes de añadir productos.');
            return;
        }
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.id = 'productFormModal';
        
        // Contenido del modal
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>${productId ? 'Editar Producto' : 'Añadir Producto'}</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="productForm" class="admin-form">
                        <div class="admin-form-group">
                            <label for="productCategory">Categoría</label>
                            <select id="productCategory" class="admin-select" required>
                                ${activeCategories.map(category => `
                                    <option value="${category.id}" ${categoryId === category.id ? 'selected' : ''}>
                                        ${category.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="admin-form-group">
                            <label for="productName">Nombre</label>
                            <input type="text" id="productName" class="admin-input" value="${product ? (product.nombre || product.name || '') : ''}" required>
                        </div>
                        <div class="admin-form-group">
                            <label for="productDescription">Descripción</label>
                            <textarea id="productDescription" class="admin-textarea" rows="3" required>${product ? (product.descripcion || product.description || '') : ''}</textarea>
                        </div>
                        <div class="admin-form-group">
                            <label for="productPrice">Precio</label>
                            <input type="text" id="productPrice" class="admin-input" value="${product ? (product.precio || product.price || '') : ''}" required>
                        </div>
                        <div class="admin-form-group">
                            <label>Características</label>
                            <div class="admin-checkbox-group">
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="productAvailable" ${!product || product.isAvailable !== false ? 'checked' : ''}>
                                    Disponible
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="productSpecialOffer" ${product && product.isSpecialOffer ? 'checked' : ''}>
                                    Oferta Especial
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="productVegetarian" ${product && product.isVegetarian ? 'checked' : ''}>
                                    Vegetariano
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="productVegan" ${product && product.isVegan ? 'checked' : ''}>
                                    Vegano
                                </label>
                                <label class="admin-checkbox">
                                    <input type="checkbox" id="productGlutenFree" ${product && product.isGlutenFree ? 'checked' : ''}>
                                    Sin Gluten
                                </label>
                            </div>
                        </div>
                        <div class="admin-form-group">
                            <label for="productAllergens">Alérgenos (separados por comas)</label>
                            <input type="text" id="productAllergens" class="admin-input" value="${product && product.allergens ? product.allergens.join(', ') : ''}">
                        </div>
                        <div class="admin-form-group">
                            <label for="productSpicyLevel">Nivel de Picante (0-3)</label>
                            <input type="number" id="productSpicyLevel" class="admin-input" min="0" max="3" value="${product && product.spicyLevel ? product.spicyLevel : '0'}">
                        </div>
                    </form>
                </div>
                <div class="admin-modal-footer">
                    <button class="admin-btn admin-btn-cancel">Cancelar</button>
                    <button class="admin-btn admin-btn-primary" id="saveProductBtn">Guardar</button>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(modal);
        
        // Eventos
        modal.querySelector('.admin-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.admin-btn-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#saveProductBtn').addEventListener('click', () => {
            this.saveProduct();
            document.body.removeChild(modal);
        });
    }

    // Guardar producto
    saveProduct() {
        // Obtener valores del formulario
        const categoryId = document.getElementById('productCategory').value;
        const name = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const isAvailable = document.getElementById('productAvailable').checked;
        const isSpecialOffer = document.getElementById('productSpecialOffer').checked;
        const isVegetarian = document.getElementById('productVegetarian').checked;
        const isVegan = document.getElementById('productVegan').checked;
        const isGlutenFree = document.getElementById('productGlutenFree').checked;
        const allergensStr = document.getElementById('productAllergens').value.trim();
        const spicyLevel = parseInt(document.getElementById('productSpicyLevel').value) || 0;
        
        // Validar
        if (!categoryId || !name || !description || !price) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        // Procesar alérgenos
        const allergens = allergensStr ? allergensStr.split(',').map(a => a.trim()).filter(a => a) : [];
        
        // Obtener productos existentes
        const productsData = LocalStorageManager.getProducts() || {};
        
        // Asegurarse de que existe la categoría en los productos
        if (!productsData[categoryId]) {
            productsData[categoryId] = [];
        }
        
        if (this.editingProductId && this.editingProductCategory) {
            if (this.editingProductCategory === categoryId) {
                // Actualizar producto en la misma categoría
                const index = productsData[categoryId].findIndex(p => p.id === this.editingProductId);
                
                if (index !== -1) {
                    productsData[categoryId][index] = {
                        ...productsData[categoryId][index],
                        nombre: name,
                        descripcion: description,
                        precio: price,
                        isAvailable,
                        isSpecialOffer,
                        isVegetarian,
                        isVegan,
                        isGlutenFree,
                        allergens,
                        spicyLevel
                    };
                }
            } else {
                // Mover producto a otra categoría
                // Eliminar de la categoría anterior
                productsData[this.editingProductCategory] = productsData[this.editingProductCategory].filter(p => p.id !== this.editingProductId);
                
                // Añadir a la nueva categoría
                productsData[categoryId].push({
                    id: this.editingProductId,
                    nombre: name,
                    descripcion: description,
                    precio: price,
                    isAvailable,
                    isSpecialOffer,
                    isVegetarian,
                    isVegan,
                    isGlutenFree,
                    allergens,
                    spicyLevel
                });
            }
        } else {
            // Crear nuevo producto
            const newProduct = {
                id: 'product_' + Date.now(),
                nombre: name,
                descripcion: description,
                precio: price,
                isAvailable,
                isSpecialOffer,
                isVegetarian,
                isVegan,
                isGlutenFree,
                allergens,
                spicyLevel
            };
            
            productsData[categoryId].push(newProduct);
        }
        
        // Guardar cambios
        LocalStorageManager.saveProducts(productsData);
        
        // Recargar productos
        this.loadProducts(document.getElementById('filterCategorySelect').value);
        
        // Limpiar IDs de edición
        this.editingProductId = null;
        this.editingProductCategory = null;
    }

    // Eliminar producto
    deleteProduct(productId, categoryId) {
        if (!confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')) {
            return;
        }
        
        // Obtener productos
        const productsData = LocalStorageManager.getProducts() || {};
        
        // Verificar si existe la categoría
        if (!productsData[categoryId]) {
            alert('Categoría no encontrada');
            return;
        }
        
        // Filtrar producto
        productsData[categoryId] = productsData[categoryId].filter(p => p.id !== productId);
        
        // Guardar cambios
        LocalStorageManager.saveProducts(productsData);
        
        // Recargar productos
        this.loadProducts(document.getElementById('filterCategorySelect').value);
    }

    // Cargar configuración
    loadSettings() {
        // Obtener configuración
        const settings = LocalStorageManager.getSettings();
        
        if (!settings) return;
        
        // Actualizar campos del formulario
        document.getElementById('restaurantName').value = settings.restaurantName || '';
        document.getElementById('restaurantAddress').value = settings.address || '';
        document.getElementById('restaurantPhone').value = settings.phone || '';
        document.getElementById('restaurantEmail').value = settings.email || '';
        document.getElementById('taxRate').value = settings.taxRate || '';
        
        // Actualizar checkboxes
        document.getElementById('enableReservations').checked = settings.features?.enableReservations || false;
        document.getElementById('enableOnlineOrders').checked = settings.features?.enableOnlineOrders || false;
        document.getElementById('enableRatings').checked = settings.features?.enableRatings || false;
        document.getElementById('enableAllergenInfo').checked = settings.features?.enableAllergenInfo || false;
        document.getElementById('enableNutritionalInfo').checked = settings.features?.enableNutritionalInfo || false;
        document.getElementById('enableDarkMode').checked = settings.features?.enableDarkMode || false;
    }

    // Guardar configuración
    saveSettings() {
        // Obtener valores del formulario
        const restaurantName = document.getElementById('restaurantName').value.trim();
        const address = document.getElementById('restaurantAddress').value.trim();
        const phone = document.getElementById('restaurantPhone').value.trim();
        const email = document.getElementById('restaurantEmail').value.trim();
        const taxRate = parseInt(document.getElementById('taxRate').value) || 0;
        
        // Obtener valores de checkboxes
        const enableReservations = document.getElementById('enableReservations').checked;
        const enableOnlineOrders = document.getElementById('enableOnlineOrders').checked;
        const enableRatings = document.getElementById('enableRatings').checked;
        const enableAllergenInfo = document.getElementById('enableAllergenInfo').checked;
        const enableNutritionalInfo = document.getElementById('enableNutritionalInfo').checked;
        const enableDarkMode = document.getElementById('enableDarkMode').checked;
        
        // Crear objeto de configuración
        const settings = {
            restaurantName,
            address,
            phone,
            email,
            taxRate,
            currency: '€',
            language: 'es',
            theme: enableDarkMode ? 'dark' : 'light',
            features: {
                enableReservations,
                enableOnlineOrders,
                enableRatings,
                enableAllergenInfo,
                enableNutritionalInfo,
                enableDarkMode
            },
            updatedAt: new Date().toISOString()
        };
        
        // Guardar configuración
        LocalStorageManager.saveSettings(settings);
        
        // Aplicar modo oscuro si está habilitado
        if (enableDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Mostrar mensaje de éxito
        alert('Configuración guardada correctamente');
    }

    // Cargar estadísticas
    loadStats() {
        // Obtener datos
        const accessCounter = LocalStorageManager.getAccessCounter() || 0;
        const categories = LocalStorageManager.getCategories() || [];
        const productsData = LocalStorageManager.getProducts() || {};
        const orders = LocalStorageManager.getOrders() || [];
        
        // Contar productos
        let totalProducts = 0;
        Object.values(productsData).forEach(categoryProducts => {
            totalProducts += categoryProducts.length;
        });
        
        // Actualizar valores
        document.getElementById('statsVisits').textContent = accessCounter;
        document.getElementById('statsProducts').textContent = totalProducts;
        document.getElementById('statsCategories').textContent = categories.length;
        document.getElementById('statsOrders').textContent = orders.length;
        
        // Generar gráficos si está disponible Chart.js
        if (typeof Chart !== 'undefined') {
            this.generateCharts(productsData, categories, orders);
        }
    }

    // Generar gráficos
    generateCharts(productsData, categories, orders) {
        // Gráfico de productos populares
        const popularProductsCanvas = document.getElementById('popularProductsCanvas');
        if (popularProductsCanvas) {
            // Contar productos por categoría
            const productsByCategory = {};
            categories.forEach(category => {
                const categoryProducts = productsData[category.id] || [];
                productsByCategory[category.name] = categoryProducts.length;
            });
            
            // Crear gráfico
            new Chart(popularProductsCanvas, {
                type: 'bar',
                data: {
                    labels: Object.keys(productsByCategory),
                    datasets: [{
                        label: 'Número de Productos',
                        data: Object.values(productsByCategory),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });
        }
        
        // Gráfico de ventas por categoría
        const categorySalesCanvas = document.getElementById('categorySalesCanvas');
        if (categorySalesCanvas) {
            // Contar pedidos por estado
            const ordersByStatus = {
                'Abiertos': orders.filter(o => o.status === 'open').length,
                'Completados': orders.filter(o => o.status === 'completed').length,
                'Cancelados': orders.filter(o => o.status === 'cancelled').length
            };
            
            // Crear gráfico
            new Chart(categorySalesCanvas, {
                type: 'pie',
                data: {
                    labels: Object.keys(ordersByStatus),
                    datasets: [{
                        data: Object.values(ordersByStatus),
                        backgroundColor: [
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 99, 132, 0.5)'
                        ],
                        borderColor: [
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    }

    // Exportar todos los datos
    exportAll() {
        const data = LocalStorageManager.exportData();
        this.downloadJSON(data, 'bar_sergios_data_export.json');
    }

    // Exportar categorías
    exportCategories() {
        const categories = LocalStorageManager.getCategories() || [];
        this.downloadJSON(categories, 'bar_sergios_categories.json');
    }

    // Exportar productos
    exportProducts() {
        const products = LocalStorageManager.getProducts() || {};
        this.downloadJSON(products, 'bar_sergios_products.json');
    }

    // Exportar configuración
    exportSettings() {
        const settings = LocalStorageManager.getSettings() || {};
        this.downloadJSON(settings, 'bar_sergios_settings.json');
    }

    // Exportar mesas
    exportTables() {
        const tables = LocalStorageManager.getTables() || [];
        this.downloadJSON(tables, 'bar_sergios_tables.json');
    }

    // Exportar pedidos
    exportOrders() {
        const orders = LocalStorageManager.getOrders() || [];
        this.downloadJSON(orders, 'bar_sergios_orders.json');
    }

    // Exportar HTML
    exportHtml() {
        const html = document.documentElement.outerHTML;
        this.downloadText(html, 'index.html');
    }

    // Exportar CSS
    exportCss() {
        let css = '';
        
        // Obtener todos los estilos
        for (let i = 0; i < document.styleSheets.length; i++) {
            try {
                const sheet = document.styleSheets[i];
                const rules = sheet.cssRules || sheet.rules;
                
                for (let j = 0; j < rules.length; j++) {
                    css += rules[j].cssText + '\n';
                }
            } catch (e) {
                console.warn('No se puede acceder a la hoja de estilos', e);
            }
        }
        
        this.downloadText(css, 'styles.css');
    }

    // Exportar JavaScript
    exportJs() {
        // Crear un archivo ZIP con todos los archivos JS
        const zip = new JSZip();
        
        // Añadir archivos JS
        zip.file('script.js', document.querySelector('script[src="script.js"]')?.textContent || '');
        zip.file('admin-panel.js', document.querySelector('script[src="admin-panel.js"]')?.textContent || '');
        zip.file('admin-access.js', document.querySelector('script[src="admin-access.js"]')?.textContent || '');
        zip.file('local-storage.js', document.querySelector('script[src="local-storage.js"]')?.textContent || '');
        zip.file('tpv-module.js', document.querySelector('script[src="tpv-module.js"]')?.textContent || '');
        zip.file('mobile-optimization.js', document.querySelector('script[src="mobile-optimization.js"]')?.textContent || '');
        
        // Generar ZIP
        zip.generateAsync({type: 'blob'}).then(content => {
            // Descargar ZIP
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bar_sergios_js.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Exportar todos los archivos
    exportAllFiles() {
        // Crear un archivo ZIP con todos los archivos
        const zip = new JSZip();
        
        // Añadir HTML
        zip.file('index.html', document.documentElement.outerHTML);
        
        // Añadir CSS
        let css = '';
        for (let i = 0; i < document.styleSheets.length; i++) {
            try {
                const sheet = document.styleSheets[i];
                const rules = sheet.cssRules || sheet.rules;
                
                for (let j = 0; j < rules.length; j++) {
                    css += rules[j].cssText + '\n';
                }
            } catch (e) {
                console.warn('No se puede acceder a la hoja de estilos', e);
            }
        }
        zip.file('styles.css', css);
        
        // Añadir JS
        zip.file('script.js', document.querySelector('script[src="script.js"]')?.textContent || '');
        zip.file('admin-panel.js', document.querySelector('script[src="admin-panel.js"]')?.textContent || '');
        zip.file('admin-access.js', document.querySelector('script[src="admin-access.js"]')?.textContent || '');
        zip.file('local-storage.js', document.querySelector('script[src="local-storage.js"]')?.textContent || '');
        zip.file('tpv-module.js', document.querySelector('script[src="tpv-module.js"]')?.textContent || '');
        zip.file('mobile-optimization.js', document.querySelector('script[src="mobile-optimization.js"]')?.textContent || '');
        
        // Añadir datos
        zip.file('data/categories.json', JSON.stringify(LocalStorageManager.getCategories() || []));
        zip.file('data/products.json', JSON.stringify(LocalStorageManager.getProducts() || {}));
        zip.file('data/settings.json', JSON.stringify(LocalStorageManager.getSettings() || {}));
        zip.file('data/tables.json', JSON.stringify(LocalStorageManager.getTables() || []));
        zip.file('data/orders.json', JSON.stringify(LocalStorageManager.getOrders() || []));
        
        // Generar ZIP
        zip.generateAsync({type: 'blob'}).then(content => {
            // Descargar ZIP
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bar_sergios_all_files.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Descargar JSON
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        this.downloadText(json, filename);
    }

    // Descargar texto
    downloadText(text, filename) {
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Abrir TPV
    openTPV() {
        if (typeof window.showTPV === 'function') {
            window.showTPV();
        } else {
            // Cargar el módulo TPV si no está disponible
            if (!document.getElementById('tpvModuleScript')) {
                const script = document.createElement('script');
                script.id = 'tpvModuleScript';
                script.src = 'tpv-module.js';
                script.onload = function() {
                    if (typeof window.showTPV === 'function') {
                        window.showTPV();
                    } else {
                        alert('Error al cargar el módulo TPV. Por favor, recargue la página e intente nuevamente.');
                    }
                };
                script.onerror = function() {
                    alert('Error al cargar el módulo TPV. Por favor, recargue la página e intente nuevamente.');
                };
                
                document.body.appendChild(script);
            }
        }
    }

    // Añadir estilos para el panel de administración
    addAdminStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('adminPanelStyles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'adminPanelStyles';
        styleElement.textContent = `
            /* Estilos para el panel de administración */
            .admin-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #f5f5f5;
                z-index: 2000;
                display: flex;
                flex-direction: column;
                font-family: 'Open Sans', sans-serif;
                color: #333;
                overflow: hidden;
            }
            
            .admin-header {
                background-color: var(--color-primary);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .admin-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .admin-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .admin-tabs {
                display: flex;
                background-color: #fff;
                border-bottom: 1px solid #ddd;
                overflow-x: auto;
            }
            
            .admin-tab-btn {
                padding: 1rem;
                border: none;
                background: none;
                cursor: pointer;
                font-weight: 600;
                color: #666;
                border-bottom: 2px solid transparent;
                white-space: nowrap;
            }
            
            .admin-tab-btn.active {
                color: var(--color-primary);
                border-bottom-color: var(--color-primary);
            }
            
            .admin-content {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }
            
            .admin-tab-content {
                display: none;
                height: 100%;
            }
            
            .admin-tab-content.active {
                display: block;
            }
            
            .admin-tab-content h3 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 1rem;
            }
            
            .admin-actions {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
            }
            
            .admin-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .admin-list-item {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .admin-list-item-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .admin-list-item-icon {
                width: 40px;
                height: 40px;
                background-color: var(--color-primary);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 1rem;
            }
            
            .admin-list-item-info {
                flex: 1;
            }
            
            .admin-list-item-title {
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 0.25rem;
            }
            
            .admin-list-item-subtitle {
                color: #666;
                font-size: 0.9rem;
            }
            
            .admin-list-item-meta {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
                font-size: 0.9rem;
            }
            
            .admin-list-item-price {
                font-weight: 600;
                color: var(--color-secondary);
            }
            
            .admin-list-item-category {
                color: #666;
            }
            
            .admin-list-item-status {
                margin-left: 1rem;
            }
            
            .admin-status {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .admin-status-active {
                background-color: #e8f5e9;
                color: #4caf50;
            }
            
            .admin-status-inactive {
                background-color: #ffebee;
                color: #f44336;
            }
            
            .admin-list-item-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }
            
            .admin-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .admin-form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .admin-form-group label {
                font-weight: 600;
            }
            
            .admin-input, .admin-select, .admin-textarea {
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: inherit;
                font-size: 1rem;
            }
            
            .admin-textarea {
                resize: vertical;
                min-height: 100px;
            }
            
            .admin-checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .admin-checkbox {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
            }
            
            .admin-form-help {
                font-size: 0.8rem;
                color: #666;
                margin-top: 0.25rem;
            }
            
            .admin-btn {
                background-color: #f0f0f0;
                border: none;
                padding: 0.75rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .admin-btn:hover {
                background-color: #e0e0e0;
            }
            
            .admin-btn-primary {
                background-color: var(--color-primary);
                color: white;
            }
            
            .admin-btn-primary:hover {
                background-color: #1a252f;
            }
            
            .admin-btn-small {
                padding: 0.5rem 0.75rem;
                font-size: 0.9rem;
            }
            
            .admin-btn-edit {
                background-color: #e3f2fd;
                color: #2196f3;
            }
            
            .admin-btn-edit:hover {
                background-color: #bbdefb;
            }
            
            .admin-btn-delete {
                background-color: #ffebee;
                color: #f44336;
            }
            
            .admin-btn-delete:hover {
                background-color: #ffcdd2;
            }
            
            .admin-btn-cancel {
                background-color: #f5f5f5;
                color: #666;
            }
            
            .admin-empty-message {
                text-align: center;
                padding: 2rem;
                color: #999;
                background-color: #f9f9f9;
                border-radius: 8px;
            }
            
            .admin-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 3000;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .admin-modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .admin-modal-header {
                padding: 1rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .admin-modal-header h3 {
                margin: 0;
                color: var(--color-primary);
            }
            
            .admin-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
            }
            
            .admin-modal-body {
                padding: 1rem;
                overflow-y: auto;
                flex: 1;
            }
            
            .admin-modal-footer {
                padding: 1rem;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }
            
            .admin-export-options {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .admin-export-option {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
            }
            
            .admin-export-option h4 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 0.5rem;
            }
            
            .admin-export-option p {
                margin-bottom: 1rem;
                color: #666;
            }
            
            .admin-export-components, .admin-export-files {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            
            .admin-stats-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .admin-stats-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1.5rem;
                text-align: center;
            }
            
            .admin-stats-card h4 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 0.5rem;
            }
            
            .admin-stats-value {
                font-size: 2rem;
                font-weight: 700;
                color: var(--color-secondary);
            }
            
            .admin-stats-charts {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                gap: 1.5rem;
            }
            
            .admin-stats-chart {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
            }
            
            .admin-stats-chart h4 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .chart-container {
                height: 300px;
            }
            
            /* Modo oscuro */
            body.dark-mode .admin-panel {
                background-color: #121212;
                color: #f1f1f1;
            }
            
            body.dark-mode .admin-tabs {
                background-color: #1a1a2e;
                border-bottom-color: #333;
            }
            
            body.dark-mode .admin-tab-btn {
                color: #ccc;
            }
            
            body.dark-mode .admin-tab-btn.active {
                color: var(--color-accent);
                border-bottom-color: var(--color-accent);
            }
            
            body.dark-mode .admin-list-item,
            body.dark-mode .admin-export-option,
            body.dark-mode .admin-stats-card,
            body.dark-mode .admin-stats-chart,
            body.dark-mode .admin-modal-content {
                background-color: #1f2937;
                color: #f1f1f1;
            }
            
            body.dark-mode .admin-list-item-subtitle,
            body.dark-mode .admin-list-item-category,
            body.dark-mode .admin-form-help,
            body.dark-mode .admin-export-option p {
                color: #adb5bd;
            }
            
            body.dark-mode .admin-empty-message {
                background-color: #2d3748;
                color: #adb5bd;
            }
            
            body.dark-mode .admin-input,
            body.dark-mode .admin-select,
            body.dark-mode .admin-textarea {
                background-color: #2d3748;
                color: #f1f1f1;
                border-color: #4a5568;
            }
            
            body.dark-mode .admin-modal-header,
            body.dark-mode .admin-modal-footer {
                border-color: #4a5568;
            }
            
            body.dark-mode .admin-btn {
                background-color: #4a5568;
                color: #f1f1f1;
            }
            
            body.dark-mode .admin-btn:hover {
                background-color: #718096;
            }
            
            body.dark-mode .admin-btn-edit {
                background-color: #1a365d;
                color: #90cdf4;
            }
            
            body.dark-mode .admin-btn-delete {
                background-color: #4a1c1c;
                color: #feb2b2;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .admin-stats-charts {
                    grid-template-columns: 1fr;
                }
                
                .admin-actions {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .admin-list-item-content {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .admin-list-item-status {
                    margin-left: 0;
                    margin-top: 0.5rem;
                }
                
                .admin-list-item-actions {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
}
