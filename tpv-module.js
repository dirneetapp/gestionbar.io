// Módulo TPV (Terminal Punto de Venta) para Bar Sergio's
// Este archivo implementa todas las funcionalidades del TPV/comandero

class TPVModule {
    constructor() {
        this.isOpen = false;
        this.activeTab = 'tables';
        this.currentTable = null;
        this.currentOrder = null;
        this.orders = [];
    }

    // Inicializar el TPV
    initialize() {
        // Crear el TPV si no existe
        this.createTPVInterface();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Cargar datos iniciales
        this.loadInitialData();
    }

    // Crear la interfaz del TPV
    createTPVInterface() {
        // Verificar si ya existe
        if (document.getElementById('tpvModule')) return;
        
        // Crear el elemento del TPV
        const tpvModule = document.createElement('div');
        tpvModule.id = 'tpvModule';
        tpvModule.className = 'tpv-module';
        tpvModule.style.display = 'none';
        
        // Estructura HTML del TPV
        tpvModule.innerHTML = `
            <div class="tpv-header">
                <h2>Terminal Punto de Venta</h2>
                <button id="closeTPVBtn" class="tpv-close-btn">&times;</button>
            </div>
            <div class="tpv-tabs">
                <button class="tpv-tab-btn active" data-tab="tables">Mesas</button>
                <button class="tpv-tab-btn" data-tab="orders">Pedidos</button>
                <button class="tpv-tab-btn" data-tab="products">Productos</button>
                <button class="tpv-tab-btn" data-tab="reports">Informes</button>
            </div>
            <div class="tpv-content">
                <!-- Pestaña de Mesas -->
                <div class="tpv-tab-content active" id="tables-tab">
                    <div class="tpv-tables-container">
                        <div class="tpv-tables-section">
                            <h3>Mesas</h3>
                            <div class="tpv-tables-grid" id="tablesGrid">
                                <!-- Las mesas se cargarán dinámicamente -->
                            </div>
                        </div>
                        <div class="tpv-tables-section">
                            <h3>Barra</h3>
                            <div class="tpv-bar-grid" id="barGrid">
                                <!-- Los taburetes de barra se cargarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pestaña de Pedidos -->
                <div class="tpv-tab-content" id="orders-tab">
                    <div class="tpv-orders-container">
                        <div class="tpv-orders-list" id="ordersList">
                            <!-- Los pedidos se cargarán dinámicamente -->
                        </div>
                        <div class="tpv-order-details" id="orderDetails">
                            <!-- Los detalles del pedido seleccionado se mostrarán aquí -->
                        </div>
                    </div>
                </div>

                <!-- Pestaña de Productos -->
                <div class="tpv-tab-content" id="products-tab">
                    <div class="tpv-products-container">
                        <div class="tpv-categories-list" id="tpvCategoriesList">
                            <!-- Las categorías se cargarán dinámicamente -->
                        </div>
                        <div class="tpv-products-grid" id="tpvProductsGrid">
                            <!-- Los productos se cargarán dinámicamente -->
                        </div>
                    </div>
                </div>

                <!-- Pestaña de Informes -->
                <div class="tpv-tab-content" id="reports-tab">
                    <div class="tpv-reports-container">
                        <div class="tpv-reports-options">
                            <h3>Informes</h3>
                            <div class="tpv-reports-filters">
                                <div class="tpv-form-group">
                                    <label for="reportType">Tipo de Informe</label>
                                    <select id="reportType" class="tpv-select">
                                        <option value="daily">Ventas Diarias</option>
                                        <option value="weekly">Ventas Semanales</option>
                                        <option value="monthly">Ventas Mensuales</option>
                                        <option value="products">Productos Vendidos</option>
                                        <option value="categories">Ventas por Categoría</option>
                                    </select>
                                </div>
                                <div class="tpv-form-group">
                                    <label for="reportDate">Fecha</label>
                                    <input type="date" id="reportDate" class="tpv-input" value="${new Date().toISOString().split('T')[0]}">
                                </div>
                                <button id="generateReportBtn" class="tpv-btn tpv-btn-primary">Generar Informe</button>
                            </div>
                        </div>
                        <div class="tpv-report-results" id="reportResults">
                            <!-- Los resultados del informe se mostrarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(tpvModule);
        
        // Añadir estilos si no existen
        this.addTPVStyles();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Cerrar TPV
        document.getElementById('closeTPVBtn').addEventListener('click', () => {
            this.close();
        });
        
        // Cambiar de pestaña
        document.querySelectorAll('.tpv-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTab(e.target.dataset.tab);
            });
        });
        
        // Generar informe
        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.generateReport();
        });
    }

    // Cargar datos iniciales
    loadInitialData() {
        // Cargar mesas
        this.loadTables();
        
        // Cargar pedidos
        this.loadOrders();
        
        // Cargar categorías para la pestaña de productos
        this.loadTPVCategories();
    }

    // Abrir el TPV
    open() {
        const tpvModule = document.getElementById('tpvModule');
        if (tpvModule) {
            tpvModule.style.display = 'block';
            this.isOpen = true;
            
            // Recargar datos por si han cambiado
            this.loadInitialData();
        }
    }

    // Cerrar el TPV
    close() {
        const tpvModule = document.getElementById('tpvModule');
        if (tpvModule) {
            tpvModule.style.display = 'none';
            this.isOpen = false;
        }
    }

    // Cambiar de pestaña
    changeTab(tabId) {
        // Actualizar botones de pestañas
        document.querySelectorAll('.tpv-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
        
        // Actualizar contenido de pestañas
        document.querySelectorAll('.tpv-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
        
        // Actualizar pestaña activa
        this.activeTab = tabId;
        
        // Cargar datos específicos de la pestaña
        if (tabId === 'products' && !document.querySelector('#tpvCategoriesList .tpv-category-item')) {
            this.loadTPVCategories();
        }
    }

    // Cargar mesas
    loadTables() {
        const tablesGrid = document.getElementById('tablesGrid');
        const barGrid = document.getElementById('barGrid');
        
        if (!tablesGrid || !barGrid) return;
        
        // Limpiar contenedores
        tablesGrid.innerHTML = '';
        barGrid.innerHTML = '';
        
        // Obtener mesas
        const tables = LocalStorageManager.getTables();
        
        if (!tables || tables.length === 0) {
            tablesGrid.innerHTML = '<div class="tpv-empty-message">No hay mesas disponibles</div>';
            barGrid.innerHTML = '<div class="tpv-empty-message">No hay taburetes disponibles</div>';
            return;
        }
        
        // Obtener pedidos activos
        const orders = LocalStorageManager.getOrders() || [];
        const activeOrders = orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled');
        
        // Crear elemento para cada mesa
        tables.forEach(table => {
            if (!table.isActive) return;
            
            const tableItem = document.createElement('div');
            tableItem.className = 'tpv-table-item';
            tableItem.dataset.id = table.id;
            
            // Verificar si la mesa tiene un pedido activo
            const tableOrder = activeOrders.find(order => order.tableId === table.id);
            if (tableOrder) {
                tableItem.classList.add('tpv-table-occupied');
            }
            
            tableItem.innerHTML = `
                <div class="tpv-table-content">
                    <div class="tpv-table-name">${table.name}</div>
                    <div class="tpv-table-capacity">${table.capacity} pax</div>
                    ${tableOrder ? `<div class="tpv-table-order-info">Pedido #${tableOrder.id}</div>` : ''}
                </div>
            `;
            
            tableItem.addEventListener('click', () => {
                this.selectTable(table.id);
            });
            
            // Añadir a la cuadrícula correspondiente
            if (table.type === 'bar') {
                barGrid.appendChild(tableItem);
            } else {
                tablesGrid.appendChild(tableItem);
            }
        });
        
        // Añadir botón para añadir mesa
        const addTableBtn = document.createElement('div');
        addTableBtn.className = 'tpv-table-item tpv-add-table';
        addTableBtn.innerHTML = `
            <div class="tpv-table-content">
                <div class="tpv-add-icon">+</div>
                <div class="tpv-add-text">Añadir Mesa</div>
            </div>
        `;
        
        addTableBtn.addEventListener('click', () => {
            this.showTableForm();
        });
        
        tablesGrid.appendChild(addTableBtn);
        
        // Añadir botón para añadir taburete
        const addBarBtn = document.createElement('div');
        addBarBtn.className = 'tpv-table-item tpv-add-table';
        addBarBtn.innerHTML = `
            <div class="tpv-table-content">
                <div class="tpv-add-icon">+</div>
                <div class="tpv-add-text">Añadir Taburete</div>
            </div>
        `;
        
        addBarBtn.addEventListener('click', () => {
            this.showTableForm('bar');
        });
        
        barGrid.appendChild(addBarBtn);
    }

    // Seleccionar mesa
    selectTable(tableId) {
        this.currentTable = tableId;
        
        // Actualizar selección visual
        document.querySelectorAll('.tpv-table-item').forEach(item => {
            item.classList.remove('tpv-table-selected');
            if (item.dataset.id === tableId) {
                item.classList.add('tpv-table-selected');
            }
        });
        
        // Obtener pedidos activos
        const orders = LocalStorageManager.getOrders() || [];
        const tableOrder = orders.find(order => order.tableId === tableId && order.status !== 'completed' && order.status !== 'cancelled');
        
        if (tableOrder) {
            // Si hay un pedido activo, mostrar detalles
            this.currentOrder = tableOrder.id;
            this.showOrderDetails(tableOrder.id);
        } else {
            // Si no hay pedido activo, mostrar formulario para nuevo pedido
            this.showNewOrderForm(tableId);
        }
    }

    // Mostrar formulario para nueva mesa
    showTableForm(type = 'table') {
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'tpv-modal';
        modal.id = 'tableFormModal';
        
        // Contenido del modal
        modal.innerHTML = `
            <div class="tpv-modal-content">
                <div class="tpv-modal-header">
                    <h3>${type === 'bar' ? 'Añadir Taburete' : 'Añadir Mesa'}</h3>
                    <button class="tpv-modal-close">&times;</button>
                </div>
                <div class="tpv-modal-body">
                    <form id="tableForm" class="tpv-form">
                        <div class="tpv-form-group">
                            <label for="tableName">Nombre</label>
                            <input type="text" id="tableName" class="tpv-input" placeholder="${type === 'bar' ? 'Barra 1' : 'Mesa 1'}">
                        </div>
                        <div class="tpv-form-group">
                            <label for="tableCapacity">Capacidad</label>
                            <input type="number" id="tableCapacity" class="tpv-input" min="1" value="${type === 'bar' ? '1' : '4'}">
                        </div>
                    </form>
                </div>
                <div class="tpv-modal-footer">
                    <button class="tpv-btn tpv-btn-cancel">Cancelar</button>
                    <button class="tpv-btn tpv-btn-primary" id="saveTableBtn">Guardar</button>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(modal);
        
        // Eventos
        modal.querySelector('.tpv-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.tpv-btn-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#saveTableBtn').addEventListener('click', () => {
            this.saveTable(type);
            document.body.removeChild(modal);
        });
    }

