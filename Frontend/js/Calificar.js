document.addEventListener("DOMContentLoaded", function () {
  obtenerPropuestasDesdeServiceId(10470, 10480); // Ajusta 10480 según lo necesites
});

/**
 * Obtiene propuestas para cada serviceId en el rango [inicialId, maxServiceId]
 * y luego las renderiza en la lista.
 */
async function obtenerPropuestasDesdeServiceId(inicialId, maxServiceId) {
  let allProposals = [];
  
  // Recorrer desde inicialId hasta maxServiceId
  for (let id = inicialId; id <= maxServiceId; id++) {
    const url = `https://apifixya.onrender.com/proposals/service/${id}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Se asume que data es un arreglo de propuestas
        if (Array.isArray(data) && data.length > 0) {
          allProposals = allProposals.concat(data);
          console.log(`ServiceId ${id} => Propuestas:`, data);
        } else {
          console.log(`ServiceId ${id} => No se encontraron propuestas.`);
        }
      } else {
        console.error(`Error al obtener proposals para serviceId ${id}:`, response.status);
      }
    } catch (error) {
      console.error(`Error en la conexión para serviceId ${id}:`, error);
    }
  }
  
  console.log("Propuestas totales a partir de serviceId 10470:", allProposals);
  renderizarListaServicios(allProposals);
}

/** 2) Renderizar la lista de servicios */
async function renderizarListaServicios(proposals) {
  const container = document.querySelector("#lista-limpiadores .row");
  container.innerHTML = "";

  if (!proposals || proposals.length === 0) {
    container.innerHTML = "<p>No hay servicios para mostrar.</p>";
    return;
  }

  const cardElements = await Promise.all(
    proposals.map(async (proposal) => {
      let cleanerName   = "Limpiador Desconocido";
      let cleanerPhoto  = "images/placeholder.png";
      let serviceName   = "Servicio sin nombre";

      // Obtener datos del servicio
      if (proposal.serviceId) {
        const respS = await fetch(`https://apifixya.onrender.com/services/${proposal.serviceId}`);
        if (respS.ok) {
          const service = await respS.json();
          serviceName = service.name || "Servicio sin nombre";

          // Obtener datos del limpiador (información pública)
          if (service.cleanerId) {
            const respC = await fetch(`https://apifixya.onrender.com/cleaners/${service.cleanerId}/public`);
            if (respC.ok) {
              const cleanerData = await respC.json();
              cleanerName  = cleanerData.name || "Limpiador Desconocido";
              cleanerPhoto = cleanerData.imageurl || "images/placeholder.png";
            }
          }
        }
      }

      // Crear tarjeta (card) para la propuesta
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
    })
  );

  cardElements.forEach(card => container.appendChild(card));
}

/** 3) Mostrar detalle de la propuesta seleccionada */
async function mostrarDetalle(proposalId) {
  resetCalificacion(); // Limpiar calificación y comentarios

  try {
    // Obtener la propuesta
    const proposalResp = await fetch(`https://apifixya.onrender.com/proposals/${proposalId}`);
    if (!proposalResp.ok) {
      console.error("Error al obtener proposal:", proposalResp.status);
      return;
    }
    const proposal = await proposalResp.json();
    console.log("Detalle proposal:", proposal);

    // Obtener datos del cliente (endpoint público)
    let userData = null;
    if (proposal.userId) {
      const uResp = await fetch(`https://apifixya.onrender.com/users/${proposal.userId}/public`);
      if (uResp.ok) {
        userData = await uResp.json();
      }
    }

    // Obtener el servicio y luego al limpiador (información pública)
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

    // Mostrar datos en la vista
    document.getElementById("lista-limpiadores").style.display = "none";
    document.getElementById("detalle-limpiador").style.display = "block";

    // Datos del cliente
    if (userData) {
      document.getElementById("nombre-cliente").textContent = userData.name || "No especificado";
      document.getElementById("contacto-cliente").textContent = userData.email || "No especificado";
    } else {
      document.getElementById("nombre-cliente").textContent = "No especificado";
      document.getElementById("contacto-cliente").textContent = "No especificado";
    }

    // Datos del limpiador
    if (cleaner) {
      document.getElementById("nombre-limpiador").textContent = cleaner.name || "No especificado";
      document.getElementById("contacto-limpiador").textContent = cleaner.email || "No especificado";
    } else {
      document.getElementById("nombre-limpiador").textContent = "No especificado";
      document.getElementById("contacto-limpiador").textContent = "No especificado";
    }

    // Fechas
    document.getElementById("inicio-servicio").textContent = proposal.createdAt || "--";
    document.getElementById("fin-servicio").textContent = proposal.updatedAt || "--";

    // Tipo de servicio
    document.getElementById("tipo-servicio").textContent = proposal.tipodeservicio || "N/A";

    // Imágenes
    document.getElementById("imagen-antes").src = proposal.imagen_antes?.[0] || "images/placeholder.png";
    document.getElementById("imagen-despues").src = proposal.imagen_despues?.[0] || "images/placeholder.png";

    // Guardamos la propuesta actual para acciones posteriores
    window.currentProposal = proposal;
  } catch (err) {
    console.error("Error en mostrarDetalle:", err);
  }
}

function resetCalificacion() {
  document.getElementById("calificacion").value = 0;
  document.getElementById("comentarios").value = "";
  const stars = document.querySelectorAll("#star-rating i");
  stars.forEach(star => star.classList.remove("selected", "hover"));
}

/** 4) Funciones para actualizar el estado de la propuesta */
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

async function confirmarServicio() {
  if (!window.currentProposal) return;
  await actualizarEstadoPropuesta(window.currentProposal.id, "Completa");
  alert("Servicio confirmado");
  volverALista();
  // Actualizamos la lista tras confirmar
  obtenerPropuestasDesdeServiceId(10470, 10480);
}

async function marcarPendiente() {
  if (!window.currentProposal) return;
  await actualizarEstadoPropuesta(window.currentProposal.id, "pending");
  alert("Servicio marcado como pendiente");
  volverALista();
  obtenerPropuestasDesdeServiceId(10470, 10480);
}

async function noRealizado() {
  if (!window.currentProposal) return;
  await actualizarEstadoPropuesta(window.currentProposal.id, "not_completed");
  alert("Servicio no realizado");
  volverALista();
  obtenerPropuestasDesdeServiceId(10470, 10480);
}

function volverALista() {
  document.getElementById("detalle-limpiador").style.display = "none";
  document.getElementById("lista-limpiadores").style.display = "block";
}

/** 5) Enviar calificación (rating y comentario) */
async function enviarCalificacion() {
  if (!window.currentProposal) return;
  const rating = parseInt(document.getElementById("calificacion").value || "0", 10);
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
