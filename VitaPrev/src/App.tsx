import { Route, Routes } from "react-router";
import { AuthProvider } from "./components/auth/useAuth";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./components/Profile/ProfilePage";

import LandingPage from "./components/Landing/LandingPage";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signup" element={<Register />} />
        <Route path="/auth/signin" element={<Login />} />

        {/* TODAS ESTAS COMPARTEN EL MISMO LAYOUT */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* HOME DEL DASHBOARD */}
          <Route path="/dashboard" element={<div>Bienvenido a VitaPrev 💚</div>} />

          {/* RUTAS PRIVADAS */}
          <Route path="/metricas" element={<div>Métricas de salud</div>} />
          <Route path="/registro-comida" element={<div>Registro de comidas</div>} />
          <Route path="/recomendaciones" element={<div>Recomendaciones</div>} />
          <Route path="/metas" element={<div>Metas</div>} />
          <Route path="/user/me" element={<ProfilePage />} />
          <Route path="/auth/logout" element={<Logout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
