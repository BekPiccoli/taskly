import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const taskly_api = process.env.TASKLY_FIREBASE_API;
const taskly_api = "http://localhost:3001";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const register = async (email: string, password: string) => {
    console.log("signup in with:", email, password);
    console.log("API URL:", taskly_api);
    const res = await axios.post(`${taskly_api}/signup`, {
      email,
      password,
    });
    console.log(res.data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
