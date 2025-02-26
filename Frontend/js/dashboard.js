// dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // si no hay token, redirigir a login
    //   alert('No has iniciado sesión. Redirigiendo...');
    //   navigateTo('registro-inicio.html');
    //   return;
    }
  
    try {
      // 1) Obtener total de usuarios
      const users = await getAllUsers(token); // viene de api.js
      const totalUsuarios = users.length;
  
      // 2) Ventas del mes: supongamos que interpretas
      // “propuestas” con status="completed" en el mes actual = $$...
      const proposalsCompleted = await getProposals(token, 'completed');
      const ventasMes = proposalsCompleted.length * 100; 
      // (Solo ejemplo, si cada proposal “vale” 100)
  
      // 3) Proyectos activos: supongamos /proposals?status=in_progress 
      const proposalsInProgress = await getProposals(token, 'in_progress');
      const proyectosActivos = proposalsInProgress.length;
  
      // 4) Insertar en el DOM
      // Cambia las IDs en tu HTML para donde quieras poner los datos
      document.getElementById('usersCount').textContent = totalUsuarios;
      document.getElementById('salesAmount').textContent = '$' + ventasMes;
      document.getElementById('projectsActive').textContent = proyectosActivos.toString();
  
      // O podrías mostrar un “Gráfico de Rendimiento” si tu API provee data
      // ...
    } catch (error) {
      alert('Error en el dashboard: ' + error.message);
    }
  });

  /** Ejemplo: renderApprovedTasks */
function renderApprovedTasks(tasks) {
    const container = document.getElementById('tareas-aprobadas'); 
    if (!container) return;
    // Por tu HTML, "tareas-aprobadas" es la ID del tab content wrapper.
    // Insertar, p.ej., un <ul> con las tasks
    let html = `<h5>Tareas Aprobadas</h5>`;
    html += `<p>Lista de tareas que han sido aprobadas.</p>`;
    html += `<ul>`;
    tasks.forEach(t => {
      html += `<li>${t.description}</li>`; // Ajusta a la estructura de tu proposal
    });
    html += `</ul>`;
    container.innerHTML = html;
  }
  
  function renderPendingTasks(tasks) {
    const container = document.getElementById('tareas-pendientes');
    if (!container) return;
    let html = `<h5>Tareas Pendientes</h5><p>Lista de tareas pendientes:</p><ul>`;
    tasks.forEach(t => {
      html += `<li>${t.description}</li>`;
    });
    html += `</ul>`;
    container.innerHTML = html;
  }
  
  function renderActiveServices(services) {
    const container = document.getElementById('servicios-activos');
    if (!container) return;
    let html = `<h5>Servicios Activos</h5><p>Lista de servicios actualmente activos.</p><ul>`;
    services.forEach(s => {
      html += `<li>${s.name} - ${s.description}</li>`;
    });
    html += `</ul>`;
    container.innerHTML = html;
  }