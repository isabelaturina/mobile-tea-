import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { authApi } from '../services/api/authApi';
import { API_CONFIG } from '../services/config/apiConfig';
import * as localAuth from '../services/storage/localAuth';

// ⚙️ CONFIGURAÇÃO: Ativa modo offline local (sem precisar de backend ou IP)
const USE_OFFLINE_MODE = true; // Altere para false para usar sempre o backend

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

  // Carrega dados do usuário do AsyncStorage ao iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Primeiro tenta carregar do modo offline local
        if (USE_OFFLINE_MODE) {
          const localUser = await localAuth.getCurrentLocalUser();
          if (localUser) {
            setUserData({
              name: localUser.nome,
              email: localUser.email,
              profileImage: require('../assets/images/familia 1.png'),
            });
            console.log("✅ Usuário carregado do modo offline local");
            return;
          }
        }

        // Se não estiver no modo offline ou não houver usuário local, tenta carregar do backend
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedToken && storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData({
            ...parsedData,
            token: storedToken,
          });
          console.log("✅ Dados do usuário carregados do AsyncStorage");
        }
      } catch (error) {
        console.warn("⚠️ Erro ao carregar dados do usuário:", error);
      }
    };

    loadUserData();
  }, []);

  // ✅ LOGIN - Tenta backend primeiro, se falhar usa modo offline
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("🟡 UserContext - Iniciando login");

      // Se estiver em modo offline, usa autenticação local
      if (USE_OFFLINE_MODE) {
        console.log("📱 Usando modo offline local para login");
        const localUser = await localAuth.loginLocalUser(email, password);
        
        setUserData({
          name: localUser.nome,
          email: localUser.email,
          profileImage: require('../assets/images/familia 1.png'),
        });

        console.log("🟢 UserContext - Login offline concluído com sucesso");
        return true;
      }

      // Tenta login no backend
      try {
        const data = await authApi.login(email, password);
        console.log("🟡 UserContext - Dados recebidos:", data);

        if (!data) {
          throw new Error("Resposta da API inválida");
        }

        const userName = data.user?.name || data.name || data.nome || email.split('@')[0];
        const userEmail = data.user?.email || data.email || email;
        const userToken = data.token || data.accessToken || data.access_token || '';

        const userDataToSave = {
          name: userName,
          email: userEmail,
          profileImage: require('../assets/images/familia 1.png'),
        };

        // Salva no estado
        setUserData({
          ...userDataToSave,
          token: userToken,
        });

        // Salva no AsyncStorage
        try {
          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('userData', JSON.stringify(userDataToSave));
          console.log("✅ Dados do usuário salvos no AsyncStorage");
        } catch (storageError) {
          console.warn("⚠️ Erro ao salvar dados no AsyncStorage:", storageError);
        }

        console.log("🟢 UserContext - Login concluído com sucesso");
        return true;
      } catch (backendError: any) {
        // Se o backend falhar e estiver configurado para usar local, tenta modo offline como fallback
        if (API_CONFIG.USE_LOCAL && backendError?.message?.includes('conectar')) {
          console.log("⚠️ Backend não disponível, tentando modo offline...");
          const localUser = await localAuth.loginLocalUser(email, password);
          
          setUserData({
            name: localUser.nome,
            email: localUser.email,
            profileImage: require('../assets/images/familia 1.png'),
          });

          console.log("🟢 UserContext - Login offline (fallback) concluído com sucesso");
          return true;
        }
        throw backendError;
      }

    } catch (error: any) {
      console.error("🔴 UserContext - Erro login:", error);
      throw error;
    }
  };

  // ✅ SIGN UP - Tenta backend primeiro, se falhar usa modo offline
  const signUp = async (
    name: string,
    email: string,
    password: string,
    nivelSuporte: "leve" | "moderado" | "severo"
  ): Promise<boolean> => {
    try {
      console.log("🟡 UserContext - Iniciando cadastro");

      // Se estiver em modo offline, usa cadastro local
      if (USE_OFFLINE_MODE) {
        console.log("📱 Usando modo offline local para cadastro");
        const localUser = await localAuth.registerLocalUser(name, email, password, nivelSuporte);
        
        setUserData({
          name: localUser.nome,
          email: localUser.email,
          profileImage: require('../assets/images/familia 1.png'),
        });

        console.log("🟢 UserContext - Cadastro offline concluído com sucesso");
        return true;
      }

      // Tenta cadastro no backend
      try {
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
      } catch (backendError: any) {
        // Se o backend falhar e estiver configurado para usar local, tenta modo offline como fallback
        if (API_CONFIG.USE_LOCAL && backendError?.message?.includes('conectar')) {
          console.log("⚠️ Backend não disponível, tentando modo offline...");
          const localUser = await localAuth.registerLocalUser(name, email, password, nivelSuporte);
          
          setUserData({
            name: localUser.nome,
            email: localUser.email,
            profileImage: require('../assets/images/familia 1.png'),
          });

          console.log("🟢 UserContext - Cadastro offline (fallback) concluído com sucesso");
          return true;
        }
        throw backendError;
      }

    } catch (error: any) {
      console.error("🔴 UserContext - Erro signUp:", error.message || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove dados do modo offline local
      if (USE_OFFLINE_MODE) {
        await localAuth.logoutLocalUser();
      }

      // Remove dados do AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      console.log("✅ Dados do usuário removidos do AsyncStorage");
    } catch (error) {
      console.warn("⚠️ Erro ao remover dados do AsyncStorage:", error);
    }
    
    // Remove do estado
    setUserData(null);
  };

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
