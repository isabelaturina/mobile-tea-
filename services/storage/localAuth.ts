/**
 * Sistema de Autenticação Local Offline
 * Salva usuários e sessões diretamente no dispositivo usando AsyncStorage
 * Funciona completamente offline, sem precisar de backend ou IP
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocalUser {
  id: string;
  nome: string;
  email: string;
  senha: string; // Em produção, isso deveria ser hash, mas para local é OK
  nivelSuporte: "leve" | "moderado" | "severo";
  createdAt: string;
}

const STORAGE_KEYS = {
  USERS: '@mobile_tea:local_users',
  CURRENT_USER: '@mobile_tea:current_user',
  SESSION_TOKEN: '@mobile_tea:session_token',
};

/**
 * Gera um ID único simples
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Busca todos os usuários cadastrados localmente
 */
export async function getAllLocalUsers(): Promise<LocalUser[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao buscar usuários locais:', error);
    return [];
  }
}

/**
 * Busca um usuário pelo email
 */
export async function getLocalUserByEmail(email: string): Promise<LocalUser | null> {
  try {
    const users = await getAllLocalUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Erro ao buscar usuário local:', error);
    return null;
  }
}

/**
 * Cadastra um novo usuário localmente
 */
export async function registerLocalUser(
  nome: string,
  email: string,
  senha: string,
  nivelSuporte: "leve" | "moderado" | "severo"
): Promise<LocalUser> {
  try {
    // Verifica se o email já existe
    const existingUser = await getLocalUserByEmail(email);
    if (existingUser) {
      throw new Error('Este email já está cadastrado. Tente fazer login.');
    }

    // Cria novo usuário
    const newUser: LocalUser = {
      id: generateUserId(),
      nome,
      email: email.toLowerCase(),
      senha, // Em produção, fazer hash da senha
      nivelSuporte,
      createdAt: new Date().toISOString(),
    };

    // Salva no AsyncStorage
    const users = await getAllLocalUsers();
    users.push(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    console.log('✅ Usuário cadastrado localmente:', newUser.email);
    return newUser;
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário local:', error);
    throw error;
  }
}

/**
 * Faz login local verificando email e senha
 */
export async function loginLocalUser(
  email: string,
  senha: string
): Promise<LocalUser> {
  try {
    const user = await getLocalUserByEmail(email);
    
    if (!user) {
      throw new Error('Email não cadastrado.');
    }

    // Verifica senha (em produção, comparar hash)
    if (user.senha !== senha) {
      throw new Error('Senha incorreta.');
    }

    // Cria token de sessão simples
    const sessionToken = `local_token_${Date.now()}_${user.id}`;
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    console.log('✅ Login local bem-sucedido:', user.email);
    return user;
  } catch (error: any) {
    console.error('Erro no login local:', error);
    throw error;
  }
}

/**
 * Verifica se há uma sessão ativa
 */
export async function getCurrentLocalUser(): Promise<LocalUser | null> {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    
    if (token && userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Erro ao verificar sessão local:', error);
    return null;
  }
}

/**
 * Faz logout local
 */
export async function logoutLocalUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    console.log('✅ Logout local realizado');
  } catch (error) {
    console.error('Erro ao fazer logout local:', error);
  }
}

/**
 * Remove todos os dados locais (útil para limpeza)
 */
export async function clearAllLocalData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USERS);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    console.log('✅ Todos os dados locais foram removidos');
  } catch (error) {
    console.error('Erro ao limpar dados locais:', error);
  }
}
