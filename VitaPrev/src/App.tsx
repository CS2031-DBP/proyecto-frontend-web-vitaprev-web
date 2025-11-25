import { Route, Routes } from "react-router";
import { AuthProvider } from "./components/auth/useAuth";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./components/Profile/ProfilePage";
import HealthMetricsPage from "./components/HealthMetrics.tsx/HealtMetricPage";
import LandingPage from "./components/Landing/LandingPage";
import Layout from "./components/ui/Layout";
import GoalsPage from "./components/GoalPage/GoalPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signup" element={<Register />} />
        <Route path="/auth/signin" element={<Login />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<div>Bienvenido a VitaPrev 💚</div>} />
          <Route path="/metricas" element={<HealthMetricsPage />} />
          <Route path="/registro-comida" element={<div>Registro de comidas</div>} />
          <Route path="/recomendaciones" element={<div>Recomendaciones</div>} />
          <Route path="/metas" element={<GoalsPage />} />
          <Route path="/user/me" element={<ProfilePage />} />
          <Route path="/auth/logout" element={<Logout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
