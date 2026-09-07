import { useEffect, useRef } from "react";
import styles from "./ClientesCarousel.module.css";

const CLIENTES = [
  "/assets/images/clients/ascim.png",
  "/assets/images/clients/saborca.png",
  "/assets/images/clients/serigraf.png",
  "/assets/images/clients/excelsior.png",
  "/assets/images/clients/bigcenter.png",
  "/assets/images/clients/clubHipico.jpeg",
  "/assets/images/clients/ganaderaSofia.png",
  "/assets/images/clients/acostruir.jpg",
] as const;

const SPEED = 0.5;
const IMAGE_WIDTH = 230;

export function ClientesCarousel() {
  const pistaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const translateRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const pista = pistaRef.current;
    const section = sectionRef.current;
    if (!pista || !section) return;

    const totalWidth = CLIENTES.length * IMAGE_WIDTH;

    const tick = () => {
      if (!pausedRef.current) {
        translateRef.current += SPEED;
        if (translateRef.current >= totalWidth) {
          translateRef.current = 0;
        }
        pista.style.transform = `translateX(-${translateRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        pausedRef.current = !entry?.isIntersecting;
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const logos = [...CLIENTES, ...CLIENTES, ...CLIENTES];

  return (
    <section
      ref={sectionRef}
      id="clientes"
      className={styles.seccionClientes}
      aria-label="Sección de clientes"
      data-aos="fade-up"
    >
      <div className={styles.clientesHeader}>
        <p>Nuestros clientes satisfechos</p>
        <h1>
          Algunos de nuestros <span>CLIENTES</span>
        </h1>
      </div>
      <div className={styles.clientesCarrusel}>
        <div
          ref={pistaRef}
          className={styles.clientesPista}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          {logos.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt={`Logo Cliente ${(i % CLIENTES.length) + 1}`}
              width={200}
              height={100}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
