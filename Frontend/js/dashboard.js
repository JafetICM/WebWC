document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const usersCountElement = document.getElementById('usersCount');
  const loadingIndicator = document.getElementById('dashboard-loading');
  const errorIndicator = document.getElementById('dashboard-error');
  const auditorNameElement = document.querySelector('.user-info span.fw-bold');
  const auditorRoleElement = document.querySelector('.user-info small');

  // Modal de perfil
  const auditorProfileName = document.getElementById('auditorName');
  const auditorProfileEmail = document.getElementById('auditorEmail');
  const auditorProfilePhone = document.getElementById('auditorPhone');
  const auditorProfileRole = document.getElementById('auditorRole');

  // Mostramos el indicador de carga
  if (loadingIndicator) loadingIndicator.style.display = 'block';
  if (errorIndicator) errorIndicator.style.display = 'none';

  // Obtenemos el token desde localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirigir a la página de inicio de sesión
    window.location.href = 'registro-inicio.html';
    return;
  }

  // Se actualiza el endpoint a "cleaners"
  const apiUrl = 'https://apifixya.onrender.com/auditors/all';

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Verificamos si la respuesta es un array y actualizamos el contador
      const count = Array.isArray(data) ? data.length : 0;
      usersCountElement.innerText = count;
    })
    .catch(error => {
      console.error('Error al obtener los datos del endpoint:', error);
      if (errorIndicator) {
        errorIndicator.innerText = 'No se pudieron cargar los datos. Inténtalo más tarde.';
        errorIndicator.style.display = 'block';
      }
    })
    .finally(() => {
      // Ocultamos el indicador de carga
      if (loadingIndicator) loadingIndicator.style.display = 'none';
    });
});
