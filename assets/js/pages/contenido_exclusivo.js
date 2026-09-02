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
async function cargarVideosYoutube() {
  const containers = document.querySelectorAll(".video-container[data-video-id]");
  if (!containers.length) {
    return;
  }

  const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:8000"
      : "";

  try {
    const response = await fetch(
      `${API_BASE_URL}/backend/api/video_proxy.php`,
      { credentials: "include" }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    if (!data.success || !data.videos) {
      return;
    }

    containers.forEach((el) => {
      const id = el.getAttribute("data-video-id");
      const url = data.videos[id];
      if (!url) {
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.width = "560";
      iframe.height = "315";
      iframe.src = url;
      iframe.title = "YouTube video player";
      iframe.setAttribute("frameborder", "0");
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      el.appendChild(iframe);
    });
  } catch (e) {
    return;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  cargarVideosYoutube();

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
