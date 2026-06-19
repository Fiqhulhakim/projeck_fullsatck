import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../services/api";

// Hanya admin
function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;