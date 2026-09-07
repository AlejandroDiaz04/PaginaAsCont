import { Link } from "react-router-dom";
import { ROUTES } from "../config/routes";
import styles from "./Contacto.module.css";

function mostrarEmail() {
  const email = "alexiszaracho@gmail.com";
  window.location.href = `mailto:${email}?subject=Consulta desde AsContSystem&body=Hola,%0A%0AQuiero más información sobre los servicios de AsCont.%0A%0AGracias.`;
}

export function Contacto() {
  return (
    <section
      id="contacto"
      className={styles.section}
      aria-label="Sección de contacto"
    >
      <div className={styles.grid}>
        <div className={`${styles.col} ${styles.info}`}>
          <img
            src="/assets/images/LogoEmpresaNegro.png"
            alt="Logo AS Informática"
            width={200}
          />
          <hr />
          <p>
            AS Informática es una empresa especializada en el desarrollo e
            implementación de sistemas para contadores, empresas e industrias.
            Nos destacamos por la confiabilidad de nuestras soluciones, el uso
            de tecnología de vanguardia y el compromiso profesional de nuestro
            equipo.
          </p>
          <button type="button" className={styles.mail} onClick={mostrarEmail}>
            Contactanos por email
          </button>
        </div>

        <div className={styles.col}>
          <div className={styles.mapaWrapper}>
            <iframe
              title="Ubicación"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1071.1599283160044!2d-57.51873389208036!3d-25.440330396421768!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945c53a59c036bb3%3A0x2ce9944328b0571b!2sQuinta%20C%C3%A1mpora%20Gonz%C3%A1lez!5e0!3m2!1ses-419!2spy!4v1762167452862!5m2!1ses-419!2spy"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className={styles.direccion}>
            <i className={`ri-map-pin-2-fill ${styles.ubicacion}`} aria-hidden />
            Avda. Héroes de Ytororó 756 esq./San Pedro Ypané - Paraguay
          </div>
        </div>

        <div className={`${styles.col} ${styles.lateral}`}>
          <div>
            <i className={`ri-phone-fill ${styles.phoneIcon}`} aria-hidden />
            <div className={styles.phones}>
              <div>
                Teléfono : <span>(021) 969-302</span>
              </div>
              <div>
                Celular : <span>(0971) 242-742</span>
              </div>
            </div>
          </div>
          <div className={styles.redes}>
            <a
              href="https://youtube.com/@ascontsystems?si=nXO6IOh6MDk1Bmy2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="bi bi-youtube" aria-hidden />
            </a>
            <a
              href="https://wa.me/+595971242742"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <i className="bi bi-whatsapp" aria-hidden />
            </a>
            <a
              href="https://www.instagram.com/ascontsystem?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram" aria-hidden />
            </a>
            <a
              href="https://www.facebook.com/share/1DKytsx1P1/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="bi bi-facebook" aria-hidden />
            </a>
          </div>
          <div className={styles.compania}>
            <p>Compañía</p>
            <Link to={`${ROUTES.empresa}#nosotros`}>¿Quienes somos?</Link>
            <Link to={`${ROUTES.empresa}#trabajaConNosotros`}>
              Trabaja con nosotros
            </Link>
            <Link to={`${ROUTES.empresa}#misionYvision`}>Visión</Link>
            <Link to={`${ROUTES.empresa}#misionYvision`}>Misión</Link>
            <Link to={ROUTES.privacidad}>Privacidad</Link>
          </div>
        </div>
      </div>
      <footer className={styles.derechos}>
        © 2025 AsCont Systems. Todos los derechos reservados. <br />
        Diseñado por AlejandroDiaz
      </footer>
    </section>
  );
}
