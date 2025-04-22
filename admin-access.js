// Archivo para optimizar el acceso exclusivo al panel de administración
// Este archivo maneja la detección del atajo de teclado CTRL+M y la carga del panel de administración

// Variable para controlar si el panel de administración está cargado
let adminPanelLoaded = false;

// Función para detectar el atajo de teclado CTRL+M
function setupAdminAccess() {
    document.addEventListener('keydown', function(event) {
        // Verificar si se presionó CTRL+M
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault(); // Prevenir comportamiento predeterminado
            
            // Mostrar u ocultar el panel de administración
            toggleAdminPanel();
        }
    });
    
    // También configurar el evento para el logo/nombre del bar
    const barName = document.querySelector('.navbar-brand');
    if (barName) {
        barName.addEventListener('click', function() {
            // Mostrar el modal de sugerencias al hacer clic en el nombre del bar
            showSuggestionsModal();
        });
    }
}

// Función para alternar la visibilidad del panel de administración
function toggleAdminPanel() {
    // Si el panel no está cargado, cargarlo primero
    if (!adminPanelLoaded) {
        loadAdminPanel();
    } else {
        // Si ya está cargado, verificar si está visible
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            if (adminPanel.style.display === 'none') {
                showAdminPanel();
            } else {
                hideAdminPanel();
            }
        }
    }
}

// Función para cargar el panel de administración
function loadAdminPanel() {
    // Verificar si el script del panel de administración ya está cargado
    if (!document.getElementById('adminPanelScript')) {
        // Crear elemento de script
        const script = document.createElement('script');
        script.id = 'adminPanelScript';
        script.src = 'admin-panel.js';
        script.onload = function() {
            // Una vez cargado el script, inicializar el panel
            adminPanelLoaded = true;
            
            // Verificar si la función de inicialización está disponible
            if (typeof initAdminPanel === 'function') {
                initAdminPanel();
                showAdminPanel();
            } else {
                console.error('Error: La función initAdminPanel no está disponible');
                alert('Error al cargar el panel de administración. Por favor, recargue la página e intente nuevamente.');
            }
        };
        script.onerror = function() {
            console.error('Error al cargar el script del panel de administración');
            alert('Error al cargar el panel de administración. Por favor, recargue la página e intente nuevamente.');
        };
        
        // Añadir el script al documento
        document.body.appendChild(script);
    } else {
        // Si el script ya está cargado pero el panel no está inicializado
        if (typeof initAdminPanel === 'function') {
            initAdminPanel();
            showAdminPanel();
            adminPanelLoaded = true;
        }
    }
}

// Función para mostrar el panel de administración
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        // Mostrar el panel con animación
        adminPanel.style.display = 'block';
        setTimeout(() => {
            adminPanel.classList.add('admin-panel-visible');
        }, 10);
        
        // Ocultar el contenido principal para enfocarse en el panel de administración
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
        
        // Actualizar título de la página
        document.title = 'Panel de Administración - Bar Sergio\'s';
        
        // Notificar al usuario
        showAdminNotification('Panel de administración activado', 'Presione CTRL+M nuevamente para volver a la carta.');
    }
}

// Función para ocultar el panel de administración
function hideAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        // Ocultar el panel con animación
        adminPanel.classList.remove('admin-panel-visible');
        setTimeout(() => {
            adminPanel.style.display = 'none';
        }, 300);
        
        // Mostrar el contenido principal
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        // Restaurar título de la página
        document.title = 'Carta - Bar Sergio\'s';
    }
}

// Función para mostrar notificación del panel de administración
function showAdminNotification(title, message) {
    // Verificar si ya existe una notificación
    let notification = document.getElementById('adminNotification');
    
    if (!notification) {
        // Crear elemento de notificación
        notification = document.createElement('div');
        notification.id = 'adminNotification';
        notification.className = 'admin-notification';
        
        // Añadir al DOM
        document.body.appendChild(notification);
    }
    
    // Actualizar contenido
    notification.innerHTML = `
        <div class="admin-notification-content">
            <div class="admin-notification-title">${title}</div>
            <div class="admin-notification-message">${message}</div>
        </div>
    `;
    
    // Mostrar notificación
    notification.classList.add('admin-notification-visible');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('admin-notification-visible');
    }, 3000);
}

