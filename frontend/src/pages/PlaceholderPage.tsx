import styles from "./Placeholder.module.css";

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className={styles.page} data-aos="fade-up">
      <h1>{title}</h1>
      <p>Pendiente de migración (Fase 2+)</p>
    </section>
  );
}
