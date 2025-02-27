document.addEventListener('DOMContentLoaded', () => {
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

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem('token');
  if (!token) {
      window.location.href = 'registro-inicio.html';
      return;
  }

  // Obtener datos del auditor desde localStorage
  const auditorData = localStorage.getItem('auditor');
  if (auditorData) {
      const auditor = JSON.parse(auditorData);
      if (auditorNameElement) auditorNameElement.textContent = auditor.name;
      if (auditorRoleElement) auditorRoleElement.textContent = auditor.role || "Auditor";

      if (auditorProfileName) auditorProfileName.textContent = auditor.name;
      if (auditorProfileEmail) auditorProfileEmail.textContent = auditor.email;
      if (auditorProfilePhone) auditorProfilePhone.textContent = auditor.phone || "No disponible";
      if (auditorProfileRole) auditorProfileRole.textContent = auditor.role || "Auditor";
  }

  // Carga de datos del dashboard
  fetch('https://apifixya.onrender.com/auditors/all', {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
  })
      .then(response => response.json())
      .then(data => {
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
          if (loadingIndicator) loadingIndicator.style.display = 'none';
      });
});
