document.addEventListener("DOMContentLoaded", function () {
    const API_BASE_URL = "https://apifixya.onrender.com";
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const apellidoP = document.getElementById("apellidoP").value.trim();
            const apellidoM = document.getElementById("apellidoM").value.trim();
            const email = document.getElementById("register_correo").value.trim();
            const password = document.getElementById("register_password").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            const requestBody = {
                name: `${nombre} ${apellidoP} ${apellidoM}`.trim(),
                email,
                password
            };

            try {
                const response = await fetch(`${API_BASE_URL}/auditors/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Error en el registro");

                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                window.location.href = "inicio_sesion.html";
            } catch (error) {
                alert(error.message);
            }
        });
    }
});
