document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadResources();
     // Inicializar categorías en el select de añadir recurso
     populateCategorySelect();
    checkAdminStatus();
});
const isAdmin= true; // variable para simular el administrador

let resources = [];
let categories = [];


// Cargar recursos desde el almacenamiento local
function loadResources() {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
        resources = JSON.parse(storedResources);
        renderResources();
    } else{
        resources=[];
        renderResources();
    }
}
// Guardar recursos en el almacenamiento local
function saveResources() {
    localStorage.setItem('resources', JSON.stringify(resources));
}


// Cargar categorías desde el almacenamiento local
function loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
         renderCategories();
    }else{
        categories = [];
        renderCategories();
    }
}

// Guardar categorías en el almacenamiento local
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}
// Renderiza las categorias en el menú de categorías
function renderCategories() {
    const categorySelect = document.getElementById('category-select');
    categorySelect.innerHTML = '<option value="all">Todas</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
     populateCategorySelect();
}
// RENDERIZAR LAS TARJETAS DE RECURSOS
function renderResources() {
    const resourcesContainer = document.getElementById('resources-container');
    resourcesContainer.innerHTML = '';
    resources.forEach((resource, index) => {
        const card = document.createElement('div');
        card.classList.add('resource-card');
        card.innerHTML = `
            <h3>${resource.title}</h3>
            <p>Categoría: ${resource.category}</p>
            <p>PDF</p>
           <div class="actions">
            <button onclick="previewResource(${index})">Previsualizar</button>
            <a href="#" onclick="downloadResource(' + index +')"><i class="fas fa-download"></i> Descargar</a>
             ${isAdmin ? `<button onclick="deleteResource(${index})">Eliminar</button>` : ''}
           </div>
        `;
         resourcesContainer.appendChild(card);
    });
}

// Filtrar recursos por búsqueda o categoría
function filterResources() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const categoryValue = document.getElementById('category-select').value;
    
    const filteredResources = resources.filter(resource => {
        const titleMatch = resource.title.toLowerCase().includes(searchValue);
        const categoryMatch = categoryValue === 'all' || resource.category === categoryValue;
        return titleMatch && categoryMatch;
    });

    const resourcesContainer = document.getElementById('resources-container');
    resourcesContainer.innerHTML = '';
    filteredResources.forEach((resource, index) => {
        const card = document.createElement('div');
        card.classList.add('resource-card');
        card.innerHTML = `
             <h3>${resource.title}</h3>
            <p>Categoría: ${resource.category}</p>
             <p>PDF</p>
            <div class="actions">
                <button onclick="previewResource(${resources.indexOf(resource)})">Previsualizar</button>
                <a href="#" onclick="downloadResource(' + resources.indexOf(resource) +')"><i class="fas fa-download"></i> Descargar</a>
                ${isAdmin ? `<button onclick="deleteResource(${resources.indexOf(resource)})">Eliminar</button>` : ''}
            </div>
        `;
         resourcesContainer.appendChild(card);
    });
}

// Modal de añadir recurso
function showAddResourceModal() {
    document.getElementById('add-resource-modal').style.display = 'block';
}

function closeAddResourceModal() {
    document.getElementById('add-resource-modal').style.display = 'none';
    resetAddResourceForm();
}
function resetAddResourceForm(){
     document.getElementById('add-resource-form').reset();
     
}
// Añadir un nuevo recurso
function addResource() {
    const title = document.getElementById('resource-title').value;
    const category = document.getElementById('resource-category').value;
    const file = document.getElementById('resource-file').files[0];

     if (file && file.type === 'application/pdf') {
        const url =  URL.createObjectURL(file);
        resources.push({ title, category, url , file });
        saveResources();
        renderResources();
        closeAddResourceModal();
      } else {
        alert('Debes seleccionar un archivo PDF para subir');
      }

}
// Modal de añadir categoría
function showAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'block';
}

function closeAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'none';
    document.getElementById('add-category-form').reset();
}
// Añadir una nueva categoría
function addCategory() {
    const newCategory = document.getElementById('category-name').value;
    if (newCategory) {
        categories.push(newCategory);
        saveCategories();
        renderCategories();
        closeAddCategoryModal();
    } else {
        alert('Por favor, ingrese el nombre de la categoría.');
    }
}

function populateCategorySelect() {
    const categorySelectAddResource = document.getElementById('resource-category');
    categorySelectAddResource.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
         categorySelectAddResource.appendChild(option);
    });
}

// Previsualizar recurso
function previewResource(index) {
    const resource = resources[index];
    const modal = document.getElementById('preview-modal');
    const previewTitle = document.getElementById('preview-title');
    const previewContainer = document.getElementById('preview-container');
    const downloadButton = document.getElementById('preview-download');
    
    previewTitle.textContent = resource.title;
    previewContainer.innerHTML = '';
    
       const pdfView = document.createElement('iframe');
         pdfView.src = resource.url;
         previewContainer.appendChild(pdfView);
       downloadButton.style.display = 'block';
        downloadButton.onclick = () => downloadResource(index);

    modal.style.display = 'block';
}
// Descargar recurso
function downloadResource(index) {
    const resource = resources[index];
       let link = document.createElement('a');
        link.href = resource.url;
        link.download = resource.file.name;
        link.click();
}

// Cerrar modal de previsualizacion
function closePreviewModal() {
    document.getElementById('preview-modal').style.display = 'none';
}
// Eliminar recurso
function deleteResource(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este recurso?")) {
        resources.splice(index, 1);
        saveResources();
        renderResources();
    }
}
// verificar si es admin
function checkAdminStatus() {
    const appElement = document.getElementById('app');
    if (isAdmin) {
          appElement.classList.add('is-admin');
        } else {
         appElement.classList.remove('is-admin');
     }
}