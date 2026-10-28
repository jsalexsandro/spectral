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
- NextAuth.js v5 configurado em `/auth.ts`
- Rotas: `/api/auth/[...nextauth]`, `/platform` (protegida)
- Documentação dos schemas em `schema.md`
