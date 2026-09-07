import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Contacto } from "../components/Contacto";
import { Navbar } from "../components/Navbar";
import { PageLoader } from "../components/PageLoader";
import { ROUTES } from "../config/routes";
import { refreshAos } from "../lib/aos";
import styles from "./MainLayout.module.css";

export function MainLayout() {
  const location = useLocation();
  const hideContacto = location.pathname === ROUTES.contenidoExclusivo;

  useEffect(() => {
    refreshAos();
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      <PageLoader />
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      {hideContacto ? null : <Contacto />}
    </div>
  );
}
