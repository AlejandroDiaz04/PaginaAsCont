const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "";

async function verificarAutenticacion() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/backend/api/check_session.php`,
      { credentials: "include" }
    );
    const data = await response.json();
    return data && data.authenticated === true;
  } catch (e) {
    return false;
  }
}

function aplicarUIAutenticada(isLoggedIn) {
  const selectItem = document.querySelector(".nav-select-item");
  const loginItem = document.querySelector(".nav-login-item");
  const loginBtn = document.querySelector(".btn-login");

  if (isLoggedIn) {
    if (selectItem) {
      selectItem.style.display = "block";
    }

    if (loginItem) {
      const loginLink = loginItem.querySelector(".nav-login-link");
      loginLink.innerHTML =
        '<i class="ri-logout-box-r-line"></i><span>Cerrar Sesión</span>';
      loginLink.href = "javascript:void(0)";
      loginLink.onclick = cerrarSesion;
    }

    if (loginBtn) {
      loginBtn.innerHTML = '<i class="ri-logout-box-r-line"></i>';
      loginBtn.href = "javascript:void(0)";
      loginBtn.onclick = cerrarSesion;
    }

    const select = document.getElementById("contenidoExclusivoSelect");
    if (select) {
      select.disabled = false;
    }
  } else {
    if (selectItem) {
      selectItem.style.display = "none";
    }

    if (loginItem) {
      const loginLink = loginItem.querySelector(".nav-login-link");
      loginLink.innerHTML =
        '<i class="ri-user-line"></i><span>Iniciar Sesión</span>';
      loginLink.href = "/HTML/login.html";
      loginLink.onclick = null;
    }

    if (loginBtn) {
      loginBtn.innerHTML = '<i class="ri-user-line"></i>';
      loginBtn.href = "/HTML/login.html";
      loginBtn.onclick = null;
    }

    const select = document.getElementById("contenidoExclusivoSelect");
    if (select) {
      select.disabled = true;
    }
  }
}

async function actualizarUISegunAutenticacion() {
  const isLoggedIn = await verificarAutenticacion();
  aplicarUIAutenticada(isLoggedIn);
}

function cerrarSesion() {
  fetch(`${API_BASE_URL}/backend/api/logout.php`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.json().catch(() => ({})))
    .then(() => {
      localStorage.removeItem("nombreUsuario");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("redirectAfterLogin");
      aplicarUIAutenticada(false);
      window.location.href = "/index.html";
    })
    .catch(() => {
      window.location.href = "/index.html";
    });
}

document.addEventListener("DOMContentLoaded", actualizarUISegunAutenticacion);

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("contenidoExclusivoSelect");
  if (select) {
    select.addEventListener("change", (e) => {
      if (e.target.value) {
        window.location.href = e.target.value;
      }
    });
  }
});
