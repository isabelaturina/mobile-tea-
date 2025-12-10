import { API_CONFIG } from "../config/apiConfig";

const BASE_URL = API_CONFIG.BASE_URL;

/**
 * ✅ TIPO EXATO COMO O BACKEND ESPERA
 * A API aceita: "Básico", "Intermediário", "Avançado", "Profissional", "Expert"
 * Mapeamos: leve -> Intermediário, moderado -> Avançado, severo -> Profissional
 */
export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
  nivelSuporte: "Básico" | "Intermediário" | "Avançado" | "Profissional" | "Expert";
};

export type UpdateProfilePayload = {
  nome: string;
  email: string;
  nivelSuporte: "Básico" | "Intermediário" | "Avançado" | "Profissional" | "Expert";
};

/**
 * Mapeia os níveis de suporte do app para os valores da API
 */
export function mapSupportLevelToAPI(
  level: "leve" | "moderado" | "severo"
): "Básico" | "Intermediário" | "Avançado" | "Profissional" | "Expert" {
  const mapping: Record<
    "leve" | "moderado" | "severo",
    "Básico" | "Intermediário" | "Avançado" | "Profissional" | "Expert"
  > = {
    leve: "Intermediário",
    moderado: "Avançado",
    severo: "Profissional",
  };
  return mapping[level];
}

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
    // Tenta extrair mensagem de erro da resposta da API
    let errorMessage = `${status} ${statusText}`;

    if (parsed && typeof parsed === "object") {
      // A API pode retornar { error: "mensagem" } ou { message: "mensagem" }
      if (parsed.error) {
        errorMessage = parsed.error;
      } else if (parsed.message) {
        errorMessage = parsed.message;
      } else {
        errorMessage = JSON.stringify(parsed);
      }
    } else if (raw && typeof raw === "string") {
      errorMessage = raw;
    }

    throw new Error(errorMessage);
  }

  return parsed;
}

// Função auxiliar para obter token do AsyncStorage
async function getToken(): Promise<string | null> {
  try {
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    return await AsyncStorage.getItem("userToken");
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
      Accept: "application/json",
    };

    // Se precisar de autenticação, adiciona o token JWT
    if (requiresAuth) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    console.log(`[auth] 🔄 ${method} ${url}`, {
      requiresAuth,
      hasToken: requiresAuth ? !!headers["Authorization"] : false,
    });

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
      if (
        err?.message?.includes("Network request failed") ||
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("ECONNREFUSED")
      ) {
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
 */
export async function registerUser(payload: RegisterPayload) {
  const url = `${BASE_URL}/api/auth/register`;

  try {
    console.log(`🔄 [CADASTRO] URL: ${url}`);
    console.log(`🔄 [CADASTRO] Payload:`, JSON.stringify(payload, null, 2));

    const result = await fetchWithLogging(url, "POST", payload, false);

    console.log(
      `✅ [CADASTRO] Sucesso! Resposta:`,
      JSON.stringify(result, null, 2)
    );
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
      errorMessage =
        "Erro no servidor. Verifique se todos os campos estão preenchidos corretamente.";
    } else if (error?.message?.includes("400")) {
      if (
        error?.message?.includes("Email já está em uso") ||
        error?.message?.includes("email") ||
        error?.message?.includes("já")
      ) {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
      } else {
        errorMessage =
          "Dados inválidos. Verifique se o email e senha estão corretos.";
      }
    } else if (
      error?.message?.includes("409") ||
      error?.message?.includes("Conflict")
    ) {
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
 */
export async function loginUser(email: string, password: string) {
  const url = `${BASE_URL}/api/auth/login`;

  try {
    console.log(`🔄 Tentando login em: ${url}`);
    const result = await fetchWithLogging(
      url,
      "POST",
      { email, senha: password },
      false
    );
    console.log(`✅ Login bem-sucedido em: ${url}`);
    console.log(`📦 Resposta do login:`, JSON.stringify(result, null, 2));

    if (result?.user) {
      try {
        const AsyncStorage =
          require("@react-native-async-storage/async-storage").default;
        await AsyncStorage.setItem("userData", JSON.stringify(result.user));
        console.log(`✅ Dados do usuário salvos no AsyncStorage`);
      } catch (storageError) {
        console.warn(`⚠️ Erro ao salvar dados:`, storageError);
      }
    }

    return result;
  } catch (error: any) {
    console.error(`❌ Erro no login:`, error);
    throw error;
  }
}

/**
 * ✅ BUSCAR USUÁRIO POR EMAIL - Endpoint: GET /api/user/email/{email}
 */
export async function getUserByEmail(email: string) {
  const url = `${BASE_URL}/api/user/email/${encodeURIComponent(email)}`;

  try {
    console.log(`🔄 Buscando usuário por email em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Dados do usuário obtidos com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao buscar dados do usuário:`, error);
    throw error;
  }
}

/**
 * ✅ ATUALIZAR SENHA DE USUÁRIO - Endpoint: PUT /api/user/{id}/password
 */
export async function updateUserPassword(userId: number, newPassword: string) {
  const url = `${BASE_URL}/api/user/${userId}/password`;

  try {
    console.log(`🔄 Atualizando senha do usuário em: ${url}`);
    const result = await fetchWithLogging(
      url,
      "PUT",
      { newPassword },
      false
    );
    console.log(`✅ Senha atualizada com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao atualizar senha:`, error);
    throw error;
  }
}

/**
 * ✅ ATUALIZAR PERFIL - Endpoint: PUT /api/user/{id}
 */
export async function updateUserProfile(
  userId: number,
  payload: UpdateProfilePayload
) {
  const url = `${BASE_URL}/api/user/${userId}`;

  try {
    console.log(`🔄 Atualizando perfil em: ${url}`);
    console.log(`🔄 Payload perfil:`, JSON.stringify(payload, null, 2));

    const result = await fetchWithLogging(url, "PUT", payload, false);

    console.log(
      `✅ Perfil atualizado com sucesso:`,
      JSON.stringify(result, null, 2)
    );
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao atualizar perfil:`, error);
    throw error;
  }
}

/**
 * ✅ VALIDAR TOKEN - Endpoint: GET /api/auth/validate-token?token={token}
 */
export async function validateToken(token: string) {
  const url = `${BASE_URL}/api/auth/validate-token?token=${encodeURIComponent(
    token
  )}`;

  try {
    console.log(`🔄 Validando token em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Token validado:`, result);

    if (result?.valid === false) {
      throw new Error("Token inválido ou expirado");
    }

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
    console.log(
      `🔄 Enviando solicitação de recuperação de senha em: ${url}`
    );
    const result = await fetchWithLogging(
      url,
      "POST",
      { email },
      false
    );
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
    const result = await fetchWithLogging(
      url,
      "POST",
      { token, newPassword },
      false
    );
    console.log(`✅ Senha redefinida com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`❌ Erro ao redefinir senha:`, error);
    if (
      error?.message?.includes("Token inválido") ||
      error?.message?.includes("expirado")
    ) {
      throw new Error(
        "Token inválido ou expirado. Solicite um novo código de recuperação."
      );
    }
    throw error;
  }
}

// ✅ Objeto usado pelo UserContext
export const authApi = {
  register: registerUser,
  login: loginUser,
  getUserByEmail,
  updateUserPassword,
  validateToken,
  forgotPassword,
  resetPassword,
  mapSupportLevelToAPI,
  updateUserProfile,
};
