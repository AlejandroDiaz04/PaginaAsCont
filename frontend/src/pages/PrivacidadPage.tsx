import { useEffect, useId, useState, type ChangeEvent } from "react";
import styles from "./PrivacidadPage.module.css";

const SECTION_IDS = [
  "pilares",
  "datos",
  "usos",
  "compartidos",
  "conservacion",
  "cookies",
  "cuenta",
  "derechos",
  "contacto-privacidad",
  "politica",
] as const;

const INDEX_LINKS = [
  { href: "#pilares", icon: "ri-layout-grid-line", label: "Resumen" },
  {
    href: "#datos",
    icon: "ri-file-list-3-line",
    label: "Datos que recolectamos",
  },
  { href: "#usos", icon: "ri-focus-3-line", label: "Para qué los usamos" },
  {
    href: "#compartidos",
    icon: "ri-share-forward-line",
    label: "Con quién se comparten",
  },
  { divider: true as const },
  { href: "#conservacion", icon: "ri-time-line", label: "Conservación" },
  { href: "#cookies", icon: "ri-cookie-line", label: "Cookies" },
  {
    href: "#cuenta",
    icon: "ri-lock-password-line",
    label: "Cuenta y contenido exclusivo",
  },
  { href: "#derechos", icon: "ri-scales-3-line", label: "Tus derechos" },
  {
    href: "#contacto-privacidad",
    icon: "ri-mail-send-line",
    label: "Contacto",
  },
  {
    href: "#politica",
    icon: "ri-information-line",
    label: "Política completa",
    chevron: true,
  },
] as const;

const TOPICS = [
  {
    href: "#datos",
    icon: "ri-file-list-3-line",
    title: "Qué datos recolectamos",
    description: "Formularios de demo, empleo, registro y contacto.",
    keywords:
      "datos recolectamos nombre email teléfono cv formulario demo empleo registro",
  },
  {
    href: "#usos",
    icon: "ri-focus-3-line",
    title: "Para qué los usamos",
    description: "Atención comercial, soporte y gestión de cuentas.",
    keywords: "finalidad uso demo soporte cuenta comercial",
  },
  {
    href: "#compartidos",
    icon: "ri-share-forward-line",
    title: "Con quién se comparten",
    description: "Equipo interno, correo y servicios de hosting.",
    keywords: "compartir terceros hosting correo proveedores",
  },
  {
    href: "#conservacion",
    icon: "ri-time-line",
    title: "Cuánto tiempo los guardamos",
    description: "Según la finalidad: contacto, empleo o cuenta activa.",
    keywords: "conservación tiempo guardar retención cv correos",
  },
  {
    href: "#cookies",
    icon: "ri-cookie-line",
    title: "Cookies y tecnologías",
    description: "Sesión del sitio. No usamos un banner de publicidad.",
    keywords: "cookies sesión navegador analytics tracking",
  },
  {
    href: "#cuenta",
    icon: "ri-lock-password-line",
    title: "Cuenta y contenido exclusivo",
    description: "Registro, activación e inicio de sesión.",
    keywords: "login cuenta contenido exclusivo sesión contraseña",
  },
  {
    href: "#derechos",
    icon: "ri-scales-3-line",
    title: "Cómo ejercer tus derechos",
    description: "Acceso, corrección y supresión de datos personales.",
    keywords: "derechos ley 1682 acceso rectificación eliminación paraguay",
  },
  {
    href: "#contacto-privacidad",
    icon: "ri-mail-send-line",
    title: "Contacto de privacidad",
    description: "Escribinos para consultas sobre tus datos.",
    keywords: "contacto email teléfono privacidad ejercer derechos",
  },
] as const;

