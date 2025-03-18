/***************************************************************
 * calificar.js
 * Ejemplo de uso con:
 *   - GET /auditors/me/proposals (lista básica)
 *   - GET /auditors/me/proposals/details?serviceId=... (detalle)
 *   - PUT /proposals/:id (cambiar estado, enviar calificación)
 ***************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  verificarAutenticacion();
  obtenerListaPropuestas(); // O como quieras llamarlo
});

/**
 * Verifica si el auditor está autenticado: revisa el token en localStorage.
 */
function verificarAutenticacion() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "registro-inicio.html";
  }
}

/**
 * 1) OBTENER LISTA DE PROPUESTAS DEL AUDITOR
 *    Llamará a GET /auditors/me/proposals (con o sin ?serviceId=).
 *    Ajusta la URL si tu endpoint requiere un param adicional.
 */
async function obtenerListaPropuestas() {
  const token = localStorage.getItem("token");

  // Si tu API requiere un serviceId, podrías poner ?serviceId=123
  const url = "https://apifixya.onrender.com/auditors/me/proposals"; 

  try {
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error("Error al obtener propuestas:", response.status);
      return;
    }

    // Suponiendo que devuelves un array. Ajusta según la respuesta real.
    const proposals = await response.json();
    console.log("Lista de propuestas:", proposals);

    // Renderizar la lista de tarjetas en la sección #lista-limpiadores
    renderizarListaServicios(proposals);
  } catch (error) {
    console.error("Error en la conexión:", error);
  }
}

/**
 * RENDERIZAR LA LISTA
 * - Muestra tarjetas con la info básica de la propuesta
 * - Al hacer clic, mostrará el detalle
 */
