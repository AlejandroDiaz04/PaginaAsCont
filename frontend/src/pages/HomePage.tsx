import { useState } from "react";
import { Link } from "react-router-dom";
import { ClientesCarousel } from "../features/home/ClientesCarousel";
import { HeroSlider } from "../features/home/HeroSlider";
import { ModulosModal } from "../features/home/ModulosModal";
import { MODULO_CARDS, type ModuloId } from "../features/home/modulosData";
import { Typewriter } from "../features/home/Typewriter";
import { ROUTES } from "../config/routes";
import styles from "./HomePage.module.css";

export function HomePage() {
  const [moduloActivo, setModuloActivo] = useState<ModuloId | null>(null);

  return (
    <div className={styles.page}>
      <HeroSlider />

      <section
        className={styles.seccionProductos}
        id="productos"
        aria-label="Sección de productos"
        data-aos="fade-up"
      >
        <div className={styles.productosHeader}>
          <p>Nuestros Productos</p>
          <h1>Soluciones Empresariales</h1>
        </div>

        <div className={styles.productosContenedor}>
          <div className={styles.productoItem}>
            <div className={styles.mockupWrapper}>
              <div className={styles.mockupContainer}>
                <img
                  src="/assets/images/sistemaImg.png"
                  alt="Mockup Sistema AsCont"
                />
              </div>
            </div>
            <div className={styles.productoInfo}>
              <span className={styles.productoBadge}>Sistema Escritorio</span>
              <h3 className={styles.productoTitulo}>AsCont System</h3>
              <div className={styles.productoLinea} />
              <p className={styles.productoDescripcion}>
                Solución integral de contabilidad y gestión empresarial.
                Diseñada para optimizar tus procesos administrativos y
                financieros con una plataforma robusta y confiable.
              </p>
              <div className={styles.productoCaracteristicas}>
                <h4>Características</h4>
                <ul>
                  <li>Multi-empresa y sucursal</li>
                  <li>Reportes contables</li>
                  <li>Datos en tiempo real</li>
                  <li>Interface moderna</li>
                  <li>Fácil integración</li>
                  <li>Soporte técnico</li>
                </ul>
              </div>
              <div className={styles.productoCta}>
                <Link
                  to={ROUTES.sistema}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Ver Más
                </Link>
                <Link
                  to={ROUTES.demo}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Solicitar Demo
                </Link>
              </div>
            </div>
          </div>

          <div id="aplicacionMovil" className={styles.productoItem}>
            <div className={styles.mockupWrapper}>
              <div className={styles.mockupContainer}>
                <img
                  src="/assets/images/appImg.png"
                  alt="Mockup AsCont Móvil"
                />
              </div>
            </div>
            <div className={styles.productoInfo}>
              <span className={styles.productoBadge}>Aplicación Móvil</span>
              <h3 className={styles.productoTitulo}>AsCont Móvil</h3>
              <div className={styles.productoLinea} />
              <p className={styles.productoDescripcion}>
                Aplicación móvil potente para gestión de facturación, inventario
                y clientes. Trabaja desde cualquier lugar con sincronización
                automática en tiempo real.
              </p>
              <div className={styles.productoCaracteristicas}>
                <h4>Características</h4>
                <ul>
                  <li>Facturación electrónica</li>
                  <li>Gestión de inventario</li>
                  <li>Control de clientes</li>
                  <li>Gestión de precios</li>
                  <li>Sincronización automática</li>
                  <li>Acceso offline</li>
                </ul>
              </div>
              <div className={styles.productoCta}>
                <Link
                  to={ROUTES.aplicacion}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Ver Más
                </Link>
                <Link
                  to={ROUTES.demo}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  Solicitar Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="servicios"
        className={styles.seccionServicios}
        aria-label="Sección de servicios"
        data-aos="fade-up"
      >
        <div>
          <p className={styles.serviciosEyebrow}>
            ¿Por que elegir el Sistema de AsContSystem?
          </p>
          <h1 className={styles.serviciosTitle}>
            QUE OFRECE NUESTROS <span>SERVICIOS?</span>
          </h1>

          <div className={styles.modulosGrid}>
            {MODULO_CARDS.map((card) => (
              <div key={card.id} className={styles.moduloItem}>
                <img
                  className={`${styles.icono} ${
                    card.variant === "centro"
                      ? styles.iconoCentro
                      : styles.iconoLateral
                  }`}
                  src={card.image}
                  alt={card.imageAlt}
                  width={300}
                  height={200}
                  loading="lazy"
                />
                <div className={styles.moduloContenido}>
                  <h3>
                    {card.id === "facturacion" ? (
                      <>
                        Facturacion y Ventas
                        <br />
                        <small>RPA</small>
                      </>
                    ) : (
                      card.title
                    )}
                  </h3>
                  <p className={styles.descripcion}>{card.description}</p>
                  <button
                    type="button"
                    className={styles.btnVerMas}
                    onClick={() => setModuloActivo(card.id)}
                    aria-label={`Ver más detalles sobre ${card.title}`}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.contactoServicio}>
          <p>NO TE OLVIDES DE CONTACTARNOS EN CASO DE DUDAS</p>
          <a href="#contacto" className={styles.btnInfoServicio}>
            CONTÁCTANOS
          </a>
        </div>
      </section>

      <ModulosModal
        moduloId={moduloActivo}
        onClose={() => setModuloActivo(null)}
      />

      <section className={styles.intermedioSeccion} data-aos="fade-up">
        <div className={styles.fraseIntermedio}>
          <h1 className={styles.textoMedio}>
            <Typewriter />
          </h1>
          <img
            src="/assets/images/fondoImg.jpg"
            alt=""
            width="100%"
            height={750}
            loading="lazy"
          />
        </div>
      </section>

      <ClientesCarousel />
    </div>
  );
}
