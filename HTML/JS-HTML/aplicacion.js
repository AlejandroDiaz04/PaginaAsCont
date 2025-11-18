// ===================== FUNCIONES PARA MODAL DE PANTALLAS =====================

let modalActual = 1;

// Abrir modal con la pantalla especificada
function abrirModalPantalla(numeroPantalla) {
  const modal = document.getElementById("modalPantallas");
  const section = document.getElementById(`modal-${numeroPantalla}`);

  if (modal && section) {
    // Ocultar todas las secciones
    document
      .querySelectorAll(".modal-pantalla-section")
      .forEach((sec) => (sec.style.display = "none"));

    // Mostrar la sección específica
    section.style.display = "block";
    modal.classList.add("active");
    modalActual = numeroPantalla;

    // Evitar scroll del body
    document.body.style.overflow = "hidden";
  }
}

// Cerrar modal
function cerrarModalPantalla() {
  const modal = document.getElementById("modalPantallas");
  modal.classList.remove("active");

  // Restaurar scroll del body
  document.body.style.overflow = "auto";
}

// Cambiar entre pantallas dentro del modal
function cambiarModalPantalla(numeroPantalla) {
  const section = document.getElementById(`modal-${numeroPantalla}`);
  if (section) {
    // Ocultar todas las secciones
    document
      .querySelectorAll(".modal-pantalla-section")
      .forEach((sec) => (sec.style.display = "none"));

    // Mostrar la nueva sección
    section.style.display = "block";
    modalActual = numeroPantalla;

    // Scroll al top del modal
    document.querySelector(".modal-pantallas-content").scrollTop = 0;
  }
}

// Cerrar modal al presionar ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modal = document.getElementById("modalPantallas");
    if (modal && modal.classList.contains("active")) {
      cerrarModalPantalla();
    }
  }
});

// Cerrar modal al hacer clic fuera
document.addEventListener("click", (event) => {
  const modal = document.getElementById("modalPantallas");
  if (event.target === modal && modal && modal.classList.contains("active")) {
    cerrarModalPantalla();
  }
});
