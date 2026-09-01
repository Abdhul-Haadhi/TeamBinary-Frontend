import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role, roles }) => {

  const location = useLocation();

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const userData =
    localStorage.getItem("user");

  const token =
    localStorage.getItem("token");


  let user = null;


  try {

    user =
      userData
        ? JSON.parse(userData)
        : null;

  } catch (error) {

    console.error(
      "Invalid user data in localStorage:",
      error
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");

  }


  // =========================================================
  // CHECK LOGIN
  // =========================================================

  if (!user || !token) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }


  // =========================================================
  // DETERMINE ALLOWED ROLES
  // =========================================================

  let allowedRoles = [];


  if (role) {

    allowedRoles = [role];

  } else if (roles) {

    allowedRoles = Array.isArray(roles)
      ? roles
      : [roles];

  }


  // =========================================================
  // ROLE CHECK
  // =========================================================

  if (
    allowedRoles.length > 0
    &&
    !allowedRoles.includes(user.role)
  ) {

    // Unauthorized user
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // AUTHORIZED
  // =========================================================

  return children;
};

export default ProtectedRoute;