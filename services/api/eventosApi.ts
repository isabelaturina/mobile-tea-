const BASE_URL = "https://api-tea-comunicacao.onrender.com";

/**
 * Tipos para Eventos - Conforme documentação da API
 * Documentação: https://api-tea-comunicacao.onrender.com
 */
export type EventoPayload = {
  titulo: string; // Título do evento
  descricao?: string; // Descrição do evento (opcional)
  data: string; // Data do evento (formato: YYYY-MM-DD ou formato livre)
  hora?: string; // Hora do evento (formato livre, ex: "14:30")
  usuarioId: string; // ID do usuário que criou o evento
};

export type Evento = {
  id?: string; // ID gerado automaticamente pelo Firebase
  titulo: string;
  descricao?: string;
  data: string;
  hora?: string;
  usuarioId: string;
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

  console.log(`[eventos] ${method} ${url} -> status ${status} ${statusText}`);
  console.log(`[eventos] Resposta raw:`, raw);
  console.log(`[eventos] Resposta parsed:`, parsed);

  if (!res.ok) {
    // Tenta extrair mensagem de erro da resposta da API
    let errorMessage = `${status} ${statusText}`;
    
    if (parsed && typeof parsed === 'object') {
      // Tenta diferentes campos de erro comuns
      if (parsed.error) {
        errorMessage = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
      } else if (parsed.message) {
        errorMessage = typeof parsed.message === 'string' ? parsed.message : JSON.stringify(parsed.message);
      } else if (parsed.errors) {
        // Se for um array de erros
        if (Array.isArray(parsed.errors)) {
          errorMessage = parsed.errors.map((e: any) => e.message || e).join(', ');
        } else {
          errorMessage = JSON.stringify(parsed.errors);
        }
      } else {
        // Se não encontrar campo de erro, retorna o objeto completo
        errorMessage = JSON.stringify(parsed);
      }
    } else if (raw && typeof raw === 'string' && raw.trim() !== '') {
      errorMessage = raw;
    }

    console.error(`[eventos] Erro na resposta:`, errorMessage);
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
 * ✅ Adicionar Evento
 * Endpoint: POST /api/eventos/add
 * Documentação: Cria um novo evento na agenda
 * Body: JSON com título, descrição, data/hora e usuarioId
 * Resposta: JSON com o evento criado
 */
export async function createEvento(payload: EventoPayload) {
  const url = `${BASE_URL}/api/eventos/add`;
  
  try {
    // Preparar payload - garantir que campos obrigatórios existam
    const cleanPayload: any = {
      titulo: payload.titulo?.trim() || '',
      data: payload.data || '',
      usuarioId: payload.usuarioId ? String(payload.usuarioId).trim() : '',
    };
    
    // Adicionar campos opcionais apenas se tiverem valor
    if (payload.descricao && payload.descricao.trim()) {
      cleanPayload.descricao = payload.descricao.trim();
    }
    
    if (payload.hora && payload.hora.trim()) {
      cleanPayload.hora = payload.hora.trim();
    }
    
    console.log(`🔄 [EVENTOS] Criando evento em: ${url}`);
    console.log(`📤 [EVENTOS] Payload completo:`, JSON.stringify(cleanPayload, null, 2));
    console.log(`📋 [EVENTOS] Tipos dos campos:`, {
      titulo: typeof cleanPayload.titulo,
      data: typeof cleanPayload.data,
      usuarioId: typeof cleanPayload.usuarioId,
      descricao: cleanPayload.descricao ? typeof cleanPayload.descricao : 'undefined',
      hora: cleanPayload.hora ? typeof cleanPayload.hora : 'undefined',
    });
    
    // Validar campos obrigatórios
    if (!cleanPayload.titulo || cleanPayload.titulo.trim() === '') {
      throw new Error('O título do evento é obrigatório');
    }
    
    if (!cleanPayload.data || cleanPayload.data.trim() === '') {
      throw new Error('A data do evento é obrigatória');
    }
    
    if (!cleanPayload.usuarioId || cleanPayload.usuarioId.trim() === '') {
      throw new Error('O ID do usuário é obrigatório. Faça login novamente.');
    }
    
    // Validar formato do usuarioId (deve ser string não vazia)
    if (typeof cleanPayload.usuarioId !== 'string' || cleanPayload.usuarioId.trim() === '') {
      throw new Error(`usuarioId inválido: deve ser uma string não vazia. Recebido: ${cleanPayload.usuarioId} (tipo: ${typeof cleanPayload.usuarioId})`);
    }
    
    const result = await fetchWithLogging(url, "POST", cleanPayload, false);
    
    console.log(`✅ [EVENTOS] Evento criado com sucesso! Resposta:`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [EVENTOS] Erro ao criar evento:`, error);
    console.error(`❌ [EVENTOS] Mensagem de erro:`, error?.message);
    console.error(`❌ [EVENTOS] Payload original:`, JSON.stringify(payload, null, 2));
    console.error(`❌ [EVENTOS] Stack trace:`, error?.stack);
    throw error;
  }
}

/**
 * ✅ Listar Eventos por Usuário
 * Endpoint: GET /api/eventos/all/{usuarioId}
 * Documentação: Lista todos os eventos de um usuário
 * Path Parameter: usuarioId - ID do usuário
 * Resposta: Array de eventos
 */
export async function getEventosByUsuario(usuarioId: string) {
  const url = `${BASE_URL}/api/eventos/all/${usuarioId}`;
  
  try {
    console.log(`🔄 [EVENTOS] Buscando eventos do usuário ${usuarioId} em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ [EVENTOS] Eventos buscados com sucesso! Total: ${Array.isArray(result) ? result.length : 'N/A'}`);
    return result;
  } catch (error: any) {
    console.error(`❌ [EVENTOS] Erro ao buscar eventos:`, error);
    throw error;
  }
}

/**
 * ✅ Listar todos os eventos (mantido para compatibilidade)
 * Nota: A API não tem endpoint para listar todos, apenas por usuário
 * Esta função pode ser usada se você tiver o usuarioId
 */
export async function getAllEventos(usuarioId?: string) {
  if (!usuarioId) {
    throw new Error("Para listar eventos, é necessário fornecer o usuarioId. Use getEventosByUsuario(usuarioId)");
  }
  return getEventosByUsuario(usuarioId);
}

/**
 * ✅ Buscar Evento por ID
 * Endpoint: GET /api/eventos/{id}
 * Documentação: Busca um evento específico pelo ID
 * Path Parameter: id - ID do evento no Firebase
 * Resposta: JSON com dados do evento
 */
export async function getEventoById(id: string) {
  const url = `${BASE_URL}/api/eventos/${id}`;
  
  try {
    console.log(`🔄 [EVENTOS] Buscando evento ${id} em: ${url}`);
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ [EVENTOS] Evento ${id} buscado com sucesso!`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [EVENTOS] Erro ao buscar evento ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Atualizar evento
 * Nota: A documentação não menciona endpoint de atualização
 * Mantido para compatibilidade, mas pode não estar disponível na API
 */
export async function updateEvento(id: string, payload: EventoPayload) {
  const url = `${BASE_URL}/api/eventos/${id}`;
  
  try {
    console.log(`🔄 [EVENTOS] Atualizando evento ${id} em: ${url}`);
    console.log(`📤 [EVENTOS] Payload:`, JSON.stringify(payload, null, 2));
    const result = await fetchWithLogging(url, "PUT", payload, false);
    console.log(`✅ [EVENTOS] Evento ${id} atualizado com sucesso!`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [EVENTOS] Erro ao atualizar evento ${id}:`, error);
    throw error;
  }
}

/**
 * ✅ Deletar Evento
 * Endpoint: DELETE /api/eventos/{id}
 * Documentação: Remove um evento da agenda
 * Path Parameter: id - ID do evento no Firebase
 * Resposta: Boolean (true se deletado)
 */
export async function deleteEvento(id: string) {
  const url = `${BASE_URL}/api/eventos/${id}`;
  
  try {
    console.log(`🔄 [EVENTOS] Deletando evento ${id} em: ${url}`);
    const result = await fetchWithLogging(url, "DELETE", undefined, false);
    console.log(`✅ [EVENTOS] Evento ${id} deletado com sucesso! Resposta:`, result);
    return result;
  } catch (error: any) {
    console.error(`❌ [EVENTOS] Erro ao deletar evento ${id}:`, error);
    throw error;
  }
}

// ✅ Objeto usado pelos componentes
export const eventosApi = {
  create: createEvento,
  getAll: getAllEventos,
  getByUsuario: getEventosByUsuario,
  getById: getEventoById,
  update: updateEvento,
  delete: deleteEvento,
};

