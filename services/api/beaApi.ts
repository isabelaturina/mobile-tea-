import { API_CONFIG, ENV_CONFIG } from '../beaConfig';

export interface BeaMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface BeaResponse {
  message: string;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface BeaChatRequest {
  message: string;
  conversation_history?: BeaMessage[];
  user_context?: {
    name?: string;
    preferences?: any;
  };
}

class BeaApiService {
  private baseUrl: string = ENV_CONFIG.BEA_API_URL;
  private chatEndpoint: string = API_CONFIG.BEA.ENDPOINTS.CHAT;

  constructor() {
    console.log('BeaApiService inicializado com:', {
      baseUrl: this.baseUrl,
      chatEndpoint: this.chatEndpoint,
      fullUrl: `${this.baseUrl}${this.chatEndpoint}`,
      useSimulation: API_CONFIG.BEA.USE_SIMULATION,
    });
  }

  async sendMessage(request: BeaChatRequest): Promise<BeaResponse> {
    // Se estiver em modo simulação, use a simulação
    if (API_CONFIG.BEA.USE_SIMULATION) {
      console.log('Modo simulação ativado');
      return this.simulateBeaResponse(request.message);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const fullUrl = `${this.baseUrl}${this.chatEndpoint}`;
      console.log('Enviando requisição para:', fullUrl);
      console.log('Payload:', JSON.stringify(request, null, 2));

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
        mode: 'cors', // Importante para APIs externas
      });

      clearTimeout(timeoutId);

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Não conseguiu parsear JSON de erro
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Resposta da API:', data);

      return {
        message: data.message || data.response || data.answer || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date().toISOString(),
        success: true,
      };
    } catch (error) {
      console.error('Erro ao chamar API da Bea:', error);
      
      // Se a API falhar, você pode:
      // 1. Lançar o erro para ser tratado no componente
      // 2. Retornar uma resposta de fallback
      // 3. Usar a simulação como fallback
      
      return {
        message: 'Desculpe, estou com problemas técnicos no momento. Tente novamente em alguns instantes.',
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Mantenha o método de simulação como fallback
  async simulateBeaResponse(userMessage: string): Promise<BeaResponse> {
    // ... (mantenha o código de simulação)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "Olá! Como posso te ajudar hoje?",
      // ... suas respostas simuladas
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      message: response,
      timestamp: new Date().toISOString(),
      success: true,
    };
  }

  // Método simplificado para uso no componente
  async getBeaResponse(message: string, conversationHistory: BeaMessage[] = []): Promise<BeaResponse> {
    const request: BeaChatRequest = {
      message,
      conversation_history: conversationHistory,
    };
    
    return await this.sendMessage(request);
  }
}

export const beaApiService = new BeaApiService();