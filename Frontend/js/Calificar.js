document.addEventListener("DOMContentLoaded", function () {
    verificarAutenticacion();
    obtenerServiciosFinalizados();
  });
  
  // Asegura que el auditor esté autenticado
  function verificarAutenticacion() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "registro-inicio.html";
    }
  }
  
  // Llama a GET /proposals/finished para obtener servicios finalizados
  async function obtenerServiciosFinalizados() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://apifixya.onrender.com/proposals/finished", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        console.error("Error al obtener servicios finalizados:", response.status);
        return;
      }
      // data = { finishedCount, proposals: [...] } (según tu API)
      const data = await response.json();
      console.log("Servicios finalizados:", data.proposals);
  
      renderizarListaServicios(data.proposals);
    } catch (error) {
      console.error("Error en la conexión con la API:", error);
    }
  }
  
  // Genera tarjetas en la lista principal
  function renderizarListaServicios(proposals) {
    const container = document.querySelector("#lista-limpiadores .row");
    container.innerHTML = "";
  
    if (!proposals || proposals.length === 0) {
      container.innerHTML = "<p>No hay servicios finalizados pendientes de calificación.</p>";
      return;
    }
  
    proposals.forEach(proposal => {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card" onclick="mostrarDetalle(${proposal.id})">
          <img src="${proposal.imagen_despues?.[0] || 'images/placeholder.png'}" class="card-img-top" alt="Después de la limpieza">
          <div class="card-body">
            <h5 class="card-title">${proposal.cleanerName || "Limpiador Desconocido"}</h5>
            <p class="card-text">Servicio: ${proposal.tipodeservicio || "No especificado"}</p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  // Muestra el detalle de un servicio
  async function mostrarDetalle(proposalId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://apifixya.onrender.com/proposals/${proposalId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error("Error al obtener detalles del servicio:", response.status);
        return;
      }
      const proposal = await response.json();
      console.log("Detalle de la propuesta:", proposal);
  
      // Cambia la vista
      document.getElementById("lista-limpiadores").style.display = "none";
      document.getElementById("detalle-limpiador").style.display = "block";
  
      // Rellena datos del limpiador
      document.getElementById("nombre-limpiador").textContent = proposal.cleanerName || "No especificado";
      document.getElementById("contacto-limpiador").textContent = proposal.cleanerEmail || "No especificado";
  
      // Rellena datos del cliente
      document.getElementById("nombre-cliente").textContent = proposal.clientName || "No especificado";
      document.getElementById("contacto-cliente").textContent = proposal.clientEmail || "No especificado";
  
      // Fechas y tipo de servicio
      document.getElementById("inicio-servicio").textContent = proposal.start_time || "--";
      document.getElementById("fin-servicio").textContent = proposal.end_time || "--";
      document.getElementById("tipo-servicio").textContent = proposal.tipodeservicio || "No especificado";
  
      // Imágenes antes/después
      document.getElementById("imagen-antes").src = proposal.imagen_antes?.[0] || "images/placeholder.png";
      document.getElementById("imagen-despues").src = proposal.imagen_despues?.[0] || "images/placeholder.png";
  
    } catch (error) {
      console.error("Error al mostrar detalle:", error);
    }
  }
  
  // Botón para volver a la lista
  function volverALista() {
    document.getElementById("detalle-limpiador").style.display = "none";
    document.getElementById("lista-limpiadores").style.display = "block";
  }
  
  // Confirmar servicio
  async function confirmarServicio() {
    // PUT /proposals/{id} => { status: 'completed' }
    console.log("Servicio confirmado (ejemplo). Implementar PUT real.");
    alert("Servicio confirmado (ejemplo).");
  }
  
  // Marcar pendiente
  async function marcarPendiente() {
    // PUT /proposals/{id} => { status: 'pending' }
    console.log("Servicio marcado como pendiente (ejemplo).");
    alert("Servicio marcado como pendiente (ejemplo).");
  }
  
  // No realizado
  async function noRealizado() {
    // PUT /proposals/{id} => { status: 'not_completed' }
    console.log("Servicio no realizado (ejemplo).");
    alert("Servicio no realizado (ejemplo).");
  }
  
  // Envía calificación
  async function enviarCalificacion() {
    const rating = document.getElementById("calificacion").value;
    const comentario = document.getElementById("comentarios").value;
    // Realizar un PUT /proposals/{id}/rate o /proposals/{id} con { calificacion, comentario }
    console.log("Calificación:", rating, "Comentario:", comentario);
    alert(`Calificación enviada (ejemplo). Implementar PUT real con:\nCalificación=${rating}\nComentario=${comentario}`);
  }
  