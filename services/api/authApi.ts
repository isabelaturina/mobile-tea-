const BASE_URL = "https://crud-tea.onrender.com";

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

async function fetchWithLogging(url: string, method: string, body?: any) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    return await handleResponse(res, url, method);
  } catch (err: any) {
    console.error(
      `[auth] network/error for ${method} ${url}:`,
      err?.message || err
    );
    throw err;
  }
}

/**
 * ✅ CADASTRO 100% COMPATÍVEL COM SEU BACKEND
 */
export async function registerUser(payload: RegisterPayload) {
  const url = `${BASE_URL}/api/user`;
  return fetchWithLogging(url, "POST", payload);
}

/**
 * ✅ LOGIN (MANTIDO COMO ESTÁ)
 */
export async function loginUser(email: string, password: string) {
  const url = `${BASE_URL}/api/auth/login`;
  return fetchWithLogging(url, "POST", { email, password });
}

// ✅ Objeto usado pelo UserContext
export const authApi = {
  register: registerUser,
  login: loginUser,
};
