/*******************************************************
 * dashboard.js
 * Lógica para mostrar datos en el Dashboard
 *******************************************************/

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Mostrar spinner de carga
  const loadingEl = document.getElementById('dashboard-loading');
  const errorEl = document.getElementById('dashboard-error');
  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';

  // 2. Verificar si hay token en localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No has iniciado sesión. Redirigiendo...');
    navigateTo('registro-inicio.html');
    return;
  }

  try {
    // 3. Llamar a la API de forma concurrente
    //    Ajusta los endpoints según tu API real:
    const [users, proposalsCompleted, proposalsInProgress, activeServices] = await Promise.all([
      getAllUsers(token),
      getProposals(token, 'completed'),
      getProposals(token, 'in_progress'),
      getServices(token)           // Ejemplo: si tienes un endpoint para servicios
    ]);

    // 4. Procesar los resultados
    const totalUsuarios = users.length;
    const ventasMes = proposalsCompleted.length * 100; // Ejemplo: cada proposal completada = $100
    const proyectosActivos = proposalsInProgress.length;

    // 5. Inyectar datos en el DOM
    document.getElementById('usersCount').textContent = totalUsuarios;
    document.getElementById('salesAmount').textContent = '$' + ventasMes;
    document.getElementById('projectsActive').textContent = proyectosActivos.toString();

    // 6. Renderizar “Tareas Aprobadas” (proposalsCompleted) en el tab "tareas-aprobadas"
    renderList('tareas-aprobadas', 'Tareas Aprobadas', 'Lista de tareas aprobadas', proposalsCompleted, 'description');

    // 7. Renderizar “Tareas Pendientes” (proposalsInProgress) en el tab "tareas-pendientes"
    renderList('tareas-pendientes', 'Tareas Pendientes', 'Lista de tareas pendientes', proposalsInProgress, 'description');

    // 8. Renderizar “Servicios Activos” en el tab "servicios-activos"
    //    Ajusta la propiedad a mostrar (por ejemplo 'name' o 'description') según tu API
    renderList('servicios-activos', 'Servicios Activos', 'Lista de servicios actualmente activos', activeServices, 'name');
  } 
  catch (error) {
    console.error(error);
    if (errorEl) {
      // Muestra un mensaje de error en el DOM (en lugar de alert)
      errorEl.textContent = `Error en el dashboard: ${error.message}`;
      errorEl.style.display = 'block';
    } else {
      // Fallback: alert si no hay contenedor para errores
      alert('Error en el dashboard: ' + error.message);
    }
  }
  finally {
    // 9. Ocultar el spinner
    if (loadingEl) loadingEl.style.display = 'none';
  }
});

/**
 * Función genérica para renderizar una lista de items en el DOM.
 * @param {string} containerId - ID del elemento contenedor en el HTML.
 * @param {string} title - Título o encabezado a mostrar.
 * @param {string} subtitle - Subtítulo o descripción breve.
 * @param {Array} items - Arreglo de objetos con datos a mostrar.
 * @param {string} itemKey - Propiedad de cada objeto que se mostrará en la lista.
 */
function renderList(containerId, title, subtitle, items, itemKey = 'description') {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = `<h5>${title}</h5>`;
  html += `<p>${subtitle}</p>`;
  html += `<ul>`;
  items.forEach(item => {
    html += `<li>${item[itemKey] || 'Sin descripción'}</li>`;
  });
  html += `</ul>`;

  container.innerHTML = html;
}
