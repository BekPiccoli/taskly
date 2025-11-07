import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getIsAuthenticated: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const taskly_api = process.env.TASKLY_FIREBASE_API;
const taskly_api = "http://localhost:3001";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    const res = await axios.post(`${taskly_api}/signup`, {
      email,
      password,
    });
    console.log(res.data);
    const getId = res.data.id;
    setId(getId);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string) => {
    await axios.post(`${taskly_api}/login`, {
      email,
      password,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const getIsAuthenticated = async () => {
    const isAuthenticated = await axios.post(`${taskly_api}/isAuthenticated`, {
      id: id,
    });
    setIsAuthenticated(isAuthenticated.data.isAuthenticated);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, getIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
