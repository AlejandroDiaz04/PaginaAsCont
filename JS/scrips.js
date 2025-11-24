const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -100px 0px",
};
// ========== CONTROL DEL MENÚ HAMBURGUESA ==========

document.addEventListener("DOMContentLoaded", function () {
  // Obtener elementos del DOM
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  // ========== ABRIR/CERRAR MENÚ ==========
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      // Toggle de clases
      hamburgerBtn.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Actualizar atributo aria-expanded para accesibilidad
      const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      hamburgerBtn.setAttribute("aria-expanded", !isExpanded);

      // Cambiar el label del botón
      hamburgerBtn.setAttribute(
        "aria-label",
        isExpanded ? "Abrir menú" : "Cerrar menú"
      );
    });
  }

  // ========== CERRAR MENÚ CUANDO SE HACE CLICK EN UN ENLACE ==========
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Cerrar el menú
      hamburgerBtn.classList.remove("active");
      navMenu.classList.remove("active");

      // Resetear aria-expanded
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "Abrir menú");
    });
  });

  // ========== CERRAR MENÚ CON LA TECLA ESCAPE ==========
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hamburgerBtn.classList.remove("active");
      navMenu.classList.remove("active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "Abrir menú");
    }
  });

  // ========== CERRAR MENÚ AL HACER CLICK FUERA ==========
  document.addEventListener("click", function (event) {
    // Verificar si el click fue fuera del navbar
    const navbar = document.querySelector(".navegacion");

    if (navbar && !navbar.contains(event.target)) {
      // Si el menú está abierto, cerrarlo
      if (navMenu.classList.contains("active")) {
        hamburgerBtn.classList.remove("active");
        navMenu.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
        hamburgerBtn.setAttribute("aria-label", "Abrir menú");
      }
    }
  });

  // ========== CERRAR MENÚ CUANDO SE RESIZE LA VENTANA ==========
  window.addEventListener("resize", function () {
    // Si la ventana es mayor a 768px y el menú está abierto, cerrarlo
    if (window.innerWidth > 768) {
      if (navMenu.classList.contains("active")) {
        hamburgerBtn.classList.remove("active");
        navMenu.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    }
  });
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-on-scroll");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".seccion-productos, .seccion-servicios, .texto-medio, .contacto-seccion"
  )
  .forEach((el) => {
    observer.observe(el);
  });

let typewriterInitialized = false;

function initTypewriter() {
  if (typewriterInitialized) return;

  const originalHTML = `Agiliza el trabajo de tu empresa\ncon <span style="color: orangered">AsCont</span>`;
  const target = document.getElementById("type-target");
  const typingSpeed = 80;
  const pauseAfter = 1600;

  function typeHTML(element, html, speed, cb) {
    const tokens = [];
    const tagRegex = /<\/?[^>]+>/g;
    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        const textPart = html.slice(lastIndex, match.index);
        for (const ch of textPart) tokens.push({ type: "char", value: ch });
      }
      tokens.push({ type: "tag", value: match[0] });
      lastIndex = tagRegex.lastIndex;
    }

    if (lastIndex < html.length) {
      const rest = html.slice(lastIndex);
      for (const ch of rest) tokens.push({ type: "char", value: ch });
    }

    let i = 0;
    function step() {
      if (i >= tokens.length) {
        if (cb) cb();
        return;
      }
      const t = tokens[i++];
      if (t.type === "tag") {
        element.innerHTML += t.value;
        step();
      } else {
        element.innerHTML += t.value;
        setTimeout(step, speed);
      }
    }
    step();
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    target.innerHTML = originalHTML.replace(/\n/g, "<br>");
    target.style.borderRight = "none";
  } else {
    const htmlWithBr = originalHTML.replace(/\n/g, "<br>");
    typeHTML(target, htmlWithBr, typingSpeed, () => {
      setTimeout(() => {
        target.style.borderRight = "none";
      }, pauseAfter);
    });
  }

  typewriterInitialized = true;
}

const typewriterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initTypewriter();
        typewriterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const typeTarget = document.getElementById("type-target");
if (typeTarget) {
  typewriterObserver.observe(typeTarget);
}

document.querySelectorAll('.navegacion a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop;
      const navHeight = document.querySelector(".navegacion").offsetHeight;

      window.scrollTo({
        top: offsetTop - navHeight,
        behavior: "smooth",
      });
    }
  });
});

let lastScrollTop = 0;
const navbar = document.querySelector(".navegacion");
const scrollThreshold = 100;

window.addEventListener(
  "scroll",
  function () {
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScrollTop) {
        navbar.classList.add("nav-hidden");
      } else {
        navbar.classList.remove("nav-hidden");
      }
    } else {
      navbar.classList.remove("nav-hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  },
  { passive: true }
);

let sliderInitialized = false;

function initSlider() {
  if (sliderInitialized) return;

  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");
  let autoSlideInterval;

  function showSlide(index) {
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    slides[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");
  }

  function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoSlide();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 10000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  document.querySelectorAll(".indicator").forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });
  });

  const prevBtn = document.querySelector(".slide-nav.prev");
  const nextBtn = document.querySelector(".slide-nav.next");

  if (prevBtn) prevBtn.addEventListener("click", () => changeSlide(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changeSlide(1));

  document
    .querySelector(".seccion-inicio")
    ?.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval);
    });

  document
    .querySelector(".seccion-inicio")
    ?.addEventListener("mouseleave", () => {
      startAutoSlide();
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") changeSlide(-1);
    else if (e.key === "ArrowRight") changeSlide(1);
  });

  startAutoSlide();
  sliderInitialized = true;
}

const sliderObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initSlider();
      }
    });
  },
  { threshold: 0.1 }
);

const inicioSection = document.querySelector(".seccion-inicio");
if (inicioSection) {
  sliderObserver.observe(inicioSection);
}

