import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import { Alert } from "react-native";
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const taskly_api = process.env.TASKLY_FIREBASE_API;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${taskly_api}/signup`, {
      email,
      password,
    });
    console.log(res.data);
    if (res.status === 201) {
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
