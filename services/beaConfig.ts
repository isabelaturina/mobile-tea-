export const ENV_CONFIG = {
  BEA_API_URL: "https://chatbea.onrender.com/api/chat", // coloque o endereço real SE TIVER
};

export const API_CONFIG = {
  TIMEOUT: 15000,

  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  BEA: {
    ENDPOINTS: {
      CHAT: "/chat", // ajuste se sua API real usar outro endpoint
    },

    USE_SIMULATION: true, // deixa true até a API real existir
  },
};
