import { useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../../api/client";
import { trabajaConNosotros } from "../../api/jobs";
import { ROUTES } from "../../config/routes";
import styles from "./TrabajaForm.module.css";

const MAX_CV_BYTES = 2 * 1024 * 1024;
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isAllowedCv(file: File): boolean {
  if (ALLOWED_CV_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
}

export function TrabajaForm() {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [acepto, setAcepto] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  function clearCv() {
    setCv(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onCvChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) {
      clearCv();
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setStatus("error");
      setFeedback("El archivo es demasiado grande. Máximo 2MB.");
      clearCv();
      return;
    }
    if (!isAllowedCv(file)) {
      setStatus("error");
      setFeedback("Solo se permiten PDF o Word.");
      clearCv();
      return;
    }
    setStatus("idle");
    setFeedback("");
    setCv(file);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!acepto) {
      setStatus("error");
      setFeedback("Debés aceptar la política de privacidad.");
      return;
    }
    if (!cv) {
      setStatus("error");
      setFeedback("Adjunta tu CV antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correo", correo);
    formData.append("telefono", telefono);
    formData.append("mensaje", mensaje);
    formData.append("cv", cv);

    setSending(true);
    setStatus("idle");
    setFeedback("");

    try {
      const data = await trabajaConNosotros(formData);
      if (data.success) {
        setStatus("ok");
        setFeedback(data.message);
        setNombre("");
        setCorreo("");
        setTelefono("");
        setMensaje("");
        setAcepto(false);
        clearCv();
      } else {
        setStatus("error");
        setFeedback(data.message);
      }
    } catch (err) {
      setStatus("error");
      setFeedback(
        err instanceof ApiError
          ? err.message
          : "Error al enviar el formulario. Intente nuevamente."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} encType="multipart/form-data">
      <h1>TRABAJA CON NOSOTROS</h1>

      <input
        type="text"
        name="nombre"
        id={`${baseId}-nombre`}
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        name="correo"
        id={`${baseId}-correo`}
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="tel"
        name="telefono"
        id={`${baseId}-telefono`}
        placeholder="Número de teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
      />

      {!cv ? (
        <label className={styles.adjuntoLabel} htmlFor={`${baseId}-cv`}>
          <span>Adjuntar CV (PDF, Word - Max 2MB)</span>
          <input
            ref={fileInputRef}
            type="file"
            name="cv"
            id={`${baseId}-cv`}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            onChange={(e) => onCvChange(e.target.files)}
          />
        </label>
      ) : (
        <div className={styles.cvPreview}>
          <span>{cv.name}</span>
          <span className={styles.cvFileSize}>
            ({(cv.size / 1024).toFixed(2)} KB)
          </span>
          <button
            type="button"
            className={styles.removeCv}
            onClick={clearCv}
          >
            Eliminar
          </button>
        </div>
      )}

      <textarea
        name="mensaje"
        id={`${baseId}-mensaje`}
        placeholder="Cuéntanos por qué te gustaría unirte..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
      />

      <label className={styles.privacyConsent}>
        <input
          type="checkbox"
          name="acepto_privacidad"
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

      {feedback ? (
        <div
          className={`${styles.message} ${status === "ok" ? styles.ok : styles.error}`}
          role="status"
        >
          {feedback}
        </div>
      ) : null}

      <button type="submit" className={styles.submit} disabled={sending}>
        {sending ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
