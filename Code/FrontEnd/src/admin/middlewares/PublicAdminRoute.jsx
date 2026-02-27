import { Navigate } from "react-router-dom";

export default function PublicAdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
