import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GaleriaLightbox,
} from "../components/aplicacion/GaleriaLightbox";
import {
  PantallasModal,
  type PantallaModalData,
} from "../components/aplicacion/PantallasModal";
import { ROUTES } from "../config/routes";
import styles from "./AplicacionPage.module.css";

const CARACTERISTICAS = [
  {
    icon: "ri-smartphone-line",
    title: "Interfaz Intuitiva",
    text: "Diseñada para ser simple y fácil de usar. No necesitas capacitación exhaustiva.",
  },
  {
    icon: "ri-database-2-line",
    title: "Sincronización en Tiempo Real",
    text: "Todos tus datos sincronizados instantáneamente en la nube.",
  },
  {
    icon: "ri-shield-check-line",
    title: "Seguridad Avanzada",
    text: "Encriptación de extremo a extremo para proteger tu información.",
  },
  {
    icon: "ri-bar-chart-2-line",
    title: "Reportes y Análisis",
    text: "Genera reportes completos directamente desde tu teléfono.",
  },
  {
    icon: "ri-team-line",
    title: "Gestión de Equipo",
    text: "Colabora con tu equipo en tiempo real desde cualquier dispositivo.",
  },
  {
    icon: "ri-wifi-off-line",
    title: "Modo Offline",
    text: "Trabaja sin conexión y sincroniza cuando vuelvas a estar online.",
  },
];

const PANTALLAS_THUMBS = [
  {
    id: 1,
    img: "/assets/images/inicioImg.jpg",
    alt: "Pantalla de inicio",
    title: "Pantalla de Inicio",
    text: "Acceso rápido a todas las funciones principales del sistema.",
    ariaLabel: "Abrir galería - Pantalla de inicio",
  },
  {
    id: 2,
    img: "/assets/images/facturacionImg.jpeg",
    alt: "Facturación",
    title: "Facturación",
    text: "Crea y gestiona facturas de manera rápida y segura.",
    ariaLabel: "Abrir galería - Facturación",
  },
  {
    id: 3,
    img: "/assets/images/preciosImg.jpg",
    alt: "Gestión de inventario",
    title: "Precios y productos",
    text: "Agrega o actualiza precios de tus productos desde cualquier lugar.",
    ariaLabel: "Abrir galería - Gestión de inventario",
  },
  {
    id: 4,
    img: "/assets/images/clienteImg.jpg",
    alt: "Clientes",
    title: "Clientes",
    text: "Gestiona la informacion de tu clientes de manera eficiente.",
    ariaLabel: "Abrir galería - Reportes",
  },
];

