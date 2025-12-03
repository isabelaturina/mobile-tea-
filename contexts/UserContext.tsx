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
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
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

  // LOGIN REAL USANDO API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authApi.login(email, password);

      setUserData({
        name: data.user.name,
        email: data.user.email,
        token: data.token,
        profileImage: require('../assets/images/familia 1.png'),
      });

      return true;
    } catch (error) {
      console.log("Erro login API:", error);
      return false;
    }
  };

  // SIGN UP REAL USANDO API
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const data = await authApi.register(name, email, password);

      setUserData({
        name: data.user.name,
        email: data.user.email,
        token: data.token,
        profileImage: require('../assets/images/familia 1.png'),
      });

      return true;
    } catch (error) {
      console.log("Erro signUp API:", error);
      return false;
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
