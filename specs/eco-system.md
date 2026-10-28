###
name: Spectral AI

"""
Esté o guia de implementação básica do site.
"""
###

# Passo 1:
1. Criar o projeto usando next-js e limpar a main
2. Definir o designer system para o front-end do projeto

## Status do Passo 1
- [x] Projeto Next.js criado
- [x] Base limpa: layout, fontes, metadata, assets padrão e README
- [x] Design system definido
- [x] shadcn/ui configurado (Base UI + CSS variables)
- [x] Página `/styleguide` criada para validação visual

Design system documentado em `designer.md`.


# Passo 2 (autenticação do projeto)
 "/app" principal pagina do projeto (exige) auth
- [x] Criar a pagina de login (front)
- [x] Criar estrutura básica do backend 
- [x] instalar drizzle, next-auth e zod (validação)

  1. [x] Configurações iniciais do DrizzleORM
  2. [x] Criar pasta db, ./index.ts pra conection
  3. [x] db/schema/index.ts 
  4. [x] definir o schema basico (definir junto com o programador), salvar a reference em schema.md
  5. [x] sobre os schemas, User e Account (login social)
  6. [x] criar o auth.ts no root (jwt-model)
  7. [x] Criar as rotas basicas/necessarias das api com o next-js
  
- [x] Uma rota básica que valida um email na plataforma.  (Aquele email existe?)
- [x] Na tela de login no campo de email usar essa rota para verificar se o email é valido, se for input de password aparece aquardando a senha
- [] Implementar autenticação por email e password na tela login 
- [] "/app" e outras rotas requer auth'
- [] Quando o user estiver logado "/login" manda para "/app"