// auth.js

// Función para alternar la visibilidad de los campos según el modo
function toggleFields() {
    const authMode = document.querySelector('input[name="authMode"]:checked').value;
    document.getElementById('nameFields').style.display = authMode === 'signup' ? 'block' : 'none';
    document.getElementById('signinFields').style.display = authMode === 'signin' ? 'block' : 'none';
    // Actualiza el texto del botón de envío
    document.getElementById('submitBtn').textContent = authMode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión';
  }
  
  // Escucha el evento de envío del formulario
  document.getElementById('dynamicForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const authMode = document.querySelector('input[name="authMode"]:checked').value;
  
    if (authMode === 'signup') {
      // Recopilamos los datos del registro
      const name = document.getElementById('nombre').value;
      const apellidoP = document.getElementById('apellidoP').value;
      const apellidoM = document.getElementById('apellidoM').value;
      const email = document.getElementById('register_correo').value;
      const password = document.getElementById('register_password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validación simple de contraseñas
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      // Preparamos el payload para el registro
      const payload = {
        name: name,
        email: email,
        password: password
      };
      
      try {
        const response = await fetch('https://apifixya.onrender.com/auditors/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Registro exitoso:', data);
          
          // Iniciar sesión automáticamente con los mismos datos
          const loginPayload = { email, password };
          try {
            const loginResponse = await fetch('https://apifixya.onrender.com/auditors/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
              },
              body: JSON.stringify(loginPayload)
            });
            
            if (loginResponse.ok) {
              const loginData = await loginResponse.json();
              console.log('Inicio de sesión exitoso:', loginData);
              // Guarda el token en localStorage para usarlo en otras páginas
              localStorage.setItem('token', loginData.token);
              // Redirige a index.html
              window.location.href = "index.html";
            } else {
              console.error('Error en el inicio de sesión automático');
              alert('Registro exitoso, pero no se pudo iniciar sesión automáticamente.');
            }
          } catch (error) {
            console.error('Error en la conexión al iniciar sesión automáticamente:', error);
            alert('Registro exitoso, pero ocurrió un error al iniciar sesión automáticamente.');
          }
        } else {
          console.error('Error en el registro');
          alert('Error en el registro');
        }
      } catch (error) {
        console.error('Error en la conexión:', error);
        alert('Error en la conexión');
      }
      
    } else if (authMode === 'signin') {
      // Recopilamos los datos para el inicio de sesión
      const email = document.getElementById('signin_correo').value;
      const password = document.getElementById('signin_password').value;
      
      // Preparamos el payload para el login
      const payload = {
        email: email,
        password: password
      };
      
      try {
        const response = await fetch('https://apifixya.onrender.com/auditors/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Inicio de sesión exitoso:', data);
          // Guarda el token en localStorage
          localStorage.setItem('token', data.token);
          // Redirige a index.html
          window.location.href = "index.html    ";
        } else {
          console.error('Error en el inicio de sesión');
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
  