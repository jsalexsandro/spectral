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
- [x] Caso email exista deve aparecer na tela, email invaliado criar conta
- [x] Na tela de login no campo de email usar essa rota para verificar se o email é valido, se for input de password aparece aquardando a senha
- [x] Implementar autenticação por email e password na tela login 
- [x] "/app" e outras rotas requer auth'
- [x] Quando o user estiver logado "/login" manda para "/app"

- [x] Coluna `password` no schema `user` (hash scrypt via `node:crypto`)
- [x] Provider `Credentials` no `auth.ts` validando com Zod
- [x] Rota `POST /api/auth/register` para criar conta com senha
- [x] Rota protegida `/app` (layout + `proxy.ts` matcher)`

- [x] Pagina de sign up "/register"
- [x] Frontend da pagina com os campos necessarios
- [x] Validar os dados da paginas
- [x] Registar o usuario no db

"""
Ao chegar aqui significa que basíco fundamental foi devidamente feito
O necessario para o inicio da aplicação.
"""


### Passo 3 (a construção o /app)
- [x] /app requer auth, deve impedir qualquer um que não esteja autencicado mandando o para /login
- [x] A criação do frontend basico, é um site baseado em chat de ia, então o frontend é nitidamente parecido com outros
- [x] [sidebar-component] [main-component]
- [x] no sidebar:
  - [x] Header com o nome Spectral e ao lado o icone de abrir e fechar a sidebar
  - [ ] OptionComponent
        - Novo Chat (estado inicial do /app) ao entrar no site estamos nessa oção inicial por padrão. 
  - [x] Footer com o o card de user: [Avatar: nome]
    - [x] ao clicar deve abrir um context menu, com duas opções por enquanto:
      - [x] Configurações
      - [x] Saiba Mais
      - [ ] Sair (logout)
- [x] no main:
- [x] Header: Olá, {nome}
- [x] ChatComponent