// JavaScript para la página de contenido exclusivo
document.addEventListener("DOMContentLoaded", function () {
  checkSession();
  setupLogout();
});

// Verificar si el usuario tiene sesión activa
async function checkSession() {
  try {
    const response = await fetch("/backend/api/check_session.php");
    const data = await response.json();

    if (!data.logged_in) {
      // Redirigir al login si no hay sesión
      window.location.href = "/HTML/login.html";
      return;
    }

    // Mostrar nombre del usuario
    if (data.user && data.user.nombre) {
      const userName = document.getElementById("userName");
      const userNameHero = document.getElementById("userNameHero");

      if (userName) {
        userName.textContent = data.user.nombre;
      }

      if (userNameHero) {
        userNameHero.textContent = data.user.nombre;
      }
    }
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    window.location.href = "/HTML/login.html";
  }
}

// Configurar botón de cerrar sesión
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        try {
          const response = await fetch("/backend/api/logout.php", {
            method: "POST",
          });

          const data = await response.json();

          if (data.success) {
            window.location.href = "/HTML/login.html";
          } else {
            alert("Error al cerrar sesión");
          }
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
          alert("Error al cerrar sesión");
        }
      }
    });
  }
}
