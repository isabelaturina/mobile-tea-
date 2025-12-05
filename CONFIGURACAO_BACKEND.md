# 🔧 Configuração do Backend Local

Este guia explica como configurar o aplicativo para funcionar com o backend local.

## 📍 Como Configurar

### 1. Configuração Básica

O arquivo de configuração está em `services/config/apiConfig.ts`. Por padrão, ele está configurado para usar o backend local.

```typescript
// Para usar backend LOCAL (desenvolvimento)
const USE_LOCAL_BACKEND = true;

// Para usar backend REMOTO (produção)
const USE_LOCAL_BACKEND = false;
```

### 2. Configurar a Porta do Backend

Se o seu backend local estiver rodando em uma porta diferente de 3000, altere a constante `LOCAL_BACKEND_PORT`:

```typescript
const LOCAL_BACKEND_PORT = 3000; // Altere para a porta do seu backend
```

### 3. Configurações por Plataforma

#### 📱 Android Emulator
O aplicativo já está configurado para usar `10.0.2.2` que é o endereço especial do Android Emulator para acessar o localhost da sua máquina.

#### 🍎 iOS Simulator
O iOS Simulator usa `localhost` normalmente.

#### 📱 Dispositivo Físico
Para usar um dispositivo físico (Android ou iOS), você precisa:

1. **Descobrir o IP da sua máquina na rede local:**
   - Windows: Execute `ipconfig` no terminal e procure por "IPv4 Address"
   - Mac/Linux: Execute `ifconfig` ou `ip addr show`

2. **Editar o arquivo `services/config/apiConfig.ts`:**
   - Descomente a linha para dispositivo físico
   - Substitua `SEU_IP_LOCAL` pelo IP encontrado
   - Exemplo: `http://192.168.1.100:3000`

```typescript
// Para dispositivo físico, descomente e use:
return `http://192.168.1.100:${LOCAL_BACKEND_PORT}`;
```

⚠️ **Importante:** Certifique-se de que o dispositivo e a máquina estão na mesma rede Wi-Fi.

## 🚀 Como Usar

### Passo 1: Inicie o Backend Local

Certifique-se de que o backend está rodando na porta configurada (padrão: 3000):

```bash
# Exemplo - ajuste conforme seu backend
cd caminho/do/seu/backend
npm start
# ou
node server.js
```

O backend deve estar acessível em:
- `http://localhost:3000` (na máquina)
- `http://10.0.2.2:3000` (do Android Emulator)
- `http://SEU_IP:3000` (do dispositivo físico)

### Passo 2: Verifique a Configuração

O aplicativo mostrará no console a URL que está sendo usada:

```
🔧 Configuração da API: {
  baseUrl: "http://10.0.2.2:3000",
  useLocal: true,
  platform: "android",
  isDev: true
}
```

### Passo 3: Teste o Cadastro e Login

Agora você pode testar o cadastro e login. As requisições serão feitas para o backend local.

## 🔍 Solução de Problemas

### Erro: "Não foi possível conectar ao backend local"

1. **Verifique se o backend está rodando:**
   - Abra o navegador e acesse `http://localhost:3000`
   - Se não carregar, o backend não está rodando

2. **Verifique a porta:**
   - Confirme que o backend está na porta configurada em `apiConfig.ts`

3. **Para Android Emulator:**
   - Certifique-se de usar `10.0.2.2` (não `localhost`)
   - Verifique se não há firewall bloqueando

4. **Para dispositivo físico:**
   - Verifique se o IP está correto
   - Certifique-se de que ambos estão na mesma rede Wi-Fi
   - Desative o firewall temporariamente para testar

### Erro: "Network request failed"

- Verifique sua conexão de internet
- Para backend local, não precisa de internet, mas precisa da mesma rede Wi-Fi (dispositivo físico)
- Verifique se o backend está rodando e acessível

### Backend não responde

1. Verifique os logs do backend
2. Confirme que as rotas `/api/auth/register` e `/api/auth/login` existem
3. Teste o backend manualmente usando Postman ou curl:

```bash
# Teste de cadastro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@gmail.com",
    "senha": "123456",
    "nivelSuporte": "leve"
  }'

# Teste de login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@gmail.com",
    "password": "123456"
  }'
```

## 🔄 Alternar entre Local e Remoto

Para alternar entre backend local e remoto, edite `services/config/apiConfig.ts`:

```typescript
// Backend LOCAL (desenvolvimento)
const USE_LOCAL_BACKEND = true;

// Backend REMOTO (produção)
const USE_LOCAL_BACKEND = false;
```

Após alterar, reinicie o aplicativo para aplicar as mudanças.

## 📝 Estrutura Esperada do Backend

O frontend espera que o backend tenha os seguintes endpoints:

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter dados do usuário autenticado
- `GET /api/auth/validate-token` - Validar token
- `POST /api/auth/forgot-password` - Recuperar senha
- `POST /api/auth/reset-password` - Redefinir senha

### Payload de Cadastro:
```json
{
  "nome": "string",
  "email": "string",
  "senha": "string",
  "nivelSuporte": "leve" | "moderado" | "severo"
}
```

### Payload de Login:
```json
{
  "email": "string",
  "password": "string"
}
```

## ✅ Checklist

- [ ] Backend está rodando na porta configurada
- [ ] `USE_LOCAL_BACKEND = true` em `apiConfig.ts`
- [ ] Porta configurada corretamente
- [ ] Para dispositivo físico: IP configurado e na mesma rede
- [ ] Backend acessível via navegador/teste manual
- [ ] Aplicativo reiniciado após mudanças

---

💡 **Dica:** Mantenha `USE_LOCAL_BACKEND = false` quando for fazer build para produção!
