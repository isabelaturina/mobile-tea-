import React, { createContext, ReactNode, useContext, useState } from "react";
import { StyleSheet } from "react-native";

interface UserData {
  name: string;
  email: string;
  profileImage: any;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (
    nome: string,
    email: string,
    senha: string,
    nivelSuporte: string
  ) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const extractNameFromEmail = (email: string): string => {
    const namePart = email.split("@")[0];
    const cleanName = namePart.replace(/[._-]/g, " ");
    const words = cleanName.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords[0];
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!email || !password) {
        return false;
      }

      const userName = extractNameFromEmail(email);

      const mockUserData: UserData = {
        name: userName,
        email: email,
        profileImage: require("../assets/images/familia 1.png"),
      };

      setUserData(mockUserData);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const signUp = async (
    nome: string,
    email: string,
    senha: string,
    nivelSuporte: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha, nivelSuporte }),
      });

      if (!response.ok) {
        console.error("Erro na resposta da API:", response.status);
        return false;
      }

      const data = await response.json();

      const userFromApi: UserData = {
        name: data.nome || nome,
        email: data.email || email,
        profileImage: require("../assets/images/familia 1.png"),
      };

      setUserData(userFromApi);
      return true;
    } catch (error) {
      console.error("Erro ao se cadastrar:", error);
      return false;
    }
  };

  const logout = () => {
    setUserData(null);
  };

  const value: UserContextType = {
    userData,
    setUserData,
    isLoggedIn: userData !== null,
    login,
    signUp,
    logout,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

// Estilos (opcional)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
    resizeMode: "contain",
  },
  loginText: {
    color: "#fff",
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
  loginLink: {
    color: "#00CFFF",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "bold",
  },
});
