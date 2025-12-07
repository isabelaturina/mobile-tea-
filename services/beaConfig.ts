export const API = "https://chatbea.onrender.com";

// Configuração para Bea API
export const ENV_CONFIG = {
  BEA_API_URL: "https://chatbea.onrender.com",
};

export const API_CONFIG = {
  BEA: {
    ENDPOINTS: {
      CHAT: "/chat", // Endpoint para chat
    },
    USE_SIMULATION: false, // Altere para true para usar simulação
  },
  TIMEOUT: 30000, // 30 segundos
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};
