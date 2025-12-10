const BASE_URL = "https://api-tea-comunicacao.onrender.com";

/**
 * Tipos para Chat - Conforme documentação da API
 * Documentação: https://api-tea-comunicacao.onrender.com
 */
export type ChatMessagePayload = {
  texto: string; // Texto da mensagem
  usuario: string; // Nome do usuário
  userId: string; // ID do usuário
};

export type ChatMessage = {
  id?: string;
  texto: string;
  usuario: string;
  userId: string;
  timestamp?: string;
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

  console.warn(`[chat] ${method} ${url} -> status ${status} ${statusText}`, {
    parsed,
    raw,
  });

  if (!res.ok) {
    // Tenta extrair mensagem de erro da resposta da API
    let errorMessage = `${status} ${statusText}`;
    
    if (parsed && typeof parsed === 'object') {
      if (parsed.error) {
        errorMessage = parsed.error;
      } else if (parsed.message) {
        errorMessage = parsed.message;
      } else {
        errorMessage = JSON.stringify(parsed);
      }
    } else if (raw && typeof raw === 'string') {
      errorMessage = raw;
    }

    throw new Error(errorMessage);
  }

  return parsed;
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

    console.log(`[chat] Fazendo requisição ${method} para ${url}`);
    if (body) {
      console.log(`[chat] Body:`, JSON.stringify(body, null, 2));
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`[chat] Resposta recebida:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
    });

    return await handleResponse(res, url, method);
  } catch (err: any) {
    console.error(
      `[chat] network/error for ${method} ${url}:`,
      err?.message || err
    );
    
    // Melhorar mensagem de erro
    if (err.message?.includes("Network request failed") || err.message?.includes("Failed to fetch")) {
      throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
    }
    
    throw err;
  }
}

/**
 * ✅ Enviar Mensagem via REST
 * Endpoint: POST /api/chat/enviar
 * Documentação: Envia uma mensagem através da API REST
 * Body: JSON com texto, usuario e userId
 * Resposta: JSON com status, firebase_id e dados da mensagem
 */
export async function sendChatMessage(payload: ChatMessagePayload) {
  const url = `${BASE_URL}/api/chat/enviar`;
  
  try {
    console.log(`🔄 [CHAT] Enviando mensagem em: ${url}`);
    console.log(`📤 [CHAT] Payload:`, JSON.stringify(payload, null, 2));
    
    const result = await fetchWithLogging(url, "POST", payload, false);
    
    console.log(`✅ [CHAT] Mensagem enviada com sucesso! Resposta:`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [CHAT] Erro ao enviar mensagem:`, error);
    throw error;
  }
}

/**
 * ✅ Buscar Mensagens
 * Endpoint: GET /api/chat/mensagens
 * Documentação: Lista todas as mensagens do chat
 * Resposta: JSON com array de mensagens
 */
export async function getChatMessages() {
  const url = `${BASE_URL}/api/chat/mensagens`;
  
  try {
    console.log(`🔄 [CHAT] Buscando mensagens em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ [CHAT] Mensagens buscadas com sucesso! Total: ${Array.isArray(result) ? result.length : 'N/A'}`);
    return result;
  } catch (error: any) {
    console.error(`❌ [CHAT] Erro ao buscar mensagens:`, error);
    throw error;
  }
}

/**
 * ✅ Health Check
 * Endpoint: GET /api/chat/health
 * Documentação: Verifica status do serviço de chat
 * Resposta: JSON com status de saúde do serviço
 */
export async function checkChatHealth() {
  const url = `${BASE_URL}/api/chat/health`;
  
  try {
    console.log(`🔄 [CHAT] Verificando saúde do serviço em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ [CHAT] Health check realizado com sucesso!`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [CHAT] Erro no health check:`, error);
    throw error;
  }
}

/**
 * ✅ Debug Firebase
 * Endpoint: GET /api/chat/debug/firebase
 * Documentação: Informações de debug sobre conexão Firebase
 * Resposta: JSON com status da conexão e últimas mensagens
 */
export async function debugFirebase() {
  const url = `${BASE_URL}/api/chat/debug/firebase`;
  
  try {
    console.log(`🔄 [CHAT] Debug Firebase em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ [CHAT] Debug Firebase realizado com sucesso!`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [CHAT] Erro no debug Firebase:`, error);
    throw error;
  }
}

// ✅ Objeto usado pelos componentes
export const chatApi = {
  sendMessage: sendChatMessage,
  getMessages: getChatMessages,
  checkHealth: checkChatHealth,
  debugFirebase: debugFirebase,
};