const PANTALLAS_MODAL: PantallaModalData[] = [
  {
    id: 1,
    title: "Pantalla de Inicio",
    description: "Acceso rápido a todas las funciones principales del sistema.",
    images: [
      {
        src: "/assets/images/menuModulos.png",
        alt: "Pantalla de inicio - Vista 1",
        caption: "Vista principal con menú de opciones",
      },
      {
        src: "/assets/images/menuIformes.png",
        alt: "Pantalla de inicio - Vista 2",
        caption: "Widgets de información rápida",
      },
      {
        src: "/assets/images/menuConfiguraciones.png",
        alt: "Pantalla de inicio - Vista 3",
        caption: "Acceso a reportes y análisis",
      },
    ],
    featuresTitle: "Características de la Pantalla de Inicio:",
    features: [
      "✓ Navegación intuitiva y clara",
      "✓ Widgets personalizables",
      "✓ Acceso rápido a funciones",
      "✓ Información en tiempo real",
      "✓ Diseño adaptativo para móviles",
    ],
  },
  {
    id: 2,
    title: "Facturación",
    description: "Crea y gestiona facturas de manera rápida y segura.",
    images: [
      {
        src: "/assets/images/facturacionCliente (2).png",
        alt: "Facturación - Vista 1",
        caption: "Formulario de creación de facturas",
      },
      {
        src: "/assets/images/facturacionProductos.png",
        alt: "Facturación - Vista 2",
        caption: "Listado de facturas emitidas",
      },
      {
        src: "/assets/images/facturacionImg.png",
        alt: "Facturación - Vista 3",
        caption: "Detalles y estado de facturas",
      },
    ],
    featuresTitle: "Características de Facturación:",
    features: [
      "✓ Creación rápida de facturas",
      "✓ Facturación electrónica integrada",
      "✓ Historial de documentos",
      "✓ Exportación a PDF",
      "✓ Control de impuestos automático",
    ],
  },
  {
    id: 3,
    title: "Precios y productos",
    description:
      "Controla y gestiona los precios y productos de tu inventario de manera eficiente.",
    images: [
      {
        src: "/assets/images/preciosApp.jpg",
        alt: "Inventario - Vista 1",
        caption: "Listado de productos en stock",
      },
      {
        src: "/assets/images/Productos.jpeg",
        alt: "Inventario - Vista 2",
        caption: "Búsqueda y filtros avanzados",
      },
      {
        src: "/assets/images/DetallesProducto.jpeg",
        alt: "Inventario - Vista 3",
        caption: "Registro de movimientos de stock",
      },
    ],
    featuresTitle: "Características de Precios y Productos:",
    features: [
      "✓ Control tus precios en tiempo real",
      "✓ Agregar y editar productos fácilmente",
      "✓ Mantiene tu lista de precio siempre actualizada",
      "✓ Código de barras integrado",
    ],
  },
  {
    id: 4,
    title: "Clientes",
    description: "Gestiona la informacion de tu clientes de manera eficiente.",
    images: [
      {
        src: "/assets/images/clienteFormulario.png",
        alt: "Reportes - Vista 1",
        caption: "Dashboard con gráficos",
      },
      {
        src: "/assets/images/clienteDetalle.png",
        alt: "Reportes - Vista 2",
        caption: "Análisis de ventas",
      },
      {
        src: "/assets/images/clienteEditar.png",
        alt: "Reportes - Vista 3",
        caption: "Exportación de reportes",
      },
    ],
    featuresTitle: "Características de Reportes:",
    features: [
      "✓ Gráficos interactivos",
      "✓ Análisis por período",
      "✓ Comparativas de datos",
      "✓ Exportación a Excel/PDF",
      "✓ Personalización de reportes",
    ],
  },
];

const CASOS_USO = [
  {
    icon: "ri-store-2-line",
    title: "Comercios",
    text: "Control de ventas y inventario en punto de venta.",
  },
  {
    icon: "ri-building-2-line",
    title: "Empresas",
    text: "Gestión integral de operaciones empresariales.",
  },
  {
    icon: "ri-calculator-line",
    title: "Contadores",
    text: "Herramientas contables y financieras avanzadas.",
  },
  {
    icon: "ri-bar-chart-box-line",
    title: "Industrias",
    text: "Control de producción y gestión de recursos.",
  },
];

