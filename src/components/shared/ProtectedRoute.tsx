import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "admin" | "user"; // Specify the allowed role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return <Navigate to="/login" state={{ message: "Please log in to access this page." }} />;
  }

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.role !== role) {
      // Token is valid but user lacks the required role
      return (
        <Navigate
          to="/login"
          state={{
            message: "You don't have permission to access this page.",
          }}
        />
      );
    }
  } catch (err) {
    console.error("Token decoding failed:", err);
    // Redirect to login if token is invalid or expired
    return (
      <Navigate
        to="/login"
        state={{
          message: "Your session has expired or the token is invalid. Please log in again.",
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

function jwtDecode(token: string): any {
  return JSON.parse(atob(token.split(".")[1]));
}
