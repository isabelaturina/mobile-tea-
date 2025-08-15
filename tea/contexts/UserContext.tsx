import React, { createContext, ReactNode, useContext, useState } from 'react';

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
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  // Função para extrair o nome do email
  const extractNameFromEmail = (email: string): string => {
    // Remove a parte após o @
    const namePart = email.split('@')[0];
    
    // Remove pontos, underscores e outros caracteres especiais
    const cleanName = namePart.replace(/[._-]/g, ' ');
    
    // Capitaliza cada palavra
    const words = cleanName.split(' ');
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    
    // Retorna apenas a primeira palavra (nome)
    return capitalizedWords[0];
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login - em um app real, aqui seria feita a chamada para a API
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extrair o nome do email que a pessoa digitou
      // Exemplos:
      // - "maria.silva@gmail.com" → "Maria"
      // - "joao_123@hotmail.com" → "Joao"
      // - "ana.costa.santos@yahoo.com" → "Ana"
      const userName = extractNameFromEmail(email);
      
      // Dados mockados do usuário (em um app real, viriam da API)
      const mockUserData: UserData = {
        name: userName, // Usa o nome extraído do email
        email: email,
        profileImage: require('../assets/images/familia 1.png')
      };
      
      setUserData(mockUserData);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUserData: UserData = {
        name: name,
        email: email,
        profileImage: require('../assets/images/familia 1.png')
      };
      setUserData(mockUserData);
      return true;
    } catch (error) {
      console.error('Erro no signUp:', error);
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
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 