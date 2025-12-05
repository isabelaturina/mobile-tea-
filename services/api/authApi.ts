import { API_CONFIG } from '../config/apiConfig';

const BASE_URL = API_CONFIG.BASE_URL;

/**
 * ✅ TIPO EXATO COMO O BACKEND ESPERA
 */
export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
  nivelSuporte: "leve" | "moderado" | "severo";
};

async function handleResponse(res: Response, url: string, method: string) {
  const status = res.status;
  const statusText = res.statusText;
  const raw = await res.text();
  let parsed: any = raw;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    // mantém raw como string se não for JSON
  }

  console.warn(`[auth] ${method} ${url} -> status ${status} ${statusText}`, {
    parsed,
    raw,
  });

  if (!res.ok) {
    const bodySnippet =
      typeof parsed === "object" ? JSON.stringify(parsed) : raw;

    const message =
      bodySnippet && bodySnippet.length
        ? `${status} ${statusText}: ${bodySnippet}`
        : `${status} ${statusText}`;

    throw new Error(message);
  }

  return parsed;
}

// Função auxiliar para obter token do AsyncStorage
async function getToken(): Promise<string | null> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('userToken');
  } catch {
    return null;
  }
}

async function fetchWithLogging(
  url: string, 
  method: string, 
  body?: any, 
  requiresAuth: boolean = false
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Se precisar de autenticação, adiciona o token JWT
    if (requiresAuth) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    
    console.log(`[auth] 🔄 ${method} ${url}`, { requiresAuth, hasToken: requiresAuth ? !!headers["Authorization"] : false });
    
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return await handleResponse(res, url, method);
  } catch (err: any) {
    console.error(
      `[auth] ❌ network/error for ${method} ${url}:`,
      err?.message || err
    );
    
    // Melhorar mensagens de erro para desenvolvimento local
    if (API_CONFIG.USE_LOCAL) {
      if (err?.message?.includes('Network request failed') || 
          err?.message?.includes('Failed to fetch') ||
          err?.message?.includes('ECONNREFUSED')) {
        const enhancedError = new Error(
          `Não foi possível conectar ao backend local (${BASE_URL}). ` +
          `Verifique se o servidor está rodando na porta ${API_CONFIG.PORT}.`
        );
        throw enhancedError;
      }
    }
    
    throw err;
  }
}

/**
 * ✅ CADASTRO - Endpoint: POST /api/auth/register
 * IMPORTANTE: Cadastro NÃO deve exigir token de autenticação
 */
export async function registerUser(payload: RegisterPayload) {
  const url = `${BASE_URL}/api/auth/register`;
  
  try {
    console.log(`🔄 [CADASTRO] URL: ${url}`);
    console.log(`🔄 [CADASTRO] Payload:`, JSON.stringify(payload, null, 2));
    
    const result = await fetchWithLogging(url, "POST", payload, false);
    
    console.log(`✅ [CADASTRO] Sucesso! Resposta:`, JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error(`❌ [CADASTRO] Erro completo:`, error);
    console.error(`❌ [CADASTRO] Mensagem:`, error?.message);
    console.error(`❌ [CADASTRO] Stack:`, error?.stack);
    
    // Melhorar mensagem de erro para o usuário
    let errorMessage = "Erro ao criar conta. Tente novamente.";
    
    if (error?.message?.includes("Não foi possível conectar ao backend local")) {
      errorMessage = error.message;
    } else if (error?.message?.includes("500")) {
      errorMessage = "Erro no servidor. Verifique se todos os campos estão preenchidos corretamente.";
    } else if (error?.message?.includes("400")) {
      errorMessage = "Dados inválidos. Verifique se o email e senha estão corretos.";
    } else if (error?.message?.includes("409") || error?.message?.includes("Conflict")) {
      errorMessage = "Este email já está cadastrado. Tente fazer login.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).originalError = error;
    throw enhancedError;
  }
}

/**
 * ✅ LOGIN - Endpoint: POST /api/auth/login
 * IMPORTANTE: Login NÃO deve exigir token de autenticação
 */
export async function loginUser(email: string, password: string) {
  const url = `${BASE_URL}/api/auth/login`;
  
  try {
    console.log(`🔄 Tentando login em: ${url}`);
    // Tenta primeiro com { email, password }
    const result = await fetchWithLogging(url, "POST", { email, password }, false);
    console.log(`✅ Login bem-sucedido em: ${url}`);
    
    // Salva o token no AsyncStorage se existir
    if (result?.token || result?.accessToken || result?.access_token) {
      const token = result.token || result.accessToken || result.access_token;
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('userToken', token);
        console.log(`✅ Token salvo no AsyncStorage`);
      } catch (storageError) {
        console.warn(`⚠️ Erro ao salvar token:`, storageError);
      }
    }
    
    return result;
  } catch (error: any) {
    console.error(`❌ Erro no login:`, error);
    throw error;
  }
}

/**
 * ✅ BUSCAR DADOS DO USUÁRIO AUTENTICADO - Endpoint: GET /api/auth/me
 * Requer token JWT no header Authorization
 */
export async function getCurrentUser() {
  const url = `${BASE_URL}/api/auth/me`;
  
  try {
    console.log(`🔄 Buscando dados do usuário em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, true);
    console.log(`✅ Dados do usuário obtidos com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao buscar dados do usuário:`, error);
    throw error;
  }
}

/**
 * ✅ VALIDAR TOKEN JWT - Endpoint: GET /api/auth/validate-jwt?token={token}
 */
export async function validateJWT(token: string) {
  const url = `${BASE_URL}/api/auth/validate-jwt?token=${encodeURIComponent(token)}`;
  
  try {
    console.log(`🔄 Validando token JWT em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Token validado com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao validar token:`, error);
    throw error;
  }
}

/**
 * ✅ VALIDAR TOKEN - Endpoint: GET /api/auth/validate-token
 * Requer token JWT no header Authorization
 */
export async function validateToken() {
  const url = `${BASE_URL}/api/auth/validate-token`;
  
  try {
    console.log(`🔄 Validando token em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, true);
    console.log(`✅ Token validado com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao validar token:`, error);
    throw error;
  }
}

/**
 * ✅ ESQUECI MINHA SENHA - Endpoint: POST /api/auth/forgot-password
 */
export async function forgotPassword(email: string) {
  const url = `${BASE_URL}/api/auth/forgot-password`;
  
  try {
    console.log(`🔄 Enviando solicitação de recuperação de senha em: ${url}`);
    const result = await fetchWithLogging(url, "POST", { email }, false);
    console.log(`✅ Solicitação de recuperação enviada com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao solicitar recuperação de senha:`, error);
    throw error;
  }
}

/**
 * ✅ REDEFINIR SENHA - Endpoint: POST /api/auth/reset-password
 */
export async function resetPassword(token: string, newPassword: string) {
  const url = `${BASE_URL}/api/auth/reset-password`;
  
  try {
    console.log(`🔄 Redefinindo senha em: ${url}`);
    const result = await fetchWithLogging(url, "POST", { token, newPassword }, false);
    console.log(`✅ Senha redefinida com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao redefinir senha:`, error);
    throw error;
  }
}

// ✅ Objeto usado pelo UserContext
export const authApi = {
  register: registerUser,
  login: loginUser,
  getCurrentUser,
  validateJWT,
  validateToken,
  forgotPassword,
  resetPassword,
};

