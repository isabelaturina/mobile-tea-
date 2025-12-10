import axios from "axios";

// ✅ URL corrigida conforme documentação
const BASE_URL = "https://api-tea-comunicacao.onrender.com";

/**
 * ✅ Buscar Mensagens - Endpoint: GET /api/chat/mensagens
 * Conforme documentação: Lista todas as mensagens do chat
 * Resposta: JSON com array de mensagens
 */
export const getGroupMessages = async () => {
  try {
    const url = `${BASE_URL}/api/chat/mensagens`;
    console.log(`🔄 [CHAT GRUPO] Buscando mensagens em: ${url}`);
    
    const response = await axios.get(url, { 
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`✅ [CHAT GRUPO] Mensagens recebidas:`, response.data);
    
    // A API retorna diretamente um array de mensagens ou { data: [...] }
    // Normaliza para sempre retornar { data: [...] }
    if (Array.isArray(response.data)) {
      return { data: response.data };
    }
    
    return response.data;
  } catch (error: any) {
    console.error("❌ [CHAT GRUPO] Erro ao buscar mensagens:", error);
    console.error("❌ [CHAT GRUPO] URL:", `${BASE_URL}/api/chat/mensagens`);
    console.error("❌ [CHAT GRUPO] Erro completo:", error?.response?.data || error?.message || error);
    throw error;
  }
};

/**
 * ✅ Enviar Mensagem via REST - Endpoint: POST /api/chat/enviar
 * Conforme documentação: Envia uma mensagem através da API REST
 * Body: JSON com texto, usuario e userId
 * Resposta: JSON com status, firebase_id e dados da mensagem
 */
export const sendGroupMessage = async ({ 
  texto, 
  usuario, 
  userId 
}: { 
  texto: string; 
  usuario: string; 
  userId: string; 
}) => {
  try {
    const url = `${BASE_URL}/api/chat/enviar`;
    const payload = { texto, usuario, userId };
    
    console.log(`🔄 [CHAT GRUPO] Enviando mensagem para: ${url}`);
    console.log(`📤 [CHAT GRUPO] Payload:`, payload);
    
    const response = await axios.post(
      url,
      payload,
      { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log(`✅ [CHAT GRUPO] Mensagem enviada com sucesso:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ [CHAT GRUPO] Erro ao enviar mensagem:", error);
    console.error("❌ [CHAT GRUPO] URL:", `${BASE_URL}/api/chat/enviar`);
    console.error("❌ [CHAT GRUPO] Payload enviado:", { texto, usuario, userId });
    console.error("❌ [CHAT GRUPO] Erro completo:", error?.response?.data || error?.message || error);
    throw error;
  }
};