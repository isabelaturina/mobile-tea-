const BASE_URL = "https://api-de-localizacao-1.onrender.com/api/clinicas/proximas";

// Coordenadas fixas de São Paulo
const SAO_PAULO_LAT = -23.5505;
const SAO_PAULO_LNG = -46.6333;
const RAIO_PADRAO = 10000;

/**
 * Tipos para Clínicas
 */
export type Clinica = {
  id?: number;
  nome: string;
  endereco: string;
  imagemUrl?: string;
  horario?: string;
  especialidade?: string;
  distancia?: number; // em metros
  latitude?: number;
  longitude?: number;
};

export type BuscarClinicasParams = {
  lat?: number; // Opcional, usa São Paulo por padrão
  lng?: number; // Opcional, usa São Paulo por padrão
  raioEmMetros?: number; // default: 10000
};

async function handleResponse(res: Response, url: string, method: string) {
  const status = res.status;
  const statusText = res.statusText;
  const raw = await res.text();
  let parsed: any = raw;

  console.log(`[clinicas] 📄 Resposta raw (primeiros 500 chars):`, raw.substring(0, 500));

  try {
    parsed = raw ? JSON.parse(raw) : null;
    console.log(`[clinicas] ✅ JSON parseado com sucesso`);
  } catch (parseError) {
    console.error(`[clinicas] ⚠️ Erro ao fazer parse do JSON:`, parseError);
    console.log(`[clinicas] ⚠️ Raw completo:`, raw);
    // mantém raw como string se não for JSON
  }

  console.log(`[clinicas] 📊 ${method} ${url} -> status ${status} ${statusText}`, {
    parsedType: typeof parsed,
    isArray: Array.isArray(parsed),
    parsedKeys: parsed && typeof parsed === 'object' ? Object.keys(parsed) : 'N/A',
    parsed,
    rawLength: raw?.length,
  });

  if (!res.ok) {
    const bodySnippet =
      typeof parsed === "object" ? JSON.stringify(parsed) : raw;

    const message =
      bodySnippet && bodySnippet.length
        ? `${status} ${statusText}: ${bodySnippet}`
        : `${status} ${statusText}`;

    console.error(`[clinicas] ❌ Erro na resposta:`, message);
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
      "Accept": "application/json",
    };

    // Se precisar de autenticação, adicionar token aqui no futuro
    // if (requiresAuth && token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    console.log(`[clinicas] 🔄 Fazendo requisição ${method} para ${url}`);
    if (body) {
      console.log(`[clinicas] Body:`, JSON.stringify(body, null, 2));
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`[clinicas] 📥 Resposta recebida:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries()),
    });

    return await handleResponse(res, url, method);
  } catch (err: any) {
    console.error(
      `[clinicas] ❌ network/error for ${method} ${url}:`,
      err?.message || err
    );
    console.error(`[clinicas] ❌ Erro completo:`, err);
    console.error(`[clinicas] ❌ Stack:`, err?.stack);
    
    // Melhorar mensagem de erro
    if (err.message?.includes("Network request failed") || err.message?.includes("Failed to fetch")) {
      throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
    }
    
    throw err;
  }
}

/**
 * ✅ Buscar clínicas próximas
 * Endpoint: GET /api/clinicas/proximas?lat={lat}&lng={lng}&raioEmMetros={raio}
 * Usa coordenadas fixas de São Paulo por padrão
 */
export async function buscarClinicasProximas(params: BuscarClinicasParams = {}): Promise<Clinica[]> {
  // Usa coordenadas de São Paulo por padrão
  const lat = params.lat ?? SAO_PAULO_LAT;
  const lng = params.lng ?? SAO_PAULO_LNG;
  const raioEmMetros = params.raioEmMetros ?? RAIO_PADRAO;
  
  const url = `${BASE_URL}?lat=${lat}&lng=${lng}&raioEmMetros=${raioEmMetros}`;
  
  try {
    console.log(`🔄 Buscando clínicas próximas em: ${url}`, { lat, lng, raioEmMetros });
    const result = await fetchWithLogging(url, "GET", undefined, false);
    console.log(`✅ Clínicas próximas buscadas com sucesso`);
    console.log(`📦 Tipo do resultado:`, typeof result);
    console.log(`📦 É array?`, Array.isArray(result));
    console.log(`📦 Resultado completo:`, JSON.stringify(result, null, 2));
    
    // A API retorna { body: [...], statusCode: "OK" }
    if (result && typeof result === 'object') {
      // Verifica se tem o campo 'body' com o array de clínicas
      if ('body' in result && Array.isArray(result.body)) {
        console.log(`✅ Encontrado array em 'body' com ${result.body.length} clínicas`);
        // Mapeia os dados da API para o formato esperado
        return result.body.map((item: any) => ({
          nome: item.nome || item.name || "Clínica sem nome",
          endereco: item.rua || item.endereco || item.address || "Endereço não informado",
          imagemUrl: item.imagemUrl || item.imagem,
          horario: item.horario,
          especialidade: item.especialidade,
          distancia: item.distancia,
          latitude: item.latitude,
          longitude: item.longitude,
        }));
      }
      // Se a resposta for diretamente um array
      if (Array.isArray(result)) {
        console.log(`✅ Retornando array com ${result.length} clínicas`);
        return result.map((item: any) => ({
          nome: item.nome || item.name || "Clínica sem nome",
          endereco: item.rua || item.endereco || item.address || "Endereço não informado",
          imagemUrl: item.imagemUrl || item.imagem,
          horario: item.horario,
          especialidade: item.especialidade,
          distancia: item.distancia,
          latitude: item.latitude,
          longitude: item.longitude,
        }));
      }
      // Verifica outras possibilidades de estrutura
      if ('data' in result && Array.isArray(result.data)) {
        console.log(`✅ Encontrado array em 'data' com ${result.data.length} clínicas`);
        return result.data;
      }
      if ('clinicas' in result && Array.isArray(result.clinicas)) {
        console.log(`✅ Encontrado array em 'clinicas' com ${result.clinicas.length} clínicas`);
        return result.clinicas;
      }
      if ('content' in result && Array.isArray(result.content)) {
        console.log(`✅ Encontrado array em 'content' com ${result.content.length} clínicas`);
        return result.content;
      }
    }
    console.log(`⚠️ Resultado vazio ou inválido, retornando array vazio`);
    return [];
  } catch (error: any) {
    console.error("🔴 Erro ao buscar clínicas próximas:", error);
    throw error;
  }
}

// ✅ Objeto usado pelos componentes
export const clinicasApi = {
  buscarProximas: buscarClinicasProximas,
};