    // Guardar mesa
    saveTable(type) {
        // Obtener valores del formulario
        const name = document.getElementById('tableName').value.trim();
        const capacity = parseInt(document.getElementById('tableCapacity').value) || (type === 'bar' ? 1 : 4);
        
        // Validar
        if (!name) {
            alert('Por favor, introduzca un nombre para la mesa.');
            return;
        }
        
        // Obtener mesas existentes
        const tables = LocalStorageManager.getTables() || [];
        
        // Generar ID único
        const id = `${type}_${Date.now()}`;
        
        // Crear objeto de mesa
        const table = {
            id,
            name,
            capacity,
            isActive: true,
            type
        };
        
        // Añadir mesa
        tables.push(table);
        
        // Guardar cambios
        LocalStorageManager.saveTables(tables);
        
        // Recargar mesas
        this.loadTables();
    }

    // Mostrar formulario para nuevo pedido
    showNewOrderForm(tableId) {
        // Cambiar a la pestaña de productos
        this.changeTab('products');
        
        // Obtener información de la mesa
        const tables = LocalStorageManager.getTables() || [];
        const table = tables.find(t => t.id === tableId);
        
        if (!table) return;
        
        // Crear nuevo pedido
        const orderId = `order_${Date.now()}`;
        this.currentOrder = orderId;
        
        // Crear objeto de pedido
        const order = {
            id: orderId,
            tableId,
            tableName: table.name,
            items: [],
            status: 'open',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Obtener pedidos existentes
        const orders = LocalStorageManager.getOrders() || [];
        
        // Añadir pedido
        orders.push(order);
        
        // Guardar cambios
        LocalStorageManager.saveOrders(orders);
        
        // Actualizar estado de la mesa
        document.querySelector(`.tpv-table-item[data-id="${tableId}"]`).classList.add('tpv-table-occupied');
        
        // Mostrar mensaje
        alert(`Nuevo pedido creado para ${table.name}. Añada productos al pedido.`);
    }

    // Cargar pedidos
    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        
        if (!ordersList) return;
        
        // Limpiar lista
        ordersList.innerHTML = '';
        
        // Obtener pedidos
        const orders = LocalStorageManager.getOrders();
        
        if (!orders || orders.length === 0) {
            ordersList.innerHTML = '<div class="tpv-empty-message">No hay pedidos disponibles</div>';
            return;
        }
        
        // Ordenar pedidos por fecha (más recientes primero)
        const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Crear elemento para cada pedido
        sortedOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'tpv-order-item';
            orderItem.dataset.id = order.id;
            
            // Añadir clase según estado
            orderItem.classList.add(`tpv-order-${order.status}`);
            
            // Calcular total
            let total = 0;
            order.items.forEach(item => {
                total += item.price * item.quantity;
            });
            
            // Formatear fecha
            const date = new Date(order.createdAt);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            orderItem.innerHTML = `
                <div class="tpv-order-header">
                    <div class="tpv-order-id">Pedido #${order.id.replace('order_', '')}</div>
                    <div class="tpv-order-status">${this.getStatusLabel(order.status)}</div>
                </div>
                <div class="tpv-order-info">
                    <div class="tpv-order-table">${order.tableName}</div>
                    <div class="tpv-order-date">${formattedDate}</div>
                    <div class="tpv-order-items">${order.items.length} productos</div>
                    <div class="tpv-order-total">${total.toFixed(2)} €</div>
                </div>
            `;
            
            orderItem.addEventListener('click', () => {
                this.showOrderDetails(order.id);
            });
            
            ordersList.appendChild(orderItem);
        });
    }

    // Mostrar detalles de pedido
    showOrderDetails(orderId) {
        const orderDetails = document.getElementById('orderDetails');
        
        if (!orderDetails) return;
        
        // Obtener pedido
        const orders = LocalStorageManager.getOrders() || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            orderDetails.innerHTML = '<div class="tpv-empty-message">Pedido no encontrado</div>';
            return;
        }
        
        // Actualizar selección en la lista
        document.querySelectorAll('.tpv-order-item').forEach(item => {
            item.classList.remove('tpv-order-selected');
            if (item.dataset.id === orderId) {
                item.classList.add('tpv-order-selected');
            }
        });
        
        // Calcular total
        let subtotal = 0;
        order.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Obtener configuración para impuestos
        const settings = LocalStorageManager.getSettings() || {};
        const taxRate = settings.taxRate || 10;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        
        // Crear HTML para detalles
        let detailsHTML = `
            <div class="tpv-order-details-header">
                <h3>Detalles del Pedido</h3>
                <div class="tpv-order-details-info">
                    <div class="tpv-order-details-id">Pedido #${order.id.replace('order_', '')}</div>
                    <div class="tpv-order-details-table">${order.tableName}</div>
                    <div class="tpv-order-details-date">${new Date(order.createdAt).toLocaleString()}</div>
                    <div class="tpv-order-details-status">${this.getStatusLabel(order.status)}</div>
                </div>
            </div>
            <div class="tpv-order-details-items">
                <table class="tpv-order-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Añadir filas para cada producto
        if (order.items.length === 0) {
            detailsHTML += `
                <tr>
                    <td colspan="5" class="tpv-empty-message">No hay productos en este pedido</td>
                </tr>
            `;
        } else {
            order.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                detailsHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.price.toFixed(2)} €</td>
                        <td>
                            <div class="tpv-quantity-control">
                                <button class="tpv-quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="tpv-quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                            </div>
                        </td>
                        <td>${itemTotal.toFixed(2)} €</td>
                        <td>
                            <button class="tpv-btn tpv-btn-small tpv-btn-delete" data-action="remove" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
        
        detailsHTML += `
                    </tbody>
                </table>
            </div>
            <div class="tpv-order-details-summary">
                <div class="tpv-order-summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)} €</span>
                </div>
                <div class="tpv-order-summary-row">
                    <span>IVA (${taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)} €</span>
                </div>
                <div class="tpv-order-summary-row tpv-order-total-row">
                    <span>Total:</span>
                    <span>${total.toFixed(2)} €</span>
                </div>
            </div>
        `;
        
        // Añadir botones de acción según estado
        detailsHTML += `
            <div class="tpv-order-details-actions">
        `;
        
        if (order.status === 'open') {
            detailsHTML += `
                <button class="tpv-btn tpv-btn-primary" id="addProductsBtn">Añadir Productos</button>
                <button class="tpv-btn tpv-btn-success" id="completeOrderBtn">Completar Pedido</button>
                <button class="tpv-btn tpv-btn-danger" id="cancelOrderBtn">Cancelar Pedido</button>
            `;
        } else if (order.status === 'completed') {
            detailsHTML += `
                <button class="tpv-btn tpv-btn-primary" id="printReceiptBtn">Imprimir Ticket</button>
                <button class="tpv-btn" id="newOrderBtn">Nuevo Pedido</button>
            `;
        } else if (order.status === 'cancelled') {
            detailsHTML += `
                <button class="tpv-btn" id="newOrderBtn">Nuevo Pedido</button>
            `;
        }
        
        detailsHTML += `
            </div>
        `;
        
        // Actualizar contenido
        orderDetails.innerHTML = detailsHTML;
        
        // Configurar eventos
        this.setupOrderDetailsEvents(order);
    }

    // Configurar eventos para detalles de pedido
    setupOrderDetailsEvents(order) {
        // Botones de cantidad
        document.querySelectorAll('.tpv-quantity-btn[data-action="decrease"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateItemQuantity(order.id, btn.dataset.id, -1);
            });
        });
        
        document.querySelectorAll('.tpv-quantity-btn[data-action="increase"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.updateItemQuantity(order.id, btn.dataset.id, 1);
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.tpv-btn-delete[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeOrderItem(order.id, btn.dataset.id);
            });
        });
        
        // Botón añadir productos
        const addProductsBtn = document.getElementById('addProductsBtn');
        if (addProductsBtn) {
            addProductsBtn.addEventListener('click', () => {
                this.changeTab('products');
            });
        }
        
        // Botón completar pedido
        const completeOrderBtn = document.getElementById('completeOrderBtn');
        if (completeOrderBtn) {
            completeOrderBtn.addEventListener('click', () => {
                this.updateOrderStatus(order.id, 'completed');
            });
        }
        
        // Botón cancelar pedido
        const cancelOrderBtn = document.getElementById('cancelOrderBtn');
        if (cancelOrderBtn) {
            cancelOrderBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de que desea cancelar este pedido?')) {
                    this.updateOrderStatus(order.id, 'cancelled');
                }
            });
        }
        
        // Botón imprimir ticket
        const printReceiptBtn = document.getElementById('printReceiptBtn');
        if (printReceiptBtn) {
            printReceiptBtn.addEventListener('click', () => {
                this.printReceipt(order.id);
            });
        }
        
        // Botón nuevo pedido
        const newOrderBtn = document.getElementById('newOrderBtn');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', () => {
                this.changeTab('tables');
            });
        }
    }

    // Actualizar cantidad de producto en pedido
    updateItemQuantity(orderId, itemId, change) {
        // Obtener pedidos
        const orders = LocalStorageManager.getOrders() || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) return;
        
        // Obtener producto
        const itemIndex = orders[orderIndex].items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;
        
        // Actualizar cantidad
        orders[orderIndex].items[itemIndex].quantity += change;
        
        // Si la cantidad es 0 o menos, eliminar producto
        if (orders[orderIndex].items[itemIndex].quantity <= 0) {
            orders[orderIndex].items.splice(itemIndex, 1);
        }
        
        // Actualizar fecha de modificación
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        // Guardar cambios
        LocalStorageManager.saveOrders(orders);
        
        // Actualizar vista
        this.showOrderDetails(orderId);
    }

    // Eliminar producto de pedido
    removeOrderItem(orderId, itemId) {
        if (!confirm('¿Está seguro de que desea eliminar este producto del pedido?')) {
            return;
        }
        
        // Obtener pedidos
        const orders = LocalStorageManager.getOrders() || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) return;
        
        // Eliminar producto
        orders[orderIndex].items = orders[orderIndex].items.filter(item => item.id !== itemId);
        
        // Actualizar fecha de modificación
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        // Guardar cambios
        LocalStorageManager.saveOrders(orders);
        
        // Actualizar vista
        this.showOrderDetails(orderId);
    }

    // Actualizar estado de pedido
    updateOrderStatus(orderId, status) {
        // Obtener pedidos
        const orders = LocalStorageManager.getOrders() || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) return;
        
        // Actualizar estado
        orders[orderIndex].status = status;
        
        // Actualizar fecha de modificación
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        // Si se completa o cancela, liberar mesa
        if (status === 'completed' || status === 'cancelled') {
            const tableId = orders[orderIndex].tableId;
            const tableElement = document.querySelector(`.tpv-table-item[data-id="${tableId}"]`);
            
            if (tableElement) {
                tableElement.classList.remove('tpv-table-occupied');
                tableElement.classList.remove('tpv-table-selected');
            }
        }
        
        // Guardar cambios
        LocalStorageManager.saveOrders(orders);
        
        // Actualizar vistas
        this.loadOrders();
        this.showOrderDetails(orderId);
    }

    // Imprimir ticket
    printReceipt(orderId) {
        // Obtener pedido
        const orders = LocalStorageManager.getOrders() || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return;
        
        // Obtener configuración
        const settings = LocalStorageManager.getSettings() || {};
        
        // Calcular totales
        let subtotal = 0;
        order.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        const taxRate = settings.taxRate || 10;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        
        // Crear contenido del ticket
        const receiptContent = `
            <div class="tpv-receipt">
                <div class="tpv-receipt-header">
                    <h2>${settings.restaurantName || 'Bar Sergio\'s'}</h2>
                    <p>${settings.address || 'Calle Principal 123, Ciudad'}</p>
                    <p>Tel: ${settings.phone || '123-456-789'}</p>
                    <p>Fecha: ${new Date(order.createdAt).toLocaleString()}</p>
                    <p>Pedido #${order.id.replace('order_', '')}</p>
                    <p>Mesa: ${order.tableName}</p>
                </div>
                <div class="tpv-receipt-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price.toFixed(2)} €</td>
                                    <td>${(item.price * item.quantity).toFixed(2)} €</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="tpv-receipt-summary">
                    <p>Subtotal: ${subtotal.toFixed(2)} €</p>
                    <p>IVA (${taxRate}%): ${taxAmount.toFixed(2)} €</p>
                    <p class="tpv-receipt-total">Total: ${total.toFixed(2)} €</p>
                </div>
                <div class="tpv-receipt-footer">
                    <p>¡Gracias por su visita!</p>
                </div>
            </div>
        `;
        
        // Crear ventana para imprimir
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Ticket - Pedido #${order.id.replace('order_', '')}</title>
                    <style>
                        body {
                            font-family: 'Courier New', monospace;
                            width: 80mm;
                            margin: 0 auto;
                            padding: 5mm;
                        }
                        .tpv-receipt {
                            text-align: center;
                        }
                        .tpv-receipt-header h2 {
                            margin: 0;
                            font-size: 16pt;
                        }
                        .tpv-receipt-header p {
                            margin: 2px 0;
                            font-size: 10pt;
                        }
                        .tpv-receipt-items {
                            margin: 10px 0;
                        }
                        .tpv-receipt-items table {
                            width: 100%;
                            border-collapse: collapse;
                            font-size: 10pt;
                        }
                        .tpv-receipt-items th {
                            border-bottom: 1px solid #000;
                            text-align: left;
                            padding: 2px;
                        }
                        .tpv-receipt-items td {
                            padding: 2px;
                        }
                        .tpv-receipt-summary {
                            margin-top: 10px;
                            text-align: right;
                            font-size: 10pt;
                        }
                        .tpv-receipt-total {
                            font-weight: bold;
                            font-size: 12pt;
                        }
                        .tpv-receipt-footer {
                            margin-top: 20px;
                            font-size: 10pt;
                            border-top: 1px solid #000;
                            padding-top: 10px;
                        }
                        @media print {
                            body {
                                width: 100%;
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${receiptContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Cargar categorías para TPV
    loadTPVCategories() {
        const categoriesList = document.getElementById('tpvCategoriesList');
        
        if (!categoriesList) return;
        
        // Limpiar lista
        categoriesList.innerHTML = '';
        
        // Obtener categorías
        const categories = LocalStorageManager.getCategories();
        
        if (!categories || categories.length === 0) {
            categoriesList.innerHTML = '<div class="tpv-empty-message">No hay categorías disponibles</div>';
            return;
        }
        
        // Ordenar categorías
        const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
        
        // Crear elemento para cada categoría
        sortedCategories.forEach(category => {
            if (!category.isActive) return;
            
            const categoryItem = document.createElement('div');
            categoryItem.className = 'tpv-category-item';
            categoryItem.dataset.id = category.id;
            
            categoryItem.innerHTML = `
                <div class="tpv-category-icon">
                    <i class="fas fa-${category.icon}"></i>
                </div>
                <div class="tpv-category-name">${category.name}</div>
            `;
            
            categoryItem.addEventListener('click', () => {
                this.selectTPVCategory(category.id);
            });
            
            categoriesList.appendChild(categoryItem);
        });
        
        // Seleccionar primera categoría por defecto
        if (sortedCategories.length > 0 && sortedCategories[0].isActive) {
            this.selectTPVCategory(sortedCategories[0].id);
        }
    }

    // Seleccionar categoría en TPV
    selectTPVCategory(categoryId) {
        // Actualizar selección visual
        document.querySelectorAll('.tpv-category-item').forEach(item => {
            item.classList.remove('tpv-category-selected');
            if (item.dataset.id === categoryId) {
                item.classList.add('tpv-category-selected');
            }
        });
        
        // Cargar productos de la categoría
        this.loadTPVProducts(categoryId);
    }

    // Cargar productos para TPV
    loadTPVProducts(categoryId) {
        const productsGrid = document.getElementById('tpvProductsGrid');
        
        if (!productsGrid) return;
        
        // Limpiar contenedor
        productsGrid.innerHTML = '';
        
        // Obtener productos
        const productsData = LocalStorageManager.getProducts();
        
        if (!productsData || !productsData[categoryId]) {
            productsGrid.innerHTML = '<div class="tpv-empty-message">No hay productos en esta categoría</div>';
            return;
        }
        
        // Filtrar productos disponibles
        const categoryProducts = productsData[categoryId].filter(product => product.isAvailable !== false);
        
        if (categoryProducts.length === 0) {
            productsGrid.innerHTML = '<div class="tpv-empty-message">No hay productos disponibles en esta categoría</div>';
            return;
        }
        
        // Crear elemento para cada producto
        categoryProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'tpv-product-card';
            productCard.dataset.id = product.id;
            
            if (product.isSpecialOffer) {
                productCard.classList.add('tpv-product-special');
            }
            
            // Obtener nombre y descripción del producto
            const nombre = product.nombre || product.name;
            const descripcion = product.descripcion || product.description;
            const precio = product.precio || product.price;
            
            productCard.innerHTML = `
                <div class="tpv-product-content">
                    <h3 class="tpv-product-title">${nombre}</h3>
                    <p class="tpv-product-description">${descripcion}</p>
                    <div class="tpv-product-price">${precio}</div>
                </div>
            `;
            
            productCard.addEventListener('click', () => {
                this.addProductToOrder(product, categoryId);
            });
            
            productsGrid.appendChild(productCard);
        });
    }

    // Añadir producto a pedido
    addProductToOrder(product, categoryId) {
        // Verificar si hay un pedido activo
        if (!this.currentOrder) {
            alert('No hay un pedido activo. Por favor, seleccione una mesa primero.');
            this.changeTab('tables');
            return;
        }
        
        // Obtener pedidos
        const orders = LocalStorageManager.getOrders() || [];
        const orderIndex = orders.findIndex(o => o.id === this.currentOrder);
        
        if (orderIndex === -1) {
            alert('El pedido seleccionado no existe.');
            this.changeTab('tables');
            return;
        }
        
        // Obtener precio como número
        let price = 0;
        if (typeof product.price === 'number') {
            price = product.price;
        } else {
            const priceStr = (product.precio || product.price || '0').toString();
            price = parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        }
        
        // Crear objeto de producto para el pedido
        const orderItem = {
            id: product.id,
            name: product.nombre || product.name,
            price: price,
            quantity: 1,
            categoryId: categoryId
        };
        
        // Verificar si el producto ya está en el pedido
        const existingItemIndex = orders[orderIndex].items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Incrementar cantidad
            orders[orderIndex].items[existingItemIndex].quantity++;
        } else {
            // Añadir nuevo producto
            orders[orderIndex].items.push(orderItem);
        }
        
        // Actualizar fecha de modificación
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        // Guardar cambios
        LocalStorageManager.saveOrders(orders);
        
        // Mostrar mensaje
        alert(`Producto "${orderItem.name}" añadido al pedido.`);
    }

    // Generar informe
    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const reportDate = document.getElementById('reportDate').value;
        const reportResults = document.getElementById('reportResults');
        
        if (!reportResults) return;
        
        // Obtener pedidos
        const orders = LocalStorageManager.getOrders() || [];
        
        // Filtrar pedidos completados
        const completedOrders = orders.filter(order => order.status === 'completed');
        
        if (completedOrders.length === 0) {
            reportResults.innerHTML = '<div class="tpv-empty-message">No hay datos disponibles para generar informes</div>';
            return;
        }
        
        // Filtrar por fecha
        const selectedDate = new Date(reportDate);
        selectedDate.setHours(0, 0, 0, 0);
        
        let filteredOrders = [];
        
        if (reportType === 'daily') {
            // Filtrar pedidos del día seleccionado
            filteredOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === selectedDate.getTime();
            });
        } else if (reportType === 'weekly') {
            // Filtrar pedidos de la semana seleccionada
            const weekStart = new Date(selectedDate);
            weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            filteredOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= weekStart && orderDate <= weekEnd;
            });
        } else if (reportType === 'monthly') {
            // Filtrar pedidos del mes seleccionado
            filteredOrders = completedOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === selectedDate.getMonth() && 
                       orderDate.getFullYear() === selectedDate.getFullYear();
            });
        } else {
            // Usar todos los pedidos completados
            filteredOrders = completedOrders;
        }
        
        if (filteredOrders.length === 0) {
            reportResults.innerHTML = '<div class="tpv-empty-message">No hay datos disponibles para el período seleccionado</div>';
            return;
        }
        
        // Generar informe según tipo
        if (reportType === 'products') {
            this.generateProductsReport(filteredOrders, reportResults);
        } else if (reportType === 'categories') {
            this.generateCategoriesReport(filteredOrders, reportResults);
        } else {
            this.generateSalesReport(filteredOrders, reportResults, reportType);
        }
    }

    // Generar informe de ventas
    generateSalesReport(orders, container, reportType) {
        // Calcular totales
        let totalSales = 0;
        let totalItems = 0;
        let totalOrders = orders.length;
        
        orders.forEach(order => {
            order.items.forEach(item => {
                totalSales += item.price * item.quantity;
                totalItems += item.quantity;
            });
        });
        
        // Obtener configuración para impuestos
        const settings = LocalStorageManager.getSettings() || {};
        const taxRate = settings.taxRate || 10;
        const taxAmount = totalSales * (taxRate / 100);
        const totalWithTax = totalSales + taxAmount;
        
        // Crear título según tipo
        let title = '';
        if (reportType === 'daily') {
            title = `Informe de Ventas Diarias - ${new Date(document.getElementById('reportDate').value).toLocaleDateString()}`;
        } else if (reportType === 'weekly') {
            const selectedDate = new Date(document.getElementById('reportDate').value);
            const weekStart = new Date(selectedDate);
            weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            title = `Informe de Ventas Semanales - ${weekStart.toLocaleDateString()} al ${weekEnd.toLocaleDateString()}`;
        } else if (reportType === 'monthly') {
            const selectedDate = new Date(document.getElementById('reportDate').value);
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            
            title = `Informe de Ventas Mensuales - ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
        }
        
        // Crear HTML del informe
        let reportHTML = `
            <div class="tpv-report">
                <h3>${title}</h3>
                <div class="tpv-report-summary">
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Total Ventas</div>
                        <div class="tpv-report-card-value">${totalWithTax.toFixed(2)} €</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Pedidos</div>
                        <div class="tpv-report-card-value">${totalOrders}</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Productos</div>
                        <div class="tpv-report-card-value">${totalItems}</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Ticket Medio</div>
                        <div class="tpv-report-card-value">${totalOrders > 0 ? (totalWithTax / totalOrders).toFixed(2) : '0.00'} €</div>
                    </div>
                </div>
                <div class="tpv-report-details">
                    <h4>Detalles de Ventas</h4>
                    <table class="tpv-report-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Pedido</th>
                                <th>Mesa</th>
                                <th>Productos</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Ordenar pedidos por fecha
        const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        // Añadir filas para cada pedido
        sortedOrders.forEach(order => {
            let orderTotal = 0;
            let orderItems = 0;
            
            order.items.forEach(item => {
                orderTotal += item.price * item.quantity;
                orderItems += item.quantity;
            });
            
            const orderTotalWithTax = orderTotal * (1 + taxRate / 100);
            
            reportHTML += `
                <tr>
                    <td>${new Date(order.createdAt).toLocaleString()}</td>
                    <td>Pedido #${order.id.replace('order_', '')}</td>
                    <td>${order.tableName}</td>
                    <td>${orderItems}</td>
                    <td>${orderTotalWithTax.toFixed(2)} €</td>
                </tr>
            `;
        });
        
        reportHTML += `
                        </tbody>
                    </table>
                </div>
                <div class="tpv-report-actions">
                    <button class="tpv-btn" id="printReportBtn">Imprimir Informe</button>
                    <button class="tpv-btn" id="exportReportBtn">Exportar CSV</button>
                </div>
            </div>
        `;
        
        // Actualizar contenido
        container.innerHTML = reportHTML;
        
        // Configurar eventos
        document.getElementById('printReportBtn').addEventListener('click', () => {
            this.printReport(title, reportHTML);
        });
        
        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportReportCSV(sortedOrders, title);
        });
    }

    // Generar informe de productos
    generateProductsReport(orders, container) {
        // Agrupar productos
        const productsMap = new Map();
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const key = item.id;
                
                if (productsMap.has(key)) {
                    const product = productsMap.get(key);
                    product.quantity += item.quantity;
                    product.total += item.price * item.quantity;
                } else {
                    productsMap.set(key, {
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                        categoryId: item.categoryId
                    });
                }
            });
        });
        
        // Convertir a array y ordenar por cantidad
        const products = Array.from(productsMap.values()).sort((a, b) => b.quantity - a.quantity);
        
        // Calcular totales
        let totalQuantity = 0;
        let totalSales = 0;
        
        products.forEach(product => {
            totalQuantity += product.quantity;
            totalSales += product.total;
        });
        
        // Obtener configuración para impuestos
        const settings = LocalStorageManager.getSettings() || {};
        const taxRate = settings.taxRate || 10;
        const totalWithTax = totalSales * (1 + taxRate / 100);
        
        // Título del informe
        const title = 'Informe de Productos Vendidos';
        
        // Crear HTML del informe
        let reportHTML = `
            <div class="tpv-report">
                <h3>${title}</h3>
                <div class="tpv-report-summary">
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Total Ventas</div>
                        <div class="tpv-report-card-value">${totalWithTax.toFixed(2)} €</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Productos Vendidos</div>
                        <div class="tpv-report-card-value">${totalQuantity}</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Productos Diferentes</div>
                        <div class="tpv-report-card-value">${products.length}</div>
                    </div>
                </div>
                <div class="tpv-report-details">
                    <h4>Productos Más Vendidos</h4>
                    <table class="tpv-report-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                                <th>% del Total</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Añadir filas para cada producto
        products.forEach(product => {
            const percentage = (product.total / totalSales * 100).toFixed(2);
            
            reportHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price.toFixed(2)} €</td>
                    <td>${product.total.toFixed(2)} €</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });
        
        reportHTML += `
                        </tbody>
                    </table>
                </div>
                <div class="tpv-report-actions">
                    <button class="tpv-btn" id="printReportBtn">Imprimir Informe</button>
                    <button class="tpv-btn" id="exportReportBtn">Exportar CSV</button>
                </div>
            </div>
        `;
        
        // Actualizar contenido
        container.innerHTML = reportHTML;
        
        // Configurar eventos
        document.getElementById('printReportBtn').addEventListener('click', () => {
            this.printReport(title, reportHTML);
        });
        
        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportProductsReportCSV(products, title);
        });
    }

    // Generar informe por categorías
    generateCategoriesReport(orders, container) {
        // Obtener categorías
        const categories = LocalStorageManager.getCategories() || [];
        
        // Crear mapa de nombres de categorías
        const categoryNames = {};
        categories.forEach(category => {
            categoryNames[category.id] = category.name;
        });
        
        // Agrupar por categorías
        const categoriesMap = new Map();
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const categoryId = item.categoryId;
                
                if (!categoryId) return;
                
                if (categoriesMap.has(categoryId)) {
                    const category = categoriesMap.get(categoryId);
                    category.quantity += item.quantity;
                    category.total += item.price * item.quantity;
                } else {
                    categoriesMap.set(categoryId, {
                        id: categoryId,
                        name: categoryNames[categoryId] || categoryId,
                        quantity: item.quantity,
                        total: item.price * item.quantity
                    });
                }
            });
        });
        
        // Convertir a array y ordenar por total
        const categoriesList = Array.from(categoriesMap.values()).sort((a, b) => b.total - a.total);
        
        // Calcular totales
        let totalQuantity = 0;
        let totalSales = 0;
        
        categoriesList.forEach(category => {
            totalQuantity += category.quantity;
            totalSales += category.total;
        });
        
        // Obtener configuración para impuestos
        const settings = LocalStorageManager.getSettings() || {};
        const taxRate = settings.taxRate || 10;
        const totalWithTax = totalSales * (1 + taxRate / 100);
        
        // Título del informe
        const title = 'Informe de Ventas por Categoría';
        
        // Crear HTML del informe
        let reportHTML = `
            <div class="tpv-report">
                <h3>${title}</h3>
                <div class="tpv-report-summary">
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Total Ventas</div>
                        <div class="tpv-report-card-value">${totalWithTax.toFixed(2)} €</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Productos Vendidos</div>
                        <div class="tpv-report-card-value">${totalQuantity}</div>
                    </div>
                    <div class="tpv-report-card">
                        <div class="tpv-report-card-title">Categorías</div>
                        <div class="tpv-report-card-value">${categoriesList.length}</div>
                    </div>
                </div>
                <div class="tpv-report-details">
                    <h4>Ventas por Categoría</h4>
                    <table class="tpv-report-table">
                        <thead>
                            <tr>
                                <th>Categoría</th>
                                <th>Productos Vendidos</th>
                                <th>Total</th>
                                <th>% del Total</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Añadir filas para cada categoría
        categoriesList.forEach(category => {
            const percentage = (category.total / totalSales * 100).toFixed(2);
            
            reportHTML += `
                <tr>
                    <td>${category.name}</td>
                    <td>${category.quantity}</td>
                    <td>${category.total.toFixed(2)} €</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });
        
        reportHTML += `
                        </tbody>
                    </table>
                </div>
                <div class="tpv-report-actions">
                    <button class="tpv-btn" id="printReportBtn">Imprimir Informe</button>
                    <button class="tpv-btn" id="exportReportBtn">Exportar CSV</button>
                </div>
            </div>
        `;
        
        // Actualizar contenido
        container.innerHTML = reportHTML;
        
        // Configurar eventos
        document.getElementById('printReportBtn').addEventListener('click', () => {
            this.printReport(title, reportHTML);
        });
        
        document.getElementById('exportReportBtn').addEventListener('click', () => {
            this.exportCategoriesReportCSV(categoriesList, title);
        });
    }

    // Imprimir informe
    printReport(title, content) {
        // Crear ventana para imprimir
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        h3 {
                            color: #333;
                            margin-bottom: 20px;
                        }
                        .tpv-report-summary {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 30px;
                        }
                        .tpv-report-card {
                            border: 1px solid #ddd;
                            padding: 15px;
                            text-align: center;
                            width: 22%;
                        }
                        .tpv-report-card-title {
                            font-size: 14px;
                            color: #666;
                            margin-bottom: 5px;
                        }
                        .tpv-report-card-value {
                            font-size: 20px;
                            font-weight: bold;
                        }
                        .tpv-report-details h4 {
                            margin-bottom: 10px;
                        }
                        .tpv-report-table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        .tpv-report-table th, .tpv-report-table td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        .tpv-report-table th {
                            background-color: #f2f2f2;
                        }
                        .tpv-report-actions {
                            display: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="tpv-report">
                        ${content}
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Exportar informe de ventas a CSV
    exportReportCSV(orders, title) {
        // Obtener configuración para impuestos
        const settings = LocalStorageManager.getSettings() || {};
        const taxRate = settings.taxRate || 10;
        
        // Crear contenido CSV
        let csvContent = 'Fecha,Pedido,Mesa,Productos,Subtotal,IVA,Total\n';
        
        orders.forEach(order => {
            let orderTotal = 0;
            let orderItems = 0;
            
            order.items.forEach(item => {
                orderTotal += item.price * item.quantity;
                orderItems += item.quantity;
            });
            
            const tax = orderTotal * (taxRate / 100);
            const total = orderTotal + tax;
            
            csvContent += `"${new Date(order.createdAt).toLocaleString()}","Pedido #${order.id.replace('order_', '')}","${order.tableName}",${orderItems},${orderTotal.toFixed(2)},${tax.toFixed(2)},${total.toFixed(2)}\n`;
        });
        
        // Descargar archivo
        this.downloadCSV(csvContent, title.replace(/\s+/g, '_') + '.csv');
    }

    // Exportar informe de productos a CSV
    exportProductsReportCSV(products, title) {
        // Crear contenido CSV
        let csvContent = 'Producto,Cantidad,Precio Unitario,Total,Porcentaje\n';
        
        // Calcular total
        let totalSales = 0;
        products.forEach(product => {
            totalSales += product.total;
        });
        
        products.forEach(product => {
            const percentage = (product.total / totalSales * 100).toFixed(2);
            
            csvContent += `"${product.name}",${product.quantity},${product.price.toFixed(2)},${product.total.toFixed(2)},${percentage}\n`;
        });
        
        // Descargar archivo
        this.downloadCSV(csvContent, title.replace(/\s+/g, '_') + '.csv');
    }

    // Exportar informe de categorías a CSV
    exportCategoriesReportCSV(categories, title) {
        // Crear contenido CSV
        let csvContent = 'Categoría,Productos Vendidos,Total,Porcentaje\n';
        
        // Calcular total
        let totalSales = 0;
        categories.forEach(category => {
            totalSales += category.total;
        });
        
        categories.forEach(category => {
            const percentage = (category.total / totalSales * 100).toFixed(2);
            
            csvContent += `"${category.name}",${category.quantity},${category.total.toFixed(2)},${percentage}\n`;
        });
        
        // Descargar archivo
        this.downloadCSV(csvContent, title.replace(/\s+/g, '_') + '.csv');
    }

    // Descargar archivo CSV
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Obtener etiqueta de estado
    getStatusLabel(status) {
        const labels = {
            'open': 'Abierto',
            'completed': 'Completado',
            'cancelled': 'Cancelado'
        };
        
        return labels[status] || status;
    }

    // Añadir estilos para el TPV
    addTPVStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('tpvStyles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'tpvStyles';
        styleElement.textContent = `
            /* Estilos para el TPV */
            .tpv-module {
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
            
            .tpv-header {
                background-color: var(--color-primary);
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .tpv-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .tpv-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .tpv-tabs {
                display: flex;
                background-color: #fff;
                border-bottom: 1px solid #ddd;
                overflow-x: auto;
            }
            
            .tpv-tab-btn {
                padding: 1rem;
                border: none;
                background: none;
                cursor: pointer;
                font-weight: 600;
                color: #666;
                border-bottom: 2px solid transparent;
                white-space: nowrap;
            }
            
            .tpv-tab-btn.active {
                color: var(--color-primary);
                border-bottom-color: var(--color-primary);
            }
            
            .tpv-content {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }
            
            .tpv-tab-content {
                display: none;
                height: 100%;
            }
            
            .tpv-tab-content.active {
                display: block;
            }
            
            /* Estilos para la pestaña de mesas */
            .tpv-tables-container {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                height: 100%;
            }
            
            .tpv-tables-section {
                flex: 1;
            }
            
            .tpv-tables-section h3 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 1rem;
            }
            
            .tpv-tables-grid, .tpv-bar-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }
            
            .tpv-table-item {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                height: 120px;
            }
            
            .tpv-table-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            .tpv-table-occupied {
                background-color: #ffebee;
                border: 2px solid #f44336;
            }
            
            .tpv-table-selected {
                background-color: #e3f2fd;
                border: 2px solid #2196f3;
            }
            
            .tpv-table-name {
                font-weight: 600;
                font-size: 1.2rem;
                margin-bottom: 0.5rem;
            }
            
            .tpv-table-capacity {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            
            .tpv-table-order-info {
                color: #f44336;
                font-weight: 600;
                font-size: 0.8rem;
            }
            
            .tpv-add-table {
                border: 2px dashed #ccc;
                background-color: #f9f9f9;
            }
            
            .tpv-add-icon {
                font-size: 2rem;
                color: #999;
                margin-bottom: 0.5rem;
            }
            
            .tpv-add-text {
                color: #999;
                font-weight: 600;
            }
            
            /* Estilos para la pestaña de pedidos */
            .tpv-orders-container {
                display: flex;
                gap: 1rem;
                height: 100%;
            }
            
            .tpv-orders-list {
                width: 300px;
                overflow-y: auto;
                border-right: 1px solid #ddd;
                padding-right: 1rem;
            }
            
            .tpv-order-details {
                flex: 1;
                overflow-y: auto;
            }
            
            .tpv-order-item {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .tpv-order-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            .tpv-order-selected {
                border: 2px solid var(--color-primary);
            }
            
            .tpv-order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .tpv-order-id {
                font-weight: 600;
            }
            
            .tpv-order-status {
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-weight: 600;
            }
            
            .tpv-order-open .tpv-order-status {
                background-color: #e3f2fd;
                color: #2196f3;
            }
            
            .tpv-order-completed .tpv-order-status {
                background-color: #e8f5e9;
                color: #4caf50;
            }
            
            .tpv-order-cancelled .tpv-order-status {
                background-color: #ffebee;
                color: #f44336;
            }
            
            .tpv-order-info {
                font-size: 0.9rem;
                color: #666;
            }
            
            .tpv-order-info > div {
                margin-bottom: 0.25rem;
            }
            
            .tpv-order-total {
                font-weight: 600;
                color: #333;
            }
            
            .tpv-order-details-header {
                margin-bottom: 1.5rem;
            }
            
            .tpv-order-details-header h3 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 0.5rem;
            }
            
            .tpv-order-details-info {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                font-size: 0.9rem;
                color: #666;
            }
            
            .tpv-order-details-id, .tpv-order-details-status {
                font-weight: 600;
            }
            
            .tpv-order-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1.5rem;
            }
            
            .tpv-order-table th, .tpv-order-table td {
                padding: 0.75rem;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            
            .tpv-order-table th {
                font-weight: 600;
                color: #333;
            }
            
            .tpv-quantity-control {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .tpv-quantity-btn {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: none;
                background-color: #f0f0f0;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: 600;
            }
            
            .tpv-order-details-summary {
                background-color: #f9f9f9;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
            }
            
            .tpv-order-summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .tpv-order-total-row {
                font-weight: 600;
                font-size: 1.1rem;
                margin-top: 0.5rem;
                padding-top: 0.5rem;
                border-top: 1px solid #ddd;
            }
            
            .tpv-order-details-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            /* Estilos para la pestaña de productos */
            .tpv-products-container {
                display: flex;
                gap: 1rem;
                height: 100%;
            }
            
            .tpv-categories-list {
                width: 200px;
                overflow-y: auto;
                border-right: 1px solid #ddd;
                padding-right: 1rem;
            }
            
            .tpv-category-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                margin-bottom: 0.5rem;
                transition: all 0.2s;
            }
            
            .tpv-category-item:hover {
                background-color: #f0f0f0;
            }
            
            .tpv-category-selected {
                background-color: #e3f2fd;
                font-weight: 600;
            }
            
            .tpv-category-icon {
                width: 32px;
                height: 32px;
                background-color: var(--color-primary);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .tpv-products-grid {
                flex: 1;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
                overflow-y: auto;
            }
            
            .tpv-product-card {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
            }
            
            .tpv-product-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            .tpv-product-special {
                border: 2px solid #ff9800;
            }
            
            .tpv-product-title {
                margin-top: 0;
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .tpv-product-description {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
                flex: 1;
            }
            
            .tpv-product-price {
                font-weight: 600;
                color: var(--color-primary);
                font-size: 1.1rem;
            }
            
            /* Estilos para la pestaña de informes */
            .tpv-reports-container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                height: 100%;
            }
            
            .tpv-reports-options {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
            }
            
            .tpv-reports-options h3 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 1rem;
            }
            
            .tpv-reports-filters {
                display: flex;
                gap: 1rem;
                align-items: flex-end;
            }
            
            .tpv-form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                flex: 1;
            }
            
            .tpv-form-group label {
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .tpv-input, .tpv-select {
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: inherit;
            }
            
            .tpv-report-results {
                flex: 1;
                overflow-y: auto;
            }
            
            .tpv-report {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 1rem;
            }
            
            .tpv-report h3 {
                margin-top: 0;
                color: var(--color-primary);
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .tpv-report-summary {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1.5rem;
            }
            
            .tpv-report-card {
                background-color: #f9f9f9;
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
                width: 23%;
            }
            
            .tpv-report-card-title {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 0.5rem;
            }
            
            .tpv-report-card-value {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--color-primary);
            }
            
            .tpv-report-details {
                margin-bottom: 1.5rem;
            }
            
            .tpv-report-details h4 {
                color: #333;
                margin-bottom: 1rem;
            }
            
            .tpv-report-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .tpv-report-table th, .tpv-report-table td {
                padding: 0.75rem;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            
            .tpv-report-table th {
                font-weight: 600;
                color: #333;
                background-color: #f5f5f5;
            }
            
            .tpv-report-actions {
                display: flex;
                justify-content: center;
                gap: 1rem;
            }
            
            /* Componentes comunes */
            .tpv-btn {
                background-color: #f0f0f0;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .tpv-btn:hover {
                background-color: #e0e0e0;
            }
            
            .tpv-btn-primary {
                background-color: var(--color-primary);
                color: white;
            }
            
            .tpv-btn-primary:hover {
                background-color: #1a252f;
            }
            
            .tpv-btn-success {
                background-color: #4caf50;
                color: white;
            }
            
            .tpv-btn-success:hover {
                background-color: #388e3c;
            }
            
            .tpv-btn-danger {
                background-color: #f44336;
                color: white;
            }
            
            .tpv-btn-danger:hover {
                background-color: #d32f2f;
            }
            
            .tpv-btn-small {
                padding: 0.25rem 0.5rem;
                font-size: 0.8rem;
            }
            
            .tpv-empty-message {
                text-align: center;
                padding: 2rem;
                color: #999;
            }
            
            .tpv-modal {
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
            
            .tpv-modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .tpv-modal-header {
                padding: 1rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .tpv-modal-header h3 {
                margin: 0;
                color: var(--color-primary);
            }
            
            .tpv-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
            }
            
            .tpv-modal-body {
                padding: 1rem;
                overflow-y: auto;
                flex: 1;
            }
            
            .tpv-modal-footer {
                padding: 1rem;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }
            
            .tpv-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            /* Estilos para modo oscuro */
            .dark-mode .tpv-module {
                background-color: #121212;
                color: #f1f1f1;
            }
            
            .dark-mode .tpv-tabs {
                background-color: #1a1a2e;
                border-bottom-color: #333;
            }
            
            .dark-mode .tpv-tab-btn {
                color: #ccc;
            }
            
            .dark-mode .tpv-tab-btn.active {
                color: var(--color-accent);
                border-bottom-color: var(--color-accent);
            }
            
            .dark-mode .tpv-table-item,
            .dark-mode .tpv-order-item,
            .dark-mode .tpv-product-card,
            .dark-mode .tpv-reports-options,
            .dark-mode .tpv-report,
            .dark-mode .tpv-modal-content {
                background-color: #1f2937;
                color: #f1f1f1;
            }
            
            .dark-mode .tpv-table-occupied {
                background-color: #4a1c1c;
            }
            
            .dark-mode .tpv-table-selected {
                background-color: #1a365d;
            }
            
            .dark-mode .tpv-add-table {
                background-color: #2d3748;
                border-color: #4a5568;
            }
            
            .dark-mode .tpv-add-icon,
            .dark-mode .tpv-add-text {
                color: #a0aec0;
            }
            
            .dark-mode .tpv-order-table th,
            .dark-mode .tpv-report-table th {
                background-color: #2d3748;
                color: #f1f1f1;
            }
            
            .dark-mode .tpv-order-table td,
            .dark-mode .tpv-report-table td,
            .dark-mode .tpv-order-table th,
            .dark-mode .tpv-report-table th {
                border-color: #4a5568;
            }
            
            .dark-mode .tpv-order-details-summary,
            .dark-mode .tpv-report-card {
                background-color: #2d3748;
            }
            
            .dark-mode .tpv-btn {
                background-color: #4a5568;
                color: #f1f1f1;
            }
            
            .dark-mode .tpv-btn:hover {
                background-color: #718096;
            }
            
            .dark-mode .tpv-input,
            .dark-mode .tpv-select {
                background-color: #2d3748;
                color: #f1f1f1;
                border-color: #4a5568;
            }
            
            .dark-mode .tpv-modal-header,
            .dark-mode .tpv-modal-footer {
                border-color: #4a5568;
            }
            
            .dark-mode .tpv-category-item:hover {
                background-color: #2d3748;
            }
            
            .dark-mode .tpv-category-selected {
                background-color: #1a365d;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .tpv-orders-container {
                    flex-direction: column;
                }
                
                .tpv-orders-list {
                    width: 100%;
                    border-right: none;
                    border-bottom: 1px solid #ddd;
                    padding-right: 0;
                    padding-bottom: 1rem;
                    margin-bottom: 1rem;
                    max-height: 300px;
                }
                
                .tpv-products-container {
                    flex-direction: column;
                }
                
                .tpv-categories-list {
                    width: 100%;
                    border-right: none;
                    border-bottom: 1px solid #ddd;
                    padding-right: 0;
                    padding-bottom: 1rem;
                    margin-bottom: 1rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                .tpv-category-item {
                    margin-bottom: 0;
                }
                
                .tpv-reports-filters {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .tpv-report-summary {
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .tpv-report-card {
                    width: 45%;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
}

// Inicializar TPV
window.TPVModule = new TPVModule();

// Función para mostrar el TPV
window.showTPV = function() {
    if (window.TPVModule) {
        window.TPVModule.initialize();
        window.TPVModule.open();
    }
};
