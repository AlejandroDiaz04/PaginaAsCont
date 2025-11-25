const links = document.querySelectorAll(".breadcrumb-link");
const contenedor = document.querySelector(".contenedor-horizontal");

// Función para ir a una sección específica
function goToSection(index) {
  if (contenedor) {
    contenedor.style.transform = `translateX(-${index * 100}vw)`;

    // Actualizar enlaces activos
    links.forEach((l, i) => {
      if (i === parseInt(index)) {
        l.classList.add("active");
      } else {
        l.classList.remove("active");
      }
    });
  }
}

// Manejar clicks en navbar local
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const index = link.getAttribute("data-section");
    goToSection(index);
  });
});

// Detectar parámetro de sección en la URL al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get("section");

  if (section !== null) {
    // Ir a la sección especificada en la URL
    goToSection(section);
  }
});
