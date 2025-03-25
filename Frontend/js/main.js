/*******************************************************
 * Frontend/js/main.js
 * Archivo unificado de JavaScript para todas las páginas
 *******************************************************/

/* ========== SECCIÓN 1: Funciones Globales (se repiten en varias páginas) ========== */

/**
 * Redirecciona a otra página sin mostrar alertas.
 * @param {string} page - Nombre o ruta de la página destino.
 */
function navigateTo(page) {
  window.location.href = page;
}

/**
 * Muestra notificaciones.
 * - Si encuentra el elemento #notificationsModal (Bootstrap), muestra el modal.
 * - De lo contrario, usa un alert por defecto.
 */
function mostrarNotificaciones() {
  const modalEl = document.getElementById('notificationsModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    // Usa modal de Bootstrap si existe
    const notificationsModal = new bootstrap.Modal(modalEl);
    notificationsModal.show();
  } else {
    // Si no existe modal, mostrar alert
    alert("No hay notificaciones nuevas.");
  }
}

/**
 * Muestra perfil.
 * - Si encuentra #profileModal (Bootstrap), muestra el modal.
 * - De lo contrario, usa alert como fallback.
 */
function mostrarPerfil() {
  const modalEl = document.getElementById('profileModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    // Usa modal de Bootstrap si existe
    const profileModal = new bootstrap.Modal(modalEl);
    profileModal.show();
  } else {
    // Fallback a alert
    alert("Nombre: Juan de Dios\nRol: Administrador");
  }
}

/* ========== SECCIÓN 2: Lógica específica de AGENDA ========== */

/**
 * Agrega una nueva tarea (Agenda).
 */
function addTask() {
  const clientName = document.getElementById("clientName").value;
  const clientAddress = document.getElementById("clientAddress").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskTime = document.getElementById("taskTime").value;
  const taskType = document.getElementById("taskType").value;

  if (!clientName || !clientAddress || !taskDate || !taskTime || !taskType) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const tasksContainer = document.getElementById("tasksContainer");
  let taskElement = document.createElement("div");
  taskElement.classList.add("task-card");
  taskElement.innerHTML = `
    <div class="task-details">
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Dirección:</strong> ${clientAddress}</p>
      <p><strong>Fecha:</strong> ${taskDate}</p>
      <p><strong>Hora:</strong> ${taskTime}</p>
      <p><strong>Servicio:</strong> ${taskType}</p>
    </div>
    <div>
      <button onclick="editTask(this)">Editar</button>
      <button onclick="removeTask(this)">Eliminar</button>
    </div>
  `;

  tasksContainer.appendChild(taskElement);
  clearForm();
}

/**
 * Elimina una tarea (Agenda).
 * @param {HTMLElement} element - Botón dentro de la task-card
 */
function removeTask(element) {
  element.parentElement.parentElement.remove();
}

/**
 * Edita una tarea (Agenda).
 * @param {HTMLElement} element - Botón dentro de la task-card
 */
function editTask(element) {
  const taskElement = element.parentElement.parentElement;
  const taskDetails = taskElement.querySelector(".task-details");
  const clientName = prompt("Nuevo nombre del cliente:", taskDetails.children[0].textContent.split(": ")[1]);
  const clientAddress = prompt("Nueva dirección:", taskDetails.children[1].textContent.split(": ")[1]);
  const taskDate = prompt("Nueva fecha (YYYY-MM-DD):", taskDetails.children[2].textContent.split(": ")[1]);
  const taskTime = prompt("Nueva hora (HH:MM):", taskDetails.children[3].textContent.split(": ")[1]);
  const taskType = prompt("Nuevo tipo de servicio:", taskDetails.children[4].textContent.split(": ")[1]);

  if (clientName && clientAddress && taskDate && taskTime && taskType) {
    taskDetails.innerHTML = `
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Dirección:</strong> ${clientAddress}</p>
      <p><strong>Fecha:</strong> ${taskDate}</p>
      <p><strong>Hora:</strong> ${taskTime}</p>
      <p><strong>Servicio:</strong> ${taskType}</p>
    `;
  }
}

