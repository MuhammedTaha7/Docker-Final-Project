import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authData, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!authData) {
    return <Navigate to="/" replace />;
  }

  // TODO: Add role-based access control if needed in the future

  return children;
};

export default ProtectedRoute;