const contenidoModulos = {
  stock: {
    titulo: "Gestión de Stock",
    icono: "IMG/stock.png",
    logo: "IMG/logoNube.png",
    descripcion:
      "Control completo de tu inventario con herramientas profesionales",
    caracteristicas: [
      "Carga de mercaderías y clasificación según grupos y familias. Permite la configuración de cuentas para ventas de mercaderías y costeo",
      "Gestión de lista de precios de mercaderías",
      "Gestión de Inventario Inicial",
      "Gestión de Inventario Físico y Comparativo",
      "Anulación de Comprobantes de entrada, salida, transferencia y notas de envío",
      "Gestión de transferencias entre depósitos y sucursales",
      "Gestión de entrada y salida de mercaderías",
      "Notas de Envío de Mercaderías",
      "Informes: Lista de artículos por grupos, Valorización de stock, Listado por inventario y mantenimiento, Artículos por sucursales y depósitos, Lista de precios, Fichas de Movimientos, Existencia de artículos por depósito, Resumen de movimientos por artículos, Listado de artículos con stock mínimo",
    ],
    beneficios:
      "Controlá tu inventario de forma precisa: registrá entradas, salidas y transferencias, mantené tus precios actualizados y accedé a reportes detallados para optimizar compras y evitar quiebres o excesos de stock.",
  },

  facturacion: {
    titulo: "Facturación y Ventas",
    icono: "IMG/facturcion.png",
    logo: "IMG/logoNube.png",
    descripcion:
      "Sistema integral para gestionar todas tus operaciones de venta",
    caracteristicas: [
      "Gestión de facturas de compras",
      "Gestión de facturas de ventas",
      "Gestión de pedidos y presupuestos",
      "Puntos de venta",
      "Informes de compras",
      "Informes de ventas",
      "Gestión de órdenes de trabajo",
      "Adelantos por productos",
      "Gestión de contratos",
      "Reprocesamiento de costo y ganancia por factura",
      "Gestión de repartos",
    ],
    beneficios:
      "Agiliza tus ventas, reduce errores de facturación y mantén un control preciso de todas las operaciones comerciales.",
  },

  inventario: {
    titulo: "Control de Inventario",
    icono: "IMG/inventario.png",
    logo: "IMG/logoNube.png",
    descripcion: "Mantén tu stock actualizado con inventarios físicos precisos",
    caracteristicas: [
      "Creación de planillas de inventario por secciones",
      "Inventario con dispositivos móviles",
      "Comparación automática",
      "Ajustes de inventario",
      "Valorización del inventario",
      "Reportes de diferencias",
      "Programación de inventarios",
      "Múltiples usuarios simultáneamente",
    ],
    beneficios:
      "Elimina las diferencias de inventario, detecta mermas y mantén información 100% confiable de tus existencias.",
  },

  reportes: {
    titulo: "Reportes y Análisis",
    icono: "IMG/reportes.png",
    logo: "IMG/logoNube.png",
    descripcion: "Información precisa para tomar las mejores decisiones",
    caracteristicas: [
      "Reportes de ventas por período",
      "Análisis de rentabilidad",
      "Estadísticas de clientes",
      "Gráficos interactivos",
      "Exportación a múltiples formatos",
      "Comparativas entre períodos",
      "Reportes de productos",
      "Proyecciones y tendencias",
    ],
    beneficios:
      "Toma decisiones basadas en datos reales, identifica oportunidades y mejora la estrategia de tu negocio.",
  },

  finanzas: {
    titulo: "Gestión Financiera",
    icono: "IMG/finanzas.png",
    logo: "IMG/logoNube.png",
    descripcion: "Control total de tu flujo de efectivo",
    caracteristicas: [
      "Control de cajas y bancos",
      "Conciliación bancaria",
      "Gestión de cheques",
      "Control de cobranzas",
      "Registro de gastos",
      "Cuentas corrientes",
      "Proyección de flujo",
      "Integración contable",
    ],
    beneficios:
      "Mantén el control financiero de tu empresa, evita cheques rechazados y optimiza tu capital de trabajo.",
  },

  rrhh: {
    titulo: "Recursos Humanos",
    icono: "IMG/RRHH.png",
    logo: "IMG/logoNube.png",
    descripcion: "Administra tu personal de forma eficiente",
    caracteristicas: [
      "Gestión de legajos",
      "Liquidación de sueldos",
      "Cálculo automático",
      "Generación de aguinaldos",
      "Planillas para organismos",
      "Control de asistencias",
      "Recibos digitales",
      "Integración contable",
    ],
    beneficios:
      "Simplifica la gestión de RRHH, asegura el cumplimiento legal y dedica más tiempo a tu negocio.",
  },
};

