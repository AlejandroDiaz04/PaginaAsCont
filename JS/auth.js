// Verificar si el usuario está logueado
function verificarAutenticacion() {
  // Obtener el token o sesión del usuario (ajusta según tu backend)
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  const token = localStorage.getItem("authToken");

  return usuarioLogueado === "true" || !!token;
}

// Actualizar la UI según el estado de autenticación
function actualizarUISegunAutenticacion() {
  const isLoggedIn = verificarAutenticacion();
  const selectItem = document.querySelector(".nav-select-item");
  const loginItem = document.querySelector(".nav-login-item");
  const loginBtn = document.querySelector(".btn-login");

  if (isLoggedIn) {
    // Usuario logueado: mostrar select y cambiar login a logout
    if (selectItem) {
      selectItem.style.display = "block";
    }

    // Cambiar el link de login a logout
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

    // Habilitar el select
    const select = document.getElementById("contenidoExclusivoSelect");
    if (select) {
      select.disabled = false;
    }
  } else {
    // Usuario no logueado: ocultar select y mantener login
    if (selectItem) {
      selectItem.style.display = "none";
    }

    // Restaurar el link de login
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

    // Deshabilitar el select
    const select = document.getElementById("contenidoExclusivoSelect");
    if (select) {
      select.disabled = true;
    }
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  // Eliminar datos de sesión
  localStorage.removeItem("usuarioLogueado");
  localStorage.removeItem("authToken");
  localStorage.removeItem("nombreUsuario");
  localStorage.removeItem("userEmail");

  // Llamar al backend para cerrar sesión en el servidor
  fetch("http://localhost:8000/backend/api/logout.php", {
    method: "POST",
    credentials: "include",
  })
    .then(() => {
      // Actualizar la UI
      actualizarUISegunAutenticacion();

      // Redirigir al inicio
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
      // Redirigir aunque haya error
      window.location.href = "/index.html";
    });
}

// Ejecutar cuando se carga la página
document.addEventListener("DOMContentLoaded", actualizarUISegunAutenticacion);

// Escuchar cambios en el select
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
