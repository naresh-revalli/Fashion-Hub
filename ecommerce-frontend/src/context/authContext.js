import { createContext, useState, useContext } from "react";
import { decodeJwt } from "../utils/jwtUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    const decoded = decodeJwt(jwtToken);
    if (decoded) {
      const existingUser = (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();
      if (existingUser && existingUser.email === decoded.sub) {
        // Same user logging back in — keep their role (ADMIN stays ADMIN)
        setUser(existingUser);
      } else {
        // Different user — default role to USER
        const userInfo = { email: decoded.sub, role: "USER" };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
      }
    }
  };

  // Called after registration to persist full user info (including role)
  const saveUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setToken(null);
    // Keep user info so role is preserved on next login
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ token, user, login, saveUser, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