const ACCORDIONS = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    body: "AS Informática, operadora de AsContSystem, con domicilio en Avda. Héroes de Ytororó 756 esq./San Pedro, Ypané, Paraguay, es responsable de los datos personales recabados a través de este sitio web.",
  },
  {
    id: "alcance",
    title: "2. Alcance",
    body: "Esta política aplica al sitio institucional, a los formularios de demo y empleo, al registro e inicio de sesión de contenido exclusivo y a las comunicaciones que nos envíes por los canales publicados. No describe el tratamiento de datos dentro del software de gestión AsCont que usan los clientes en su propia operación, salvo que se indique lo contrario en un contrato específico.",
  },
  {
    id: "base",
    title: "3. Base y finalidad",
    body: "Tratamos tus datos porque los necesitamos para atender una solicitud que vos iniciás (demo, postulación, registro o consulta) o para ejecutar la relación con clientes que acceden al contenido exclusivo. El consentimiento se manifiesta al enviar el formulario correspondiente, incluso mediante la casilla de aceptación de esta política.",
  },
  {
    id: "seguridad",
    title: "4. Seguridad",
    body: "Aplicamos medidas razonables de acceso restringido en el servidor (por ejemplo, control de subida de CVs). Ningún envío por internet es 100% seguro. Te pedimos no compartir tu contraseña y usar una clave exclusiva para este sitio.",
  },
  {
    id: "cambios",
    title: "5. Cambios a esta política",
    body: "Podemos actualizar este texto para reflejar cambios en el sitio o en la normativa. La fecha de última actualización aparece al inicio de esta página. El uso continuado del sitio después de un cambio implica que tomaste conocimiento de la versión vigente.",
  },
] as const;

const JUMP_OPTIONS = [
  { value: "#pilares", label: "Resumen" },
  { value: "#datos", label: "Datos que recolectamos" },
  { value: "#usos", label: "Para qué los usamos" },
  { value: "#compartidos", label: "Con quién se comparten" },
  { value: "#conservacion", label: "Conservación" },
  { value: "#cookies", label: "Cookies" },
  { value: "#cuenta", label: "Cuenta y contenido exclusivo" },
  { value: "#derechos", label: "Tus derechos" },
  { value: "#contacto-privacidad", label: "Contacto" },
  { value: "#politica", label: "Política completa" },
] as const;

function topicMatches(query: string, keywords: string, text: string) {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return `${keywords} ${text}`.toLowerCase().includes(term);
}

