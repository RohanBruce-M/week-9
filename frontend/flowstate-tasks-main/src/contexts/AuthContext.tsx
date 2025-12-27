import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, role: "admin" | "user") => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("taskflow_token");
    const storedUser = localStorage.getItem("taskflow_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken: string, role: "admin" | "user") => {
    const userObj: User = { role };

    localStorage.setItem("taskflow_token", newToken);
    localStorage.setItem("taskflow_user", JSON.stringify(userObj));

    setToken(newToken);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
