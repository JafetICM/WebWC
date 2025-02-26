document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://apifixya.onrender.com";
  const form = document.getElementById("dynamicForm");
  const submitBtn = document.getElementById("submitBtn");
  const nameFields = document.getElementById("nameFields");
  const signinFields = document.getElementById("signinFields");
  const confirmPasswordField = document.getElementById("confirmPassword");

  function toggleFields() {
      const mode = document.querySelector('input[name="authMode"]:checked').value;

      if (mode === "signup") {
          nameFields.style.display = "block";
          signinFields.style.display = "none";
          submitBtn.textContent = "Crear cuenta";

          document.getElementById("register_correo").setAttribute("required", "true");
          document.getElementById("register_password").setAttribute("required", "true");
          confirmPasswordField.setAttribute("required", "true");

          document.getElementById("signin_correo").removeAttribute("required");
          document.getElementById("signin_password").removeAttribute("required");
      } else {
          nameFields.style.display = "none";
          signinFields.style.display = "block";
          submitBtn.textContent = "Iniciar sesión";

          document.getElementById("signin_correo").setAttribute("required", "true");
          document.getElementById("signin_password").setAttribute("required", "true");

          document.getElementById("register_correo").removeAttribute("required");
          document.getElementById("register_password").removeAttribute("required");
          confirmPasswordField.removeAttribute("required");
      }
  }

  document.querySelectorAll('input[name="authMode"]').forEach(input => {
      input.addEventListener("change", toggleFields);
  });

  form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const mode = document.querySelector('input[name="authMode"]:checked').value;
      const url = mode === "signup" 
          ? `${API_BASE_URL}/auditors/register` 
          : `${API_BASE_URL}/auditors/login`;

      let requestBody = {};

      if (mode === "signup") {
          const nombre = document.getElementById("nombre").value.trim();
          const apellidoP = document.getElementById("apellidoP").value.trim();
          const apellidoM = document.getElementById("apellidoM").value.trim();
          const email = document.getElementById("register_correo").value.trim();
          const password = document.getElementById("register_password").value.trim();
          const confirmPassword = confirmPasswordField ? confirmPasswordField.value.trim() : "";

          if (password !== confirmPassword) {
              alert("Las contraseñas no coinciden.");
              return;
          }

          requestBody = {
              name: `${nombre} ${apellidoP} ${apellidoM}`,
              email,
              password
          };
      } else {
          const email = document.getElementById("signin_correo").value.trim();
          const password = document.getElementById("signin_password").value.trim();

          requestBody = {
              email,
              password
          };
      }

      try {
          console.log("Enviando solicitud a:", url);
          console.log("Datos enviados:", requestBody);

          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(requestBody),
              mode: 'cors'  // ✅ Intentar forzar CORS
          });

          const text = await response.text();
          const data = text ? JSON.parse(text) : {};

          if (!response.ok) {
              throw new Error(data.message || "Error en la autenticación");
          }

          if (mode === "signin") {
              console.log("Token recibido:", data.token);
              localStorage.setItem("token", data.token);
              alert("Inicio de sesión exitoso");
              window.location.href = "dashboard.html";
          } else {
              alert("Registro exitoso. Ahora puedes iniciar sesión.");
              document.querySelector('input[value="signin"]').click();
          }
      } catch (error) {
          console.error("Error en la autenticación:", error);
          alert(error.message);
      }
  });

  toggleFields();
});