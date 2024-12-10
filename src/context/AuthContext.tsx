import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  userRole: string | null;
  setIsLoggedIn: (value: boolean) => void;
  setUserRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  userRole: null,
  setIsLoggedIn: () => {},
  setUserRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Helper function to decode JWT and extract user data
  const decodeToken = (token: string): { role: string } | null => {
    try {
      const decoded: any = JSON.parse(atob(token.split(".")[1]));
      return { role: decoded.role };
    } catch {
      return null;
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setIsLoggedIn(true);
        setUserRole(decoded.role);
      } else {
        localStorage.removeItem("jwt");
      }
    }
  }, []);

  // Watch for token updates and refresh state
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setIsLoggedIn(true);
        setUserRole(decoded.role);
      }
    }
  }, [isLoggedIn, userRole]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, setIsLoggedIn, setUserRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