export function AplicacionPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [screenId, setScreenId] = useState(1);
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    src: string;
    alt: string;
  }>({ open: false, src: "", alt: "" });

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  const openModal = (id: number) => {
    setScreenId(id);
    setModalOpen(true);
  };

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ open: true, src, alt });
  }, []);

  useEffect(() => {
    const locked = modalOpen || lightbox.open;
    const previous = document.body.style.overflow;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [modalOpen, lightbox.open]);

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        aria-label="Sección principal de aplicación"
        data-aos="fade-up"
      >
        <div className={styles.heroContent}>
          <div className={styles.heroTexto} data-aos="fade-up">
            <p className={styles.heroSubtitulo}>Tecnología Móvil</p>
            <h1 className={styles.heroTitulo}>
              Gestiona tu Negocio
              <br />
              <span className={styles.destacado}>En tu Bolsillo</span>
            </h1>
            <p className={styles.heroDescripcion}>
              Acceso total a tu empresa desde cualquier lugar y en cualquier
              momento. La potencia de AsContSystem, siempre contigo.
            </p>
            <div className={styles.heroBotones}>
              <a
                href="#caracteristicas"
                className={`${styles.btnPage} ${styles.btnPrimary}`}
              >
                DESCUBRE CARACTERÍSTICAS
              </a>
              <Link
                to={ROUTES.demo}
                className={`${styles.btnPage} ${styles.btnSecondary}`}
              >
                SOLICITAR DEMO
              </Link>
            </div>
          </div>

          <div className={styles.heroImagen} data-aos="fade-right">
            <div
              className={styles.telefonoMockup}
              role="img"
              aria-label="Mockup del teléfono con aplicación"
            >
              <img
                src="/assets/images/loginApp.jpg"
                alt="Pantalla de login de AsContSystem"
                className={styles.telefonoPantalla}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="caracteristicas"
        className={styles.caracteristicas}
        aria-label="Características de la aplicación"
        data-aos="fade-up"
      >
        <div className={styles.caracteristicasHeader}>
          <p className={styles.caracteristicasSubtitulo}>Funcionalidades</p>
          <h2 className={styles.caracteristicasTitulo}>
            ¿Qué puedes hacer con nuestra
            <br />
            <span className={styles.destacado}>Aplicación Móvil?</span>
          </h2>
        </div>

        <div className={styles.caracteristicasGrid}>
          {CARACTERISTICAS.map((item, index) => (
            <div
              key={item.title}
              className={styles.caracteristicaCard}
              data-aos="fade-up"
              data-aos-delay={String(index * 50)}
            >
              <div className={styles.caracteristicaIcono}>
                <i className={item.icon} aria-hidden />
              </div>
              <h3 className={styles.caracteristicaTitulo}>{item.title}</h3>
              <p className={styles.caracteristicaDescripcion}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={styles.pantallas}
        aria-label="Galería de pantallas de la aplicación"
        data-aos="fade-up"
      >
        <div className={styles.pantallasHeader}>
          <h2 className={styles.pantallasTitulo}>
            Conoce las <span className={styles.destacado}>Pantallas</span>
          </h2>
          <p className={styles.pantallasDescripcion}>
            Una interfaz moderna y eficiente diseñada para optimizar tu
            productividad. Haz clic en cualquier imagen para ver más detalles.
          </p>
        </div>

        <div className={styles.pantallasContainer}>
          {PANTALLAS_THUMBS.map((pantalla, index) => (
            <div
              key={pantalla.id}
              className={styles.pantallaItem}
              data-aos="fade-up"
              data-aos-delay={String(index * 50)}
            >
              <button
                type="button"
                className={styles.pantallaImagen}
                aria-label={pantalla.ariaLabel}
                onClick={() => openModal(pantalla.id)}
              >
                <img src={pantalla.img} alt={pantalla.alt} />
              </button>
              <div className={styles.pantallaInfo}>
                <h3>{pantalla.title}</h3>
                <p>{pantalla.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className={styles.casos}
        aria-label="Casos de uso de la aplicación"
        data-aos="fade-up"
      >
        <div className={styles.casosHeader}>
          <h2 className={styles.casosTitulo}>Casos de Uso</h2>
          <p className={styles.casosDescripcion}>
            Diferentes industrias confían en AsContSystem
          </p>
        </div>

        <div className={styles.casosGrid}>
          {CASOS_USO.map((caso, index) => (
            <div
              key={caso.title}
              className={styles.casoItem}
              data-aos="fade-up"
              data-aos-delay={String(index * 50)}
            >
              <div className={styles.casoIcono}>
                <i className={caso.icon} aria-hidden />
              </div>
              <h3>{caso.title}</h3>
              <p>{caso.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={styles.cta}
        aria-label="Llamada a acción"
        data-aos="fade-up"
      >
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitulo}>
            ¿Listo para transformar
            <br />
            tu negocio?
          </h2>
          <p className={styles.ctaDescripcion}>
            Solicita una demostración gratuita hoy mismo y descubre cómo
            AsContSystem puede ayudarte.
          </p>
          <Link
            to={ROUTES.demo}
            className={`${styles.btnPage} ${styles.btnPrimary} ${styles.btnGrande}`}
          >
            SOLICITAR DEMOSTRACIÓN GRATIS
          </Link>
        </div>
      </section>

      <PantallasModal
        open={modalOpen}
        screenId={screenId}
        screens={PANTALLAS_MODAL}
        onClose={closeModal}
        onChangeScreen={setScreenId}
        onOpenLightbox={openLightbox}
        lightboxOpen={lightbox.open}
      />

      <GaleriaLightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={closeLightbox}
      />
    </div>
  );
}
