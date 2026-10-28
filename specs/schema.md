# Spectral AI - Schema Documentation

## Database: PostgreSQL
Using DrizzleORM with NextAuth.js (Auth.js) adapter.

## Tables

### user
- `id` (text, PK) - CUID gerado automaticamente via @paralleldrive/cuid2
- `name` (text, nullable)
- `email` (text, unique, nullable)
- `emailVerified` (timestamp, nullable)
- `image` (text, nullable)
- `password` (text, nullable) - Hash scrypt no formato `scrypt:<salt>:<hash>`; nulo para contas apenas sociais
- `createdAt` (timestamp, not null) - Default: now()
- `updatedAt` (timestamp, not null) - Default: now()

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

### verificationToken
Para verificação de email/magic links.
- `identifier` (text)
- `token` (text)
- `expires` (timestamp, not null)
- Unique index: (identifier, token)
