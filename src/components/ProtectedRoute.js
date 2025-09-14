import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem("jwtToken");
    const user = localStorage.getItem("user");
    return !!(token && user);
  }, []);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default React.memo(ProtectedRoute);
