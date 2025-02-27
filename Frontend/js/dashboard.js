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

<<<<<<< HEAD
  // Se actualiza el endpoint a "cleaners"
  const apiUrl = 'https://apifixya.onrender.com/auditors/all';
=======
  // API para obtener la información del auditor
  const auditorApiUrl = 'https://apifixya.onrender.com/auditors/me';

  fetch(auditorApiUrl, {
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
    .then(auditor => {
      console.log('Datos del auditor:', auditor);

      // Guardar datos en localStorage
      localStorage.setItem('auditor', JSON.stringify(auditor));

      // Mostrar los datos en el Dashboard
      if (auditorNameElement) auditorNameElement.textContent = auditor.name;
      if (auditorRoleElement) auditorRoleElement.textContent = auditor.role || "Auditor";

      // Mostrar los datos en el modal de perfil
      if (auditorProfileName) auditorProfileName.textContent = auditor.name;
      if (auditorProfileEmail) auditorProfileEmail.textContent = auditor.email;
      if (auditorProfilePhone) auditorProfilePhone.textContent = auditor.phone || "No disponible";
      if (auditorProfileRole) auditorProfileRole.textContent = auditor.role || "Auditor";
    })
    .catch(error => {
      console.error('Error al obtener los datos del auditor:', error);
    });

  // API para obtener los usuarios registrados
  const apiUrl = 'https://apifixya.onrender.com/auditors/me/cleaners';
>>>>>>> b680f3518845a398363727b4089e6aae1b217243

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
