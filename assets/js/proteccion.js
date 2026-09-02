(function () {
  "use strict";

  const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:8000"
      : "";

  async function verificarAcceso() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/backend/api/check_session.php`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (!data || data.authenticated !== true) {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        alert("Debes iniciar sesión para acceder a este contenido.");
        window.location.href = "/HTML/login.html";
        return false;
      }

      return true;
    } catch (e) {
      localStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "/HTML/login.html";
      return false;
    }
  }

  verificarAcceso();

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      verificarAcceso();
    }
  });

  setInterval(verificarAcceso, 30000);
})();
