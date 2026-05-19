//Team members : Leonardo Perez, Valery Avila

// Input donde el usuario escribe la tarea
const taskInput = document.getElementById('task-input');

// Botón para agregar una nueva tarea
const addTaskBtn = document.getElementById('add-task');

// Contenedor UL/OL donde se mostrarán las tareas
const taskList = document.getElementById('task-list');

// Botones de filtros (Todos, Completadas, Pendientes)
const filterBtns = document.querySelectorAll('.filters button');

// Input de búsqueda de tareas
const searchInput = document.getElementById('search-input');

// Label donde se muestra la cantidad de tareas completadas
const completedCountLabel = document.getElementById('completed-count');

// Botón para activar/desactivar modo oscuro
const darkModeBtn = document.getElementById('toggle-dark-mode');

// Se cargan las tareas desde localStorage.
// Si no existen tareas guardadas, se inicia con un array vacío.
//JSON.parse cumple la funcion de convertir una cadena de texto en formato JSON
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Se recupera el último filtro usado desde sessionStorage.
// Si no existe, se usa "all" por defecto.
let currentFilter = sessionStorage.getItem('lastFilter') || 'all';

// Se recupera la búsqueda temporal guardada en sessionStorage.
searchInput.value = sessionStorage.getItem('tempSearch') || '';


// Si el usuario había activado el modo oscuro previamente,
// se agrega la clase "dark-mode" al body.
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}


function saveTasks() {

    // Guarda el array de tareas en localStorage
    // convertido a formato JSON.
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Vuelve a renderizar la lista en pantalla
    renderTasks();
}

function renderTasks() {

    // Limpia completamente la lista antes de volver a dibujarla
    taskList.innerHTML = '';

    // Obtiene el texto de búsqueda en minúsculas
    // para hacer comparaciones sin distinguir mayúsculas/minúsculas.
    const searchText = searchInput.value.toLowerCase();
    

    // Filtra las tareas según:
    // 1. El filtro actual (all/completed/pending)
    // 2. El texto de búsqueda
    const filteredTasks = tasks.filter(t => {

        // Verifica si la tarea coincide con el filtro seleccionado
        const matchesFilter = 
            currentFilter === 'all' || 
            (currentFilter === 'completed' && t.completed) || 
            (currentFilter === 'pending' && !t.completed);

        // Verifica si el texto de la tarea incluye la búsqueda
        const matchesSearch = t.text.toLowerCase().includes(searchText);

        // Solo devuelve tareas que cumplan ambas condiciones
        return matchesFilter && matchesSearch;
    });


    // Recorre las tareas filtradas para mostrarlas en pantalla
    filteredTasks.forEach((task, index) => {

        // Crea un elemento <li> para cada tarea
        const li = document.createElement('li');

        // Si la tarea está completada,
        // agrega la clase "completed"
        li.className = task.completed ? 'completed' : '';

        // Inserta el contenido HTML de la tarea
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button onclick="toggleTask(${index})">✔</button>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        // Agrega el <li> a la lista del DOM
        taskList.appendChild(li);
    });


    // Cuenta cuántas tareas están completadas
    const completedCount = tasks.filter(t => t.completed).length;

    // Actualiza el texto del contador
    completedCountLabel.textContent = completedCount;
}


// Evento al hacer clic en "Agregar tarea"
addTaskBtn.onclick = () => {

    // Verifica que el input no esté vacío
    if (taskInput.value.trim()) {

        // Agrega una nueva tarea al array
        tasks.push({
            text: taskInput.value,
            completed: false
        });

        // Limpia el input
        taskInput.value = '';

        // Guarda y renderiza
        saveTasks();
    }
};



// Se asigna al objeto window para que pueda ser llamada
// desde el HTML generado dinámicamente.
window.toggleTask = (index) => {

    // Cambia el estado completed:
    // true -> false
    // false -> true
    tasks[index].completed = !tasks[index].completed;

    // Guarda cambios
    saveTasks();
};



window.deleteTask = (index) => {

    // Elimina 1 elemento del array en la posición indicada
    tasks.splice(index, 1);

    // Guarda cambios
    saveTasks();
};



// Recorre todos los botones de filtros
filterBtns.forEach(btn => {

    // Evento click en cada botón
    btn.onclick = () => {

        // Obtiene el filtro desde data-filter
        currentFilter = btn.dataset.filter;

        // Guarda el filtro en sessionStorage
        sessionStorage.setItem('lastFilter', currentFilter);

        // Actualiza la vista
        renderTasks();
    };
});



// Cada vez que el usuario escribe...
searchInput.oninput = () => {

    // Guarda temporalmente la búsqueda
    sessionStorage.setItem('tempSearch', searchInput.value);

    // Actualiza la lista filtrada
    renderTasks();
};



// Evento click del botón de modo oscuro
darkModeBtn.onclick = () => {

    // Alterna la clase "dark-mode"
    document.body.classList.toggle('dark-mode');

    // Determina el estado actual del modo oscuro
    const mode = document.body.classList.contains('dark-mode')
        ? 'enabled'
        : 'disabled';

    // Guarda la preferencia en localStorage
    localStorage.setItem('darkMode', mode);
};


// Dibuja las tareas al iniciar la aplicación
renderTasks();
