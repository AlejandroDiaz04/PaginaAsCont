import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useAuth } from "../features/auth/AuthProvider";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 100 && y > last) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      last = y <= 0 ? 0 : y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const authDesktop = !loading && user ? (
    <div className={styles.userBox}>
      <span className={styles.userName}>{user.nombre}</span>
      <button
        type="button"
        className={styles.logoutBtn}
        onClick={() => void logout()}
      >
        Salir
      </button>
    </div>
  ) : (
    <Link to={ROUTES.login} className={styles.loginBtn} aria-label="Iniciar sesión">
      <i className="ri-user-line" aria-hidden />
    </Link>
  );

  const authMobile = !loading && user ? (
    <li className={styles.navLoginItem}>
      <button
        type="button"
        className={styles.loginLink}
        onClick={() => void logout()}
      >
        <i className="ri-logout-box-r-line" aria-hidden />
        <span>Salir ({user.nombre})</span>
      </button>
    </li>
  ) : (
    <li className={styles.navLoginItem}>
      <Link to={ROUTES.login} className={styles.loginLink}>
        <i className="ri-user-line" aria-hidden />
        <span>Iniciar Sesión</span>
      </Link>
    </li>
  );

  return (
    <header className={styles.header}>
      <nav
        className={`${styles.nav} ${hidden ? styles.navHidden : ""}`}
        aria-label="Navegación principal"
      >
        <Link to={ROUTES.home} className={styles.logoWrap}>
          <img
            src="/assets/images/NewLogoEmpresaBlanco.png"
            alt="AsContSystem Logo"
            className={styles.logo}
          />
        </Link>

        <button
          type="button"
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </button>

        <ul className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}>
          <li>
            <Link to={ROUTES.home}>Inicio</Link>
          </li>
          <li>
            <Link to={ROUTES.sistema}>Sistema</Link>
          </li>
          <li>
            <Link to={ROUTES.aplicacion}>Aplicación</Link>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
          <li>
            <Link to={ROUTES.empresa}>Empresa</Link>
          </li>
          <li>
            <Link to={ROUTES.privacidad}>Privacidad</Link>
          </li>
          {authMobile}
        </ul>

        <div className={styles.loginDesktop}>{authDesktop}</div>
      </nav>
    </header>
  );
}
