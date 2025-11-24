const clientesCarrusel = document.getElementById("clientesPista");

if (clientesCarrusel) {
  const clientesData = [
    "IMG-CLIENTE/ascim.png",
    "IMG-CLIENTE/saborca.png",
    "IMG-CLIENTE/serigraf.png",
    "IMG-CLIENTE/excelsior.png",
    "IMG-CLIENTE/bigcenter.png",
    "IMG-CLIENTE/clubHipico.jpeg",
    "IMG-CLIENTE/ganaderaSofia.png",
    "IMG-CLIENTE/acostruir.jpg",
  ];

  let isPaused = false;
  let animationId = null;
  let translateValue = 0;
  const speed = 0.5; // Pixels por frame (ajusta para velocidad)

  function renderClientes() {
    clientesCarrusel.innerHTML = "";

    // Duplicar imágenes 3 veces para efecto infinito suave
    for (let repeat = 0; repeat < 3; repeat++) {
      clientesData.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Logo Cliente ${index + 1}`;
        img.width = 200;
        img.height = 100;
        img.loading = "lazy";
        clientesCarrusel.appendChild(img);
      });
    }
  }

  function animateCarrusel() {
    if (!isPaused) {
      translateValue += speed;

      // Calcular el ancho de un set completo de imágenes (230px = 200px width + 30px gap)
      const imageWidth = 230;
      const totalWidth = clientesData.length * imageWidth;

      // Resetear cuando se completa un ciclo completo
      if (translateValue >= totalWidth) {
        translateValue = 0;
      }

      clientesCarrusel.style.transform = `translateX(-${translateValue}px)`;
    }

    animationId = requestAnimationFrame(animateCarrusel);
  }

  function pausarCarrusel() {
    isPaused = true;
  }

  function reanudarCarrusel() {
    isPaused = false;
  }

  function iniciarCarrusel() {
    renderClientes();
    animateCarrusel();
  }

  const carruselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!animationId) {
            iniciarCarrusel();
          }
          isPaused = false;
        } else {
          isPaused = true;
        }
      });
    },
    { threshold: 0.5 }
  );

  const seccionClientes = document.querySelector(".seccion-clientes");
  if (seccionClientes) {
    carruselObserver.observe(seccionClientes);
  }

  clientesCarrusel.addEventListener("mouseenter", pausarCarrusel);
  clientesCarrusel.addEventListener("mouseleave", reanudarCarrusel);

  iniciarCarrusel();
}
