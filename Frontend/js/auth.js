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
          signinFields.style.visibility = "hidden";
          signinFields.style.height = "0px";
          submitBtn.textContent = "Crear cuenta";
      } else {
          nameFields.style.display = "none";
          signinFields.style.visibility = "visible";
          signinFields.style.height = "auto";
          submitBtn.textContent = "Iniciar sesión";
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
          const nombre = document.getElementById("nombre")?.value.trim() || "";
          const apellidoP = document.getElementById("apellidoP")?.value.trim() || "";
          const apellidoM = document.getElementById("apellidoM")?.value.trim() || "";
          const email = document.getElementById("register_correo")?.value.trim();
          const password = document.getElementById("register_password")?.value.trim();
          const confirmPassword = confirmPasswordField?.value.trim();

          if (!email || !password || !confirmPassword) {
              alert("Todos los campos son obligatorios.");
              return;
          }

          if (password !== confirmPassword) {
              alert("Las contraseñas no coinciden.");
              return;
          }

          requestBody = {
              name: `${nombre} ${apellidoP} ${apellidoM}`.trim(),
              email,
              password
          };
      } else {
          const email = document.getElementById("signin_correo")?.value.trim();
          const password = document.getElementById("signin_password")?.value.trim();

          if (!email || !password) {
              alert("Correo y contraseña son obligatorios.");
              return;
          }

          requestBody = { email, password };
      }

      try {
          const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
              mode: 'cors'
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Error en autenticación");

          if (mode === "signin") {
              localStorage.setItem("token", data.token);
              alert("Inicio de sesión exitoso");
              window.location.href = "dashboard.html";
          } else {
              alert("Registro exitoso. Ahora puedes iniciar sesión.");
              document.querySelector('input[value="signin"]').click();
          }
      } catch (error) {
          alert(error.message);
      }
  });

  toggleFields();
});
