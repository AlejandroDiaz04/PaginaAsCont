import { useEffect, useRef, useState } from "react";
import styles from "./PageLoader.module.css";

const DURATION_MS = 1200;

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "fade" | "reveal" | "done">(
    "loading"
  );
  const [contentOpacity, setContentOpacity] = useState(1);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("loader-active");
    document.body.classList.add("loader-active");

    let raf = 0;
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const next = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(next);
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setContentOpacity(0);
          setPhase("fade");
          setTimeout(() => {
            setPhase("reveal");
            setTimeout(() => {
              setPhase("done");
              document.documentElement.classList.remove("loader-active");
              document.body.classList.remove("loader-active");
            }, 1300);
          }, 500);
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("loader-active");
      document.body.classList.remove("loader-active");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`${styles.pageLoader} ${phase === "reveal" ? styles.reveal : ""}`}
      aria-hidden={phase === "reveal"}
    >
      <div className={`${styles.curtain} ${styles.curtainTop}`} />
      <div className={`${styles.curtain} ${styles.curtainBottom}`} />
      <div className={styles.loaderContent} style={{ opacity: contentOpacity }}>
        <div className={styles.lineContainer}>
          <div className={styles.line} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.percentage}>
          Cargando <span>{Math.floor(progress)}</span>%
        </div>
      </div>
    </div>
  );
}
