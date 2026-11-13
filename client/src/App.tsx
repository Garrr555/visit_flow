import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./middleware/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./stores/auth.store";
import Layout from "./pages/Layout";
import EntityPage from "./pages/EntityPage";

export default function App() {
  const token = useAuthStore((state) => state.token);
  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/entity" element={<EntityPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
