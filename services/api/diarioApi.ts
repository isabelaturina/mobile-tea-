const BASE_URL = "https://diario-api-fzvz.onrender.com";

/**
 * Tipos para Diário
 */
export type DiarioPayload = {
  data: string; // formato: YYYY-MM-DD
  humor: string; // muito_feliz | feliz | neutro | triste | muito_triste | ansioso | irritado
  anotacao: string;
};

export type Diario = {
  id?: string; // O backend usa String para ID
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
 * Endpoint: POST /diario/salvar
 */
export async function createDiario(payload: DiarioPayload) {
  const url = `${BASE_URL}/diario/salvar`;
  
  try {
    console.log(`🔄 [DIARIO] Criando anotação em: ${url}`);
    console.log(`📤 [DIARIO] Payload:`, JSON.stringify(payload, null, 2));
    
    const result = await fetchWithLogging(url, "POST", payload, false);
    
    console.log(`✅ [DIARIO] Anotação criada com sucesso!`);
    return result;
  } catch (error: any) {
    console.error(`❌ [DIARIO] Erro ao criar anotação:`, error);
    throw error;
  }
}

/**
 * ✅ Listar todas as anotações do diário
 * Endpoint: GET /diario/listar
 */
export async function getAllDiarios() {
  const url = `${BASE_URL}/diario/listar`;
  
  try {
    console.log(`🔄 [DIARIO] Buscando todas as anotações em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ [DIARIO] Anotações buscadas com sucesso!`);
    return result;
  } catch (error: any) {
    console.error(`❌ [DIARIO] Erro ao buscar anotações:`, error);
    throw error;
  }
}

/**
 * ✅ Buscar anotação por ID
 * Nota: O backend não tem endpoint específico para buscar por ID
 * Usa getAllDiarios() e filtra localmente se necessário
 */
export async function getDiarioById(id: string) {
  try {
    console.log(`🔄 [DIARIO] Buscando anotação com ID: ${id}`);
    const allDiarios = await getAllDiarios();
    
    // Se a resposta for um array, busca pelo ID
    if (Array.isArray(allDiarios)) {
      const diario = allDiarios.find((d: Diario) => d.id === id);
      if (diario) {
        console.log(`✅ [DIARIO] Anotação ${id} encontrada!`);
        return diario;
      }
      throw new Error(`Anotação com ID ${id} não encontrada.`);
    }
    
    // Se não for array, retorna como está
    return allDiarios;
  } catch (error: any) {
    console.error(`❌ [DIARIO] Erro ao buscar anotação ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Buscar anotação por data
 * Nota: O backend não tem endpoint específico para buscar por data
 * Usa getAllDiarios() e filtra localmente
 */
export async function getDiarioByDate(data: string) {
  try {
    console.log(`🔄 [DIARIO] Buscando anotação da data: ${data}`);
    const allDiarios = await getAllDiarios();
    
    // Se a resposta for um array, busca pela data
    if (Array.isArray(allDiarios)) {
      const diario = allDiarios.find((d: Diario) => d.data === data);
      if (diario) {
        console.log(`✅ [DIARIO] Anotação da data ${data} encontrada!`);
        return diario;
      }
      // Se não encontrar, retorna null (não lança erro)
      console.log(`⚠️ [DIARIO] Nenhuma anotação encontrada para a data ${data}`);
      return null;
    }
    
    // Se não for array, retorna como está
    return allDiarios;
  } catch (error: any) {
    console.error(`❌ [DIARIO] Erro ao buscar anotação da data ${data}:`, error);
    throw error;
  }
}

/**
 * ✅ Atualizar anotação do diário
 * Endpoint: PUT /diario/editar/{id}
 */
export async function updateDiario(id: string, payload: DiarioPayload) {
  const url = `${BASE_URL}/diario/editar/${id}`;
  
  try {
    console.log(`🔄 [DIARIO] Atualizando anotação ${id} em: ${url}`);
    console.log(`📤 [DIARIO] Payload:`, JSON.stringify(payload, null, 2));
    
    const result = await fetchWithLogging(url, "PUT", payload, false);
    
    console.log(`✅ [DIARIO] Anotação ${id} atualizada com sucesso!`);
    return result;
  } catch (error: any) {
    console.error(`❌ [DIARIO] Erro ao atualizar anotação ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Deletar anotação do diário
 * Endpoint: DELETE /diario/deletar/{id}
 */
export async function deleteDiario(id: string) {
  const url = `${BASE_URL}/diario/deletar/${id}`;
  
  try {
    console.log(`🔄 [DIARIO] Deletando anotação ${id} em: ${url}`);
    
    const result = await fetchWithLogging(url, "DELETE", undefined, false);
    
    console.log(`✅ [DIARIO] Anotação ${id} deletada com sucesso!`);
    return result;
  } catch (error: any) {
    console.error(`❌ [DIARIO] Erro ao deletar anotação ${id}:`, error);
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

