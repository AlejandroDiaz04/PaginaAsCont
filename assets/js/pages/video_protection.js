// ===== PROTECCIÓN SIMPLE DE VIDEOS =====
// Solo protege contra clic derecho, descarga y copiar enlaces

(function () {
  "use strict";

  // Deshabilitar clic derecho en videos e iframes
  document.addEventListener("contextmenu", function (e) {
    if (
      e.target.tagName === "VIDEO" ||
      e.target.tagName === "IFRAME" ||
      e.target.closest(".video-container") ||
      e.target.closest(".video-container-principal")
    ) {
      e.preventDefault();
      return false;
    }
  });

  // Prevenir atajos de teclado relacionados con descargas
  document.addEventListener("keydown", function (e) {
    // Ctrl+S (Guardar)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      const target = document.activeElement;
      if (
        target.tagName === "VIDEO" ||
        target.closest(".video-container") ||
        target.closest(".video-container-principal")
      ) {
        e.preventDefault();
        return false;
      }
    }
  });

  // Bloquear selección de texto en URLs de iframes
  document.addEventListener("selectstart", function (e) {
    if (e.target.tagName === "IFRAME" || e.target.closest(".video-container")) {
      e.preventDefault();
      return false;
    }
  });

  // Prevenir arrastre de iframes
  document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "IFRAME" || e.target.closest(".video-container")) {
      e.preventDefault();
      return false;
    }
  });

  // Ocultar URLs de YouTube en la consola
  if (typeof console !== "undefined") {
    const originalLog = console.log;
    console.log = function () {
      // Filtrar logs que contengan URLs de YouTube
      const args = Array.from(arguments);
      const filtered = args.filter((arg) => {
        if (typeof arg === "string") {
          return !arg.includes("youtube.com") && !arg.includes("youtu.be");
        }
        return true;
      });
      if (filtered.length > 0) {
        originalLog.apply(console, filtered);
      }
    };
  }

  // Prevenir inspección de iframes y ocultar src
  document.addEventListener("DOMContentLoaded", function () {
    const videoContainers = document.querySelectorAll(".video-container");

    videoContainers.forEach((container) => {
      const iframe = container.querySelector("iframe");

      if (iframe) {
        // Hacer el iframe no seleccionable
        iframe.style.userSelect = "none";
        iframe.style.webkitUserSelect = "none";
        iframe.style.mozUserSelect = "none";
        iframe.style.msUserSelect = "none";

        // Prevenir copia del atributo src mediante inspección
        iframe.addEventListener("mousedown", function (e) {
          e.preventDefault();
        });

        // Bloquear eventos de teclado en el iframe
        iframe.addEventListener("keydown", function (e) {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            return false;
          }
        });
      }
    });

    // Proteger el video de presentación
    const videoPresentacion = document.querySelector(
      ".video-container-principal video"
    );
    if (videoPresentacion) {
      videoPresentacion.style.userSelect = "none";
      videoPresentacion.style.webkitUserSelect = "none";
    }
  });

  console.log("🔒 Protección de videos activada");
})();
