import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  children,
}) => {
  const isAuthenticated =
    localStorage.getItem("admin-auth") ===
    "true";

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};