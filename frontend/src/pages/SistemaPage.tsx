import { Link } from "react-router-dom";
import { ROUTES } from "../config/routes";
import btn from "../styles/buttons.module.css";
import styles from "./SistemaPage.module.css";

const CARACTERISTICAS = [
  {
    title: "Reportes Avanzados",
    text: "Genera reportes contables detallados y personalizables en múltiples formatos para tomar decisiones informadas.",
  },
  {
    title: "Seguridad Total",
    text: "Protección máxima de tus datos con encriptación de nivel empresarial y respaldos automáticos.",
  },
  {
    title: "Rendimiento Rápido",
    text: "Procesamiento ultra rápido de datos incluso con grandes volúmenes de información.",
  },
  {
    title: "Acceso Remoto",
    text: "Accede desde cualquier lugar con conexión a internet a través de nuestra plataforma web.",
  },
  {
    title: "Personalizable",
    text: "Adapta el sistema completamente a las necesidades específicas de tu empresa.",
  },
  {
    title: "Soporte 24/7",
    text: "Equipo de soporte técnico disponible para resolver cualquier duda o inconveniente.",
  },
];

const MODULOS = [
  {
    title: "Contabilidad Impositiva",
    text: "Contabilidad impositiva y de gestión para empresas con normativa completa.",
  },
  {
    title: "Control de Stock",
    text: "Inventario, facturación y puntos de venta integrados en un único sistema.",
  },
  {
    title: "Tesorería",
    text: "Gestión de caja, banco, conciliación y cartera de cheques.",
  },
  {
    title: "Cuentas por Cobrar/Pagar",
    text: "Estado de cuentas de clientes y proveedores en tiempo real.",
  },
  {
    title: "Activo Fijo",
    text: "Presupuestos, ejecución presupuestaria y reajustes automáticos.",
  },
  {
    title: "Recursos Humanos",
    text: "Gestión de RRHH y control de reloj biométrico integrado.",
  },
  {
    title: "Básculas y Peaje",
    text: "Sistemas especializados para básculas y control de peaje.",
  },
  {
    title: "Cooperativas",
    text: "Sistemas para cooperativas: préstamos, ahorros y cuentas corrientes.",
  },
  {
    title: "Shopping y Expensas",
    text: "Facturación para locatorios y gestión de expensas comunes.",
  },
  {
    title: "Flotas de Camiones",
    text: "Control de flotas, fletes y liquidación de servicios.",
  },
  {
    title: "Silos y Acopios",
    text: "Sistema para silos, acopios y liquidación de clientes/proveedores.",
  },
  {
    title: "Sincronización",
    text: "Sincronización automática entre todos los módulos del sistema.",
  },
];

const FUNCIONALIDADES = [
  {
    img: "/assets/images/Contabilidad integrada.jpeg",
    alt: "Contabilidad integrada",
    title: "Contabilidad Integrada",
    text: "Sistema completo de contabilidad que te permite gestionar todos tus registros contables de manera eficiente y profesional.",
    items: [
      "Registro de transacciones automático",
      "Balance general dinámico",
      "Estados financieros en tiempo real",
      "Auditoría y trazabilidad completa",
    ],
  },
  {
    img: "/assets/images/Control de stock.png",
    alt: "Control de stock",
    title: "Control de Inventario y Facturación",
    text: "Gestión completa de inventario con facturación integrada y puntos de venta configurables.",
    items: [
      "Control de stock en tiempo real",
      "Facturación automática y electrónica",
      "Múltiples puntos de venta",
      "Gestión de códigos de barras",
    ],
  },
  {
    img: "/assets/images/Tesorería y Gestión Financiera.jpeg",
    alt: "Tesorería",
    title: "Tesorería y Gestión Financiera",
    text: "Administra tu tesorería con herramientas avanzadas de caja, banco y conciliación.",
    items: [
      "Gestión de caja y caja chica",
      "Conciliación bancaria automática",
      "Cartera de cheques integrada",
      "Proyección de flujo de caja",
    ],
  },
  {
    img: "/assets/images/recursos humanos.jpg",
    alt: "Recursos humanos",
    title: "Recursos Humanos",
    text: "Módulo completo de RRHH con control de asistencia biométrica integrada.",
    items: [
      "Gestión de empleados y nómina",
      "Control de asistencia biométrica",
      "Cálculo de impuestos y aportes",
      "Reportes de recursos humanos",
    ],
  },
];