/**
 * Busca una tarea por texto (Agenda).
 */
function searchTask() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const tasks = document.querySelectorAll(".task-card");

  tasks.forEach(task => {
    const taskText = task.textContent.toLowerCase();
    if (taskText.includes(searchValue)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

/**
 * Limpia el formulario (Agenda).
 */
function clearForm() {
  document.getElementById("clientName").value = "";
  document.getElementById("clientAddress").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskTime").value = "";
  document.getElementById("taskType").value = "Limpieza General";
}

/* ========== SECCIÓN 3: Lógica específica de CALIFICAR LIMPIADOR ========== */

/**
 * Esta función es un ejemplo de cómo mostrar detalles estáticos.
 * Nota: El módulo calificar.js tiene la versión completa con fetch a la API.
 */
function mostrarDetalle(id) {
  // Ejemplo estático (para pruebas, si se requiere)
  if (id === 'juan') {
    document.getElementById('nombre-limpiador').innerText = "Juan Pérez";
  } else if (id === 'maria') {
    document.getElementById('nombre-limpiador').innerText = "María López";
  }
  document.getElementById('lista-limpiadores').style.display = "none";
  document.getElementById('detalle-limpiador').style.display = "block";
}

/**
 * Regresa a la lista de limpiadores.
 */
function volverALista() {
  document.getElementById('detalle-limpiador').style.display = "none";
  document.getElementById('lista-limpiadores').style.display = "block";
}

/**
 * Envía calificación (Calificar-limpiador).
 * Este ejemplo solo muestra un alert, la lógica real se implementa en calificar.js.
 */
function enviarCalificacion() {
  const rating = document.getElementById('calificacion').value;
  const comentarios = document.getElementById('comentarios').value;
  console.log("Calificación enviada:", { rating, comentarios });
  alert("¡Calificación enviada!\nEstrellas: " + rating + "\nComentarios: " + comentarios);
}

/**
 * Función para confirmar el servicio.
 */
function confirmarServicio() {
  console.log("Servicio confirmado");
  alert("Servicio confirmado.");
}

/**
 * Función para marcar el servicio como pendiente.
 */
function marcarPendiente() {
  console.log("Servicio marcado como pendiente");
  alert("Servicio marcado como pendiente.");
}

/**
 * Función para marcar el servicio como no realizado.
 */
function noRealizado() {
  console.log("Servicio marcado como NO realizado");
  alert("Servicio marcado como NO realizado.");
}

/**
 * Listener para estrellas (rating).
 */
document.addEventListener("DOMContentLoaded", function() {
  const stars = document.querySelectorAll("#star-rating i");
  const ratingInput = document.getElementById("calificacion");

  if (stars.length > 0 && ratingInput) {
    stars.forEach(star => {
      star.addEventListener("click", function() {
        const rating = this.getAttribute("data-value");
        ratingInput.value = rating;
        stars.forEach(s => {
          s.classList.remove("selected");
          if (s.getAttribute("data-value") <= rating) {
            s.classList.add("selected");
          }
        });
      });

      star.addEventListener("mouseover", function() {
        const rating = this.getAttribute("data-value");
        stars.forEach(s => {
          if (s.getAttribute("data-value") <= rating) {
            s.classList.add("hover");
          } else {
            s.classList.remove("hover");
          }
        });
      });

      star.addEventListener("mouseout", function() {
        stars.forEach(s => s.classList.remove("hover"));
      });
    });
  }
});

/* ========== SECCIÓN 4: Lógica específica de REGISTRO/INICIO SESIÓN ========== */

document.addEventListener('DOMContentLoaded', () => {
  const dynamicForm = document.getElementById('dynamicForm');
  if (dynamicForm) {
    dynamicForm.addEventListener('submit', onFormSubmit);
  }
});

/**
 * Alterna campos según "Crear cuenta" o "Iniciar sesión".
 */
function toggleFields() {
  const signupMode = document.querySelector('input[name="authMode"]:checked').value === "signup";

  const nameFields = document.getElementById('nameFields');
  const signinFields = document.getElementById('signinFields');
  const submitBtn = document.getElementById('submitBtn');

  if (signupMode) {
    nameFields.style.display = "flex";
    signinFields.style.display = "none";
    submitBtn.textContent = "Crear cuenta";
  } else {
    nameFields.style.display = "none";
    signinFields.style.display = "flex";
    submitBtn.textContent = "Iniciar sesión";
  }
}

/**
 * Maneja el submit del formulario (crear cuenta o iniciar sesión).
 * @param {Event} e 
 */
async function onFormSubmit(e) {
  e.preventDefault();
  const signupMode = document.querySelector('input[name="authMode"]:checked').value === "signup";

  if (signupMode) {
    try {
      const nombre = document.getElementById('nombre').value;
      const apellidoP = document.getElementById('apellidoP').value;
      const apellidoM = document.getElementById('apellidoM').value;
      const fullName = `${nombre} ${apellidoP} ${apellidoM}`.trim();

      const correo = document.getElementById('correo').value;
      const password = document.getElementById('password').value;
      const confirmPass = document.getElementById('confirmPassword').value;

      if (password !== confirmPass) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // Llamada a función de registro (ejemplo)
      await registerAuditor({ name: fullName, email: correo, password });
      alert('Cuenta creada con éxito. Ahora inicia sesión');
      document.querySelector('input[name="authMode"][value="signin"]').checked = true;
      toggleFields();
    } catch (err) {
      alert('Error al crear cuenta: ' + err.message);
    }
  } else {
    try {
      const correo = document.getElementById('correo').value;
      const password = document.getElementById('password').value;

      const token = await loginAuditor(correo, password);
      localStorage.setItem('token', token);
      alert('Sesión iniciada');
      window.location.href = 'index.html';
    } catch (err) {
      alert('Error al iniciar sesión: ' + err.message);
    }
  }
}

/* ========== Sección adicional: Inicialización de gráficos y paginación ========== */

// Verifica si existe el elemento canvas para evitar errores de getContext
const canvasElement = document.getElementById('tasksChart');
if (canvasElement) {
  const ctx = canvasElement.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      datasets: [{
        label: 'Servicios Realizados por Día',
        data: [12, 20, 35, 25, 45, 55, 70],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}

// Ejemplo de paginación de servicios (datos simulados)
const services = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  service: `Servicio ${i + 1}`,
  employee: `Empleado ${Math.floor(i / 5) + 1}`,
  client: `Cliente ${Math.floor(i / 3) + 1}`,
  confirmedBy: `Supervisor ${Math.floor(i / 7) + 1}`,
  time: `${8 + (i % 8)}:00 AM`
}));

let currentPage = 1;
const servicesPerPage = 6;

function renderServices(page) {
  $("#tasksList").empty();
  const start = (page - 1) * servicesPerPage;
  const end = start + servicesPerPage;
  const paginatedServices = services.slice(start, end);

  paginatedServices.forEach(service => {
    $("#tasksList").append(`
      <div class="col-md-4">
        <div class="card p-3">
          <h5>${service.service}</h5>
          <p><strong>Empleado:</strong> ${service.employee}</p>
          <p><strong>Cliente:</strong> ${service.client}</p>
          <p><strong>Confirmado por:</strong> ${service.confirmedBy}</p>
          <p><strong>Hora:</strong> ${service.time}</p>
        </div>
      </div>
    `);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(services.length / servicesPerPage);
  $(".pagination").empty();
  for (let i = 1; i <= totalPages; i++) {
    $(".pagination").append(`
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#">${i}</a>
      </li>
    `);
  }
  $(".pagination .page-link").on("click", function (e) {
    e.preventDefault();
    currentPage = Number($(this).text());
    renderServices(currentPage);
    renderPagination();
  });
}

$(document).ready(function() {
  renderServices(currentPage);
  renderPagination();
});
