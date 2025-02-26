// agenda.js
// Maneja la lógica de la Agenda, usando las funciones de "api.js" (createService, getServices, etc.)

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // si requieres login
      alert('No has iniciado sesión');
      return;
    }
    // Al cargar la página, obtén la lista de servicios
    await loadServices();
  });
  
  /**
   * Carga los servicios y los renderiza en #tasksContainer
   */
  async function loadServices() {
    try {
      const token = localStorage.getItem('token');
      // si tu API /services retorna un array de servicios
      const services = await getServices(token); // llama a la func en api.js
      renderServices(services);
    } catch (err) {
      alert('Error al cargar servicios: ' + err.message);
    }
  }
  
  /**
   * Crea un nuevo "Servicio" interpretándolo como un "Trabajo" en la agenda
   */
  async function addTask() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No has iniciado sesión');
      return;
    }
  
    const clientName = document.getElementById("clientName").value;
    const clientAddress = document.getElementById("clientAddress").value;
    const taskDate = document.getElementById("taskDate").value;
    const taskTime = document.getElementById("taskTime").value;
    const taskType = document.getElementById("taskType").value;
  
    if (!clientName || !clientAddress || !taskDate || !taskTime || !taskType) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    // Arma el "data" para createService
    // Revisa tu tabla Services: name, services_name, description, ...
    // Por ejemplo:
    const data = {
      // 'name' es un campo existente en la tabla Services
      name: taskType, 
      // "description" con la info del cliente + fecha/hora
      description: `Cliente: ${clientName}, Dir: ${clientAddress}, Fecha: ${taskDate}, Hora: ${taskTime}`,
      price: 0, // si deseas
      services_name: 'AgendaItem', // o lo que gustes
      // si tu API exige 'cleaner_id', pon un valor (1 o un ID real)
      cleaner_id: 1 
    };
  
    try {
      await createService(token, data); // Llama a la funcion de api.js
      alert('Trabajo (Servicio) creado');
  
      // Recargar lista
      await loadServices();
    } catch (err) {
      alert('Error al crear trabajo: ' + err.message);
    }
  }
  
  /**
   * Filtro local por texto (clientName, etc.) 
   * (Si tu API no soporta query param, filtra en el front)
   */
  function searchTask() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const tasks = document.querySelectorAll(".task-card");
    tasks.forEach(task => {
      const text = task.textContent.toLowerCase();
      task.style.display = text.includes(searchValue) ? "block" : "none";
    });
  }
  
  /**
   * Renderiza la lista de servicios en #tasksContainer
   */
  function renderServices(services) {
    const container = document.getElementById("tasksContainer");
    if (!container) return;
  
    if (!Array.isArray(services)) {
      container.innerHTML = `<p>Respuesta inesperada: ${JSON.stringify(services)}</p>`;
      return;
    }
  
    let html = '';
    services.forEach(s => {
      // s.name, s.description, etc. de la tabla Services
      html += `
        <div class="task-card">
          <div class="task-details">
            <p><strong>Servicio:</strong> ${s.name || ''}</p>
            <p><strong>Descripción:</strong> ${s.description || ''}</p>
            <p><strong>Precio:</strong> ${s.price || ''}</p>
            <p><strong>Cleaner ID:</strong> ${s.cleaner_id || ''}</p>
          </div>
        </div>
      `;
    });
  
    container.innerHTML = html || '<p>No hay servicios (trabajos) registrados</p>';
  }
  