function abrirModal(modulo) {
  const modal = document.getElementById("modalModulo");
  const contenido = document.getElementById("contenidoModal");
  const datos = contenidoModulos[modulo];

  if (datos) {
    let listaCaracteristicas = datos.caracteristicas
      .map((item) => `<li>${item}</li>`)
      .join("");

    contenido.innerHTML = `
      <img src="${datos.logo}" alt="Logo AsContSystem" class="modal-logo">
      <img src="${datos.icono}" alt="${datos.titulo}" class="modal-header-img">
      <h2>${datos.titulo}</h2>
      <p style="font-size: 1.2rem; color: #333; font-weight: 500;">${datos.descripcion}</p>
      
      <h3>Características principales:</h3>
      <ul>
        ${listaCaracteristicas}
      </ul>
      
      <h3>Beneficios:</h3>
      <p><strong>${datos.beneficios}</strong></p>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    modal.setAttribute("aria-hidden", "false");
  }
}

function cerrarModal() {
  const modal = document.getElementById("modalModulo");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  modal.setAttribute("aria-hidden", "true");
}

window.onclick = function (event) {
  const modal = document.getElementById("modalModulo");
  if (event.target === modal) {
    cerrarModal();
  }
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    cerrarModal();
  }
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", function () {
    const targetTab = this.getAttribute("data-tab");
    const currentContent = document.querySelector(".tab-content.active");

    if (currentContent && currentContent.id === `tab-${targetTab}`) {
      return;
    }

    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    this.classList.add("active");
    this.setAttribute("aria-selected", "true");

    if (currentContent) {
      currentContent.style.opacity = "0";
      setTimeout(() => {
        currentContent.classList.remove("active");
        currentContent.style.opacity = "";

        const targetContent = document.getElementById(`tab-${targetTab}`);
        if (targetContent) {
          targetContent.classList.add("active");
        }
      }, 300);
    } else {
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    }
  });
});

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = "";

  if (element.timeoutId) {
    clearTimeout(element.timeoutId);
  }

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      element.timeoutId = setTimeout(type, speed);
    }
  }

  type();
}

document
  .querySelectorAll(
    ".movil, .movil2, .movil4, .movil5, .sistema, .sistema2, .sistema3, .sistema4"
  )
  .forEach((div) => {
    let cooldown = false;

    div.addEventListener("mouseenter", function () {
      if (cooldown) return;

      cooldown = true;
      const textos = this.querySelectorAll(".typewriter-js");

      textos.forEach((texto) => {
        texto.textContent = "";
        if (texto.timeoutId) clearTimeout(texto.timeoutId);
        if (texto.delayTimeoutId) clearTimeout(texto.delayTimeoutId);
      });

      let primeraLinea = "Aplicación";
      let segundaLinea = "Móvil";

      if (
        this.classList.contains("sistema") ||
        this.classList.contains("sistema2") ||
        this.classList.contains("sistema3") ||
        this.classList.contains("sistema4")
      ) {
        primeraLinea = "Sistema";
        segundaLinea = "Escritorio";
      }

      textos[0].delayTimeoutId = setTimeout(() => {
        typeWriter(textos[0], primeraLinea, 50);
      }, 200);

      textos[1].delayTimeoutId = setTimeout(() => {
        typeWriter(textos[1], segundaLinea, 50);
      }, 800);

      setTimeout(() => {
        cooldown = false;
      }, 1200);
    });

    div.addEventListener("mouseleave", function () {
      const textos = this.querySelectorAll(".typewriter-js");

      textos.forEach((texto) => {
        if (texto.timeoutId) clearTimeout(texto.timeoutId);
        if (texto.delayTimeoutId) clearTimeout(texto.delayTimeoutId);
        texto.textContent = "";
      });

      setTimeout(() => {
        cooldown = false;
      }, 100);
    });
  });

function navegarAPagina(tipo, elemento) {
  elemento.classList.add("clicking");

  setTimeout(() => {
    if (tipo === "empresa") {
      window.location.href = "HTML/empresa.html";
    }
    if (tipo === "movil") {
      window.location.href = "HTML/aplicacion.html";
    } else if (tipo === "sistema") {
      window.location.href = "HTML/sistema.html";
    }
  }, 300);
}

document
  .querySelectorAll(".movil, .movil2, .movil4, .movil5")
  .forEach((div) => {
    div.addEventListener("click", function () {
      navegarAPagina("movil", this);
    });
  });

document
  .querySelectorAll(".sistema, .sistema2, .sistema3, .sistema4, .sistema5")
  .forEach((div) => {
    div.addEventListener("click", function () {
      navegarAPagina("sistema", this);
    });
  });

document.querySelectorAll(".navegacion a[href^='#empresa']").forEach((div) => {
  div.addEventListener("click", function () {
    navegarAPagina("empresa", this);
  });
});
document
  .getElementById("solicitudForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const nombre = form.querySelector("#nombre").value.trim();
    const email = form.querySelector("#email").value.trim();
    const telefono = form.querySelector("#telefono").value.trim();

    let isValid = true;

    // Validación nombre
    if (!nombre || nombre.length < 3) {
      document.getElementById("nombre-error").textContent =
        "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    } else {
      document.getElementById("nombre-error").textContent = "";
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById("email-error").textContent =
        "Por favor ingresa un email válido";
      isValid = false;
    } else {
      document.getElementById("email-error").textContent = "";
    }

    // Validación teléfono
    const telefonoRegex = /^[\d\s\+\-\(\)]{9,}$/;
    if (!telefono || !telefonoRegex.test(telefono)) {
      document.getElementById("telefono-error").textContent =
        "Por favor ingresa un teléfono válido";
      isValid = false;
    } else {
      document.getElementById("telefono-error").textContent = "";
    }

    if (isValid) {
      // Aquí iría el envío del formulario
      console.log({
        nombre,
        email,
        telefono,
        empresa: form.querySelector("#empresa").value.trim(),
      });

      alert("¡Solicitud enviada correctamente! Nos contactaremos pronto.");
      form.reset();
    }
  });
// ===================== INTERSECTION OBSERVER PARA ANIMACIONES =====================

// Seleccionar todas las secciones
const sections = document.querySelectorAll(
  ".seccion-hero-app, .seccion-caracteristicas-app, .seccion-pantallas, .seccion-casos-uso, .seccion-cta-app"
);

// Observar cada sección
sections.forEach((section) => {
  observer.observe(section);
});

// ===================== ANIMACIÓN DE TARJETAS INDIVIDUALES =====================

const cardObserverOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-on-scroll");
    }
  });
}, cardObserverOptions);

// Observar tarjetas de características
document.querySelectorAll(".caracteristica-card").forEach((card) => {
  cardObserver.observe(card);
});

// Observar items de pantallas
document.querySelectorAll(".pantalla-item").forEach((item) => {
  cardObserver.observe(item);
});

// Observar items de casos de uso
document.querySelectorAll(".caso-item").forEach((item) => {
  cardObserver.observe(item);
});
class PageLoader {
  constructor() {
    this.loader = document.getElementById("pageLoader");
    this.loaderLine = document.getElementById("loaderLine");
    this.loaderPercentage = document.getElementById("loaderPercentage");
    this.loaderContent = document.querySelector(".loader-content");
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.simulationActive = true;
    this.init();
  }

  init() {
    //  BLOQUEAR PÁGINA AL INICIAR
    this.blockPage();

    this.simulateProgress();
    window.addEventListener("load", () => this.complete());
  }

  blockPage() {
    //  Agregar clase de bloqueo
    document.documentElement.classList.add("loader-active");
    document.body.classList.add("loader-active");
  }

  unblockPage() {
    //  Remover clase de bloqueo
    document.documentElement.classList.remove("loader-active");
    document.body.classList.remove("loader-active");
  }

  simulateProgress() {
    const increment = () => {
      if (!this.simulationActive) return;
      const random = Math.random() * 30;
      this.targetProgress = Math.min(this.targetProgress + random, 90);
      this.updateProgress(this.targetProgress);
      const delay = this.targetProgress > 70 ? 400 : 300;
      setTimeout(increment, delay);
    };
    setTimeout(increment, 500);
  }

  updateProgress(value) {
    const step = () => {
      if (this.currentProgress < value) {
        this.currentProgress += (value - this.currentProgress) * 0.1;
        if (this.currentProgress > 99) this.currentProgress = 99;

        this.loaderLine.style.width = this.currentProgress + "%";
        this.loaderPercentage.textContent = Math.floor(this.currentProgress);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  complete() {
    this.simulationActive = false;
    this.targetProgress = 100;
    this.loaderLine.style.width = "100%";
    this.loaderPercentage.textContent = "100";

    setTimeout(() => this.fadeOut(), 600);
  }

  fadeOut() {
    //  Desvanecer el contenido del loader
    this.loaderContent.style.transition = "opacity 0.5s ease";
    this.loaderContent.style.opacity = "0";

    setTimeout(() => this.reveal(), 500);
  }

  reveal() {
    this.loader.classList.add("reveal");

    //  DESBLOQUEAR PÁGINA DESPUÉS DE LA ANIMACIÓN
    setTimeout(() => {
      this.loader.classList.add("hidden");
      this.unblockPage(); // ← DESBLOQUEAR AQUÍ
    }, 1300);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PageLoader();
});
// ===================== CONFIGURACIÓN DE SLIDES =====================

const SLIDE_INTERVAL = 5000; // 5 segundos - Cambiar según necesites
let currentSlide = 0;
let autoSlideInterval;
let progressInterval;
let startTime;
let isPaused = false;

// ===================== FUNCIÓN AUXILIAR PARA RESETEAR LA BARRA DE PROGRESO =====================

function resetProgressBar() {
  const progressFill = document.querySelector(".progress-fill");
  if (!progressFill) return;

  // Reiniciar la animación
  progressFill.style.animation = "none";
  progressFill.offsetHeight; // Trigger reflow
  progressFill.style.animation = `progressAnimation ${SLIDE_INTERVAL}ms linear forwards`;
}

// ===================== INICIALIZACIÓN =====================

function inicializarProgressBar() {
  const slides = document.querySelectorAll(".slide");
  const markers = document.querySelectorAll(".progress-marker");
  const progressBar = document.querySelector(".slide-progress-bar");
  const progressFill = document.querySelector(".progress-fill");

  if (!progressBar || !progressFill) return;

  // Event listeners para marcadores
  markers.forEach((marker, index) => {
    marker.addEventListener("click", () => goToSlide(index));
  });

  // Event listeners para navegación de flechas
  const prevBtn = document.querySelector(".slide-nav.prev");
  const nextBtn = document.querySelector(".slide-nav.next");

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Pausar en hover/focus
  progressBar.addEventListener("mouseenter", pauseSlideAnimation);
  progressBar.addEventListener("mouseleave", resumeSlideAnimation);
  progressBar.addEventListener("focusin", pauseSlideAnimation);
  progressBar.addEventListener("focusout", resumeSlideAnimation);

  // ⭐ IMPORTANTE: Iniciar la animación de la barra inmediatamente
  resetProgressBar();

  // Iniciar slider
  startAutoSlide();
}

// ===================== FUNCIONES DE CONTROL DE SLIDES =====================

function goToSlide(index) {
  clearInterval(autoSlideInterval);
  clearInterval(progressInterval);

  const slides = document.querySelectorAll(".slide");
  const markers = document.querySelectorAll(".progress-marker");

  // Actualizar slides
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");

  // Actualizar marcadores
  markers.forEach((marker, i) => {
    marker.classList.toggle("active", i === index);
  });

  currentSlide = index;

  // ⭐ Resetear la barra de progreso
  resetProgressBar();

  // Reiniciar contador
  startAutoSlide();
}

function nextSlide() {
  const totalSlides = document.querySelectorAll(".slide").length;
  const nextIndex = (currentSlide + 1) % totalSlides;
  goToSlide(nextIndex);
}

function prevSlide() {
  const totalSlides = document.querySelectorAll(".slide").length;
  const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  goToSlide(prevIndex);
}

// ===================== ANIMACIÓN AUTOMÁTICA =====================

function startAutoSlide() {
  clearInterval(autoSlideInterval);

  autoSlideInterval = setInterval(() => {
    if (!isPaused) {
      nextSlide();
    }
  }, SLIDE_INTERVAL);
}

// ===================== PAUSA Y REANUDACIÓN =====================

function pauseSlideAnimation() {
  isPaused = true;
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    progressFill.classList.add("paused");
  }
}

function resumeSlideAnimation() {
  isPaused = false;
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    progressFill.classList.remove("paused");
  }
}

// ===================== ACTUALIZAR BARRA DE PROGRESO (ARIA) =====================

function updateProgressBar() {
  const progressBar = document.querySelector(".slide-progress-bar");
  if (progressBar) {
    const percentage = Math.round(
      ((new Date().getTime() - startTime) / SLIDE_INTERVAL) * 100
    );
    progressBar.setAttribute("aria-valuenow", Math.min(percentage, 100));
  }
}

// ===================== INICIALIZAR AL CARGAR =====================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarProgressBar);
} else {
  inicializarProgressBar();
}

// ===================== SOPORTE PARA NAVEGACIÓN CON TECLADO =====================

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});
