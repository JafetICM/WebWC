// Función para alternar la visibilidad de los campos según el modo
function toggleFields() {
  const authMode = document.querySelector('input[name="authMode"]:checked').value;
  document.getElementById('nameFields').style.display = authMode === 'signup' ? 'block' : 'none';
  document.getElementById('signinFields').style.display = authMode === 'signin' ? 'block' : 'none';
  document.getElementById('submitBtn').textContent = authMode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión';
}

// Función para cerrar sesión
function logout() {
  // Elimina los datos almacenados en localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("auditor");

  // Redirige al usuario a la pantalla de inicio de sesión
  window.location.href = "registro-inicio.html";
}

// Escucha el evento de envío del formulario
document.getElementById('dynamicForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const authMode = document.querySelector('input[name="authMode"]:checked').value;

  if (authMode === 'signup') {
      const name = document.getElementById('nombre').value;
      const email = document.getElementById('register_correo').value;
      const password = document.getElementById('register_password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
      }

      const payload = { name, email, password };

      try {
          const response = await fetch('https://apifixya.onrender.com/auditors/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
              body: JSON.stringify(payload)
          });

          if (response.ok) {
              const data = await response.json();
              console.log('Registro exitoso:', data);

              // Iniciar sesión automáticamente
              const loginResponse = await fetch('https://apifixya.onrender.com/auditors/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
                  body: JSON.stringify({ email, password })
              });

              if (loginResponse.ok) {
                  const loginData = await loginResponse.json();
                  console.log('Inicio de sesión exitoso:', loginData);
                  localStorage.setItem('token', loginData.token);
                  localStorage.setItem('auditor', JSON.stringify(loginData.user));
                  window.location.href = "index.html";
              } else {
                  alert('Registro exitoso, pero no se pudo iniciar sesión automáticamente.');
              }
          } else {
              alert('Error en el registro');
          }
      } catch (error) {
          console.error('Error en la conexión:', error);
          alert('Error en la conexión');
      }
  } else if (authMode === 'signin') {
      const email = document.getElementById('signin_correo').value;
      const password = document.getElementById('signin_password').value;
      const payload = { email, password };

      try {
          const response = await fetch('https://apifixya.onrender.com/auditors/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
              body: JSON.stringify(payload)
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Inicio de sesión exitoso:', data);
          
            // Guarda el token y los datos del auditor en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('auditor', JSON.stringify(data.user));
          
            // Redirige a index.html
            window.location.href = "index.html";
          }
          
          
          else {
              alert('Error en el inicio de sesión');
          }
      } catch (error) {
          console.error('Error en la conexión:', error);
          alert('Error en la conexión');
      }
  }
});

// Inicializa la vista correcta al cargar la página
toggleFields();
