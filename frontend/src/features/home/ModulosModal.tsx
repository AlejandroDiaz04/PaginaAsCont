import { useEffect, useId, useRef } from "react";
import { MODULOS_DATA, type ModuloId } from "./modulosData";
import styles from "./ModulosModal.module.css";

type Props = {
  moduloId: ModuloId | null;
  onClose: () => void;
};

export function ModulosModal({ moduloId, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = moduloId !== null;
  const datos = moduloId ? MODULOS_DATA[moduloId] : null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !datos) return null;

  return (
    <div
      className={`${styles.modal} ${styles.modalOpen}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalContent}>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <div className={styles.modalBody}>
          <img
            src={datos.logo}
            alt="Logo AsContSystem"
            className={styles.modalLogo}
          />
          <img
            src={datos.icono}
            alt={datos.titulo}
            className={styles.modalHeaderImg}
          />
          <h2 id={titleId}>{datos.titulo}</h2>
          <p className={styles.descripcion}>{datos.descripcion}</p>
          <h3>Características principales:</h3>
          <ul>
            {datos.caracteristicas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Beneficios:</h3>
          <p>
            <strong>{datos.beneficios}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
