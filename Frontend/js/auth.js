// js/auth.js

// URL base de tu API
const BASE_URL = 'https://apifixya.onrender.com'; // Ajusta a tu endpoint real

/**
 * Registra un nuevo auditor.
 * @param {Object} datos - { name, email, password }
 * @returns {Promise<Object>} Los datos del auditor creado (o lanza error).
 */
async function registerAuditor(datos) {
  // datos = { name, email, password }
  const resp = await fetch(`${BASE_URL}/auditors/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg);
  }
  return resp.json(); // { auditor_id, name, email, etc. }
}

/**
 * Inicia sesión como auditor.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} token devuelto por el servidor
 */
async function loginAuditor(email, password) {
  const resp = await fetch(`${BASE_URL}/auditors/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg);
  }
  const data = await resp.json(); // { token: '...' }
  return data.token;
}
