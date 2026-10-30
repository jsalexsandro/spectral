# Spectral AI - Schema Documentation

## Database: PostgreSQL
Using DrizzleORM with NextAuth.js (Auth.js) adapter.

## Tables

### user
- `id` (text, PK) - CUID gerado automaticamente via @paralleldrive/cuid2
- `name` (text, nullable) - Nome exibido; editável (2–80 caracteres) em Configurações → Conta
- `nickname` (text, nullable) - Apelido opcional (até 40 caracteres); editável em Configurações → Conta. Vazio é salvo como `null`
- `email` (text, unique, nullable) - Somente leitura após o cadastro
- `emailVerified` (timestamp, nullable)
- `image` (text, nullable)
- `password` (text, nullable) - Hash scrypt no formato `scrypt:<salt>:<hash>`; nulo para contas apenas sociais
- `createdAt` (timestamp, not null) - Default: now()
- `updatedAt` (timestamp, not null) - Default: now(); atualizado em cada alteração de perfil (`PATCH /api/user`)

> Alterações de perfil (nome/apelido) são persistidas via `PATCH /api/user` e refletidas na sessão JWT.

### account
Armazena contas vinculadas para login social (Google, GitHub, Apple, etc.).
- `id` (text, PK) - CUID gerado automaticamente
- `userId` (text, FK -> user.id, cascade delete) - Indexado
- `type` (text) - Tipo de conta (oauth, email, etc.)
- `provider` (text) - Provedor (google, github, apple)
- `providerAccountId` (text) - ID da conta no provedor
- Unique index: (provider, providerAccountId)
- `refresh_token`, `access_token`, `id_token` (text, nullable)
- `expires_at` (integer, nullable)
- `token_type`, `scope`, `session_state` (text, nullable)

### session
- `sessionToken` (text, PK)
- `userId` (text, FK -> user.id, cascade delete)
- `expires` (timestamp, not null)

### AIKey
Chaves de API dos provedores de IA por usuário (BYOK). O valor em `apiKey` é armazenado criptografado (AES-256-GCM).
- `id` (text, PK) - CUID gerado automaticamente
- `userId` (text, FK -> user.id, cascade delete) - Indexado
- `provider` (text) - Identificador do provedor: `openai`, `anthropic`, `google` ou `openrouter`
- `apiKey` (text, not null) - Chave criptografada no formato `v1:<iv>:<tag>:<ciphertext>` (base64)
- `createdAt` (timestamp, not null) - Default: now()
- `updatedAt` (timestamp, not null) - Default: now(); atualizado em cada upsert
- Unique index: (userId, provider)

> A chave nunca é retornada pela API; a listagem expõe apenas o status e os 4 últimos caracteres, calculados no servidor.

### InstantModel
Preferência do usuário sobre quais modelos aparecem na seleção rápida do chat.
- `id` (text, PK) - CUID gerado automaticamente
- `userId` (text, FK -> user.id, cascade delete) - Indexado
- `provider` (text) - Identificador do provedor: `openai`, `anthropic`, `google` ou `openrouter`
- `modelId` (text) - ID do modelo no catálogo (`lib/ai/models.ts`)
- `enabled` (boolean, not null) - Default: `true`; `false` remove o modelo da seleção rápida
- `createdAt` (timestamp, not null) - Default: now()
- `updatedAt` (timestamp, not null) - Default: now(); atualizado em cada upsert
- Unique index: (userId, provider, modelId)

> A ausência de registro significa modelo ativo. O `PUT /api/instant-models` grava apenas overrides explícitos; registros de modelos removidos do catálogo são ignorados na leitura.

### MessageRole
Enum PostgreSQL com os valores `user`, `assistant` e `system`.

### Chat
Conversa do usuário. O `id` é gerado no cliente (UUID) para permitir o envio da primeira mensagem sem criar registros vazios, mas também aceita o CUID padrão do banco.
- `id` (text, PK) - UUID gerado no cliente ou CUID padrão
- `userId` (text, FK -> user.id, cascade delete)
- `title` (text, not null) - Default: `"Nova conversa"`; derivado da primeira mensagem do usuário
- `provider` (text, nullable) - Provedor do **último modelo usado** na conversa
- `model` (text, nullable) - ID do **último modelo usado** na conversa
- `createdAt` (timestamp, not null) - Default: now()
- `updatedAt` (timestamp, not null) - Default: now(); atualizado a cada nova mensagem
- Index: (userId, updatedAt)

### Message
Mensagem persistida de uma conversa.
- `id` (text, PK) - ID do `UIMessage` gerado pelo AI SDK
- `chatId` (text, FK -> Chat.id, cascade delete)
- `role` (MessageRole, not null) - `user`, `assistant` ou `system`
- `content` (text, not null) - Texto derivado da concatenação das partes de texto (usado para título e busca)
- `parts` (jsonb, not null) - Partes completas do `UIMessage` (`UIMessagePart[]`), preservando texto, raciocínio, ferramentas etc.
- `provider` (text, nullable) - Provedor do modelo que gerou a resposta (`assistant`)
- `model` (text, nullable) - ID do modelo que gerou a resposta (`assistant`)
- `promptVersion` (integer, nullable) - Versão do system prompt (`SYSTEM_PROMPT_VERSION`) usada na resposta (`assistant`)
- `inputTokens` (integer, nullable) - Tokens de entrada reportados pelo provedor
- `outputTokens` (integer, nullable) - Tokens de saída reportados pelo provedor
- `createdAt` (timestamp, not null) - Default: now()
- Index: (chatId, createdAt)

> A mensagem do usuário é gravada imediatamente no envio. A resposta do assistente é gravada no fim do stream, incluindo partes e uso de tokens. Mensagens de conversas de outros usuários nunca são retornadas.

### verificationToken
Para verificação de email/magic links.
- `identifier` (text)
- `token` (text)
- `expires` (timestamp, not null)
- Unique index: (identifier, token)

## Migrations

- `0000_jazzy_fenris` — tabelas iniciais do Auth.js (`user`, `account`, `session`, `verificationToken`) e coluna `password`.
- `0001_add_nickname` — adiciona a coluna `nickname` em `user`.
- `0002_ai_key` — cria a tabela `AIKey` (chaves BYOK por usuário).
- `0003_instant_model` — cria a tabela `InstantModel` (preferências de modelos rápidos por usuário).
- `0004_chat` — cria o enum `MessageRole` e as tabelas `Chat` e `Message`.
- `0005_message_prompt_version` — adiciona a coluna `promptVersion` em `Message`.

Aplicar com:

```bash
npx drizzle-kit migrate
```
