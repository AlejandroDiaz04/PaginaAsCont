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
// ===================== LIGHTBOX PARA IMÁGENES DE LA GALERÍA =====================

// Crear el lightbox dinámicamente
function crearLightboxGaleria() {
  const lightbox = document.createElement("div");
  lightbox.id = "lightboxGaleria";
  lightbox.className = "lightbox-galeria";
  lightbox.innerHTML = `
    <button class="lightbox-galeria-close" id="lightboxGaleriaClose" aria-label="Cerrar">
      <i class="ri-close-line"></i>
    </button>
    <img src="" alt="" class="lightbox-galeria-image" id="lightboxGaleriaImage">
    <div class="lightbox-galeria-info" id="lightboxGaleriaInfo"></div>
  `;
  document.body.appendChild(lightbox);
}

// Inicializar lightbox cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  crearLightboxGaleria();

  const lightbox = document.getElementById("lightboxGaleria");
  const lightboxImage = document.getElementById("lightboxGaleriaImage");
  const lightboxInfo = document.getElementById("lightboxGaleriaInfo");
  const closeBtn = document.getElementById("lightboxGaleriaClose");

  // Función para abrir lightbox
  function abrirLightboxImagen(imageSrc, imageAlt) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightboxInfo.textContent = imageAlt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Función para cerrar lightbox
  function cerrarLightboxImagen() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Event listener para cerrar con el botón
  closeBtn.addEventListener("click", cerrarLightboxImagen);

  // Cerrar al hacer clic fuera de la imagen
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      cerrarLightboxImagen();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      cerrarLightboxImagen();
    }
  });

  // Prevenir que el clic en la imagen cierre el lightbox
  lightboxImage.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Agregar event listeners a todas las imágenes de la galería
  function inicializarImagenesGaleria() {
    const imagenesGaleria = document.querySelectorAll(".galeria-item img");

    imagenesGaleria.forEach(function (img) {
      img.addEventListener("click", function () {
        abrirLightboxImagen(this.src, this.alt);
      });

      // Soporte para teclado
      img.setAttribute("tabindex", "0");
      img.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          abrirLightboxImagen(this.src, this.alt);
        }
      });
    });
  }

  // Inicializar las imágenes
  inicializarImagenesGaleria();

  // Re-inicializar cuando se cambia de modal (para las nuevas imágenes cargadas)
  const observer = new MutationObserver(function () {
    inicializarImagenesGaleria();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
