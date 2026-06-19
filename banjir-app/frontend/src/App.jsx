import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddReport from "./pages/AddReport";
import DashboardPage from "./pages/DashboardPage";
import ReportListPage from "./pages/ReportListPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/daftar-laporan" element={<ReportListPage />} />

      {/* Protected routes */}
      <Route
        path="/buat-laporan"
        element={
          <ProtectedRoute>
            <AddReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;