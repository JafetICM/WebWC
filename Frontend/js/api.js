// api.js

const BASE_URL = 'https://apifixya.onrender.com'; // Ajusta a tu endpoint real

// Ejemplo: si quieres contar “usuarios” (GET /users)
async function getAllUsers(token) {
  const resp = await fetch(`${BASE_URL}/users`, {
    headers: { 'Authorization': 'Bearer ' + token },
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json(); // asume tu API retorna un array de users
}

// Ejemplo: si quieres obtener “tareas aprobadas” o “pendientes”
// (podrías interpretar que las “proposals” con un status=approved o pending)
async function getProposals(token, status) {
  // /proposals?status=approved (si el backend lo permite) 
  // o filtras en el frontend
  const resp = await fetch(`${BASE_URL}/proposals?status=${status}`, {
    headers: { 'Authorization': 'Bearer ' + token },
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json(); // asume un JSON con rows o un array
}

// Ejemplo: si “Servicios Activos” se obtienen con GET /services con un filtro
// Podrías hacer /services?status=active si tu API lo define. 
async function getServices(token, status = 'active') {
  const resp = await fetch(`${BASE_URL}/services?status=${status}`, {
    headers: { 'Authorization': 'Bearer ' + token },
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json();
}


// ===========================================================
// TUS FUNCIONES EXISTENTES (EJ. getAllUsers, getProposals...)
// ===========================================================

/**
 * Obtener servicios, opcionalmente filtrados por status.
 * Por defecto status='active', si tu API lo maneja.
 * Si tu endpoint /services no filtra status, quita param.
 */
async function getServices(token, status = '') {
  let url = `${BASE_URL}/services`;
  if (status) {
    // si tu API /services?status=xxx existe, añade query param
    url += `?status=${status}`;
  }

  const resp = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json(); // Podría retornar un array o {rows, count}, según tu API
}

/**
 * Crear un nuevo servicio (POST /services)
 * data = { name, description, price, etc. }
 */
async function createService(token, data) {
  const resp = await fetch(`${BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json(); // retorna el servicio creado
}

/**
 * Ejemplo: obtener un servicio por ID (GET /services/{id})
 */
async function getServiceById(token, serviceId) {
  const resp = await fetch(`${BASE_URL}/services/${serviceId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json();
}

/**
 * Actualizar un servicio (PUT /services/{id})
 */
async function updateService(token, serviceId, data) {
  const resp = await fetch(`${BASE_URL}/services/${serviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json();
}

/**
 * Eliminar un servicio (DELETE /services/{id})
 */
async function deleteService(token, serviceId) {
  const resp = await fetch(`${BASE_URL}/services/${serviceId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp.json();
}
