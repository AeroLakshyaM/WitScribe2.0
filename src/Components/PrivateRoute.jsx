import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return currentUser ? children : <Navigate to="/landing" replace />;
};

export default PrivateRoute; 
