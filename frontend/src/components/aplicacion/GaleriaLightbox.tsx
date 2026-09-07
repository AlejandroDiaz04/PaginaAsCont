import { useEffect } from "react";
import styles from "./GaleriaLightbox.module.css";

export type GaleriaLightboxProps = {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
};

export function GaleriaLightbox({
  open,
  src,
  alt,
  onClose,
}: GaleriaLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`${styles.lightbox} ${styles.lightboxActive}`}
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada de imagen"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Cerrar"
      >
        <i className="ri-close-line" aria-hidden />
      </button>
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onClick={(event) => event.stopPropagation()}
      />
      {alt ? <div className={styles.info}>{alt}</div> : null}
    </div>
  );
}
