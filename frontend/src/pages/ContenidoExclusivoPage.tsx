import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchVideoMap, videoPresentacionSrc } from "../api/videos";
import styles from "./ContenidoExclusivoPage.module.css";

const SECTION_IDS = [
  "inicio-exclusivo",
  "videos-exclusivos",
  "actualizaciones-exclusivas",
] as const;

const TUTORIALS = [
  {
    id: "tutorial_contabilidad",
    title: "Contabilidad",
    description: "Contabilidad integrada.",
  },
  {
    id: "tutorial_transacciones",
    title: "Transacciones",
    description: "Control y gestión de transacciones financieras.",
  },
  {
    id: "tutorial_configuraciones",
    title: "Configuraciones",
    description: "Configuraciones del sistema.",
  },
] as const;

const UPDATES = [
  {
    date: "Julio 2025",
    title: "SistemaAsCont",
    text: "Optimización en carga de reportes y procesamiento de datos.",
  },
  {
    date: "Diciembre 2025",
    title: "Servidor",
    text: "Mejoras de rendimiento y estabilidad del servidor.",
  },
  {
    date: "Diciembre 2025",
    title: "AplicacionAsCont",
    text: "Mejoras de sincronización y estabilidad en la aplicación.",
  },
] as const;

function blockContextMenu(e: MouseEvent) {
  e.preventDefault();
}

export function ContenidoExclusivoPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [videoMap, setVideoMap] = useState<Record<string, string>>({});
  const [params] = useSearchParams();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchVideoMap();
        if (!cancelled && data.success && data.videos) {
          setVideoMap(data.videos);
        }
      } catch {
        /* sesión inválida o error: embeds quedan vacíos */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = params.get("section");
    if (section === null) return;
    const index = Number.parseInt(section, 10);
    if (Number.isNaN(index) || index < 0 || index >= SECTION_IDS.length) return;
    const timer = window.setTimeout(() => {
      sectionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(index);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [params]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = SECTION_IDS.indexOf(
            entry.target.id as (typeof SECTION_IDS)[number]
          );
          if (index !== -1) setActiveSection(index);
        }
      },
      { root: null, rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    for (const el of sectionRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  function goToSection(index: number) {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(index);
  }

  return (
    <div className={styles.page}>
      <nav className={styles.localNav} aria-label="Secciones exclusivas">
        <div className={styles.localNavInner}>
          <img
            src="/assets/images/LogoNaranjaPng.png"
            alt="AsCont"
            className={styles.localLogo}
          />
          <ul className={styles.breadcrumb}>
            {["Inicio", "Video Tutoriales", "Actualizaciones"].map(
              (label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    className={`${styles.breadcrumbLink} ${
                      activeSection === index ? styles.active : ""
                    }`}
                    onClick={() => goToSection(index)}
                  >
                    {label}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </nav>

      <div className={styles.horizontal}>
        <section
          id="inicio-exclusivo"
          className={`${styles.section} ${styles.inicio}`}
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
        >
          <div className={styles.content}>
            <div className={styles.inicioContenido}>
              <div className={styles.izquierdo}>
                <div className={styles.heroText}>
                  <h1>
                    Excelencia en <span className={styles.highlight}>los detalles</span>
                  </h1>
                  <p>
                    Accede a recursos avanzados, tutoriales y novedades del
                    sistema AsContSystem. Esta plataforma está diseñada para
                    combinar creatividad, funcionalidad y eficiencia.
                  </p>
                </div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>25</div>
                    <div className={styles.statLabel}>
                      Tutoriales
                      <br />
                      disponibles
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>54</div>
                    <div className={styles.statLabel}>
                      Actualizaciones
                      <br />
                      implementadas
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.derecho}>
                <div className={styles.cardPrincipal}>
                  <div
                    className={styles.videoPrincipal}
                    onContextMenu={blockContextMenu}
                  >
                    <video
                      controls
                      controlsList="nodownload"
                      disablePictureInPicture
                      onContextMenu={blockContextMenu}
                    >
                      <source
                        src={videoPresentacionSrc()}
                        type="video/mp4"
                      />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                  <div className={styles.videoInfoPrincipal}>
                    <p>
                      Descubre el sistema AsContSystem y cómo puede transformar
                      la gestión de tu empresa.
                    </p>
                  </div>
                </div>

                <div className={styles.cardsBottom}>
                  <div className={styles.cardSmall}>
                    <div>
                      <h3>
                        Módulos <span className={styles.accent}>personalizados</span>
                      </h3>
                      <p>Adaptados a tus necesidades</p>
                    </div>
                  </div>
                  <div className={styles.cardSmall2}>
                    <div>
                      <h3>
                        Soporte <span className={styles.accent}>exclusivo</span>
                      </h3>
                      <p>Atención prioritaria 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="videos-exclusivos"
          className={`${styles.section} ${styles.videos}`}
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
        >
          <div className={styles.content}>
            <h1>Tutoriales en Video</h1>
            <p className={styles.subtexto}>
              Aprende a usar el sistema paso a paso.
            </p>
            <div className={styles.videoGrid}>
              {TUTORIALS.map((tutorial) => {
                const url = videoMap[tutorial.id];
                return (
                  <div key={tutorial.id} className={styles.videoCard}>
                    <div
                      className={styles.videoContainer}
                      onContextMenu={blockContextMenu}
                    >
                      {url ? (
                        <iframe
                          src={url}
                          title={tutorial.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <div className={styles.videoPlaceholder}>
                          Cargando…
                        </div>
                      )}
                    </div>
                    <div className={styles.videoInfo}>
                      <h3>{tutorial.title}</h3>
                      <p>{tutorial.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="actualizaciones-exclusivas"
          className={`${styles.section} ${styles.updates}`}
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
        >
          <div className={styles.content}>
            <div className={styles.textContent}>
              <h1>Novedades y Actualizaciones</h1>
              <p className={styles.subtexto}>
                Conoce las mejoras más recientes del sistema.
              </p>
            </div>
            <div className={styles.timeline}>
              {UPDATES.map((item) => (
                <article key={`${item.date}-${item.title}`} className={styles.updateCard}>
                  <span className={styles.date}>{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>
          2025 AsCont Software Solutions. All rights reserved. Desings with
          AlejandroDiaz
        </p>
      </footer>
    </div>
  );
}
