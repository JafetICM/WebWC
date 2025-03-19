/***************************************************************
 * calificar.js - Versión final para mostrar:
 *   - Foto de perfil del limpiador (en la lista)
 *   - Nombre/correo del cliente (requiere /users/:id/public)
 *   - Horas de inicio/fin en proposal
 ***************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  obtenerPropuestasFinalizadas();
});

/** 1) Obtener proposals => filtrar status='Completa' */
async function obtenerPropuestasFinalizadas() {
  const url = "https://apifixya.onrender.com/proposals";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error al obtener proposals:", response.status);
      return;
    }
    const data = await response.json();
    let proposals = data.proposals || [];
    proposals = proposals.filter(p => p.status === 'Completa');
    console.log("Propuestas finalizadas:", proposals);

    renderizarListaServicios(proposals);

  } catch (error) {
    console.error("Error en la conexión:", error);
  }
}

/** 2) Renderizar la lista: */
async function renderizarListaServicios(proposals) {
  const container = document.querySelector("#lista-limpiadores .row");
  container.innerHTML = "";

  if (!proposals || proposals.length === 0) {
    container.innerHTML = "<p>No hay servicios finalizados para calificar.</p>";
    return;
  }

  const cardElements = await Promise.all(proposals.map(async (proposal) => {
    let cleanerName   = "Limpiador Desconocido";
    let cleanerPhoto  = "images/placeholder.png";
    let serviceName   = "Servicio sin nombre";
    const imagenDespues = proposal.imagen_despues?.[0] || "images/placeholder.png"; 
    // (En caso quieras mostrar imagen del "después" en la card, ajusta la variable)

    // Obtenemos service
    if (proposal.serviceId) {
      const respS = await fetch(`https://apifixya.onrender.com/services/${proposal.serviceId}`);
      if (respS.ok) {
        const service = await respS.json();
        serviceName = service.name || "Servicio sin nombre";

        // Obtenemos cleaner
        if (service.cleanerId) {
          const respC = await fetch(`https://apifixya.onrender.com/cleaners/${service.cleanerId}/public`);
          if (respC.ok) {
            const cleanerData = await respC.json();
            cleanerName  = cleanerData.name   || "Limpiador Desconocido";
            cleanerPhoto = cleanerData.imageurl|| "images/placeholder.png";
          }
        }
      }
    }

    // Card
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card" style="cursor:pointer;" onclick="mostrarDetalle(${proposal.id})">
        <img src="${cleanerPhoto}" class="card-img-top" alt="Foto de perfil">
        <div class="card-body">
          <h5 class="card-title">${cleanerName}</h5>
          <p class="card-text">
            Servicio: ${serviceName} <br/>
            Estado: ${proposal.status}
          </p>
        </div>
      </div>
    `;
    return col;
  }));

  cardElements.forEach(card => container.appendChild(card));
}

/** 3) mostrarDetalle => info de cliente, limpiador, horas, etc. */
async function mostrarDetalle(proposalId) {
  resetCalificacion(); // borra rating/comentarios

  try {
    const proposalResp = await fetch(`https://apifixya.onrender.com/proposals/${proposalId}`);
    if (!proposalResp.ok) {
      console.error("Error al obtener proposal:", proposalResp.status);
      return;
    }
    const proposal = await proposalResp.json();
    console.log("Detalle proposal:", proposal);

    // 3.1) Obtener user (cliente), si existe endpoint /users/:id/public
    let userData = null;
    if (proposal.userId) {
      const uResp = await fetch(`https://apifixya.onrender.com/users/${proposal.userId}/public`); 
      if (uResp.ok) {
        userData = await uResp.json();
      }
    }

    // 3.2) Obtener service => cleaner
    let service = null;
    let cleaner = null;
    if (proposal.serviceId) {
      const sResp = await fetch(`https://apifixya.onrender.com/services/${proposal.serviceId}`);
      if (sResp.ok) {
        service = await sResp.json();

        if (service.cleanerId) {
          const cResp = await fetch(`https://apifixya.onrender.com/cleaners/${service.cleanerId}/public`);
          if (cResp.ok) {
            cleaner = await cResp.json();
          }
        }
      }
    }

    // 3.3) Rellenar HTML
    document.getElementById("lista-limpiadores").style.display = "none";
    document.getElementById("detalle-limpiador").style.display = "block";

    // DATOS DEL CLIENTE
    if (userData) {
      document.getElementById("nombre-cliente").textContent   = userData.name  || "No especificado";
      document.getElementById("contacto-cliente").textContent = userData.email || "No especificado";
    } else {
      document.getElementById("nombre-cliente").textContent   = "No especificado";
      document.getElementById("contacto-cliente").textContent = "No especificado";
    }

    // DATOS DEL LIMPIADOR
    if (cleaner) {
      document.getElementById("nombre-limpiador").textContent  = cleaner.name  || "No especificado";
      document.getElementById("contacto-limpiador").textContent= cleaner.email || "No especificado";
    } else {
      document.getElementById("nombre-limpiador").textContent  = "No especificado";
      document.getElementById("contacto-limpiador").textContent= "No especificado";
    }

    // Horas (Si tu proposal tiene start_time y end_time, úsalos)
    document.getElementById("inicio-servicio").textContent = proposal.start_time || "--";
    document.getElementById("fin-servicio").textContent    = proposal.end_time   || "--";

    // Tipo de servicio => proposal.tipodeservicio?
    document.getElementById("tipo-servicio").textContent = proposal.tipodeservicio || "N/A";

    // Imágenes “antes” y “después”
    document.getElementById("imagen-antes").src   = proposal.imagen_antes?.[0]   || "images/placeholder.png";
    document.getElementById("imagen-despues").src = proposal.imagen_despues?.[0] || "images/placeholder.png";

    // Guardamos
    window.currentProposal = proposal;
  } catch (err) {
    console.error("Error en mostrarDetalle:", err);
  }
}

function resetCalificacion() {
  document.getElementById("calificacion").value = 0;
  document.getElementById("comentarios").value  = "";
  const stars = document.querySelectorAll("#star-rating i");
  stars.forEach(star => star.classList.remove("selected", "hover"));
}

/**
 * 4) Confirmar => PUT /proposals/:id => status
 *    Re-fetch la lista
 */
async function confirmarServicio() {
  if (!window.currentProposal) return;
  await actualizarEstadoPropuesta(window.currentProposal.id, "finished");
  alert("Servicio confirmado");
  volverALista();
  obtenerPropuestasFinalizadas();
}
async function marcarPendiente() {
  if (!window.currentProposal) return;
  await actualizarEstadoPropuesta(window.currentProposal.id, "pending");
  alert("Servicio marcado como pendiente");
  volverALista();
  obtenerPropuestasFinalizadas();
}
async function noRealizado() {
  if (!window.currentProposal) return;
  await actualizarEstadoPropuesta(window.currentProposal.id, "not_completed");
  alert("Servicio no realizado");
  volverALista();
  obtenerPropuestasFinalizadas();
}
function volverALista() {
  document.getElementById("detalle-limpiador").style.display = "none";
  document.getElementById("lista-limpiadores").style.display = "block";
}
async function actualizarEstadoPropuesta(proposalId, nuevoEstado) {
  try {
    const resp = await fetch(`https://apifixya.onrender.com/proposals/${proposalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nuevoEstado })
    });
    if (!resp.ok) {
      console.error("Error al actualizar estado:", resp.status);
      return;
    }
    const updated = await resp.json();
    console.log("Propuesta actualizada:", updated);
  } catch (error) {
    console.error("Error al actualizar propuesta:", error);
  }
}

/**
 * 5) Enviar calificación => rating, comment
 */
async function enviarCalificacion() {
  if (!window.currentProposal) return;
  const rating     = parseInt(document.getElementById("calificacion").value || "0", 10);
  const comentario = document.getElementById("comentarios").value || "";
  
  try {
    const resp = await fetch(`https://apifixya.onrender.com/proposals/${window.currentProposal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment: comentario })
    });
    if (!resp.ok) {
      console.error("Error al enviar calificación:", resp.status);
      alert("Error al enviar calificación");
      return;
    }
    const updated = await resp.json();
    console.log("Calificación enviada:", updated);
    alert("Calificación enviada");
  } catch (error) {
    console.error("Error al enviar calificación:", error);
    alert("Error al enviar calificación");
  }
}
