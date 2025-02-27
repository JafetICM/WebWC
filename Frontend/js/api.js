// api.js

// Obtener todos los usuarios
async function getAllUsers(token) {
    const response = await fetch('https://apifixya.onrender.com/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
  
    return response.json(); // Devuelve un array o el formato que tenga tu endpoint
  }
  
  // Obtener propuestas filtradas por estado (completed, in_progress, etc.)
  async function getProposals(token, status) {
    // Asumiendo que tu API tenga un endpoint /proposals?status=xxx
    const response = await fetch(`https://apifixya.onrender.com/proposals?status=${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener proposals');
    }
  
    return response.json();
  }
  
/*******************************************************
 * api.js
 * Funciones para interactuar con la API
 *******************************************************/

async function getAllUsers(token) {
    const response = await fetch('https://apifixya.onrender.com:3000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    return response.json();
  }
  
  async function getProposals(token, status) {
    const response = await fetch(`https://apifixya.onrender.com/proposals?status=${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Error al obtener proposals con status=${status}`);
    }
    return response.json();
  }
  
  async function getServices(token) {
    const response = await fetch(`https://apifixya.onrender.com/services`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Error al obtener servicios');
    }
    return response.json();
  }
  