export function PrivacidadPage() {
  const uid = useId();
  const searchId = `${uid}-search`;
  const jumpId = `${uid}-jump`;

  const [search, setSearch] = useState("");
  const [currentSection, setCurrentSection] = useState("pilares");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {}
  );

  const visibleTopics = TOPICS.filter((topic) =>
    topicMatches(search, topic.keywords, `${topic.title} ${topic.description}`)
  );

  useEffect(() => {
    const observed = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (!observed.length || !("IntersectionObserver" in window)) return;

    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setCurrentSection(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    observed.forEach((section) => spy.observe(section));
    return () => spy.disconnect();
  }, []);

  function handleJumpChange(event: ChangeEvent<HTMLSelectElement>) {
    const target = document.querySelector(event.target.value);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleAccordion(id: string) {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#privacy-main">
        Saltar al contenido
      </a>

      <section
        className={styles.hero}
        aria-labelledby="privacy-title"
        data-aos="fade-up"
      >
        <h1 id="privacy-title">Centro de privacidad</h1>
        <p className={styles.lead}>
          Te explicamos qué información recopilamos en este sitio, para qué la
          usamos y cómo podés ejercer tus derechos. Explorá los temas o leé la
          política completa.
        </p>
        <p className={styles.updated}>
          Última actualización: 19 de agosto de 2026
        </p>
      </section>

      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Temas de privacidad">
          <div className={styles.logoBox} aria-hidden="true">
            <img
              src="/assets/images/LogoBlancoPng.png"
              alt=""
              width={48}
              height={48}
            />
          </div>

          <label className={styles.searchLabel} htmlFor={searchId}>
            Buscar temas
          </label>
          <div className={styles.search}>
            <i className="ri-search-line" aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              placeholder="Buscar un tema..."
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <label className={styles.selectLabel} htmlFor={jumpId}>
            Ir a
          </label>
          <select
            id={jumpId}
            className={styles.jump}
            value={`#${currentSection}`}
            onChange={handleJumpChange}
          >
            {JUMP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <nav className={styles.index} aria-label="Índice">
            {INDEX_LINKS.map((item, i) => {
              if ("divider" in item) {
                return (
                  <div
                    key={`divider-${i}`}
                    className={styles.indexDivider}
                    role="separator"
                  />
                );
              }
              const isCurrent = item.href === `#${currentSection}`;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  <i className={item.icon} aria-hidden="true" />
                  <span>{item.label}</span>
                  {"chevron" in item && item.chevron ? (
                    <i
                      className={`ri-arrow-right-s-line ${styles.indexChevron}`}
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              );
            })}
          </nav>
        </aside>

        <div id="privacy-main" className={styles.main}>
          <section id="pilares" className={styles.section}>
            <h2>Diseñamos nuestros canales con la privacidad en mente</h2>
            <p className={styles.intro}>
              AsContSystem (AS Informática) usa este sitio para informar sobre
              nuestros productos, recibir solicitudes de demo, postulaciones
              laborales y accesos a contenido exclusivo. Solo pedimos los datos
              necesarios para esas finalidades.
            </p>
            <div className={styles.pillars} data-aos="fade-up">
              <article className={styles.pillar}>
                <i className="ri-database-2-line" aria-hidden="true" />
                <h3>Datos que recolectamos</h3>
                <p>
                  Nombre, correo, teléfono y, según el formulario, CV o
                  credenciales de cuenta.
                </p>
              </article>
              <article className={styles.pillar}>
                <i className="ri-shield-check-line" aria-hidden="true" />
                <h3>Para qué los usamos</h3>
                <p>
                  Contactarte, coordinar demos, evaluar postulaciones y
                  administrar el acceso al contenido exclusivo.
                </p>
              </article>
              <article className={styles.pillar}>
                <i className="ri-user-settings-line" aria-hidden="true" />
                <h3>Tus derechos</h3>
                <p>
                  Podés pedir acceso, corrección o eliminación de tus datos
                  personales, conforme a la normativa paraguaya aplicable.
                </p>
              </article>
            </div>
          </section>

          <section
            id="temas"
            className={styles.section}
            data-aos="fade-up"
          >
            <h2>Temas sobre privacidad</h2>
            <p className={styles.intro}>
              Elegí un tema para ir al detalle. Si no encontrás lo que buscás,
              usá el buscador o leé la política completa.
            </p>
            <div className={styles.topics}>
              {visibleTopics.map((topic) => (
                <a
                  key={topic.href}
                  className={styles.topic}
                  href={topic.href}
                  data-keywords={topic.keywords}
                >
                  <i className={topic.icon} aria-hidden="true" />
                  <div>
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <i
                    className={`ri-arrow-right-s-line ${styles.chevron}`}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
            {visibleTopics.length === 0 ? (
              <p className={styles.empty}>
                No hay temas que coincidan con tu búsqueda.
              </p>
            ) : null}
          </section>

          <section
            id="datos"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Qué datos recolectamos</h2>
            <p>
              Recolectamos los datos que vos nos das en este sitio, según el
              formulario que completes:
            </p>
            <ul>
              <li>
                <strong>Solicitud de demo:</strong> nombre completo, correo,
                teléfono y sistema de interés.
              </li>
              <li>
                <strong>Trabaja con nosotros:</strong> nombre, correo, teléfono,
                mensaje y archivo de CV (PDF o Word).
              </li>
              <li>
                <strong>Registro de contenido exclusivo:</strong> nombre, correo
                y contraseña.
              </li>
              <li>
                <strong>Contacto:</strong> si nos escribís por correo, WhatsApp
                o teléfono, los datos que incluyas en esa conversación.
              </li>
            </ul>
          </section>

          <section id="usos" className={`${styles.section} ${styles.article}`}>
            <h2>Para qué los usamos</h2>
            <p>Usamos tus datos únicamente para:</p>
            <ul>
              <li>
                Responder consultas y coordinar demostraciones de producto.
              </li>
              <li>Evaluar postulaciones laborales y contactar candidatos.</li>
              <li>
                Crear, activar y mantener cuentas de acceso a contenido
                exclusivo para clientes.
              </li>
              <li>Enviar confirmaciones relacionadas con esas solicitudes.</li>
            </ul>
            <p>
              No usamos estos datos para publicidad de terceros ni para perfiles
              de marketing automatizado en este sitio.
            </p>
          </section>

          <section
            id="compartidos"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Con quién se comparten</h2>
            <p>
              El tratamiento lo realiza el equipo de AS Informática. Para operar
              el sitio y el correo también intervienen proveedores de hosting y
              envío de email, que procesan la información en nuestro nombre.
            </p>
            <p>
              No vendemos tus datos personales. Podríamos compartirlos si una
              autoridad competente lo exige conforme a la ley.
            </p>
          </section>

          <section
            id="conservacion"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Cuánto tiempo los guardamos</h2>
            <ul>
              <li>
                Solicitudes de demo y mensajes de contacto: el tiempo necesario
                para atenderlas y un período razonable de seguimiento comercial.
              </li>
              <li>
                CVs y postulaciones: el proceso de selección y, si aplica, un
                archivo de candidatos por un plazo limitado.
              </li>
              <li>
                Cuentas de contenido exclusivo: mientras la cuenta esté activa o
                hasta que pidas su baja.
              </li>
            </ul>
          </section>

          <section
            id="cookies"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Cookies y tecnologías</h2>
            <p>
              Este sitio usa almacenamiento local y cookies de sesión para el
              inicio de sesión y la experiencia de navegación (por ejemplo,
              recordar el nombre de usuario en el navegador). No implementamos
              un banner de cookies de publicidad ni herramientas de analítica de
              terceros evidentes en el sitio público.
            </p>
          </section>

          <section
            id="cuenta"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Cuenta y contenido exclusivo</h2>
            <p>
              El registro solicita nombre, correo y contraseña. La cuenta se
              activa tras un proceso interno. Al iniciar sesión se crea una
              sesión en el servidor. Podés solicitar la baja de tu cuenta
              escribiéndonos a los canales de contacto.
            </p>
          </section>

          <section
            id="derechos"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Cómo ejercer tus derechos</h2>
            <p>
              En Paraguay, el tratamiento de datos personales se rige, entre
              otras normas, por la Ley 1682/2001 y sus modificaciones. Podés
              solicitar:
            </p>
            <ul>
              <li>Acceso a los datos que tenemos sobre vos.</li>
              <li>Rectificación de información inexacta.</li>
              <li>Eliminación cuando ya no sea necesaria para la finalidad.</li>
            </ul>
            <p>
              Para ejercerlos, escribinos identificándote y describiendo el
              pedido. Podemos pedir datos adicionales para verificar tu
              identidad.
            </p>
          </section>

          <section
            id="contacto-privacidad"
            className={`${styles.section} ${styles.article}`}
          >
            <h2>Contacto de privacidad</h2>
            <p>
              Responsable: <strong>AS Informática / AsContSystem</strong>
              <br />
              Avda. Héroes de Ytororó 756 esq./San Pedro, Ypané, Paraguay
              <br />
              Teléfono: (021) 969-302 · Celular: (0971) 242-742
            </p>
            <p>
              También podés usar{" "}
              <a href="#contacto">la sección de contacto</a> al pie de esta
              página o el enlace de correo.
            </p>
          </section>

          <section id="politica" className={styles.section}>
            <h2>Más información en la Política de privacidad</h2>
            <p className={styles.intro}>
              Texto informativo sobre el tratamiento de datos en{" "}
              <strong>www.ascont.com.py</strong>. No sustituye una revisión
              legal formal.
            </p>
            <div className={styles.accordions}>
              {ACCORDIONS.map((item) => {
                const panelId = `acc-${item.id}`;
                const btnId = `${panelId}-btn`;
                const expanded = Boolean(openAccordions[item.id]);
                return (
                  <div key={item.id} className={styles.accordion}>
                    <button
                      type="button"
                      className={styles.accordionTrigger}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      id={btnId}
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <span>{item.title}</span>
                      <i
                        className={
                          expanded ? "ri-subtract-line" : "ri-add-line"
                        }
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={panelId}
                      className={styles.accordionPanel}
                      role="region"
                      aria-labelledby={btnId}
                      hidden={!expanded}
                    >
                      <p>{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
