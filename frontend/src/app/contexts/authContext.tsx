/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/app/interface";

interface AuthContextType {
  user: IUser | null;
  isAuth: boolean;
  token?: string | null;
  saveUserData: (data: { user: IUser; access_token: string }) => void;
  resetUserData: () => void;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const saveUserData = (data: { user: IUser; access_token: string }) => {
    setUser(data.user);
    setIsAuth(true);
    setToken(data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("access_token", data.access_token);
  };
  const resetUserData = () => {
    setUser(null);
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");
    console.log(storedUser, " user guardados");
    if (storedToken && storedToken.split(".").length === 3) {
      try {
        const decodedToken: any = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp > currentTime && storedUser) {
          const parsedUser: IUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuth(true);
        } else {
          resetUserData();
        }
      } catch (error) {
        console.warn("Error al decodificar token:", error);
        resetUserData();
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-lg font-medium">
      <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      Cargando...
    </div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        saveUserData,
        resetUserData,
        token,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