export function SistemaPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} id="inicio" data-aos="fade-up">
        <h1>AsCont System</h1>
        <p>
          Solución integral de contabilidad y gestión empresarial diseñada para
          optimizar tus procesos administrativos y financieros
        </p>
        <div className={styles.heroButtons}>
          <Link to={ROUTES.demo} className={`${btn.btn} ${btn.btnPrimary}`}>
            Solicitar Demo
          </Link>
          <a
            href="#presentacion"
            className={`${btn.btn} ${btn.btnSecondaryOnDark}`}
          >
            Ver Más
          </a>
        </div>
      </section>

      <section
        className={styles.presentacion}
        id="presentacion"
        data-aos="fade-up"
      >
        <div className={styles.container}>
          <div className={styles.sistemaContainer}>
            <div className={styles.mockup} data-aos="fade-right">
              <img src="/assets/images/escritorio.png" alt="AsCont Sistema" />
            </div>
            <div className={styles.info} data-aos="fade-left">
              <h2>Gestión Empresarial Integral</h2>
              <div className={styles.linea} />
              <p className={styles.subtitle}>Contabilidad + Gestión + Reportes</p>
              <p className={styles.descripcion}>
                AsCont Sistema es una plataforma empresarial completa que
                integra contabilidad, gestión financiera y generación de
                reportes avanzados. Diseñada para empresas que buscan optimizar
                sus procesos administrativos con una solución confiable y
                profesional.
              </p>
              <ul className={styles.checkList}>
                <li>Multi-empresa y multi-sucursal</li>
                <li>Reportes contables avanzados</li>
                <li>Datos en tiempo real</li>
                <li>Interface intuitiva y moderna</li>
                <li>Integración con sistemas externos</li>
                <li>Soporte técnico especializado</li>
              </ul>
              <div className={styles.botones}>
                <a
                  href="#caracteristicas"
                  className={`${btn.btn} ${btn.btnPrimary}`}
                >
                  Ver Más Características
                </a>
                <Link
                  to={ROUTES.demo}
                  className={`${btn.btn} ${btn.btnSecondary}`}
                >
                  Solicitar Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.caracteristicas}
        id="caracteristicas"
        data-aos="fade-up"
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Características Principales</h2>
          <div className={styles.sectionLinea} />
          <div className={styles.caracteristicasGrid}>
            {CARACTERISTICAS.map((item, i) => (
              <article
                key={item.title}
                className={styles.caracteristicaCard}
                data-aos="fade-up"
                data-aos-delay={String(i * 50)}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.modulos} id="modulos" data-aos="fade-up">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Módulos Especializados</h2>
          <div className={styles.sectionLinea} />
          <div className={styles.modulosGrid}>
            {MODULOS.map((item, i) => (
              <article
                key={item.title}
                className={styles.moduloCard}
                data-aos="fade-up"
                data-aos-delay={String((i % 4) * 40)}
              >
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.funcionalidades}
        id="funcionalidades"
        data-aos="fade-up"
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Funcionalidades Clave</h2>
          <div className={styles.sectionLinea} />
          {FUNCIONALIDADES.map((item, i) => (
            <div
              key={item.title}
              className={`${styles.funcionalidadItem} ${i % 2 === 1 ? styles.funcionalidadReverse : ""}`}
              data-aos="fade-up"
            >
              <div className={styles.funcionalidadMedia}>
                <div className={styles.videoContainer}>
                  <img src={item.img} alt={item.alt} />
                </div>
              </div>
              <div className={styles.funcionalidadInfo}>
                <h3>{item.title}</h3>
                <div className={styles.linea} />
                <p>{item.text}</p>
                <ul className={styles.funcionalidadLista}>
                  {item.items.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta} id="cta-demo" data-aos="fade-up">
        <div className={styles.ctaInner}>
          <h2>¿Listo para transformar tu gestión empresarial?</h2>
          <p>
            Solicita una demostración gratuita y conoce cómo AsCont Sistema
            puede optimizar tus procesos
          </p>
          <Link to={ROUTES.demo} className={`${btn.btn} ${btn.btnPrimary}`}>
            Solicitar Demo Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
