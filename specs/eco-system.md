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
  - [x] OptionComponent
        - Novo Chat (estado inicial do /app) ao entrar no site estamos nessa oção inicial por padrão. 
        - Pesquisar (não é bem uma opção e sim botão) ele deve abrir um modal com um input, digite o nome do chat... (o component aplicar um blur no fundo)
  - [x] MyChatsComponents (gestão dos chats) — Passo 4
  - [x] Footer com o o card de user: [Avatar: nome]
    - [x] ao clicar deve abrir um context menu, com duas opções por enquanto:
      - [x] Configurações (modal de configurações) ConfigComponent
      - [x] Saiba Mais
      - [x] Sair (logout) Modal de confirmação
- [x] no main:
- [x] Header: Olá, {nome}
- [x] ChatComponent


   ChatComponent:
    Um inputchat, o principal component e o que mais será usado.
    Regras basicas:
      1. Não ter overflow (scrrol), a usar o shift-enter o component vai crescendo
      2. Não é um input comum, pois ele tem botões nas suas laterais.
    SelectModelComponent proximo ao botão de send, para selecionar Modelos

  ConfigComponent:
  Um modal de configurações da site
  [sidebar] - [content]

  sidebar: (Opções)
  1. Geral
    Aparencia
    Tema [sytem, light, dark]

  2. Conta
     Seu perfil
     [UserCardComponent]: [Avatar, Name \n Email]
     Seu Nome - [input] (auto-save)
     Seu Apelido - [input]  (auto-save)

     Sua conta
     Desconectar - logout -  component
     Apagar Conta  - (Apenas o botão não funciona por enquanto)

  3. Byok
     Uma das etapas do site, é o BYOK. Declaras as KEYS dos provedores de IA

     Use suas proprias chaves de api no Spectral

     Disponiveis - input: Pesquisar provedores
     AiProvidersCardComponent:
     "Provedor" - [Não Configurado] (ProviderConfigComponent
    
     - [x] Definir um api no backend com todos os provedores para listarmos aqui (`GET /api/byok`)
     - [x] Definir o schema do BYOK no DB (tabela `AIKey`)
     - [x] Salvar/remover chave por provedor (`PUT`/`DELETE /api/byok/[provider]`)
     - [x] Criptografia das chaves com `BYOK_ENCRYPTION_KEY`
     - [x] Provedores iniciais: OpenAI, Anthropic, Google Gemini e OpenRouter

     A criação de "/provider/[provider]/models
     Será um tela basisca e simples, onde fica listado os modelos dos provedores suportados

     - será necessario criar uma api que lista os modelos suportados pela spectral, com algums metadados:
       EX: Sep 23, 2026 262K context $0.70/M input tokens $1.40/M output tokens
       
    Isso deve ser feito com grande anteção pois ao decorrer será adicionado novos modelos, e isso deve ser estavel e controlave
    veja todos os providers em `specs/providers.md`

  4. Modelos rapidos (redirect para /providers/select-model )

- [x] O select de models (seleção rapida de modelos para uso): (InstantModel) 
  devemos definir uma rota para isso: /providers/select-model (requer auth)

    header: selecione seus modelos - input: Procurar modelo

    listar o nome do + Um toogle-buton que (false/true) que deixa ativado/desativado. os modelos para uso rapido no chat.
    listar o nome especifico do modelo exeplo: anthropic/fable-5
    as pequisa deve funcionar tanto no nome simples quanto o nome especifico do model

    com base no modelos que estão disponiveis dos providers, ele vai deixando ativos os que ele vai usar.

- [x] Toggle por modelo no dropdown do `ModelSelect` do chat
      Deve listar apenas os modelos ativados e um link: Selecionar modelos

- [x] Preferência persistida por usuário na tabela `InstantModel`
- [x] Rotas `GET /api/instant-models` e `PUT /api/instant-models`
- [x] Catálogo com OpenRouter (`MODEL_CATALOG_VERSION = 2`)



Passo 4 (o basico do funcionamento dos chats)
- Tendo cloncuido o passo 3 com exito, estamos formidavelente prontos para começar a implantação basica do chat 
- 1. Definir o schema do chat (definir junto com o programador e salvar e schema.md para reference)
- 2. Usaremos o ai-skd da vercel, por isso devemos definir o nosso service/lib para melhor manutenção
- 3. O usuario escolhe qual modelo de ia, ele vai utilizar. esses modelos estão listados SelectModelComponent
     Deve está disponiveis apenas o chats que foram previamente marcado na pagina de (InstantModel)

  (bug econtrado apenas a primeira respota da ia ta salva, as demais não aparece)
  (demais modelos not-working apenas o google adicionado pelo proprio user)

  MyChatsComponents (gestão dos chats)
  icone de 3 pontos na direita:
  1. Renomear (o nome vira input o user escrever e é salvo automaticamente )
  2. Excluir (modal de confirmação)

  ao clicar nesse component ele deve se comrportar assim na url: /chat/[uuid], mantendo o layout padrão do site, mudar apenas url

passo 5
tools e system prompt