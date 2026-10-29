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
escuro já está preparado para um toggle futuro.

## Backend (Passo 2)
- DrizzleORM configurado com PostgreSQL
- Schemas Auth.js: User, Account, Session, VerificationToken
- NextAuth.js v5 configurado em `/auth.ts` (Google, GitHub, Apple opcional e Credentials)
- Senhas com hash scrypt (`node:crypto`) na coluna `user.password`
- Rotas: `/api/auth/[...nextauth]`, `/api/auth/check-email`, `/api/auth/register`
- Páginas: `/login`, `/register`, `/app` (protegida) e `/platform` (redirect)
- Proteção central em `proxy.ts` + verificação de sessão no layout de `/app`
- Documentação dos schemas em `specs/schema.md`

### Variáveis de ambiente
- `DATABASE_URL` — string de conexão PostgreSQL
- `AUTH_SECRET` — segredo do Auth.js
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
