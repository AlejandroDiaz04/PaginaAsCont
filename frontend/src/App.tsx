import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./config/routes";
import { AuthProvider } from "./features/auth/AuthProvider";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";
import { AplicacionPage } from "./pages/AplicacionPage";
import { ContenidoExclusivoPage } from "./pages/ContenidoExclusivoPage";
import { DemoPage } from "./pages/DemoPage";
import { EmpresaPage } from "./pages/EmpresaPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PrivacidadPage } from "./pages/PrivacidadPage";
import { SistemaPage } from "./pages/SistemaPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.sistema} element={<SistemaPage />} />
            <Route path={ROUTES.aplicacion} element={<AplicacionPage />} />
            <Route path={ROUTES.empresa} element={<EmpresaPage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.demo} element={<DemoPage />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path={ROUTES.contenidoExclusivo}
                element={<ContenidoExclusivoPage />}
              />
            </Route>
            <Route path={ROUTES.privacidad} element={<PrivacidadPage />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
