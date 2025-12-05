# 📝 Configuração da API de Diário

## ✅ URL da API

A API de diário está configurada para usar:

```
https://diario-api-fzvz.onrender.com
```

## 🔧 Endpoints do Backend

Baseado no seu `DiarioController`, os endpoints são:

### 1. **Criar Anotação** - `POST /diario/salvar`
```typescript
await diarioApi.create({
  data: "2024-01-15",
  humor: "feliz",
  anotacao: "Minha anotação aqui"
});
```

### 2. **Listar Todas as Anotações** - `GET /diario/listar`
```typescript
const anotacoes = await diarioApi.getAll();
```

### 3. **Buscar por ID** - Usa `getAll()` e filtra
```typescript
// Nota: O backend não tem endpoint específico para buscar por ID
// A função getAllDiarios() busca todas e filtra localmente
const anotacao = await diarioApi.getById("id-da-anotacao");
```

### 4. **Buscar por Data** - Usa `getAll()` e filtra
```typescript
// Nota: O backend não tem endpoint específico para buscar por data
// A função getAllDiarios() busca todas e filtra localmente
const anotacao = await diarioApi.getByDate("2024-01-15");
```

### 5. **Atualizar Anotação** - `PUT /diario/editar/{id}`
```typescript
await diarioApi.update("id-da-anotacao", {
  data: "2024-01-15",
  humor: "neutro",
  anotacao: "Anotação atualizada"
});
```

### 6. **Deletar Anotação** - `DELETE /diario/deletar/{id}`
```typescript
await diarioApi.delete("id-da-anotacao");
```

## 📋 Estrutura dos Dados

### Payload para Criar/Atualizar:

```typescript
{
  data: string;        // formato: YYYY-MM-DD (ex: "2024-01-15")
  humor: string;       // muito_feliz | feliz | neutro | triste | muito_triste | ansioso | irritado
  anotacao: string;    // Texto da anotação
}
```

### Exemplo:

```json
{
  "data": "2024-01-15",
  "humor": "feliz",
  "anotacao": "Hoje foi um dia muito produtivo!"
}
```

### Tipo Diario (Resposta):

```typescript
{
  id?: string;        // ID é String no backend
  data: string;
  humor: string;
  anotacao: string;
}
```

## 🔍 Como Usar no Componente AnotarDia

O componente `AnotarDia.tsx` já está configurado para usar a API:

```typescript
import { diarioApi } from "../services/api/diarioApi";

// Criar nova anotação
await diarioApi.create({
  data: "2024-01-15",
  humor: "feliz",
  anotacao: "Minha anotação aqui"
});
```

## ⚠️ Observações Importantes

1. **IDs são Strings**: O backend usa String para IDs, não números
2. **Busca por Data/ID**: Como o backend não tem endpoints específicos, a função busca todas as anotações e filtra localmente
3. **Estrutura do Controller**: 
   - Base path: `/diario`
   - Endpoints: `/salvar`, `/listar`, `/editar/{id}`, `/deletar/{id}`

## 🚀 Status

✅ **URL configurada**: `https://diario-api-fzvz.onrender.com`
✅ **Endpoints corretos**: Todos atualizados conforme o controller
✅ **Tipos ajustados**: ID agora é String
✅ **Logs detalhados**: Para facilitar debug

## 📝 Exemplo Completo

```typescript
import { diarioApi } from "../services/api/diarioApi";

// 1. Criar anotação
const resultado = await diarioApi.create({
  data: "2024-01-15",
  humor: "feliz",
  anotacao: "Hoje foi um ótimo dia!"
});

// 2. Listar todas
const todasAnotacoes = await diarioApi.getAll();

// 3. Buscar por data
const anotacaoHoje = await diarioApi.getByDate("2024-01-15");

// 4. Buscar por ID (se souber o ID)
const anotacao = await diarioApi.getById("id-da-anotacao");

// 5. Atualizar
await diarioApi.update("id-da-anotacao", {
  data: "2024-01-15",
  humor: "neutro",
  anotacao: "Anotação atualizada"
});

// 6. Deletar
await diarioApi.delete("id-da-anotacao");
```

## 🔍 Debug

Todos os requests incluem logs detalhados no console:
- `🔄 [DIARIO]` - Requisições sendo feitas
- `✅ [DIARIO]` - Sucesso
- `❌ [DIARIO]` - Erros

Verifique o console do React Native para ver os logs.

---

**API configurada e pronta para usar!** 🎉
