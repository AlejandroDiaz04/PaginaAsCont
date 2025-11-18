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

  let currentIndex = 0;
  const visibleCount = 5;
  let carruselInterval;

  function renderClientes() {
    clientesCarrusel.innerHTML = "";

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % clientesData.length;
      const img = document.createElement("img");
      img.src = clientesData[index];
      img.alt = `Logo Cliente ${index + 1}`;
      img.width = 200;
      img.height = 100;
      img.loading = "lazy";
      clientesCarrusel.appendChild(img);
    }
  }

  function rotarCarrusel() {
    clientesCarrusel.style.transform = "translateX(-250px)";

    setTimeout(() => {
      clientesCarrusel.style.transition = "none";
      currentIndex = (currentIndex + 1) % clientesData.length;
      renderClientes();
      clientesCarrusel.style.transform = "translateX(0)";

      setTimeout(() => {
        clientesCarrusel.style.transition = "transform 0.8s ease-in-out";
      }, 50);
    }, 800);
  }

  function iniciarCarrusel() {
    renderClientes();
    carruselInterval = setInterval(rotarCarrusel, 3000);
  }

  function pausarCarrusel() {
    clearInterval(carruselInterval);
  }

  function reanudarCarrusel() {
    carruselInterval = setInterval(rotarCarrusel, 2000);
  }

  const carruselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!carruselInterval) {
            iniciarCarrusel();
          }
        } else {
          pausarCarrusel();
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
