import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "40vh",
          display: "grid",
          placeItems: "center",
          color: "#666",
          fontFamily: "inherit",
        }}
        aria-busy="true"
      >
        Verificando sesión…
      </div>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`${ROUTES.login}?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  return <Outlet />;
}
