/*******************************************************
 * main.js
 * Archivo unificado de JavaScript para todas las páginas
 *******************************************************/

/* ========== SECCIÓN 1: Funciones Globales (se repiten en varias páginas) ========== */

/**
 * Redirecciona a otra página.
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
 * Muestra detalle del limpiador.
 * @param {string} id - identificador del limpiador
 */
function mostrarDetalle(id) {
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
 */
function enviarCalificacion() {
  const rating = document.getElementById('calificacion').value;
  const comentarios = document.getElementById('comentarios').value;
  alert("Calificación enviada:\nEstrellas: " + rating + "\nComentarios: " + comentarios);
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

/* ========== SECCIÓN 4: Lógica específica de AUDITORÍA ========== */
/* (Actualmente, auditoría solo tenía navigateTo, mostrarNotificaciones, mostrarPerfil,
   que ya unificamos en secciones globales. No se requiere código extra aquí.) */

/* ========== SECCIÓN 5: Lógica específica de DASHBOARD ========== */
/* (Igual que Auditoría, las funciones repetidas se han unificado) */

/* ========== SECCIÓN 6: Lógica específica de PAGOS ========== */
/* (Igual que Dashboard, las funciones repetidas se han unificado) */

//inicio de secion o crear cuenta//
// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Al cargar la página, configuramos los listeners
  
  const dynamicForm = document.getElementById('dynamicForm');
  if (dynamicForm) {
    dynamicForm.addEventListener('submit', onFormSubmit);
  }
});

/**
 * Alterna qué campos se muestran según si es "Crear cuenta" o "Iniciar sesión".
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
    // Crear cuenta
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

      // Llamamos a la función de auth.js
      await registerAuditor({ name: fullName, email: correo, password });
      alert('Cuenta creada con éxito. Ahora inicia sesión');
      // Cambiamos a modo "signin"
      document.querySelector('input[name="authMode"][value="signin"]').checked = true;
      toggleFields();

    } catch (err) {
      alert('Error al crear cuenta: ' + err.message);
    }
  } else {
    // Iniciar sesión
    try {
      const correo = document.getElementById('correo').value;
      const password = document.getElementById('password').value;

      // Llamamos a la función de auth.js
      const token = await loginAuditor(correo, password);
      // Guardamos token en localStorage
      localStorage.setItem('token', token);

      alert('Sesión iniciada');
      // Redirigir a dashboard u otra página
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert('Error al iniciar sesión: ' + err.message);
    }
  }
}

