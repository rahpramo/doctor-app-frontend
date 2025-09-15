import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem("jwtToken");
    const user = localStorage.getItem("user");
    return !!(token && user);
  }, []);

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default React.memo(PublicRoute);
