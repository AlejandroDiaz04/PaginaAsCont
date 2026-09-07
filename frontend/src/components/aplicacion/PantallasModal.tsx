import { useEffect, useRef } from "react";
import styles from "./PantallasModal.module.css";

export type GaleriaImage = {
  src: string;
  alt: string;
  caption: string;
};

export type PantallaModalData = {
  id: number;
  title: string;
  description: string;
  images: GaleriaImage[];
  featuresTitle: string;
  features: string[];
};

export type PantallasModalProps = {
  open: boolean;
  screenId: number;
  screens: PantallaModalData[];
  onClose: () => void;
  onChangeScreen: (id: number) => void;
  onOpenLightbox: (src: string, alt: string) => void;
  /** Si el lightbox está abierto, ESC no cierra el modal. */
  lightboxOpen?: boolean;
};

export function PantallasModal({
  open,
  screenId,
  screens,
  onClose,
  onChangeScreen,
  onOpenLightbox,
  lightboxOpen = false,
}: PantallasModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const screen = screens.find((item) => item.id === screenId) ?? screens[0];
  const minId = screens[0]?.id ?? 1;
  const maxId = screens[screens.length - 1]?.id ?? screens.length;

  useEffect(() => {
    if (!open || lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, lightboxOpen, onClose]);

  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open, screenId]);

  if (!open || !screen) return null;

  const goPrev = () => {
    if (screenId > minId) onChangeScreen(screenId - 1);
  };

  const goNext = () => {
    if (screenId < maxId) onChangeScreen(screenId + 1);
  };

  return (
    <div
      className={`${styles.modal} ${styles.modalActive}`}
      role="dialog"
      aria-modal="true"
      aria-label={screen.title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Cerrar modal"
      >
        <i className="ri-close-line" aria-hidden />
      </button>

      <div className={styles.content} ref={contentRef}>
        <div className={styles.section} key={screen.id}>
          <div className={styles.header}>
            <h2>{screen.title}</h2>
            <p>{screen.description}</p>
          </div>

          <div className={styles.galeria}>
            {screen.images.map((image) => (
              <div
                key={image.src}
                className={styles.galeriaItem}
                role="button"
                tabIndex={0}
                aria-label={`Ampliar: ${image.alt}`}
                onClick={() => onOpenLightbox(image.src, image.alt)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenLightbox(image.src, image.alt);
                  }
                }}
              >
                <img src={image.src} alt={image.alt} />
                <p>{image.caption}</p>
              </div>
            ))}
          </div>

          <div className={styles.descripcion}>
            <h3>{screen.featuresTitle}</h3>
            <ul>
              {screen.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className={styles.navegacion}>
            {screenId > minId ? (
              <button
                type="button"
                className={styles.btnNav}
                onClick={goPrev}
                aria-label="Ir a pantalla anterior"
              >
                <i className="ri-arrow-left-line" aria-hidden /> Anterior
              </button>
            ) : null}
            {screenId < maxId ? (
              <button
                type="button"
                className={styles.btnNav}
                onClick={goNext}
                aria-label="Ir a siguiente pantalla"
              >
                Siguiente <i className="ri-arrow-right-line" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
