import { useCallback, useEffect, useState } from "react";
import styles from "./HeroSlider.module.css";

const SLIDE_INTERVAL = 5000;

const SLIDES = [
  {
    id: "erp",
    background: "/assets/images/pc.png",
    ariaLabel: "Imagen de computadora",
    h1: "SISTEMA DE",
    h2: (
      <>
        GESTIÓN <span className={styles.destacado}>ERP</span>
      </>
    ),
    p: (
      <>
        Contamos con módulos que se adaptan
        <br />a las necesidades específicas de tu empresa.
      </>
    ),
    secondaryHref: "#productos",
    secondaryLabel: "MÁS INFORMACIÓN",
  },
  {
    id: "movil",
    background: "/assets/images/movil.png",
    ariaLabel: "Imagen de aplicación móvil",
    h1: "GESTIONA TU NEGOCIO",
    h2: (
      <>
        CON NUESTRA <span className={styles.destacado}>APLICACIÓN MÓVIL</span>
      </>
    ),
    p: (
      <>
        Administra todas las operaciones de tu empresa
        <br />
        desde cualquier lugar y en cualquier momento.
      </>
    ),
    secondaryHref: "#aplicacionMovil",
    secondaryLabel: "VER APLICACIÓN",
  },
  {
    id: "fe",
    background: null as string | null,
    ariaLabel: undefined as string | undefined,
    h1: "FACTURACIÓN ELECTRÓNICA",
    h2: (
      <>
        CUMPLE CON LA <span className={styles.destacado}>NORMATIVA VIGENTE</span>
      </>
    ),
    p: (
      <>
        Emite facturas electrónicas desde el sistema de escritorio
        <br />y la aplicación móvil con total seguridad y validez legal.
      </>
    ),
    secondaryHref: null as string | null,
    secondaryLabel: null as string | null,
  },
] as const;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const total = SLIDES.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
      setProgressKey((k) => k + 1);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
      setProgressKey((k) => k + 1);
    }, SLIDE_INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, total, progressKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section
      id="inicio"
      className={styles.seccionInicio}
      aria-label="Sección de inicio con slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${i === index ? styles.slideActive : ""} ${
            i === 0 ? styles.slide1 : i === 1 ? styles.slide2 : ""
          }`}
        >
          <div
            className={styles.slideBackground}
            style={
              slide.background
                ? { backgroundImage: `url('${slide.background}')` }
                : undefined
            }
            role="img"
            aria-label={slide.ariaLabel}
          />
          <div className={styles.capa} aria-hidden />
          <div className={styles.textoSistema}>
            <h1 className={styles.animateText}>{slide.h1}</h1>
            <h2 className={styles.animateText}>{slide.h2}</h2>
            <p className={styles.animateText}>{slide.p}</p>
            {slide.secondaryHref ? (
              <div className={`${styles.botones} ${styles.animateText}`}>
                <a href="#contacto" className={`${styles.btn} ${styles.btnContacto}`}>
                  CONTÁCTANOS
                </a>
                <a
                  href={slide.secondaryHref}
                  className={`${styles.btn} ${styles.btnInfo}`}
                >
                  {slide.secondaryLabel}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <div
        className={styles.slideProgressBar}
        role="progressbar"
        aria-label="Progreso del slide actual"
        aria-valuemin={0}
        aria-valuemax={100}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          key={progressKey}
          className={`${styles.progressFill} ${paused ? styles.progressFillPaused : ""}`}
          style={{ animationDuration: `${SLIDE_INTERVAL}ms` }}
        />
      </div>

      <button
        type="button"
        className={`${styles.slideNav} ${styles.slideNavPrev}`}
        aria-label="Slide anterior"
        onClick={prev}
      >
        &#10094;
      </button>
      <button
        type="button"
        className={`${styles.slideNav} ${styles.slideNavNext}`}
        aria-label="Siguiente slide"
        onClick={next}
      >
        &#10095;
      </button>
    </section>
  );
}
