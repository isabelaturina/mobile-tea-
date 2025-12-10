import { Platform } from 'react-native';

/**
 * Configuração da API - Permite alternar entre ambiente local e produção
 */

// ⚙️ CONFIGURAÇÃO - Altere para true para usar backend local
const USE_LOCAL_BACKEND = false;

// 🌐 URLs de configuração
const LOCAL_BACKEND_PORT = 8080; // Porta padrão do backend local (altere se necessário)
const PRODUCTION_URL = "https://api-auth-tea.onrender.com";

/**
 * Obtém a URL base da API baseado na configuração
 * 
 * Para React Native:
 * - Android Emulator: usa 10.0.2.2 para acessar localhost da máquina
 * - iOS Simulator: usa localhost normalmente
 * - Dispositivo físico: use o IP da sua máquina na rede local (ex: 192.168.1.100)
 */
function getBaseUrl(): string {
  if (!USE_LOCAL_BACKEND) {
    return PRODUCTION_URL;
  }

  // Backend local
  if (__DEV__) {
    // Para Android Emulator, use 10.0.2.2 em vez de localhost
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${LOCAL_BACKEND_PORT}`;
    }
    
    // Para iOS Simulator ou Web, use localhost
    if (Platform.OS === 'ios' || Platform.OS === 'web') {
      return `http://localhost:${LOCAL_BACKEND_PORT}`;
    }
  }

  // Para dispositivo físico Android/iOS, você precisa usar o IP da sua máquina
  // Exemplo: return 'http://192.168.1.100:3000';
  // Descomente a linha abaixo e substitua pelo IP da sua máquina na rede local
  // return `http://SEU_IP_LOCAL:${LOCAL_BACKEND_PORT}`;
  
  // Fallback para desenvolvimento
  return `http://localhost:${LOCAL_BACKEND_PORT}`;
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  USE_LOCAL: USE_LOCAL_BACKEND,
  PORT: LOCAL_BACKEND_PORT,
};

// Log para debug
console.log('🔧 Configuração da API:', {
  baseUrl: API_CONFIG.BASE_URL,
  useLocal: API_CONFIG.USE_LOCAL,
  platform: Platform.OS,
  isDev: __DEV__,
});
