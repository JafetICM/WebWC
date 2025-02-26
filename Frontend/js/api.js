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

// ...
// Añade aquí más funciones para las peticiones que requieras
