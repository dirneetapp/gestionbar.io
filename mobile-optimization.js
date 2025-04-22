// Optimizaciones para dispositivos móviles
// Este archivo implementa mejoras específicas para la experiencia en dispositivos móviles y tablets

// Función para inicializar optimizaciones móviles
function initMobileOptimizations() {
    // Detectar tipo de dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    
    if (isMobile || isTablet) {
        // Añadir clase al body para estilos específicos
        document.body.classList.add(isTablet ? 'tablet-device' : 'mobile-device');
        
        // Configurar gestos táctiles
        setupTouchGestures();
        
        // Optimizar imágenes según la conexión
        optimizeImagesForConnection();
        
        // Mejorar accesibilidad táctil
        enhanceTouchTargets();
    }
    
    // Configurar detección de orientación
    setupOrientationDetection();
    
    // Configurar modo oscuro automático
    setupAutoDarkMode();
}

// Función para configurar gestos táctiles
function setupTouchGestures() {
    // Configurar deslizamiento horizontal para categorías
    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
        let startX, startScrollLeft;
        
        categoryList.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - categoryList.offsetLeft;
            startScrollLeft = categoryList.scrollLeft;
        });
        
        categoryList.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const x = e.touches[0].pageX - categoryList.offsetLeft;
            const walk = (x - startX) * 2; // Multiplicador de velocidad
            categoryList.scrollLeft = startScrollLeft - walk;
        });
        
        categoryList.addEventListener('touchend', () => {
            startX = null;
        });
    }
    
    // Configurar deslizamiento vertical para productos
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        // Añadir clase para habilitar gestos
        productGrid.classList.add('swipe-area');
    }
}

// Función para optimizar imágenes según la conexión
function optimizeImagesForConnection() {
    // Verificar si la API de Network Information está disponible
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            // Ajustar calidad de imágenes según tipo de conexión
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('low-data-mode');
            }
            
            // Escuchar cambios en la conexión
            connection.addEventListener('change', () => {
                if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    document.body.classList.add('low-data-mode');
                } else {
                    document.body.classList.remove('low-data-mode');
                }
            });
        }
    }
}

// Función para mejorar accesibilidad táctil
function enhanceTouchTargets() {
    // Aumentar área táctil para elementos pequeños
    const smallTargets = document.querySelectorAll('.category-item, .modal-close, .dark-mode-toggle');
    
    smallTargets.forEach(target => {
        // Asegurar tamaño mínimo recomendado para elementos táctiles (44x44px)
        if (target.offsetWidth < 44 || target.offsetHeight < 44) {
            target.style.minWidth = '44px';
            target.style.minHeight = '44px';
        }
        
        // Añadir padding adicional si es necesario
        const computedStyle = window.getComputedStyle(target);
        const paddingH = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingV = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        if (target.offsetWidth - paddingH < 44) {
            const additionalPadding = (44 - (target.offsetWidth - paddingH)) / 2;
            target.style.paddingLeft = `${parseFloat(computedStyle.paddingLeft) + additionalPadding}px`;
            target.style.paddingRight = `${parseFloat(computedStyle.paddingRight) + additionalPadding}px`;
        }
        
        if (target.offsetHeight - paddingV < 44) {
            const additionalPadding = (44 - (target.offsetHeight - paddingV)) / 2;
            target.style.paddingTop = `${parseFloat(computedStyle.paddingTop) + additionalPadding}px`;
            target.style.paddingBottom = `${parseFloat(computedStyle.paddingBottom) + additionalPadding}px`;
        }
    });
}

// Función para configurar detección de orientación
function setupOrientationDetection() {
    // Detectar cambios de orientación
    window.addEventListener('orientationchange', () => {
        // Actualizar clases en el body
        if (window.orientation === 0 || window.orientation === 180) {
            document.body.classList.remove('landscape');
            document.body.classList.add('portrait');
        } else {
            document.body.classList.remove('portrait');
            document.body.classList.add('landscape');
        }
        
        // Ajustar layout después del cambio de orientación
        setTimeout(adjustLayoutForOrientation, 300);
    });
    
    // Configuración inicial
    if (window.orientation === 0 || window.orientation === 180) {
        document.body.classList.add('portrait');
    } else {
        document.body.classList.add('landscape');
    }
    
    // Ajustar layout inicial
    adjustLayoutForOrientation();
}

// Función para ajustar layout según orientación
function adjustLayoutForOrientation() {
    const isLandscape = document.body.classList.contains('landscape');
    const productGrid = document.getElementById('productGrid');
    
    if (productGrid) {
        // En dispositivos móviles, ajustar columnas según orientación
        if (window.innerWidth <= 768) {
            if (isLandscape) {
                productGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                productGrid.style.gridTemplateColumns = 'repeat(1, 1fr)';
            }
        }
    }
}

// Función para configurar modo oscuro automático
function setupAutoDarkMode() {
    // Verificar si el navegador soporta la consulta de preferencia de color
    if (window.matchMedia) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Función para aplicar modo oscuro automático
        const applyAutoDarkMode = (matches) => {
            // Obtener preferencias guardadas
            const preferences = LocalStorageManager.getUserPreferences() || {};
            
            // Solo aplicar automáticamente si el usuario no ha establecido una preferencia
            if (preferences.darkMode === undefined) {
                document.body.classList.toggle('dark-mode', matches);
                
                // Actualizar icono
                const icon = document.querySelector('#darkModeToggle i');
                if (icon) {
                    if (matches) {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                    } else {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                    }
                }
            }
        };
        
        // Aplicar inicialmente
        applyAutoDarkMode(prefersDarkMode.matches);
        
        // Escuchar cambios
        if (prefersDarkMode.addEventListener) {
            prefersDarkMode.addEventListener('change', (e) => {
                applyAutoDarkMode(e.matches);
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initMobileOptimizations);