// Función para mostrar el modal de sugerencias
function showSuggestionsModal() {
    // Verificar si ya existe el modal
    let suggestionsModal = document.getElementById('suggestionsModal');
    
    if (!suggestionsModal) {
        // Crear elemento del modal
        suggestionsModal = document.createElement('div');
        suggestionsModal.id = 'suggestionsModal';
        suggestionsModal.className = 'suggestions-modal';
        
        // Contenido del modal
        suggestionsModal.innerHTML = `
            <div class="suggestions-content animate-slide-up">
                <div class="suggestions-header">
                    <h2>Sugerencias del Chef</h2>
                    <p>Descubre nuestras recomendaciones especiales para hoy</p>
                </div>
                <div class="suggestions-list">
                    <div class="suggestion-item">
                        <div class="suggestion-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="suggestion-text">
                            <div class="suggestion-title">Tabla de Ibéricos Selección</div>
                            <div class="suggestion-description">Nuestra selección de los mejores embutidos ibéricos acompañados de pan tostado con tomate.</div>
                        </div>
                    </div>
                    <div class="suggestion-item">
                        <div class="suggestion-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <div class="suggestion-text">
                            <div class="suggestion-title">Pulpo a la Brasa</div>
                            <div class="suggestion-description">Pulpo braseado con aceite de pimentón, patatas confitadas y alioli suave.</div>
                        </div>
                    </div>
                    <div class="suggestion-item">
                        <div class="suggestion-icon">
                            <i class="fas fa-wine-glass-alt"></i>
                        </div>
                        <div class="suggestion-text">
                            <div class="suggestion-title">Vermut Casero</div>
                            <div class="suggestion-description">Nuestro vermut elaborado artesanalmente con una selección de hierbas aromáticas y cítricos.</div>
                        </div>
                    </div>
                    <div class="suggestion-item">
                        <div class="suggestion-icon">
                            <i class="fas fa-cheese"></i>
                        </div>
                        <div class="suggestion-text">
                            <div class="suggestion-title">Croquetas de Jamón Ibérico</div>
                            <div class="suggestion-description">Cremosas croquetas caseras elaboradas con jamón ibérico de bellota.</div>
                        </div>
                    </div>
                    <div class="suggestion-item">
                        <div class="suggestion-icon">
                            <i class="fas fa-fish"></i>
                        </div>
                        <div class="suggestion-text">
                            <div class="suggestion-title">Tartar de Atún</div>
                            <div class="suggestion-description">Tartar de atún rojo con aguacate, sésamo y aliño de soja y jengibre.</div>
                        </div>
                    </div>
                </div>
                <div class="suggestions-footer">
                    <button class="close-suggestions-btn">Explorar la Carta</button>
                </div>
            </div>
        `;
        
        // Añadir al DOM
        document.body.appendChild(suggestionsModal);
        
        // Configurar evento para cerrar
        const closeBtn = suggestionsModal.querySelector('.close-suggestions-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSuggestionsModal);
        }
        
        // También cerrar al hacer clic fuera del contenido
        suggestionsModal.addEventListener('click', function(event) {
            if (event.target === suggestionsModal) {
                closeSuggestionsModal();
            }
        });
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    } else {
        // Si ya existe, solo mostrarlo
        suggestionsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Función para cerrar el modal de sugerencias
function closeSuggestionsModal() {
    const suggestionsModal = document.getElementById('suggestionsModal');
    if (suggestionsModal) {
        // Ocultar con animación
        const content = suggestionsModal.querySelector('.suggestions-content');
        if (content) {
            content.classList.remove('animate-slide-up');
            content.classList.add('animate-fade-out');
            
            setTimeout(() => {
                suggestionsModal.style.display = 'none';
                // Restaurar scroll
                document.body.style.overflow = '';
            }, 300);
        } else {
            suggestionsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupAdminAccess();
    
    // Mostrar el modal de sugerencias automáticamente al cargar la página
    setTimeout(showSuggestionsModal, 500);
});

// Añadir estilos para el panel de administración y notificaciones
function addAdminStyles() {
    // Verificar si ya existen los estilos
    if (document.getElementById('adminAccessStyles')) {
        return;
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'adminAccessStyles';
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
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .admin-panel-visible {
            opacity: 1;
        }
        
        /* Estilos para notificaciones */
        .admin-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .admin-notification-visible {
            transform: translateX(0);
        }
        
        .admin-notification-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .admin-notification-message {
            font-size: 0.9rem;
        }
        
        /* Animación para el modal de sugerencias */
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .animate-fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        /* Estilos para modo oscuro */
        body.dark-mode .admin-panel {
            background-color: #121212;
            color: #f1f1f1;
        }
        
        body.dark-mode .admin-notification {
            background-color: #1f2937;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Añadir estilos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', addAdminStyles);
