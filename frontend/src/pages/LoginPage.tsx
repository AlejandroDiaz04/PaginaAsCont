import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { registro } from "../api/auth";
import { ROUTES } from "../config/routes";
import { useAuth } from "../features/auth/AuthProvider";
import styles from "./LoginPage.module.css";

function isSafeRedirect(url: string | null): url is string {
  if (!url) return false;
  return url.startsWith("/") && !url.startsWith("//");
}

export function LoginPage() {
  const [panelRight, setPanelRight] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInMsg, setSignInMsg] = useState("");
  const [signInOk, setSignInOk] = useState(false);
  const [signInBusy, setSignInBusy] = useState(false);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [signUpMsg, setSignUpMsg] = useState("");
  const [signUpOk, setSignUpOk] = useState(false);
  const [signUpBusy, setSignUpBusy] = useState(false);

  async function onSignIn(e: FormEvent) {
    e.preventDefault();
    setSignInBusy(true);
    setSignInMsg("");
    try {
      await login(signInEmail, signInPassword);
      setSignInOk(true);
      setSignInMsg("Inicio de sesión exitoso");
      // Ignorar data.redirect del PHP (paths HTML legacy).
      const redirect = params.get("redirect");
      const target = isSafeRedirect(redirect)
        ? redirect
        : ROUTES.home;
      setTimeout(() => navigate(target, { replace: true }), 600);
    } catch (err) {
      setSignInOk(false);
      setSignInMsg(
        err instanceof ApiError
          ? err.message
          : "Error al iniciar sesión. Por favor, intente nuevamente."
      );
    } finally {
      setSignInBusy(false);
    }
  }

  async function onSignUp(e: FormEvent) {
    e.preventDefault();
    if (!acepto) {
      setSignUpOk(false);
      setSignUpMsg("Debés aceptar la política de privacidad.");
      return;
    }
    setSignUpBusy(true);
    setSignUpMsg("");
    try {
      const data = await registro({
        nombre: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      });
      setSignUpOk(data.success);
      setSignUpMsg(data.message);
      if (data.success) {
        setSignUpName("");
        setSignUpEmail("");
        setSignUpPassword("");
        setAcepto(false);
      }
    } catch (err) {
      setSignUpOk(false);
      setSignUpMsg(
        err instanceof ApiError
          ? err.message
          : "Error al procesar la solicitud. Por favor, intente nuevamente."
      );
    } finally {
      setSignUpBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.blobs} aria-hidden>
        <span className={styles.blob} />
        <span className={styles.blob} />
        <span className={styles.blob} />
      </div>

      <div
        className={`${styles.container} ${panelRight ? styles.rightActive : ""}`}
      >
        <div className={styles.mobileToggle}>
          <button
            type="button"
            className={!panelRight ? styles.mobileActive : undefined}
            onClick={() => setPanelRight(false)}
          >
            Entrar
          </button>
          <button
            type="button"
            className={panelRight ? styles.mobileActive : undefined}
            onClick={() => setPanelRight(true)}
          >
            Registrarse
          </button>
        </div>

        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={onSignUp}>
            <h1>Crear cuenta</h1>
            <span>Usa nombre y apellido para registrarte</span>
            <input
              type="text"
              placeholder="Nombre"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
              minLength={6}
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
                <Link to={ROUTES.privacidad}>política de privacidad</Link>
              </span>
            </label>
            {signUpMsg ? (
              <div
                className={`${styles.msg} ${signUpOk ? styles.ok : styles.error}`}
              >
                {signUpMsg}
              </div>
            ) : null}
            <button type="submit" disabled={signUpBusy}>
              {signUpBusy ? "Procesando..." : "Registrarse"}
            </button>
          </form>
        </div>

        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form onSubmit={onSignIn}>
            <h1>Iniciar sesión</h1>
            <span>Email o usuario</span>
            <input
              type="text"
              placeholder="Email o Usuario"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
            />
            {signInMsg ? (
              <div
                className={`${styles.msg} ${signInOk ? styles.ok : styles.error}`}
              >
                {signInMsg}
              </div>
            ) : null}
            <button type="submit" disabled={signInBusy}>
              {signInBusy ? "Iniciando..." : "Entrar"}
            </button>
          </form>
        </div>

        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <img
                src="/assets/images/LogoBlancoPng.png"
                alt=""
                className={styles.overlayLogo}
              />
              <h1>¡Bienvenido a AsCont!</h1>
              <p>Tu empresa de desarrollo de software de confianza.</p>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => setPanelRight(false)}
              >
                Iniciar sesión
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <img
                src="/assets/images/LogoBlancoPng.png"
                alt=""
                className={styles.overlayLogo}
              />
              <h1>¡Hola!</h1>
              <p>
                ¿Aún no tenés cuenta? Solicitá la tuya si sos cliente y accedé a
                contenido exclusivo.
              </p>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => setPanelRight(true)}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
