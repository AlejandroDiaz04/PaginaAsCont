import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../api/client";
import { solicitudDemo } from "../api/demo";
import { ROUTES } from "../config/routes";
import styles from "./DemoPage.module.css";

export function DemoPage() {
  const [select, setSelect] = useState("SistemaAsCont");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!acepto) {
      setStatus("error");
      setMessage("Debés aceptar la política de privacidad.");
      return;
    }
    setSending(true);
    setStatus("idle");
    setMessage("");
    try {
      const data = await solicitudDemo({ name, email, tel, select });
      if (data.success) {
        setStatus("ok");
        setMessage(data.message);
        setName("");
        setEmail("");
        setTel("");
        setSelect("SistemaAsCont");
        setAcepto(false);
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Error al enviar el formulario. Por favor, intente nuevamente."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.page} data-aos="fade-up">
      <div className={styles.particles} aria-hidden />
      <form className={styles.form} onSubmit={onSubmit}>
        <h1>Deja tu solicitud y elige a qué sistema deseas acceder</h1>

        <label htmlFor="demo-select">Sistema para demo:</label>
        <select
          id="demo-select"
          value={select}
          onChange={(e) => setSelect(e.target.value)}
          required
        >
          <option value="SistemaAsCont">Sistema AsCont</option>
          <option value="AplicacionAsCont">Aplicación AsCont</option>
          <option value="OtraOpcion">Sistema y Aplicacion AsCont</option>
        </select>

        <label htmlFor="demo-name">Nombre Completo:</label>
        <input
          id="demo-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={3}
          maxLength={50}
          placeholder="Ej: Freddy Mercury"
        />

        <label htmlFor="demo-email">Correo Electrónico:</label>
        <input
          id="demo-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="correo@dominio.com"
        />

        <label htmlFor="demo-tel">Teléfono:</label>
        <input
          id="demo-tel"
          type="tel"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          required
          placeholder="Ej: +595 9XX 123456"
          pattern="[0-9+ ]+"
        />

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
            required
          />
          <span>
            He leído la{" "}
            <Link to={ROUTES.privacidad} target="_blank" rel="noopener">
              política de privacidad
            </Link>
          </span>
        </label>

        {message ? (
          <div
            className={`${styles.message} ${status === "ok" ? styles.ok : styles.error}`}
            role="status"
          >
            {message}
          </div>
        ) : null}

        <button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
}
