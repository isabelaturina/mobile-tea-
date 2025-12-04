export const ENV_CONFIG = {
  BEA_API_URL: "https://chatbea.onrender.com", // APENAS a base URL
};

export const API_CONFIG = {
  TIMEOUT: 15000,

  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    // Adicione headers de autenticação se necessário
    // "Authorization": "Bearer seu-token-aqui"
  },

  BEA: {
    ENDPOINTS: {
      CHAT: "/api/chat", // endpoint completo relativo à base URL
    },

    USE_SIMULATION: false, // MUDE para false para usar a API real
  },
};