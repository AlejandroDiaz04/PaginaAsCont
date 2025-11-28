// Protección de página - Solo usuarios logueados pueden acceder
(function () {
  "use strict";

  // Verificar autenticación inmediatamente
  function verificarAcceso() {
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    const token = localStorage.getItem("authToken");

    // Si no está logueado, redirigir al login
    if (usuarioLogueado !== "true" && !token) {
      // Guardar la URL actual para redirigir después del login
      const urlActual = window.location.href;
      localStorage.setItem("redirectAfterLogin", urlActual);

      // Mostrar mensaje y redirigir
      alert("Debes iniciar sesión para acceder a este contenido.");
      window.location.href = "/HTML/login.html";
      return false;
    }

    return true;
  }

  // Ejecutar verificación inmediatamente
  verificarAcceso();

  // Verificar también cuando la página se vuelve visible (previene bypass)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      verificarAcceso();
    }
  });

  // Verificar periódicamente cada 30 segundos
  setInterval(verificarAcceso, 30000);
})();
