import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    console.log("[AdminRoute] No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log(`[AdminRoute] User ${user.email} is not an admin (Role: ${user.role}), redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
