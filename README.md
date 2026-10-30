# Spectral AI

Base visual e estrutural do painel SaaS do Spectral AI.

## Stack

- Next.js 16 (App Router, Cache Components e Partial Prefetching)
- React 19
- TypeScript
- Tailwind CSS 4 via Turbopack
- shadcn/ui com Base UI
- Geist Sans e Geist Mono

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Estrutura

- `app/` — rotas e layout global
- `app/styleguide/` — referência visual dos tokens e componentes
- `components/ui/` — primitivos do shadcn/ui
- `lib/` — utilitários compartilhados
- `specs/` — guia funcional do projeto em passos

## Design system

O tema **Spectral Emerald** usa branco e off-whites esverdeados como base, com
esmeralda como cor de ação. Os tokens ficam em `app/globals.css`, e o tema
claro/escuro/sistema é controlado em Configurações → Geral → Aparência.

## Backend (Passo 2)
- DrizzleORM configurado com PostgreSQL
- Schemas Auth.js: User, Account, Session, VerificationToken
- NextAuth.js v5 configurado em `/auth.ts` (Google, GitHub, Apple opcional e Credentials)
- Senhas com hash scrypt (`node:crypto`) na coluna `user.password`
- Rotas: `/api/auth/[...nextauth]`, `/api/auth/check-email`, `/api/auth/register`
- Páginas: `/login`, `/register`, `/app` (protegida) e `/platform` (redirect)
- Proteção central em `proxy.ts` + verificação de sessão no layout de `/app`
- Documentação dos schemas em `specs/schema.md`

## BYOK (Passo 3)
- Seção **BYOK** em Configurações → BYOK (substitui a antiga "Chave de API")
- Provedores: OpenAI, Anthropic, Google Gemini e OpenRouter (`lib/ai/providers.ts`)
- Chaves salvas por usuário na tabela `AIKey`, criptografadas com AES-256-GCM
- Rotas: `GET /api/byok`, `PUT /api/byok/[provider]`, `DELETE /api/byok/[provider]`
- A API nunca retorna a chave; apenas o status e os 4 últimos caracteres
- Documentação da tabela em `specs/schema.md`

## Catálogo de modelos (Passo 3)
- Catálogo estático e tipado em `lib/ai/models.ts`, validado com Zod na inicialização
- Página pública `/provider/[provider]/models` com metadados de cada modelo
- Rotas: `GET /api/models` (todos os provedores) e `GET /api/models/[provider]`
- Provedores disponíveis: `openai`, `anthropic`, `google` e `openrouter`
- Para adicionar ou atualizar um modelo, edite `modelCatalog` em `lib/ai/models.ts` e mantenha o par `(provider, id)` único

## InstantModel (Passo 3)
- Cada usuário escolhe quais modelos aparecem na seleção rápida do chat
- Preferência por modelo salva na tabela `InstantModel`; ausência de registro significa modelo ativo
- No `ModelSelect` do chat, os toggles ficam na seção **Modelos rápidos**
- Rotas: `GET /api/instant-models` e `PUT /api/instant-models`
- Apenas modelos dos provedores com chave BYOK configurada entram na seleção rápida; sem nenhuma chave, o catálogo completo continua disponível como fallback

## Generative UI (Passo 7)
- A IA pode renderizar componentes estruturados no chat com a tool `renderUi`
- Catálogo versionado em `lib/ai/ui/catalog.ts` (`UI_CATALOG_VERSION = 1`)
- Componentes: callout, infoCard, statGrid, dataTable, timeline e sourceList
- Registry e renderer em `components/ai-ui/`, com validação Zod e estados loading/waiting/success/error
- As interfaces são recuperadas do histórico via `Message.parts` (jsonb), sem migração adicional
- Galeria visual em `/styleguide#generative-ui`
- Referência técnica em `specs/ui-generative-components.md`

### Variáveis de ambiente
- `DATABASE_URL` — string de conexão PostgreSQL
- `AUTH_SECRET` — segredo do Auth.js
- `BYOK_ENCRYPTION_KEY` — segredo usado para criptografar as chaves BYOK (usa `AUTH_SECRET` como fallback)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — login com Google
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — login com GitHub
- `AUTH_APPLE_ID` / `AUTH_APPLE_SECRET` — login com Apple (opcional)

Após alterar o schema, gere e aplique a migração:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Usuário de teste

O seed cria (ou atualiza) um usuário com senha para testar o login por credenciais:

```bash
npm run db:seed
```

Padrões: `admin@admin.com` / `admin123`. Sobrescreva com
`SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.
