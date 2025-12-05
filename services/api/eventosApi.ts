const BASE_URL = "https://eventos-latest.onrender.com";

/**
 * Tipos para Eventos
 */
export type EventoPayload = {
  titulo: string;
  data: string; // formato: YYYY-MM-DD
  horario?: string; // formato: HH:mm
  nota?: string;
  temNotificacao?: boolean;
};

export type Evento = {
  id?: number;
  titulo: string;
  data: string;
  horario?: string;
  nota?: string;
  temNotificacao?: boolean;
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

  console.warn(`[eventos] ${method} ${url} -> status ${status} ${statusText}`, {
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

async function fetchWithLogging(
  url: string,
  method: string,
  body?: any,
  requiresAuth: boolean = false
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Se precisar de autenticação, adicionar token aqui no futuro
    // if (requiresAuth && token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    console.log(`[eventos] Fazendo requisição ${method} para ${url}`);
    if (body) {
      console.log(`[eventos] Body:`, JSON.stringify(body, null, 2));
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`[eventos] Resposta recebida:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
    });

    return await handleResponse(res, url, method);
  } catch (err: any) {
    console.error(
      `[eventos] network/error for ${method} ${url}:`,
      err?.message || err
    );
    console.error(`[eventos] Erro completo:`, err);
    
    // Melhorar mensagem de erro
    if (err.message?.includes("Network request failed") || err.message?.includes("Failed to fetch")) {
      throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
    }
    
    throw err;
  }
}

/**
 * ✅ Criar novo evento
 * Tenta diferentes endpoints possíveis
 */
export async function createEvento(payload: EventoPayload) {
  // Lista de endpoints possíveis para tentar
  const possibleEndpoints = [
    `${BASE_URL}/api/eventos`,           // Endpoint padrão
    `${BASE_URL}/eventos`,                // Sem /api
    `${BASE_URL}/api/evento`,            // Singular
  ];

  let lastError: any = null;

  for (const url of possibleEndpoints) {
    try {
      console.log(`🔄 Tentando criar evento em: ${url}`, payload);
      const result = await fetchWithLogging(url, "POST", payload, false);
      console.log(`✅ Evento criado com sucesso em: ${url}`);
      return result;
    } catch (error: any) {
      lastError = error;
      // Se for 404, tenta o próximo endpoint
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        console.log(`⚠️ Endpoint ${url} não encontrado (404), tentando próximo...`);
        continue;
      }
      // Para outros erros, lança imediatamente
      throw error;
    }
  }

  // Se chegou aqui, todos os endpoints falharam
  throw new Error(
    `Erro 404: Nenhum endpoint de eventos foi encontrado. ` +
    `Verifique se a URL da API está correta: ${BASE_URL}. ` +
    `Endpoints tentados: ${possibleEndpoints.join(", ")}`
  );
}

/**
 * ✅ Listar todos os eventos
 */
export async function getAllEventos() {
  const url = `${BASE_URL}/api/eventos`;
  
  try {
    console.log(`🔄 Buscando eventos em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Eventos buscados com sucesso`);
    return result;
  } catch (error: any) {
    console.error("🔴 Erro ao buscar eventos:", error);
    throw error;
  }
}

/**
 * ✅ Buscar evento por ID
 */
export async function getEventoById(id: number) {
  const url = `${BASE_URL}/api/eventos/${id}`;
  
  try {
    console.log(`🔄 Buscando evento ${id} em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Evento ${id} buscado com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao buscar evento ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Atualizar evento
 */
export async function updateEvento(id: number, payload: EventoPayload) {
  const url = `${BASE_URL}/api/eventos/${id}`;
  
  try {
    console.log(`🔄 Atualizando evento ${id} em: ${url}`, payload);
    const result = await fetchWithLogging(url, "PUT", payload, false);
    console.log(`✅ Evento ${id} atualizado com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao atualizar evento ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Deletar evento
 */
export async function deleteEvento(id: number) {
  const url = `${BASE_URL}/api/eventos/${id}`;
  
  try {
    console.log(`🔄 Deletando evento ${id} em: ${url}`);
    const result = await fetchWithLogging(url, "DELETE", undefined, false);
    console.log(`✅ Evento ${id} deletado com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao deletar evento ${id}:`, error);
    throw error;
  }
}

// ✅ Objeto usado pelos componentes
export const eventosApi = {
  create: createEvento,
  getAll: getAllEventos,
  getById: getEventoById,
  update: updateEvento,
  delete: deleteEvento,
};