function renderizarListaServicios(proposals) {
  const container = document.querySelector("#lista-limpiadores .row");
  container.innerHTML = "";

  if (!proposals || proposals.length === 0) {
    container.innerHTML = "<p>No hay propuestas pendientes de calificación.</p>";
    return;
  }

  // Recorremos el array de proposals
  proposals.forEach(proposal => {
    // Ajusta los campos según lo que devuelva tu endpoint
    const proposalId = proposal.id; // Por ejemplo
    const tipodeservicio = proposal.tipodeservicio || "Sin tipo";
    const cleanerName = proposal.cleanerName || "Limpiador Desconocido";
    const imagenDespues = proposal.imagen_despues?.[0] || "images/placeholder.png";

    // Crear la tarjeta
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card" onclick="mostrarDetalle(${proposalId})">
        <img src="${imagenDespues}" class="card-img-top" alt="Después de la limpieza">
        <div class="card-body">
          <h5 class="card-title">${cleanerName}</h5>
          <p class="card-text">Servicio: ${tipodeservicio}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * 2) MOSTRAR DETALLE
 *    - Llama a GET /auditors/me/proposals/details?serviceId=...
 *      (o a tu endpoint preferido)
 *    - Rellena la vista de detalle
 */
async function mostrarDetalle(proposalId) {
  // GUARDAMOS el proposalId en una variable global, 
  // para usarlo luego en "confirmarServicio", etc.
  window.currentProposalId = proposalId;

  // Si en tu API es "GET /proposals/:id", haz eso:
  //   const url = `https://apifixya.onrender.com/proposals/${proposalId}`;
  // Si en tu API es "GET /auditors/me/proposals/details?serviceId=...",
  //   necesitas un serviceId. Ajusta la lógica para que
  //   'proposal' tenga un serviceId y lo uses. Ejemplo:
  
  /*
  const serviceId = ... // obtén el serviceId de la proposal guardada 
                        // o haz otra llamada a GET /proposals/:id 
  const urlDetails = `https://apifixya.onrender.com/auditors/me/proposals/details?serviceId=${serviceId}`;
  */

  // En este ejemplo, haremos un "GET /proposals/:id" directo:
  const token = localStorage.getItem("token");
  const url = `https://apifixya.onrender.com/proposals/${proposalId}`;

  try {
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
      console.error("Error al obtener detalle:", response.status);
      return;
    }
    const proposal = await response.json();
    console.log("Detalle proposal:", proposal);

    // Ahora tenemos la propuesta. Si necesitas info de user/cleaner,
    // la obtendrás dependiendo de si tu API ya lo trae o no.
    // Ejemplo: Rellenamos la UI:
    document.getElementById("lista-limpiadores").style.display = "none";
    document.getElementById("detalle-limpiador").style.display = "block";

    // Rellenar campos del limpiador
    // (Si proposal.cleanerName no existe, tendrías que
    //  hacer otra llamada a "GET /cleaners/..." o reestructurar la respuesta.)
    document.getElementById("nombre-limpiador").textContent = proposal.cleanerName || "No especificado";
    document.getElementById("contacto-limpiador").textContent = proposal.cleanerEmail || "No especificado";

    // Rellenar datos del cliente
    document.getElementById("nombre-cliente").textContent = proposal.clientName || "No especificado";
    document.getElementById("contacto-cliente").textContent = proposal.clientEmail || "No especificado";

    // Fechas y tipo de servicio
    document.getElementById("inicio-servicio").textContent = proposal.start_time || "--";
    document.getElementById("fin-servicio").textContent = proposal.end_time   || "--";
    document.getElementById("tipo-servicio").textContent = proposal.tipodeservicio || "No especificado";

    // Imágenes
    document.getElementById("imagen-antes").src   = proposal.imagen_antes?.[0]   || "images/placeholder.png";
    document.getElementById("imagen-despues").src = proposal.imagen_despues?.[0] || "images/placeholder.png";

  } catch (error) {
    console.error("Error al mostrar detalle:", error);
  }
}

/**
 * BOTÓN: Volver a la lista
 */
function volverALista() {
  document.getElementById("detalle-limpiador").style.display = "none";
  document.getElementById("lista-limpiadores").style.display = "block";
}

/***********************************************************
 * CAMBIAR ESTADO DE LA PROPUESTA
 * PUT /proposals/:id con { status: "..." }
 ***********************************************************/

async function confirmarServicio() {
  if (!window.currentProposalId) return;
  await actualizarEstadoPropuesta(window.currentProposalId, "completed");
  alert("Servicio confirmado");
}

async function marcarPendiente() {
  if (!window.currentProposalId) return;
  await actualizarEstadoPropuesta(window.currentProposalId, "pending");
  alert("Servicio marcado como pendiente");
}

async function noRealizado() {
  if (!window.currentProposalId) return;
  await actualizarEstadoPropuesta(window.currentProposalId, "not_completed");
  alert("Servicio no realizado");
}

/**
 * PUT /proposals/:id => { status: nuevoEstado }
 */
async function actualizarEstadoPropuesta(proposalId, nuevoEstado) {
  const token = localStorage.getItem("token");
  const url = `https://apifixya.onrender.com/proposals/${proposalId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: nuevoEstado })
    });

    if (!response.ok) {
      console.error("Error actualizando estado:", response.status);
      return;
    }
    const updatedProposal = await response.json();
    console.log("Propuesta actualizada:", updatedProposal);
  } catch (error) {
    console.error("Error al actualizar propuesta:", error);
  }
}

/***********************************************************
 * ENVIAR CALIFICACIÓN
 * - DEPENDE de tu API. Ejemplos:
 *   A) Si tu API lo hace con PUT /proposals/:id => { rating, comment }
 *   B) Si tu API tiene POST /ratings/create => { serviceId, rating, comment }
 ***********************************************************/

/**
 * A) Ejemplo: PUT /proposals/:id => { rating, comment }
 */
async function enviarCalificacion() {
  const rating = document.getElementById("calificacion").value;
  const comentario = document.getElementById("comentarios").value;
  if (!window.currentProposalId) return;

  const token = localStorage.getItem("token");
  const url = `https://apifixya.onrender.com/proposals/${window.currentProposalId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        rating: parseInt(rating, 10),
        comment: comentario
      })
    });
    if (!response.ok) {
      console.error("Error al enviar calificación:", response.status);
      alert("Error al enviar calificación");
      return;
    }
    const updated = await response.json();
    console.log("Calificación enviada, propuesta actualizada:", updated);
    alert("Calificación enviada");
  } catch (error) {
    console.error("Error al enviar calificación:", error);
    alert("Error al enviar calificación");
  }
}

/**
 * B) Ejemplo: POST /ratings/create => { serviceId, rating, comment }
 *  (En caso de que uses un endpoint de ratings separado)
 */
/*
async function enviarCalificacion() {
  const rating = document.getElementById("calificacion").value;
  const comentario = document.getElementById("comentarios").value;

  // Si necesitas saber el "serviceId" o "proposalId"
  // haz un fetch a la proposal actual, o guarda la info
  // en variables globales cuando mostraste el detalle.
  const serviceId = window.currentServiceId || 123;

  const token = localStorage.getItem("token");
  const url = `https://apifixya.onrender.com/ratings/create`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        serviceId: serviceId,
        rating: parseInt(rating, 10),
        comment: comentario
      })
    });
    if (!response.ok) {
      console.error("Error al enviar calificación:", response.status);
      alert("Error al enviar calificación");
      return;
    }
    const createdRating = await response.json();
    console.log("Calificación creada:", createdRating);
    alert("Calificación enviada");
  } catch (error) {
    console.error("Error al enviar calificación:", error);
    alert("Error al enviar calificación");
  }
}
*/
