import React, { createContext, ReactNode, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { authApi } from '../services/api/authApi';

interface UserData {
  name: string;
  email: string;
  profileImage?: any;
  token?: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (
    name: string,
    email: string,
    password: string,
    nivelSuporte: "leve" | "moderado" | "severo"
  ) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

interface ProviderProps { children: ReactNode }

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  // ✅ LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("🟡 UserContext - Iniciando login");

      const data = await authApi.login(email, password);
      console.log("🟡 UserContext - Dados recebidos:", data);

      if (!data) {
        throw new Error("Resposta da API inválida");
      }

      const userName = data.user?.name || data.name || email.split('@')[0];
      const userEmail = data.user?.email || data.email || email;
      const userToken = data.token || data.accessToken || data.access_token || '';

      setUserData({
        name: userName,
        email: userEmail,
        token: userToken,
        profileImage: require('../assets/images/familia 1.png'),
      });

      console.log("🟢 UserContext - Login concluído com sucesso");
      return true;

    } catch (error: any) {
      console.error("🔴 UserContext - Erro login API:", error);
      throw error;
    }
  };

  // ✅ SIGN UP 100% COMPATÍVEL COM SEU BACKEND
  const signUp = async (
    name: string,
    email: string,
    password: string,
    nivelSuporte: "leve" | "moderado" | "severo"
  ): Promise<boolean> => {
    try {
      console.log("🟡 UserContext - Iniciando cadastro");

      // ✅ OBJETO EXATO QUE SUA API ESPERA
      const payload = {
        nome: name,               // ✅ nome correto
        email: email,             // ✅
        senha: password,          // ✅ senha correta
        nivelSuporte: nivelSuporte // ✅ leve | moderado | severo
      };

      console.log("📤 Enviando para API:", payload);

      const data = await authApi.register(payload);
      console.log("🟡 UserContext - Dados recebidos:", data);

      if (!data) {
        throw new Error("Resposta da API inválida");
      }

      const userName = data.nome || name;
      const userEmail = data.email || email;

      setUserData({
        name: userName,
        email: userEmail,
        profileImage: require('../assets/images/familia 1.png'),
      });

      console.log("🟢 UserContext - Cadastro concluído com sucesso");
      return true;

    } catch (error: any) {
      console.error("🔴 UserContext - Erro signUp API:", error.message || error);
      throw error;
    }
  };

  const logout = () => setUserData(null);

  return (
    <UserContext.Provider value={{
      userData,
      setUserData,
      isLoggedIn: userData !== null,
      login,
      signUp,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
