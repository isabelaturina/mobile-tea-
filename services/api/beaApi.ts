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
      useSimulation: API_CONFIG.BEA.USE_SIMULATION,
    });
  }

  async sendMessage(request: BeaChatRequest): Promise<BeaResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(`${this.baseUrl}${this.chatEndpoint}`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          // ❌ SEM API KEY AQUI - fica no backend!
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.message || data.response || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date().toISOString(),
        success: true,
      };
    } catch (error) {
      console.error('Erro ao chamar API da Bea:', error);
      
      // Retorna uma resposta de fallback em caso de erro
      return {
        message: 'Desculpe, estou com problemas técnicos no momento. Tente novamente em alguns instantes.',
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Método para simular a API quando não estiver disponível
  async simulateBeaResponse(userMessage: string): Promise<BeaResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Respostas simuladas baseadas em palavras-chave
    const responses = [
      "Olá! Como posso te ajudar hoje?",
      "Entendo sua preocupação. Vamos trabalhar juntos para resolver isso.",
      "Que bom que você está cuidando da sua saúde mental!",
      "Posso te ajudar com algumas estratégias para lidar com essa situação.",
      "É importante você se sentir apoiada. Estou aqui para te ouvir.",
      "Vamos quebrar isso em pequenos passos para ficar mais fácil.",
      "Você está fazendo muito bem ao buscar ajuda.",
      "Que tal tentarmos algumas técnicas de relaxamento?",
      "Lembre-se: é normal ter dias difíceis. O importante é não desistir.",
      "Posso te sugerir algumas atividades que podem te ajudar a se sentir melhor."
    ];

    // Resposta inteligente baseada no conteúdo da mensagem
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    if (userMessage.toLowerCase().includes('ansiedade') || userMessage.toLowerCase().includes('ansioso')) {
      response = "Entendo que você está se sentindo ansiosa. Vamos tentar algumas técnicas de respiração. Inspire profundamente por 4 segundos, segure por 4 segundos e expire por 6 segundos. Repita isso algumas vezes.";
    } else if (userMessage.toLowerCase().includes('triste') || userMessage.toLowerCase().includes('deprimida')) {
      response = "Sinto muito que você esteja se sentindo assim. É importante lembrar que sentimentos difíceis são temporários. Que tal tentarmos fazer algo que você gosta hoje?";
    } else if (userMessage.toLowerCase().includes('estresse') || userMessage.toLowerCase().includes('estressada')) {
      response = "O estresse pode ser muito desgastante. Vamos tentar identificar uma pequena coisa que você pode fazer hoje para se cuidar. Que tal uma caminhada curta ou ouvir uma música que você gosta?";
    } else if (userMessage.toLowerCase().includes('obrigada') || userMessage.toLowerCase().includes('obrigado')) {
      response = "De nada! É um prazer poder te ajudar. Estou sempre aqui quando precisar conversar.";
    } else if (userMessage.toLowerCase().includes('oi') || userMessage.toLowerCase().includes('olá')) {
      response = "Oi! Como você está se sentindo hoje? Estou aqui para te apoiar no que precisar.";
    }

    return {
      message: response,
      timestamp: new Date().toISOString(),
      success: true,
    };
  }

  // Método principal que tenta usar a API real, mas usa simulação se falhar
  async getBeaResponse(message: string, conversationHistory: BeaMessage[] = []): Promise<BeaResponse> {
    // Se estiver em modo de simulação, usa a simulação
    if (API_CONFIG.BEA.USE_SIMULATION) {
      console.log('Usando simulação da Bea');
      return this.simulateBeaResponse(message);
    }

    // Tenta usar a API real
    try {
      return await this.sendMessage({ message, conversation_history: conversationHistory });
    } catch (error) {
      console.warn('Erro na API real, usando simulação:', error);
      return this.simulateBeaResponse(message);
    }
  }
}

export const beaApiService = new BeaApiService();
