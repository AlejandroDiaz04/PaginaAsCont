import { TrabajaForm } from "../features/empresa/TrabajaForm";
import styles from "./EmpresaPage.module.css";

const VALORES = [
  {
    img: "/assets/images/confianza.png",
    title: "Confianza",
    text: "En nuestra empresa, la confianza es el pilar fundamental que sustenta todas nuestras relaciones. Nos comprometemos a ser transparentes, honestos y consistentes en nuestras acciones, buscando siempre generar la seguridad y fiabilidad que nuestros clientes, colaboradores y socios necesitan para confiar en nosotros.",
  },
  {
    img: "/assets/images/responsabilidad.png",
    title: "Responsabilidad",
    text: "Asumimos con seriedad la responsabilidad de nuestros actos, tanto dentro como fuera de la empresa. Cada decisión que tomamos está guiada por un sentido de compromiso con nuestros clientes, el medio ambiente, y la sociedad. Creemos en la rendición de cuentas y en actuar con ética y coherencia.",
  },
  {
    img: "/assets/images/specialization.png",
    title: "Especialización",
    text: "Nuestra empresa se distingue por su enfoque en la especialización. Nos dedicamos a ofrecer soluciones de alta calidad, respaldadas por un profundo conocimiento en nuestro campo. Nos mantenemos en constante formación y actualización para ser referentes en la industria y proporcionar a nuestros clientes un servicio único y experto.",
  },
] as const;

const DATOS = [
  {
    img: "/assets/images/edificio.png",
    text: "+20 Años en el mercado",
  },
  {
    img: "/assets/images/personas.png",
    text: "+500 Clientes satisfechos",
  },
  {
    img: "/assets/images/laptop.png",
    text: "+50 Módulos desarrollados",
  },
  {
    img: "/assets/images/internet.png",
    text: "Desarrollo e Implementación de ERP’s",
  },
  {
    img: "/assets/images/reloj.png",
    text: "+100K Horas de desarrollo",
  },
  {
    img: "/assets/images/certificadio.png",
    text: "Contamos con las certificaciones más exigentes del sector",
  },
] as const;

export function EmpresaPage() {
  return (
    <div className={styles.page}>
      <section className={styles.inicioContainer} data-aos="fade-up">
        <div className={styles.heroContentMinimal}>
          <div className={styles.heroLineLeft} aria-hidden />
          <div className={styles.heroMainContent}>
            <div className={styles.heroEyebrow}>Bienvenido a AsCont</div>
            <h1>Acompañanos en la transformación digital</h1>
            <p>
              y forma parte de nuestra{" "}
              <span className={styles.historia}>historia</span>
            </p>
            <div className={styles.statsVertical}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>20+</span>
                <span className={styles.statText}>años</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>600+</span>
                <span className={styles.statText}>clientes</span>
              </div>
            </div>
          </div>
          <div className={styles.heroLineRight} aria-hidden />
        </div>
      </section>

      <section id="nosotros" className={styles.nosotros} data-aos="fade-up">
        <div className={styles.sobreNosotros}>
          <h1>¿Quienes somos?</h1>
          <p>
            En AsContSystem, somos una empresa dedicada a ofrecer soluciones
            tecnológicas integrales para la gestión empresarial. Con años de
            experiencia en el sector, nos especializamos en el desarrollo de
            software personalizado, consultoría tecnológica y soporte técnico.
            Nuestro equipo de profesionales altamente capacitados trabaja
            incansablemente para brindar a nuestros clientes herramientas
            innovadoras que optimicen sus procesos y potencien su crecimiento.
          </p>
        </div>
      </section>

      <section
        id="misionYvision"
        className={styles.misionYvision}
        data-aos="fade-up"
      >
        <div className={styles.misionVisionContenedor}>
          <div className={styles.mision}>
            <h1>Misión</h1>
            <p>
              Poner al alcance de empresas y profesionales del área contable la
              mejor y más completa herramienta de gestión y análisis, con la
              mejor atención y servicio post venta del medio, para lograr mayor
              rapidez, precisión y seguridad en su trabajo.
            </p>
          </div>
          <div className={styles.vision}>
            <h1>Visión</h1>
            <p>
              Ser líderes en la transformación digital de las empresas,
              impulsando su crecimiento y competitividad.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.valores} data-aos="fade-up">
        <h1>Nuestros Valores</h1>
        <div className={styles.valoresContenedor}>
          {VALORES.map((item) => (
            <div key={item.title} className={styles.valorItem}>
              <img src={item.img} alt="" />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.datosEmpresa} data-aos="fade-up">
        {DATOS.map((item) => (
          <div key={item.text} className={styles.datoItem}>
            <img src={item.img} alt="" />
            <p>{item.text}</p>
          </div>
        ))}
      </section>

      <section className={styles.trabajaConNosotros} data-aos="fade-up">
        <div className={styles.trabajaContenedor}>
          <div className={styles.presentacion}>
            <div className={styles.presentacionTexto}>
              <h2>Forma parte de nuestro equipo</h2>
              <p>
                En <strong>Tu Empresa</strong> buscamos personas apasionadas y
                con ganas de crecer profesionalmente. Si te identificas con
                nuestra misión, ¡envíanos tu solicitud!
              </p>
            </div>
          </div>
          <div id="trabajaConNosotros" className={styles.formulario}>
            <TrabajaForm />
          </div>
        </div>
      </section>
    </div>
  );
}
