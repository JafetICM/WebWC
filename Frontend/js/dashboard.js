document.addEventListener('DOMContentLoaded', () => {
  // Verificamos si el elemento existe en la página
  const usersCountElement = document.getElementById('usersCount');
  if (!usersCountElement) {
    console.log('Elemento "usersCount" no encontrado en esta página. Se omite la actualización.');
    return;
  }

  // Obtenemos el token desde el almacenamiento local (o desde donde lo gestiones)
  const token = localStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirigimos inmediatamente
    window.location.href = 'registro-inicio.html';
    return;
  }

  // Se actualiza el endpoint a "cleaners"
  const apiUrl = 'https://apifixya.onrender.com/auditors/me/cleaners';

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      // Si la respuesta no es exitosa, asumimos que el token es inválido y redirigimos
      if (!response.ok) {
        window.location.href = 'registro-inicio.html';
        throw new Error('Token inválido o error en la petición');
      }
      return response.json();
    })
    .then(data => {
      // Suponiendo que el endpoint devuelve un arreglo de cleaners
      const count = Array.isArray(data) ? data.length : 0;
      usersCountElement.innerText = count;
    })
    .catch(error => {
      console.error('Error al obtener los datos del endpoint:', error);
    });
});
