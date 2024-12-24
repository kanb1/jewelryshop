import React from "react";
import { Navigate } from "react-router-dom";


// Defines the props expected by protectedroute
// children --> the child components rendered if the user passes authentication and authorization checks. It's type is React.ReactNode which can be any react element
// role -> the required role to access the route

// ensures type safety when using protectedroute, if u try to use invalid props, ts will flag an error during development (all those errors I used to get)
interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "admin" | "user"; // Specify the allowed role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  // it retrieves the JWT token from localstorage
  const token = localStorage.getItem("jwt");

  // if no token exists, the user is redirected to the login page
  if (!token) {
    return <Navigate to="/login" state={{ message: "Please log in to access this page." }} />;
  }


  try {
    // uses the helper function jwtDecode() to decode the JWT payload (bottom of file)
    const decoded: any = jwtDecode(token);
    // exracts the role from the token. It compares the decoded role with the role prop passed to protectedroute.
      // if roles don't match, the user is redirected to the login page with a message
    if (decoded.role !== role) {
      // Token is valid but user lacks the required role, so we redirect her to the loginpage
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

  // if all checks pass, the children components are rendered

  return <>{children}</>;
};

export default ProtectedRoute;

function jwtDecode(token: string): any {
  return JSON.parse(atob(token.split(".")[1]));
}
