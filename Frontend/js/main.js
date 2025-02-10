// Seleccionamos los radios
const signupRadio = document.querySelector('input[value="signup"]');
const signinRadio = document.querySelector('input[value="signin"]');

// Seleccionamos el contenedor de campos de nombres
const nameFields = document.querySelector('.name-fields');

// Seleccionamos el botón principal
const submitBtn = document.getElementById('submitBtn');

// Función para actualizar la vista
function updateFormView() {
  if (signupRadio.checked) {
    // Crear cuenta
    nameFields.classList.remove('hidden');    // Muestra nombres
    submitBtn.textContent = 'Crear cuenta';   // Cambia el texto del botón
  } else if (signinRadio.checked) {
    // Iniciar sesión
    nameFields.classList.add('hidden');       // Oculta nombres
    submitBtn.textContent = 'Iniciar sesión'; // Cambia el texto del botón
  }
}

// Eventos cuando se cambia el radio
signupRadio.addEventListener('change', updateFormView);
signinRadio.addEventListener('change', updateFormView);

// Al cargar la página, forzamos la actualización inicial
updateFormView();
