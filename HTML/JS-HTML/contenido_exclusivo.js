const links = document.querySelectorAll(".breadcrumb-link");

// Función para ir a una sección específica con smooth scroll
function goToSection(index) {
  const sections = [
    "inicio-exclusivo",
    "videos-exclusivos",
    "actualizaciones-exclusivas",
  ];
  const targetSection = document.getElementById(sections[index]);

  if (targetSection) {
    // Scroll suave a la sección
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

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
    setTimeout(() => goToSection(section), 100);
  }

  // Observador para actualizar navbar activa al hacer scroll
  const observerOptions = {
    root: null,
    rootMargin: "-100px 0px -70% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const sectionIndex = [
          "inicio-exclusivo",
          "videos-exclusivos",
          "actualizaciones-exclusivas",
        ].indexOf(sectionId);

        if (sectionIndex !== -1) {
          links.forEach((l, i) => {
            if (i === sectionIndex) {
              l.classList.add("active");
            } else {
              l.classList.remove("active");
            }
          });
        }
      }
    });
  }, observerOptions);

  // Observar todas las secciones
  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });
});
