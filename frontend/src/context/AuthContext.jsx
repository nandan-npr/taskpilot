import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem("taskpilotToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("taskpilotToken");
    setUser(null);
  };

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("taskpilotToken");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      const response = await API.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("taskpilotToken");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};