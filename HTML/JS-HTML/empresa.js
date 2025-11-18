// ===================== INTERSECTION OBSERVER PARA ANIMACIONES DE SCROLL =====================

// Función para inicializar el observador de intersección
function inicializarAnimacionesScroll() {
  // Elementos a observar
  const elementosAObservar = [
    ".sobre-nosotros",
    ".mision-vision-contenedor",
    ".valores",
    ".datos-empresa",
    ".trabaja-con-nosotros",
    ".contacto-seccion",
  ];

  // Opciones del observador
  const opciones = {
    threshold: 0.1, // Se activa cuando el 10% del elemento es visible
    rootMargin: "0px 0px -100px 0px", // Inicia la animación 100px antes de que sea visible
  };

  // Crear observador
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Agregar clase de animación cuando entra en viewport
        entry.target.classList.add("animate-on-scroll");

        // Opcional: dejar de observar después de animar
        observer.unobserve(entry.target);
      }
    });
  }, opciones);

  // Observar todos los elementos
  elementosAObservar.forEach((selector) => {
    const elemento = document.querySelector(selector);
    if (elemento) {
      observer.observe(elemento);
    }
  });
}

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarAnimacionesScroll);
} else {
  inicializarAnimacionesScroll();
}
