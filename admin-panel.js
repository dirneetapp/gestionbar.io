// Panel de Administración para Bar Sergio's
// Este archivo implementa todas las funcionalidades del panel de administración

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
            this.isOpen = true;
            
            // Recargar datos por si han cambiado
            this.loadInitialData();
        }
    }

    // Cerrar el panel
    close() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'none';
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
            categoriesList.innerHTML = '<div class="admin-empty-list">No hay categorías disponibles</div>';
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
                <div class="admin-item-content">
                    <div class="admin-item-icon">
                        <i class="fas fa-${category.icon}"></i>
                    </div>
                    <div class="admin-item-details">
                        <div class="admin-item-name">${category.name}</div>
                        <div class="admin-item-meta">ID: ${category.id} | Orden: ${category.order}</div>
                    </div>
                    <div class="admin-item-status">
                        ${category.isActive ? 
                            '<span class="admin-status-active">Activa</span>' : 
                            '<span class="admin-status-inactive">Inactiva</span>'}
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-btn admin-btn-small admin-btn-edit" data-action="edit">Editar</button>
                    <button class="admin-btn admin-btn-small admin-btn-delete" data-action="delete">Eliminar</button>
                </div>
            `;
            
            // Eventos para botones
            categoryItem.querySelector('[data-action="edit"]').addEventListener('click', () => {
                this.showCategoryForm(category.id);
            });
            
            categoryItem.querySelector('[data-action="delete"]').addEventListener('click', () => {
                this.deleteCategory(category.id);
            });
            
            categoriesList.appendChild(categoryItem);
        });
        
        // Actualizar selector de categorías en pestaña de productos
        this.updateCategorySelect(sortedCategories);
    }

    // Actualizar selector de categorías
    updateCategorySelect(categories) {
        const filterSelect = document.getElementById('filterCategorySelect');
        if (!filterSelect) return;
        
        // Guardar valor actual
        const currentValue = filterSelect.value;
        
        // Limpiar opciones excepto la primera
        while (filterSelect.options.length > 1) {
            filterSelect.remove(1);
        }
        
        // Añadir opciones
        categories.forEach(category => {
            if (!category.isActive) return;
            
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            filterSelect.appendChild(option);
        });
        
        // Restaurar valor si existe
        if (currentValue && filterSelect.querySelector(`option[value="${currentValue}"]`)) {
            filterSelect.value = currentValue;
        }
    }

    // Mostrar formulario de categoría
    showCategoryForm(categoryId = null) {
        // Guardar ID de categoría en edición
        this.editingCategoryId = categoryId;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.id = 'categoryFormModal';
        
        // Obtener datos de la categoría si existe
        let category = null;
        if (categoryId) {
            const categories = LocalStorageManager.getCategories() || [];
            category = categories.find(c => c.id === categoryId);
        }
        
        // Contenido del modal
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>${category ? 'Editar Categoría' : 'Añadir Categoría'}</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="categoryForm" class="admin-form">
                        <div class="admin-form-group">
                            <label for="categoryId">ID (único)</label>
                            <input type="text" id="categoryId" class="admin-input" ${category ? 'readonly' : ''} value="${category ? category.id : ''}">
                            <small>El ID debe ser único y no puede contener espacios ni caracteres especiales.</small>
                        </div>
                        <div class="admin-form-group">
                            <label for="categoryName">Nombre</label>
                            <input type="text" id="categoryName" class="admin-input" value="${category ? category.name : ''}">
                        </div>
                        <div class="admin-form-group">
                            <label for="categoryIcon">Icono</label>
                            <input type="text" id="categoryIcon" class="admin-input" value="${category ? category.icon : ''}">
                            <small>Nombre del icono de Font Awesome (ej: coffee, utensils, pizza-slice).</small>
                        </div>
                        <div class="admin-form-group">
                            <label for="categoryOrder">Orden</label>
                            <input type="number" id="categoryOrder" class="admin-input" min="1" value="${category ? category.order : ''}">
                        </div>
                        <div class="admin-form-group">
                            <label class="admin-checkbox">
                                <input type="checkbox" id="categoryActive" ${category && category.isActive ? 'checked' : ''}>
                                Categoría activa
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
        const id = document.getElementById('categoryId').value.trim();
        const name = document.getElementById('categoryName').value.trim();
        const icon = document.getElementById('categoryIcon').value.trim();
        const order = parseInt(document.getElementById('categoryOrder').value) || 99;
        const isActive = document.getElementById('categoryActive').checked;
        
        // Validar
        if (!id || !name) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        // Obtener categorías existentes
        const categories = LocalStorageManager.getCategories() || [];
        
        // Si es una nueva categoría, verificar que el ID no exista
        if (!this.editingCategoryId && categories.some(c => c.id === id)) {
            alert('Ya existe una categoría con ese ID. Por favor, elija otro.');
            return;
        }
        
        // Crear objeto de categoría
        const category = {
            id,
            name,
            icon: icon || 'question',
            order,
            isActive
        };
        
        // Actualizar o añadir
        if (this.editingCategoryId) {
            // Actualizar categoría existente
            const index = categories.findIndex(c => c.id === this.editingCategoryId);
            if (index >= 0) {
                categories[index] = category;
            }
        } else {
            // Añadir nueva categoría
            categories.push(category);
        }
        
        // Guardar cambios
        LocalStorageManager.saveCategories(categories);
        
        // Recargar lista
        this.loadCategories();
        
        // Resetear ID en edición
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
        
        // Recargar lista
        this.loadCategories();
    }

    // Cargar productos
    loadProducts(filterCategory = '') {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;
        
        // Limpiar lista
        productsList.innerHTML = '';
        
        // Obtener productos
        const productsData = LocalStorageManager.getProducts();
        
        if (!productsData) {
            productsList.innerHTML = '<div class="admin-empty-list">No hay productos disponibles</div>';
            return;
        }
        
        // Crear array plano de productos
        let allProducts = [];
        for (const category in productsData) {
            if (filterCategory && category !== filterCategory) continue;
            
            productsData[category].forEach(product => {
                allProducts.push({
                    ...product,
                    category
                });
            });
        }
        
        if (allProducts.length === 0) {
            productsList.innerHTML = '<div class="admin-empty-list">No hay productos disponibles</div>';
            return;
        }
        
        // Ordenar productos por nombre
        allProducts.sort((a, b) => {
            const nameA = a.nombre || a.name || '';
            const nameB = b.nombre || b.name || '';
            return nameA.localeCompare(nameB);
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
            
            // Obtener nombre de la categoría
            const categories = LocalStorageManager.getCategories() || [];
            const categoryObj = categories.find(c => c.id === product.category);
            const categoryName = categoryObj ? categoryObj.name : product.category;
            
            productItem.innerHTML = `
                <div class="admin-item-content">
                    <div class="admin-item-details">
                        <div class="admin-item-name">${nombre}</div>
                        <div class="admin-item-description">${descripcion}</div>
                        <div class="admin-item-meta">
                            Precio: ${precio} | Categoría: ${categoryName}
                            ${product.isSpecialOffer ? ' | <span class="admin-tag">Oferta</span>' : ''}
                            ${product.isVegetarian ? ' | <span class="admin-tag">Vegetariano</span>' : ''}
                            ${product.isVegan ? ' | <span class="admin-tag">Vegano</span>' : ''}
                            ${product.isGlutenFree ? ' | <span class="admin-tag">Sin Gluten</span>' : ''}
                        </div>
                    </div>
                    <div class="admin-item-status">
                        ${product.isAvailable !== false ? 
                            '<span class="admin-status-active">Disponible</span>' : 
                            '<span class="admin-status-inactive">No Disponible</span>'}
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-btn admin-btn-small admin-btn-edit" data-action="edit">Editar</button>
                    <button class="admin-btn admin-btn-small admin-btn-delete" data-action="delete">Eliminar</button>
                </div>
            `;
            
            // Eventos para botones
            productItem.querySelector('[data-action="edit"]').addEventListener('click', () => {
                this.showProductForm(product.id, product.category);
            });
            
            productItem.querySelector('[data-action="delete"]').addEventListener('click', () => {
                this.deleteProduct(product.id, product.category);
            });
            
            productsList.appendChild(productItem);
        });
    }

    // Filtrar productos por categoría
    filterProducts(categoryId) {
        this.loadProducts(categoryId);
    }

    // Mostrar formulario de producto
    showProductForm(productId = null, productCategory = null) {
        // Guardar ID de producto en edición
        this.editingProductId = productId;
        this.editingProductCategory = productCategory;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'admin-modal admin-modal-large';
        modal.id = 'productFormModal';
        
        // Obtener datos del producto si existe
        let product = null;
        if (productId && productCategory) {
            const productsData = LocalStorageManager.getProducts() || {};
            const categoryProducts = productsData[productCategory] || [];
            product = categoryProducts.find(p => p.id === productId);
        }
        
        // Obtener categorías para el selector
        const categories = LocalStorageManager.getCategories() || [];
        const activeCategories = categories.filter(c => c.isActive);
        
        // Contenido del modal
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>${product ? 'Editar Producto' : 'Añadir Producto'}</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="productForm" class="admin-form">
                        <div class="admin-form-row">
                            <div class="admin-form-group">
                                <label for="productName">Nombre</label>
                                <input type="text" id="productName" class="admin-input" value="${product ? (product.nombre || product.name || '') : ''}">
                            </div>
                            <div class="admin-form-group">
                                <label for="productPrice">Precio</label>
                                <input type="text" id="productPrice" class="admin-input" value="${product ? (product.precio || product.price || '') : ''}">
                            </div>
                        </div>
                        <div class="admin-form-group">
                            <label for="productDescription">Descripción</label>
                            <textarea id="productDescription" class="admin-textarea">${product ? (product.descripcion || product.description || '') : ''}</textarea>
                        </div>
                        <div class="admin-form-group">
                            <label for="productCategory">Categoría</label>
                            <select id="productCategory" class="admin-select">
                                ${activeCategories.map(category => `
                                    <option value="${category.id}" ${product && product.category === category.id ? 'selected' : ''}>
                                        ${category.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="admin-form-row">
                            <div class="admin-form-group">
                                <label>Alérgenos</label>
                                <div class="admin-tags-input">
                                    <input type="text" id="allergenInput" class="admin-input" placeholder="Añadir alérgeno...">
                                    <button type="button" id="addAllergenBtn" class="admin-btn admin-btn-small">Añadir</button>
                                </div>
                                <div id="allergensList" class="admin-tags-list">
                                    ${product && product.allergens ? product.allergens.map(allergen => `
                                        <span class="admin-tag">
                                            ${allergen}
                                            <button type="button" class="admin-tag-remove" data-value="${allergen}">&times;</button>
                                        </span>
                                    `).join('') : ''}
                                </div>
                            </div>
                            <div class="admin-form-group">
                                <label>Etiquetas</label>
                                <div class="admin-tags-input">
                                    <input type="text" id="tagInput" class="admin-input" placeholder="Añadir etiqueta...">
                                    <button type="button" id="addTagBtn" class="admin-btn admin-btn-small">Añadir</button>
                                </div>
                                <div id="tagsList" class="admin-tags-list">
                                    ${product && product.tags ? product.tags.map(tag => `
                                        <span class="admin-tag">
                                            ${tag}
                                            <button type="button" class="admin-tag-remove" data-value="${tag}">&times;</button>
                                        </span>
                                    `).join('') : ''}
                                </div>
                            </div>
                        </div>
                        <div class="admin-form-row">
                            <div class="admin-form-group">
                                <label>Tamaños</label>
                                <div id="sizesList" class="admin-sizes-list">
                                    ${product && product.sizes ? product.sizes.map((size, index) => `
                                        <div class="admin-size-item">
                                            <input type="text" class="admin-input size-name" placeholder="Nombre" value="${size.name}">
                                            <input type="number" class="admin-input size-price" placeholder="Modificador" value="${size.priceModifier}" step="0.1">
                                            <button type="button" class="admin-btn admin-btn-small admin-btn-delete size-remove">&times;</button>
                                        </div>
                                    `).join('') : ''}
                                </div>
                                <button type="button" id="addSizeBtn" class="admin-btn admin-btn-small">Añadir Tamaño</button>
                            </div>
                        </div>
                        <div class="admin-form-row">
                            <div class="admin-form-group">
                                <label>Características</label>
                                <div class="admin-checkbox-group">
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
                                    <label class="admin-checkbox">
                                        <input type="checkbox" id="productAvailable" ${product && product.isAvailable !== false ? 'checked' : ''}>
                                        Disponible
                                    </label>
                                </div>
                            </div>
                            <div class="admin-form-group">
                                <label for="productSpicyLevel">Nivel de Picante</label>
                                <select id="productSpicyLevel" class="admin-select">
                                    <option value="0" ${product && product.spicyLevel === 0 ? 'selected' : ''}>Sin picante</option>
                                    <option value="1" ${product && product.spicyLevel === 1 ? 'selected' : ''}>Suave</option>
                                    <option value="2" ${product && product.spicyLevel === 2 ? 'selected' : ''}>Medio</option>
                                    <option value="3" ${product && product.spicyLevel === 3 ? 'selected' : ''}>Picante</option>
                                    <option value="4" ${product && product.spicyLevel === 4 ? 'selected' : ''}>Muy picante</option>
                                    <option value="5" ${product && product.spicyLevel === 5 ? 'selected' : ''}>Extremadamente picante</option>
                                </select>
                            </div>
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
        
        // Configurar eventos
        this.setupProductFormEvents(modal);
    }

    // Configurar eventos del formulario de producto
    setupProductFormEvents(modal) {
        // Cerrar modal
        modal.querySelector('.admin-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.admin-btn-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Guardar producto
        modal.querySelector('#saveProductBtn').addEventListener('click', () => {
            this.saveProduct();
            document.body.removeChild(modal);
        });
        
        // Añadir alérgeno
        modal.querySelector('#addAllergenBtn').addEventListener('click', () => {
            const input = document.getElementById('allergenInput');
            const value = input.value.trim();
            
            if (value) {
                const allergensList = document.getElementById('allergensList');
                
                // Verificar si ya existe
                if (!allergensList.querySelector(`.admin-tag button[data-value="${value}"]`)) {
                    const tag = document.createElement('span');
                    tag.className = 'admin-tag';
                    tag.innerHTML = `
                        ${value}
                        <button type="button" class="admin-tag-remove" data-value="${value}">&times;</button>
                    `;
                    
                    tag.querySelector('.admin-tag-remove').addEventListener('click', (e) => {
                        allergensList.removeChild(tag);
                    });
                    
                    allergensList.appendChild(tag);
                }
                
                input.value = '';
            }
        });
        
        // Añadir etiqueta
        modal.querySelector('#addTagBtn').addEventListener('click', () => {
            const input = document.getElementById('tagInput');
            const value = input.value.trim();
            
            if (value) {
                const tagsList = document.getElementById('tagsList');
                
                // Verificar si ya existe
                if (!tagsList.querySelector(`.admin-tag button[data-value="${value}"]`)) {
                    const tag = document.createElement('span');
                    tag.className = 'admin-tag';
                    tag.innerHTML = `
                        ${value}
                        <button type="button" class="admin-tag-remove" data-value="${value}">&times;</button>
                    `;
                    
                    tag.querySelector('.admin-tag-remove').addEventListener('click', (e) => {
                        tagsList.removeChild(tag);
                    });
                    
                    tagsList.appendChild(tag);
                }
                
                input.value = '';
            }
        });
        
        // Eliminar etiquetas existentes
        modal.querySelectorAll('.admin-tag-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.closest('.admin-tag');
                tag.parentNode.removeChild(tag);
            });
        });
        
        // Añadir tamaño
        modal.querySelector('#addSizeBtn').addEventListener('click', () => {
            const sizesList = document.getElementById('sizesList');
            
            const sizeItem = document.createElement('div');
            sizeItem.className = 'admin-size-item';
            sizeItem.innerHTML = `
                <input type="text" class="admin-input size-name" placeholder="Nombre">
                <input type="number" class="admin-input size-price" placeholder="Modificador" step="0.1">
                <button type="button" class="admin-btn admin-btn-small admin-btn-delete size-remove">&times;</button>
            `;
            
            sizeItem.querySelector('.size-remove').addEventListener('click', () => {
                sizesList.removeChild(sizeItem);
            });
            
            sizesList.appendChild(sizeItem);
        });
        
        // Eliminar tamaños existentes
        modal.querySelectorAll('.size-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.admin-size-item');
                item.parentNode.removeChild(item);
            });
        });
    }

    // Guardar producto
    saveProduct() {
        // Obtener valores del formulario
        const name = document.getElementById('productName').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const category = document.getElementById('productCategory').value;
        const isSpecialOffer = document.getElementById('productSpecialOffer').checked;
        const isVegetarian = document.getElementById('productVegetarian').checked;
        const isVegan = document.getElementById('productVegan').checked;
        const isGlutenFree = document.getElementById('productGlutenFree').checked;
        const isAvailable = document.getElementById('productAvailable').checked;
        const spicyLevel = parseInt(document.getElementById('productSpicyLevel').value);
        
        // Validar
        if (!name || !price || !category) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        // Obtener alérgenos
        const allergens = [];
        document.querySelectorAll('#allergensList .admin-tag').forEach(tag => {
            const value = tag.querySelector('.admin-tag-remove').dataset.value;
            allergens.push(value);
        });
        
        // Obtener etiquetas
        const tags = [];
        document.querySelectorAll('#tagsList .admin-tag').forEach(tag => {
            const value = tag.querySelector('.admin-tag-remove').dataset.value;
            tags.push(value);
        });
        
        // Obtener tamaños
        const sizes = [];
        document.querySelectorAll('.admin-size-item').forEach(item => {
            const name = item.querySelector('.size-name').value.trim();
            const priceModifier = parseFloat(item.querySelector('.size-price').value) || 0;
            
            if (name) {
                sizes.push({
                    name,
                    priceModifier
                });
            }
        });
        
        // Crear objeto de producto
        const product = {
            id: this.editingProductId || generateUniqueId(),
            name,
            description,
            price,
            allergens,
            tags,
            sizes,
            isSpecialOffer,
            isVegetarian,
            isVegan,
            isGlutenFree,
            isAvailable,
            spicyLevel,
            updatedAt: new Date().toISOString()
        };
        
        // Obtener productos existentes
        const productsData = LocalStorageManager.getProducts() || {};
        
        // Si es una edición y la categoría ha cambiado, eliminar de la categoría anterior
        if (this.editingProductId && this.editingProductCategory && this.editingProductCategory !== category) {
            const oldCategoryProducts = productsData[this.editingProductCategory] || [];
            productsData[this.editingProductCategory] = oldCategoryProducts.filter(p => p.id !== this.editingProductId);
        }
        
        // Asegurarse de que existe la categoría en los datos
        if (!productsData[category]) {
            productsData[category] = [];
        }
        
        // Actualizar o añadir
        if (this.editingProductId) {
            // Actualizar producto existente
            const index = productsData[category].findIndex(p => p.id === this.editingProductId);
            if (index >= 0) {
                productsData[category][index] = product;
            } else {
                productsData[category].push(product);
            }
        } else {
            // Añadir nuevo producto
            productsData[category].push(product);
        }
        
        // Guardar cambios
        LocalStorageManager.saveProducts(productsData);
        
        // Recargar lista
        this.loadProducts(document.getElementById('filterCategorySelect').value);
        
        // Resetear IDs en edición
        this.editingProductId = null;
        this.editingProductCategory = null;
    }

    // Eliminar producto
    deleteProduct(productId, productCategory) {
        if (!confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')) {
            return;
        }
        
        // Obtener productos
        const productsData = LocalStorageManager.getProducts() || {};
        
        // Verificar si existe la categoría
        if (!productsData[productCategory]) return;
        
        // Filtrar producto
        productsData[productCategory] = productsData[productCategory].filter(p => p.id !== productId);
        
        // Guardar cambios
        LocalStorageManager.saveProducts(productsData);
        
        // Recargar lista
        this.loadProducts(document.getElementById('filterCategorySelect').value);
    }

    // Cargar configuración
    loadSettings() {
        // Obtener configuración
        const settings = LocalStorageManager.getSettings();
        if (!settings) return;
        
        // Rellenar formulario
        document.getElementById('restaurantName').value = settings.restaurantName || '';
        document.getElementById('restaurantAddress').value = settings.address || '';
        document.getElementById('restaurantPhone').value = settings.phone || '';
        document.getElementById('restaurantEmail').value = settings.email || '';
        document.getElementById('taxRate').value = settings.taxRate || 0;
        
        // Checkboxes
        document.getElementById('enableReservations').checked = settings.features?.enableReservations || false;
        document.getElementById('enableOnlineOrders').checked = settings.features?.enableOnlineOrders || false;
        document.getElementById('enableRatings').checked = settings.features?.enableRatings || false;
        document.getElementById('enableAllergenInfo').checked = settings.features?.enableAllergenInfo || false;
        document.getElementById('enableNutritionalInfo').checked = settings.features?.enableNutritionalInfo || false;
        document.getElementById('enableDarkMode').checked = settings.features?.enableDarkMode || false;
    }

    // Guardar configuración
    saveSettings() {
        // Obtener valores
        const restaurantName = document.getElementById('restaurantName').value.trim();
        const address = document.getElementById('restaurantAddress').value.trim();
        const phone = document.getElementById('restaurantPhone').value.trim();
        const email = document.getElementById('restaurantEmail').value.trim();
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        
        // Características
        const features = {
            enableReservations: document.getElementById('enableReservations').checked,
            enableOnlineOrders: document.getElementById('enableOnlineOrders').checked,
            enableRatings: document.getElementById('enableRatings').checked,
            enableAllergenInfo: document.getElementById('enableAllergenInfo').checked,
            enableNutritionalInfo: document.getElementById('enableNutritionalInfo').checked,
            enableDarkMode: document.getElementById('enableDarkMode').checked
        };
        
        // Crear objeto de configuración
        const settings = {
            restaurantName,
            address,
            phone,
            email,
            taxRate,
            currency: '€',
            language: 'es',
            theme: features.enableDarkMode ? 'dark' : 'light',
            features,
            updatedAt: new Date().toISOString()
        };
        
        // Guardar cambios
        LocalStorageManager.saveSettings(settings);
        
        // Actualizar interfaz
        this.updateInterfaceWithSettings(settings);
        
        // Mostrar mensaje
        alert('Configuración guardada correctamente.');
    }

    // Actualizar interfaz con la configuración
    updateInterfaceWithSettings(settings) {
        // Actualizar nombre del restaurante
        const logoElement = document.getElementById('barLogo');
        if (logoElement && settings.restaurantName) {
            logoElement.textContent = settings.restaurantName;
        }
        
        // Actualizar información del pie de página
        const footerInfoElement = document.querySelector('.footer-info');
        if (footerInfoElement) {
            const titleElement = footerInfoElement.querySelector('h3');
            if (titleElement && settings.restaurantName) {
                titleElement.textContent = settings.restaurantName;
            }
            
            const addressElement = footerInfoElement.querySelector('p:nth-child(2)');
            if (addressElement && settings.address) {
                addressElement.textContent = settings.address;
            }
            
            const phoneElement = footerInfoElement.querySelector('p:nth-child(3)');
            if (phoneElement && settings.phone) {
                phoneElement.textContent = `Tel: ${settings.phone}`;
            }
        }
        
        // Aplicar modo oscuro si está habilitado
        if (settings.features.enableDarkMode) {
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

    // Cargar estadísticas
    loadStats() {
        // Obtener datos
        const accessCount = LocalStorageManager.getAccessCounter() || 0;
        const productsData = LocalStorageManager.getProducts() || {};
        const categories = LocalStorageManager.getCategories() || [];
        const orders = LocalStorageManager.getOrders() || [];
        
        // Contar productos
        let productCount = 0;
        for (const category in productsData) {
            productCount += productsData[category].length;
        }
        
        // Actualizar valores
        document.getElementById('statsVisits').textContent = accessCount;
        document.getElementById('statsProducts').textContent = productCount;
        document.getElementById('statsCategories').textContent = categories.length;
        document.getElementById('statsOrders').textContent = orders.length;
        
        // Cargar gráficos si existe la librería
        this.loadCharts(productsData, categories, orders);
    }

    // Cargar gráficos
    loadCharts(productsData, categories, orders) {
        // Verificar si existe Chart.js
        if (typeof Chart === 'undefined') {
            // Cargar Chart.js
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                this.createCharts(productsData, categories, orders);
            };
            document.head.appendChild(script);
        } else {
            this.createCharts(productsData, categories, orders);
        }
    }

    // Crear gráficos
    createCharts(productsData, categories, orders) {
        // Datos para gráfico de productos populares
        const popularProductsCanvas = document.getElementById('popularProductsCanvas');
        if (popularProductsCanvas) {
            // Obtener productos más populares (simulado)
            const popularProducts = [];
            for (const category in productsData) {
                productsData[category].forEach(product => {
                    if (product.popularity) {
                        popularProducts.push({
                            name: product.name || product.nombre,
                            popularity: product.popularity
                        });
                    }
                });
            }
            
            // Ordenar por popularidad
            popularProducts.sort((a, b) => b.popularity - a.popularity);
            
            // Tomar los 5 más populares
            const top5 = popularProducts.slice(0, 5);
            
            // Si no hay datos, mostrar datos de ejemplo
            if (top5.length === 0) {
                top5.push(
                    { name: 'Patatas Bravas', popularity: 4.8 },
                    { name: 'Calamares a la Romana', popularity: 4.6 },
                    { name: 'Tortilla Española', popularity: 4.5 },
                    { name: 'Croquetas de Jamón', popularity: 4.3 },
                    { name: 'Ensaladilla Rusa', popularity: 4.2 }
                );
            }
            
            // Crear gráfico
            new Chart(popularProductsCanvas, {
                type: 'bar',
                data: {
                    labels: top5.map(p => p.name),
                    datasets: [{
                        label: 'Popularidad',
                        data: top5.map(p => p.popularity),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });
        }
        
        // Datos para gráfico de ventas por categoría
        const categorySalesCanvas = document.getElementById('categorySalesCanvas');
        if (categorySalesCanvas) {
            // Contar productos por categoría
            const categoryCounts = {};
            for (const category in productsData) {
                categoryCounts[category] = productsData[category].length;
            }
            
            // Obtener nombres de categorías
            const categoryNames = {};
            categories.forEach(cat => {
                categoryNames[cat.id] = cat.name;
            });
            
            // Crear arrays para el gráfico
            const labels = [];
            const data = [];
            const backgroundColors = [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(199, 199, 199, 0.7)',
                'rgba(83, 102, 255, 0.7)',
                'rgba(78, 205, 196, 0.7)',
                'rgba(255, 99, 255, 0.7)'
            ];
            
            let i = 0;
            for (const category in categoryCounts) {
                labels.push(categoryNames[category] || category);
                data.push(categoryCounts[category]);
                i++;
            }
            
            // Crear gráfico
            new Chart(categorySalesCanvas, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Productos por Categoría',
                        data: data,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
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
        this.downloadJSON(data, 'bar-sergios-data.json');
    }

    // Exportar categorías
    exportCategories() {
        const categories = LocalStorageManager.getCategories();
        this.downloadJSON(categories, 'bar-sergios-categories.json');
    }

    // Exportar productos
    exportProducts() {
        const products = LocalStorageManager.getProducts();
        this.downloadJSON(products, 'bar-sergios-products.json');
    }

    // Exportar configuración
    exportSettings() {
        const settings = LocalStorageManager.getSettings();
        this.downloadJSON(settings, 'bar-sergios-settings.json');
    }

    // Exportar mesas
    exportTables() {
        const tables = LocalStorageManager.getTables();
        this.downloadJSON(tables, 'bar-sergios-tables.json');
    }

    // Exportar pedidos
    exportOrders() {
        const orders = LocalStorageManager.getOrders();
        this.downloadJSON(orders, 'bar-sergios-orders.json');
    }

    // Exportar HTML
    exportHtml() {
        fetch('index.html')
            .then(response => response.text())
            .then(html => {
                this.downloadText(html, 'index.html');
            })
            .catch(error => {
                console.error('Error al exportar HTML:', error);
                alert('Error al exportar HTML. Por favor, inténtelo de nuevo.');
            });
    }

    // Exportar CSS
    exportCss() {
        // Exportar styles.css
        fetch('styles.css')
            .then(response => response.text())
            .then(css => {
                this.downloadText(css, 'styles.css');
            })
            .catch(error => {
                console.error('Error al exportar CSS:', error);
                alert('Error al exportar CSS. Por favor, inténtelo de nuevo.');
            });
        
        // Exportar visual-enhancements.css
        fetch('visual-enhancements.css')
            .then(response => response.text())
            .then(css => {
                this.downloadText(css, 'visual-enhancements.css');
            })
            .catch(error => {
                console.error('Error al exportar CSS:', error);
            });
    }

    // Exportar JavaScript
    exportJs() {
        // Exportar script.js
        fetch('script.js')
            .then(response => response.text())
            .then(js => {
                this.downloadText(js, 'script.js');
            })
            .catch(error => {
                console.error('Error al exportar JavaScript:', error);
                alert('Error al exportar JavaScript. Por favor, inténtelo de nuevo.');
            });
        
        // Exportar local-storage.js
        fetch('local-storage.js')
            .then(response => response.text())
            .then(js => {
                this.downloadText(js, 'local-storage.js');
            })
            .catch(error => {
                console.error('Error al exportar JavaScript:', error);
            });
        
        // Exportar admin-panel.js
        const adminPanelJs = `// Admin Panel JavaScript
${this.constructor.toString()}

// Inicializar panel de administración
window.AdminPanel = new AdminPanel();
`;
        this.downloadText(adminPanelJs, 'admin-panel.js');
        
        // Exportar tpv-module.js
        fetch('tpv-module.js')
            .then(response => response.text())
            .then(js => {
                this.downloadText(js, 'tpv-module.js');
            })
            .catch(error => {
                console.error('Error al exportar JavaScript:', error);
            });
        
        // Exportar mobile-optimization.js
        fetch('mobile-optimization.js')
            .then(response => response.text())
            .then(js => {
                this.downloadText(js, 'mobile-optimization.js');
            })
            .catch(error => {
                console.error('Error al exportar JavaScript:', error);
            });
    }

    // Exportar todos los archivos
    exportAllFiles() {
        // Crear un archivo ZIP
        this.createZipFile();
    }

    // Crear archivo ZIP
    createZipFile() {
        // Verificar si existe JSZip
        if (typeof JSZip === 'undefined') {
            // Cargar JSZip
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => {
                this.generateZipFile();
            };
            document.head.appendChild(script);
        } else {
            this.generateZipFile();
        }
    }

    // Generar archivo ZIP
    generateZipFile() {
        const zip = new JSZip();
        
        // Añadir archivos al ZIP
        const files = [
            'index.html',
            'styles.css',
            'visual-enhancements.css',
            'script.js',
            'local-storage.js',
            'mobile-optimization.js',
            'tpv-module.js'
        ];
        
        // Añadir admin-panel.js
        const adminPanelJs = `// Admin Panel JavaScript
${this.constructor.toString()}

// Inicializar panel de administración
window.AdminPanel = new AdminPanel();
`;
        zip.file('admin-panel.js', adminPanelJs);
        
        // Añadir README.md
        const readme = `# Bar Sergio's - Carta Digital

## Descripción
Aplicación web moderna para mostrar la carta de productos del Bar Sergio's, con panel de administración y módulo TPV.

## Características
- Interfaz moderna y responsive
- Panel de administración (CTRL+M)
- Módulo TPV/comandero
- Almacenamiento local
- Contador de accesos
- Opciones para productos (alérgenos, tamaños, etc.)
- Optimización para dispositivos móviles

## Archivos
- index.html: Página principal
- styles.css: Estilos principales
- visual-enhancements.css: Mejoras visuales
- script.js: Funcionalidad principal
- local-storage.js: Gestión de almacenamiento local
- admin-panel.js: Panel de administración
- tpv-module.js: Módulo TPV/comandero
- mobile-optimization.js: Optimización para dispositivos móviles

## Uso
1. Abra index.html en su navegador
2. Acceda al panel de administración con CTRL+M
3. Gestione categorías, productos y configuración
4. Acceda al TPV desde el panel de administración

## Contacto
Para más información, contacte con el desarrollador.
`;
        zip.file('README.md', readme);
        
        // Añadir datos
        const data = LocalStorageManager.exportData();
        zip.file('data.json', JSON.stringify(data, null, 2));
        
        // Obtener archivos
        const promises = files.map(file => 
            fetch(file)
                .then(response => response.text())
                .then(content => {
                    zip.file(file, content);
                })
                .catch(error => {
                    console.error(`Error al añadir ${file}:`, error);
                })
        );
        
        // Generar ZIP cuando todos los archivos estén añadidos
        Promise.all(promises)
            .then(() => {
                zip.generateAsync({ type: 'blob' })
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'bar-sergios-app.zip';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    });
            });
    }

    // Descargar JSON
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        this.downloadText(json, filename);
    }

    // Descargar texto
    downloadText(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
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
            alert('El módulo TPV no está disponible. Por favor, cargue tpv-module.js primero.');
        }
    }

    // Añadir estilos para el panel de administración
    addAdminStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('adminStyles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'adminStyles';
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
            }
            
            .admin-tab-content.active {
                display: block;
            }
            
            .admin-tab-content h3 {
                margin-top: 0;
                color: var(--color-primary);
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
                gap: 0.5rem;
            }
            
            .admin-item-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .admin-item-icon {
                width: 40px;
                height: 40px;
                background-color: #f0f0f0;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--color-primary);
                font-size: 1.2rem;
            }
            
            .admin-item-details {
                flex: 1;
            }
            
            .admin-item-name {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .admin-item-description {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
            }
            
            .admin-item-meta {
                color: #999;
                font-size: 0.8rem;
            }
            
            .admin-item-status {
                margin-left: auto;
            }
            
            .admin-status-active {
                color: #4caf50;
                font-weight: 600;
            }
            
            .admin-status-inactive {
                color: #f44336;
                font-weight: 600;
            }
            
            .admin-item-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }
            
            .admin-btn {
                background-color: #f0f0f0;
                border: none;
                padding: 0.5rem 1rem;
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
                padding: 0.25rem 0.5rem;
                font-size: 0.8rem;
            }
            
            .admin-btn-edit {
                background-color: #2196f3;
                color: white;
            }
            
            .admin-btn-edit:hover {
                background-color: #1976d2;
            }
            
            .admin-btn-delete {
                background-color: #f44336;
                color: white;
            }
            
            .admin-btn-delete:hover {
                background-color: #d32f2f;
            }
            
            .admin-select {
                padding: 0.5rem;
                border-radius: 4px;
                border: 1px solid #ddd;
                min-width: 200px;
            }
            
            .admin-empty-list {
                text-align: center;
                padding: 2rem;
                color: #999;
            }
            
            .admin-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .admin-form-row {
                display: flex;
                gap: 1rem;
            }
            
            .admin-form-group {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .admin-form-group label {
                font-weight: 600;
            }
            
            .admin-input, .admin-textarea, .admin-select {
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: inherit;
            }
            
            .admin-textarea {
                min-height: 100px;
                resize: vertical;
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
                max-width: 500px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .admin-modal-large {
                max-width: 800px;
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
            
            .admin-tags-input {
                display: flex;
                gap: 0.5rem;
            }
            
            .admin-tags-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }
            
            .admin-tag {
                background-color: #e3f2fd;
                color: #1565c0;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .admin-tag-remove {
                background: none;
                border: none;
                color: #1565c0;
                cursor: pointer;
                font-size: 0.9rem;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .admin-sizes-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }
            
            .admin-size-item {
                display: flex;
                gap: 0.5rem;
                align-items: center;
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
                margin-bottom: 1.5rem;
            }
            
            .admin-stats-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                text-align: center;
            }
            
            .admin-stats-card h4 {
                margin-top: 0;
                color: var(--color-primary);
            }
            
            .admin-stats-value {
                font-size: 2rem;
                font-weight: 600;
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
                text-align: center;
            }
            
            .chart-container {
                height: 300px;
                position: relative;
            }
            
            .chart-placeholder {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                color: #999;
            }
            
            .chart-placeholder i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            /* Estilos para modo oscuro */
            .dark-mode .admin-panel {
                background-color: #121212;
                color: #f1f1f1;
            }
            
            .dark-mode .admin-tabs {
                background-color: #1a1a2e;
                border-bottom-color: #333;
            }
            
            .dark-mode .admin-tab-btn {
                color: #ccc;
            }
            
            .dark-mode .admin-tab-btn.active {
                color: var(--color-accent);
                border-bottom-color: var(--color-accent);
            }
            
            .dark-mode .admin-list-item,
            .dark-mode .admin-export-option,
            .dark-mode .admin-stats-card,
            .dark-mode .admin-stats-chart,
            .dark-mode .admin-modal-content {
                background-color: #1f2937;
                color: #f1f1f1;
            }
            
            .dark-mode .admin-item-description {
                color: #ccc;
            }
            
            .dark-mode .admin-item-meta {
                color: #999;
            }
            
            .dark-mode .admin-btn {
                background-color: #333;
                color: #f1f1f1;
            }
            
            .dark-mode .admin-btn:hover {
                background-color: #444;
            }
            
            .dark-mode .admin-input,
            .dark-mode .admin-textarea,
            .dark-mode .admin-select {
                background-color: #333;
                color: #f1f1f1;
                border-color: #555;
            }
            
            .dark-mode .admin-modal-header,
            .dark-mode .admin-modal-footer {
                border-color: #333;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .admin-form-row {
                    flex-direction: column;
                }
                
                .admin-stats-charts {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
}

// Función para generar ID único
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Inicializar panel de administración
window.AdminPanel = new AdminPanel();
