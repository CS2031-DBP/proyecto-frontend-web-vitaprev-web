import { Route, Routes } from "react-router";
import { AuthProvider } from "./components/auth/useAuth";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./components/Profile/ProfilePage";
import HealthMetricsPage from "./components/MetricasSalud/HealthMetricPage";
import LandingPage from "./components/Landing/LandingPage";
import Layout from "./components/ui/Layout";
import GoalsPage from "./components/GoalPage/GoalPage";
import FoodRecommendationsPage from "./components/FoodRecom/RecommendationPage";
import FoodLogPage from "./components/FoodRegister/FoodPage";
import DashboardPage from "./components/Dashboard/Dashboard";
import NotFound from "./components/NotFound";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/signup" element={<Register />} />
        <Route path="/auth/signin" element={<Login />} />

        {/* PRIVADAS */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/metricas" element={<HealthMetricsPage />} />
          <Route path="/registro-comida" element={<FoodLogPage/>} />
          <Route path="/recomendaciones" element={<FoodRecommendationsPage/>} />
          <Route path="/metas" element={<GoalsPage />} />
          <Route path="/user/me" element={<ProfilePage />} />
          <Route path="/auth/logout" element={<Logout />} />
        </Route>

        {/* CATCH-ALL: 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
