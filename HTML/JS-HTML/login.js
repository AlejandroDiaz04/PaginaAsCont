const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Crear burbujas animadas en el fondo
const bg = document.getElementById("interactive-bg");

for (let i = 0; i < 3; i++) {
  const blob = document.createElement("div");
  blob.classList.add("blob");
  bg.appendChild(blob);
}

// Manejar formulario de registro (Sign Up)
document
  .getElementById("signUpForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      nombre: document.getElementById("signUpName").value,
      email: document.getElementById("signUpEmail").value,
      password: document.getElementById("signUpPassword").value,
    };

    console.log("Datos a enviar:", formData); // Debug

    const messageContainer = document.getElementById("signUpMessage");
    const submitBtn = this.querySelector('button[type="submit"]');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Procesando...";

      const response = await fetch(
        "http://localhost:8000/backend/api/registro.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status); // Debug
      const data = await response.json();
      console.log("Response data:", data); // Debug

      messageContainer.style.display = "block";

      if (data.success) {
        messageContainer.style.background = "#d4edda";
        messageContainer.style.color = "#155724";
        messageContainer.style.border = "1px solid #c3e6cb";
        messageContainer.textContent = data.message;
        this.reset();
      } else {
        messageContainer.style.background = "#f8d7da";
        messageContainer.style.color = "#721c24";
        messageContainer.style.border = "1px solid #f5c6cb";
        messageContainer.textContent = data.message;
      }
    } catch (error) {
      messageContainer.style.display = "block";
      messageContainer.style.background = "#f8d7da";
      messageContainer.style.color = "#721c24";
      messageContainer.style.border = "1px solid #f5c6cb";
      messageContainer.textContent =
        "Error al procesar la solicitud. Por favor, intente nuevamente.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign Up";
    }
  });

// Manejar formulario de inicio de sesión (Sign In)
document
  .getElementById("signInForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      email: document.getElementById("signInEmail").value,
      password: document.getElementById("signInPassword").value,
    };

    console.log("Login - Datos a enviar:", formData); // Debug

    const messageContainer = document.getElementById("signInMessage");
    const submitBtn = this.querySelector('button[type="submit"]');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Iniciando...";

      const response = await fetch(
        "http://localhost:8000/backend/api/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Login - Response status:", response.status); // Debug
      const data = await response.json();
      console.log("Login - Response data:", data); // Debug

      messageContainer.style.display = "block";

      if (data.success) {
        // Guardar sesión en localStorage
        localStorage.setItem("usuarioLogueado", "true");
        localStorage.setItem("authToken", data.token || "session_active");
        localStorage.setItem("nombreUsuario", data.user?.nombre || "");
        localStorage.setItem("userEmail", data.user?.email || "");

        messageContainer.style.background = "#d4edda";
        messageContainer.style.color = "#155724";
        messageContainer.style.border = "1px solid #c3e6cb";
        messageContainer.textContent = data.message;

        // Redirigir a la página de contenido exclusivo
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 1000);
      } else {
        messageContainer.style.background = "#f8d7da";
        messageContainer.style.color = "#721c24";
        messageContainer.style.border = "1px solid #f5c6cb";
        messageContainer.textContent = data.message;
      }
    } catch (error) {
      messageContainer.style.display = "block";
      messageContainer.style.background = "#f8d7da";
      messageContainer.style.color = "#721c24";
      messageContainer.style.border = "1px solid #f5c6cb";
      messageContainer.textContent =
        "Error al iniciar sesión. Por favor, intente nuevamente.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
    }
  });
