# Integração com a API da Bea - IA Virtual

## Visão Geral

O aplicativo Tea agora possui integração completa com a API da Bea, uma assistente virtual especializada em apoio emocional e saúde mental.

## Arquivos Principais

### 1. `services/beaApi.ts`
Serviço principal para comunicação com a API da Bea:
- Gerencia requisições HTTP
- Implementa fallback para modo simulação
- Trata erros e timeouts
- Mantém histórico de conversas

### 2. `config/api.ts`
Configurações centralizadas da API:
- URLs da API
- Timeouts e retries
- Headers padrão
- Modo de desenvolvimento/produção

### 3. `app/ChatBea.tsx`
Interface do chat atualizada:
- Estados de loading e erro
- Indicador de "digitando"
- Scroll automático
- Timestamps das mensagens
- UI melhorada com bubbles de mensagem

## Configuração

### Modo Desenvolvimento (Atual)
```typescript
// config/api.ts
export const API_CONFIG = {
  USE_SIMULATION: true, // Usa respostas simuladas
  BEA_API_URL: 'https://api-bea.exemplo.com',
};
```

### Modo Produção
```typescript
// config/api.ts
export const API_CONFIG = {
  USE_SIMULATION: false, // Usa API real
  BEA_API_URL: 'https://sua-api-real.com',
};

// Variáveis de ambiente
export const ENV_CONFIG = {
  BEA_API_KEY: 'sua-api-key-aqui',
};
```

## Funcionalidades Implementadas

### ✅ Chat em Tempo Real
- Envio de mensagens
- Respostas da Bea
- Histórico de conversa
- Scroll automático

### ✅ Estados de Loading
- Indicador "Bea está digitando..."
- Botão de envio desabilitado durante loading
- Spinner no botão de envio

### ✅ Tratamento de Erros
- Fallback para modo simulação
- Alertas de erro para o usuário
- Mensagens de erro amigáveis
- Timeout de requisições

### ✅ UI/UX Melhorada
- Bubbles de mensagem estilizados
- Timestamps nas mensagens
- Avatar da Bea
- Cores diferenciadas para usuário/Bea
- Input multiline com limite de caracteres

### ✅ Simulação Inteligente
- Respostas baseadas em palavras-chave
- Delay realista de rede
- Respostas contextuais para:
  - Ansiedade
  - Tristeza/depressão
  - Estresse
  - Saudações
  - Agradecimentos

## Como Testar

1. **Modo Simulação (Atual)**:
   - Abra o chat da Bea
   - Digite mensagens como "estou ansiosa", "me sinto triste", etc.
   - Observe as respostas contextuais da Bea

2. **Modo Produção**:
   - Configure `USE_SIMULATION: false` em `config/api.ts`
   - Adicione sua API key real
   - Configure a URL da API real
   - Teste com mensagens reais

## Próximos Passos

1. **Integração com API Real**:
   - Obter URL e API key da API da Bea
   - Configurar variáveis de ambiente
   - Testar em ambiente de produção

2. **Melhorias Futuras**:
   - Persistência do histórico de conversas
   - Suporte a mídia (imagens, áudios)
   - Integração com contexto do usuário
   - Análise de sentimento das mensagens

## Estrutura da API Esperada

```typescript
// Request
{
  "message": "string",
  "conversation_history": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "user_context": {
    "name": "string",
    "preferences": {}
  }
}

// Response
{
  "message": "string",
  "timestamp": "string",
  "success": boolean,
  "error": "string" // opcional
}
```

## Troubleshooting

### Erro: "Cannot find module '../services/beaApi'"
- Verifique se o arquivo `services/beaApi.ts` existe
- Confirme se o caminho de importação está correto

### Erro: "API key not found"
- Configure a variável `BEA_API_KEY` nas variáveis de ambiente
- Ou use o modo simulação (`USE_SIMULATION: true`)

### Respostas não aparecem
- Verifique o console para logs de erro
- Confirme se a URL da API está correta
- Teste com modo simulação primeiro

