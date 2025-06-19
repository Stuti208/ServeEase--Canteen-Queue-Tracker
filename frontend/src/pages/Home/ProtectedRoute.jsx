import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Helper to decode JWT and get user role
function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    // JWT is in format header.payload.signature (payload is base64)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = getUserRole();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Logged in, but not allowed
    return <Navigate to="/home" replace />;
  }

  // Allowed
  return <Outlet />;
};

export default ProtectedRoute;