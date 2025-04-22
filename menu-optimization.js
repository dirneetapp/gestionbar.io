// Mejoras para el menú de categorías en pantallas pequeñas
document.addEventListener('DOMContentLoaded', function() {
    // Crear menú desplegable para categorías en pantallas pequeñas
    createCategoryDropdown();
    
    // Añadir indicadores de desplazamiento para el menú horizontal
    addScrollIndicators();
    
    // Configurar eventos de desplazamiento suave
    setupSmoothScrolling();
});

// Función para crear el menú desplegable de categorías
function createCategoryDropdown() {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) return;
    
    // Obtener todas las categorías
    const categoryItems = categoryList.querySelectorAll('.category-item');
    if (categoryItems.length === 0) return;
    
    // Crear contenedor del menú desplegable
    const dropdown = document.createElement('div');
    dropdown.className = 'category-dropdown';
    
    // Crear botón del menú desplegable
    const dropdownBtn = document.createElement('button');
    dropdownBtn.className = 'category-dropdown-btn';
    
    // Encontrar la categoría activa
    const activeCategory = categoryList.querySelector('.category-item.active');
    const defaultText = activeCategory ? activeCategory.textContent : 'Seleccionar categoría';
    
    dropdownBtn.innerHTML = `
        <span>${defaultText}</span>
        <i class="fas fa-chevron-down"></i>
    `;
    
    // Crear contenido del menú desplegable
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'category-dropdown-content';
    
    // Añadir elementos al menú desplegable
    categoryItems.forEach(item => {
        const dropdownItem = document.createElement('div');
        dropdownItem.className = 'category-dropdown-item';
        if (item.classList.contains('active')) {
            dropdownItem.classList.add('active');
        }
        dropdownItem.innerHTML = item.innerHTML;
        
        // Configurar evento de clic
        dropdownItem.addEventListener('click', function() {
            // Simular clic en el elemento original
            item.click();
            
            // Actualizar botón del menú desplegable
            dropdownBtn.querySelector('span').textContent = this.textContent;
            
            // Actualizar clase activa
            dropdownContent.querySelectorAll('.category-dropdown-item').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            // Cerrar menú desplegable
            dropdownContent.style.display = 'none';
        });
        
        dropdownContent.appendChild(dropdownItem);
    });
    
    // Configurar evento de clic para el botón
    dropdownBtn.addEventListener('click', function() {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
    });
    
    // Cerrar menú desplegable al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
    
    // Añadir elementos al DOM
    dropdown.appendChild(dropdownBtn);
    dropdown.appendChild(dropdownContent);
    
    // Insertar antes de la lista de categorías
    categoryList.parentNode.insertBefore(dropdown, categoryList);
}

// Función para añadir indicadores de desplazamiento
function addScrollIndicators() {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) return;
    
    // Verificar si el contenido es más ancho que el contenedor
    if (categoryList.scrollWidth <= categoryList.clientWidth) return;
    
    // Crear indicador izquierdo
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'category-scroll-indicator category-scroll-left';
    leftIndicator.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    // Crear indicador derecho
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'category-scroll-indicator category-scroll-right';
    rightIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Configurar eventos de clic
    leftIndicator.addEventListener('click', function() {
        categoryList.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    rightIndicator.addEventListener('click', function() {
        categoryList.scrollBy({ left: 200, behavior: 'smooth' });
    });
    
    // Añadir al DOM
    const menuContainer = categoryList.parentNode;
    menuContainer.style.position = 'relative';
    menuContainer.appendChild(leftIndicator);
    menuContainer.appendChild(rightIndicator);
    
    // Mostrar/ocultar indicadores según la posición de desplazamiento
    categoryList.addEventListener('scroll', function() {
        // Mostrar/ocultar indicador izquierdo
        if (categoryList.scrollLeft <= 10) {
            leftIndicator.style.opacity = '0';
            leftIndicator.style.pointerEvents = 'none';
        } else {
            leftIndicator.style.opacity = '0.8';
            leftIndicator.style.pointerEvents = 'auto';
        }
        
        // Mostrar/ocultar indicador derecho
        if (categoryList.scrollLeft + categoryList.clientWidth >= categoryList.scrollWidth - 10) {
            rightIndicator.style.opacity = '0';
            rightIndicator.style.pointerEvents = 'none';
        } else {
            rightIndicator.style.opacity = '0.8';
            rightIndicator.style.pointerEvents = 'auto';
        }
    });
    
    // Disparar evento de desplazamiento para configurar estado inicial
    categoryList.dispatchEvent(new Event('scroll'));
}

// Función para configurar desplazamiento suave
function setupSmoothScrolling() {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) return;
    
    // Configurar desplazamiento con rueda del ratón
    categoryList.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            categoryList.scrollBy({
                left: e.deltaY > 0 ? 100 : -100,
                behavior: 'smooth'
            });
        }
    }, { passive: false });
    
    // Configurar desplazamiento con teclado
    categoryList.tabIndex = 0; // Hacer que el elemento sea enfocable
    categoryList.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            categoryList.scrollBy({ left: 100, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            categoryList.scrollBy({ left: -100, behavior: 'smooth' });
        }
    });
}
