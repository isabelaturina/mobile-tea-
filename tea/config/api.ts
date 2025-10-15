// Configurações das APIs do app Tea
export const API_CONFIG = {
  // ===== API DA BEA (IA Virtual) =====
  BEA: {
    URL: 'http://192.168.15.141:8080', // IP da sua máquina
    ENDPOINTS: {
      CHAT: '/chat', // ou '/api/chat' dependendo da sua API
    },
    USE_SIMULATION: true, // true = simulação (para testar agora)
  },

  // ===== API DE USUÁRIOS (Login, Cadastro, etc.) =====
  USER: {
    URL: 'http://localhost:3000', // URL da API de usuários
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/user/profile',
    },
    USE_SIMULATION: true, // Por enquanto em simulação
  },

  // ===== API DE CRONOGRAMA (Eventos, Timers) =====
  CRONOGRAMA: {
    URL: 'http://localhost:4000', // URL da API de cronograma
    ENDPOINTS: {
      EVENTS: '/events',
      TIMERS: '/timers',
      SCHEDULE: '/schedule',
    },
    USE_SIMULATION: true, // Por enquanto em simulação
  },

  // ===== API DE NOTÍCIAS (Saúde Mental, Bem-estar) =====
  NEWS: {
    URL: 'http://localhost:5000', // URL da API de notícias
    ENDPOINTS: {
      LATEST: '/news/latest',
      CATEGORY: '/news/category',
      SEARCH: '/news/search',
      DETAIL: '/news/detail',
    },
    USE_SIMULATION: true, // Por enquanto em simulação
  },

  // ===== API DE CLÍNICAS PRÓXIMAS (Localização, Agendamento) =====
  CLINICS: {
    URL: 'http://localhost:6000', // URL da API de clínicas
    ENDPOINTS: {
      NEARBY: '/clinics/nearby',
      SEARCH: '/clinics/search',
      DETAILS: '/clinics/details',
      APPOINTMENT: '/clinics/appointment',
      SPECIALTIES: '/clinics/specialties',
    },
    USE_SIMULATION: true, // Por enquanto em simulação
  },

  // ===== CONFIGURAÇÕES GERAIS =====
  TIMEOUT: 30000, // 30 segundos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  
  // Headers padrão para todas as APIs
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Variáveis de ambiente (para produção)
export const ENV_CONFIG = {
  // URLs dos SEUS backends (não das APIs externas)
  BEA_API_URL: process.env.BEA_API_URL || API_CONFIG.BEA.URL,
  USER_API_URL: process.env.USER_API_URL || API_CONFIG.USER.URL,
  CRONOGRAMA_API_URL: process.env.CRONOGRAMA_API_URL || API_CONFIG.CRONOGRAMA.URL,
  NEWS_API_URL: process.env.NEWS_API_URL || API_CONFIG.NEWS.URL,
  CLINICS_API_URL: process.env.CLINICS_API_URL || API_CONFIG.CLINICS.URL,
  
  // NOTA: API Keys ficam no BACKEND, não no frontend!
  // Seu backend no IntelliJ deve ter as API keys das APIs externas
};
