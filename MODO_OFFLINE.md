# 📱 Modo Offline Local - Sem Backend e Sem IP!

Agora você pode usar o aplicativo **completamente offline** para cadastro e login, sem precisar configurar IP ou ter um backend rodando!

## ✅ Como Funciona

O aplicativo agora tem um **sistema de autenticação local** que salva tudo diretamente no dispositivo usando AsyncStorage. Isso significa:

- ✅ **Não precisa de backend rodando**
- ✅ **Não precisa configurar IP**
- ✅ **Funciona offline completamente**
- ✅ **Dados salvos localmente no celular**

## ⚙️ Como Ativar o Modo Offline

### Opção 1: Modo Offline Sempre Ativo (Recomendado)

1. Abra o arquivo `contexts/UserContext.tsx`
2. Encontre a linha:
   ```typescript
   const USE_OFFLINE_MODE = true; // Altere para false para usar sempre o backend
   ```
3. Certifique-se de que está `true`

**Pronto!** Agora o cadastro e login funcionam 100% offline, sem precisar de backend ou IP.

### Opção 2: Modo Híbrido (Tenta Backend, se Falhar usa Offline)

1. Deixe `USE_OFFLINE_MODE = false`
2. Configure `USE_LOCAL_BACKEND = true` em `services/config/apiConfig.ts`
3. Se o backend não estiver disponível, o app automaticamente usa o modo offline

## 🚀 Como Usar

### Cadastro Offline

1. Abra o app
2. Vá para a tela de **Cadastro (SignUp)**
3. Preencha os dados normalmente:
   - Nome
   - Email
   - Senha
   - Nível de suporte
4. Clique em **Criar Conta**

✅ O usuário será salvo **localmente no dispositivo** - não precisa de internet ou backend!

### Login Offline

1. Vá para a tela de **Login**
2. Digite o email e senha que você cadastrou
3. Clique em **Entrar**

✅ Você será autenticado usando os dados salvos localmente!

## 📋 Vantagens do Modo Offline

- ✅ **Funciona sem internet** - tudo salvo no celular
- ✅ **Sem configuração de IP** - não precisa descobrir o IP da máquina
- ✅ **Sem backend** - não precisa ter servidor rodando
- ✅ **Rápido** - não depende de conexão de rede
- ✅ **Ideal para desenvolvimento** - teste rapidamente sem configuração

## ⚠️ Limitações

- Os dados ficam **apenas no dispositivo** - se você desinstalar o app, perde tudo
- **Não sincroniza** entre dispositivos
- Usado principalmente para **desenvolvimento e testes locais**

## 🔄 Alternar entre Modo Offline e Backend

Para voltar a usar o backend remoto:

1. Abra `contexts/UserContext.tsx`
2. Altere:
   ```typescript
   const USE_OFFLINE_MODE = false; // Desativa modo offline
   ```
3. Abra `services/config/apiConfig.ts`
4. Altere:
   ```typescript
   const USE_LOCAL_BACKEND = false; // Usa backend remoto
   ```

## 🧹 Limpar Dados Locais

Se quiser limpar todos os usuários cadastrados localmente, você pode criar uma função de limpeza. Os dados estão salvos no AsyncStorage com as chaves:

- `@mobile_tea:local_users` - Lista de usuários
- `@mobile_tea:current_user` - Usuário atual logado
- `@mobile_tea:session_token` - Token de sessão

## 💡 Dicas

1. **Para desenvolvimento:** Use `USE_OFFLINE_MODE = true` - é muito mais rápido!
2. **Para testes locais:** Use modo offline para testar rapidamente sem configurar backend
3. **Para produção:** Use o backend remoto (`USE_OFFLINE_MODE = false`)

## 📝 Exemplo de Uso

```typescript
// No UserContext.tsx - modo offline ativado
const USE_OFFLINE_MODE = true; // ✅ Cadastro/Login offline

// Quando você cadastrar:
// - Dados salvos em: AsyncStorage
// - Não precisa de backend
// - Funciona offline

// Quando você fizer login:
// - Verifica dados no AsyncStorage
// - Não precisa de internet
// - Autenticação local
```

---

**Pronto!** Agora você pode usar o app completamente offline para cadastro e login, sem precisar configurar IP ou ter backend rodando! 🎉
