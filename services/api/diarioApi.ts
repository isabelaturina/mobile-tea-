const BASE_URL = "https://diario-uvit.onrender.com";

/**
 * Tipos para Diário
 */
export type DiarioPayload = {
  data: string; // formato: YYYY-MM-DD
  humor: string; // muito_feliz | feliz | neutro | triste | muito_triste | ansioso | irritado
  anotacao: string;
};

export type Diario = {
  id?: number;
  data: string;
  humor: string;
  anotacao: string;
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

  console.warn(`[diario] ${method} ${url} -> status ${status} ${statusText}`, {
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

    console.log(`[diario] Fazendo requisição ${method} para ${url}`);
    if (body) {
      console.log(`[diario] Body:`, JSON.stringify(body, null, 2));
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`[diario] Resposta recebida:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
    });

    return await handleResponse(res, url, method);
  } catch (err: any) {
    console.error(
      `[diario] network/error for ${method} ${url}:`,
      err?.message || err
    );
    console.error(`[diario] Erro completo:`, err);
    
    // Melhorar mensagem de erro
    if (err.message?.includes("Network request failed") || err.message?.includes("Failed to fetch")) {
      throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
    }
    
    throw err;
  }
}

/**
 * ✅ Criar nova anotação do diário
 * Tenta diferentes endpoints possíveis
 */
export async function createDiario(payload: DiarioPayload) {
  // Lista de endpoints possíveis para tentar
  const possibleEndpoints = [
    `${BASE_URL}/api/diario`,           // Endpoint padrão
    `${BASE_URL}/diario`,                // Sem /api
    `${BASE_URL}/api/diarios`,           // Plural
  ];

  let lastError: any = null;

  for (const url of possibleEndpoints) {
    try {
      console.log(`🔄 Tentando criar anotação em: ${url}`, payload);
      const result = await fetchWithLogging(url, "POST", payload, false);
      console.log(`✅ Anotação criada com sucesso em: ${url}`);
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
    `Erro 404: Nenhum endpoint de diário foi encontrado. ` +
    `Verifique se a URL da API está correta: ${BASE_URL}. ` +
    `Endpoints tentados: ${possibleEndpoints.join(", ")}`
  );
}

/**
 * ✅ Listar todas as anotações do diário
 */
export async function getAllDiarios() {
  const url = `${BASE_URL}/api/diario`;
  
  try {
    console.log(`🔄 Buscando anotações do diário em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Anotações do diário buscadas com sucesso`);
    return result;
  } catch (error: any) {
    console.error("🔴 Erro ao buscar anotações do diário:", error);
    throw error;
  }
}

/**
 * ✅ Buscar anotação por ID
 */
export async function getDiarioById(id: number) {
  const url = `${BASE_URL}/api/diario/${id}`;
  
  try {
    console.log(`🔄 Buscando anotação ${id} em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Anotação ${id} buscada com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao buscar anotação ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Buscar anotação por data
 */
export async function getDiarioByDate(data: string) {
  const url = `${BASE_URL}/api/diario/data/${data}`;
  
  try {
    console.log(`🔄 Buscando anotação da data ${data} em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Anotação da data ${data} buscada com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao buscar anotação da data ${data}:`, error);
    throw error;
  }
}

/**
 * ✅ Atualizar anotação do diário
 */
export async function updateDiario(id: number, payload: DiarioPayload) {
  const url = `${BASE_URL}/api/diario/${id}`;
  
  try {
    console.log(`🔄 Atualizando anotação ${id} em: ${url}`, payload);
    const result = await fetchWithLogging(url, "PUT", payload, false);
    console.log(`✅ Anotação ${id} atualizada com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao atualizar anotação ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Deletar anotação do diário
 */
export async function deleteDiario(id: number) {
  const url = `${BASE_URL}/api/diario/${id}`;
  
  try {
    console.log(`🔄 Deletando anotação ${id} em: ${url}`);
    const result = await fetchWithLogging(url, "DELETE", undefined, false);
    console.log(`✅ Anotação ${id} deletada com sucesso`);
    return result;
  } catch (error: any) {
    console.error(`🔴 Erro ao deletar anotação ${id}:`, error);
    throw error;
  }
}

// ✅ Objeto usado pelos componentes
export const diarioApi = {
  create: createDiario,
  getAll: getAllDiarios,
  getById: getDiarioById,
  getByDate: getDiarioByDate,
  update: updateDiario,
  delete: deleteDiario,
};

