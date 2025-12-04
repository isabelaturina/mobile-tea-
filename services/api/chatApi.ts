import axios from 'axios';
import { API } from '../beaConfig';

// Criar instância do Axios com a URL base
const chatApiClient = axios.create({
  baseURL: API,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Envia mensagem para o chat Bea
 * @param message - Mensagem do usuário
 * @returns Resposta da API (texto)
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await chatApiClient.post('/chat', {
      message: message.trim(),
    });

    // Sua API retorna uma string pura, então tratamos a resposta diretamente
    const responseText = typeof response.data === 'string' 
      ? response.data 
      : response.data.toString();

    return responseText && responseText.trim() !== ''
      ? responseText
      : 'Desculpe, não consegui entender sua pergunta. Pode tentar reformular?';
  } catch (error) {
    // Tratamento de erros com mensagens mais descritivas
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status de erro
        throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Sem resposta do servidor. Verifique sua conexão.');
      }
    }
    throw error;
  }
};
