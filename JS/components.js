// Función para cargar componentes HTML
function loadComponent(elementId, filePath) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;

      // Aplicar estilos del navbar en páginas secundarias
      const isIndexPage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/");

      if (!isIndexPage) {
        // En páginas secundarias, el navbar siempre debe tener fondo
        const navbar = document.querySelector(".navegacion");
        if (navbar) {
          navbar.classList.add("scrolled");
        }
      }
    })
    .catch((error) => console.error("Error loading component:", error));
}

// Cargar navbar cuando la página cargue
document.addEventListener("DOMContentLoaded", function () {
  // Detectar si estamos en la carpeta HTML o en la raíz
  const isInHtmlFolder = window.location.pathname.includes("/HTML/");
  const navbarPath = isInHtmlFolder
    ? "../components/navbar.html"
    : "components/navbar.html";

  loadComponent("navbar-container", navbarPath);
});
