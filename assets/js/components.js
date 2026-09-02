// Función para cargar componentes HTML
function loadComponent(elementId, filePath) {
  const mount = document.getElementById(elementId);
  if (!mount) {
    return Promise.resolve(null);
  }

  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      mount.innerHTML = data;

      // Aplicar estilos del navbar en páginas secundarias
      if (elementId === "navbar-container") {
        const isIndexPage =
          window.location.pathname.endsWith("index.html") ||
          window.location.pathname === "/" ||
          window.location.pathname.endsWith("/");

        if (!isIndexPage) {
          const navbar = document.querySelector(".navegacion");
          if (navbar) {
            navbar.classList.add("scrolled");
          }
        }
      }

      if (elementId === "contacto-container") {
        initContactoComponent();
      }

      return mount;
    })
    .catch((error) => {
      console.error("Error loading component:", error);
      return null;
    });
}

function mostrarEmail() {
  const email = "alexiszaracho@gmail.com";
  window.location.href = `mailto:${email}?subject=Consulta desde AsContSystem&body=Hola,%0A%0AQuiero más información sobre los servicios de AsCont.%0A%0AGracias.`;
}

function initContactoComponent() {
  const section = document.querySelector(
    "#contacto-container .contacto-seccion"
  );
  if (!section) return;

  // Re-observar animaciones (el HTML llega después del DOMContentLoaded)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-on-scroll");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(section);
  } else {
    section.classList.add("animate-on-scroll");
  }

  document.dispatchEvent(new CustomEvent("contacto:loaded"));
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("navbar-container", "/components/navbar.html");
  loadComponent("contacto-container", "/components/contacto.html");
});
