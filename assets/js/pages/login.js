const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "";

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

const bg = document.getElementById("interactive-bg");

for (let i = 0; i < 3; i++) {
  const blob = document.createElement("div");
  blob.classList.add("blob");
  bg.appendChild(blob);
}

function isSafeRedirect(url) {
  if (!url) return false;
  try {
    if (url.startsWith("/") && !url.startsWith("//")) {
      return true;
    }
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch (e) {
    return false;
  }
}

document
  .getElementById("signUpForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const consentimiento = document.getElementById("aceptoPrivacidadRegistro");
    if (!consentimiento || !consentimiento.checked) {
      if (consentimiento) consentimiento.reportValidity();
      return;
    }

    const formData = {
      nombre: document.getElementById("signUpName").value,
      email: document.getElementById("signUpEmail").value,
      password: document.getElementById("signUpPassword").value,
    };

    const messageContainer = document.getElementById("signUpMessage");
    const submitBtn = this.querySelector('button[type="submit"]');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Procesando...";

      const response = await fetch(`${API_BASE_URL}/backend/api/registro.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

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

document
  .getElementById("signInForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      email: document.getElementById("signInEmail").value,
      password: document.getElementById("signInPassword").value,
    };

    const messageContainer = document.getElementById("signInMessage");
    const submitBtn = this.querySelector('button[type="submit"]');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Iniciando...";

      const response = await fetch(`${API_BASE_URL}/backend/api/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      messageContainer.style.display = "block";

      if (data.success) {
        if (data.user?.nombre) {
          localStorage.setItem("nombreUsuario", data.user.nombre);
        }
        if (data.user?.email) {
          localStorage.setItem("userEmail", data.user.email);
        }

        const sessionResponse = await fetch(
          `${API_BASE_URL}/backend/api/check_session.php`,
          { credentials: "include" }
        );
        const sessionData = await sessionResponse.json();

        if (!sessionData.authenticated) {
          messageContainer.style.background = "#f8d7da";
          messageContainer.style.color = "#721c24";
          messageContainer.style.border = "1px solid #f5c6cb";
          messageContainer.textContent =
            "No se pudo confirmar la sesión. Intente nuevamente.";
          return;
        }

        messageContainer.style.background = "#d4edda";
        messageContainer.style.color = "#155724";
        messageContainer.style.border = "1px solid #c3e6cb";
        messageContainer.textContent = data.message;

        const params = new URLSearchParams(window.location.search);
        const queryRedirect = params.get("redirect");
        const storedRedirect = localStorage.getItem("redirectAfterLogin");
        const redirectUrl = isSafeRedirect(queryRedirect)
          ? queryRedirect
          : isSafeRedirect(storedRedirect)
            ? storedRedirect
            : data.redirect;

        setTimeout(() => {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
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
