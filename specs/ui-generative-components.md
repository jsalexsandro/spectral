# Spectral AI — Generative UI (Passo 7)

Referência técnica da camada de componentes dinâmicos que a IA pode renderizar
dentro da conversa. Inicialmente apenas o escopo **chat-level** está implementado;
componentes em nível de aplicação ficam para uma fase futura.

## Visão geral

O modelo chama a tool `renderUi` com um componente permitido e um objeto de
`props`. O backend valida a chamada com Zod, devolve um payload versionado e o
frontend renderiza o componente dentro da mensagem do assistente.

```
Modelo -> tool renderUi -> output { uiVersion, component, props }
      -> Message.parts (jsonb) -> RenderUiPart -> registry -> componente React
```

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `lib/ai/ui/catalog.ts` | Fonte única dos schemas, nomes, descrições, versão do catálogo e `RENDER_UI_TOOL_NAME`. |
| `lib/ai/tools/render-ui.ts` | Definição da tool `renderUi` e do output versionado. |
| `lib/ai/tools/index.ts` | Registro da tool em `getChatTools()`. |
| `lib/ai/prompts/sections/generative-ui.ts` | Instruções do system prompt sobre quando e como usar a UI. |
| `components/ai-ui/*` | Implementações visuais dos componentes permitidos. |
| `components/ai-ui/registry.tsx` | Registro `UiComponentName -> componente` e renderer type-safe. |
| `components/ai-ui/render-ui-part.tsx` | Identificação da tool part, validação e estados loading/waiting/success/error. |
| `components/chat/chat.tsx` | Roteia tool parts: `fetchUrl` usa o card existente; `renderUi` usa o renderer. |
| `app/styleguide/generative-ui-gallery.tsx` | Fixtures visuais dos componentes e estados. |

## Componentes permitidos (`UI_CATALOG_VERSION = 1`)

| Nome | Uso |
| --- | --- |
| `callout` | Destaque curto: conclusão, aviso, alerta ou confirmação (`info`, `success`, `warning`, `danger`). |
| `infoCard` | Cartão com título, subtítulo, descrição e pares rótulo/valor. |
| `statGrid` | Grade de 2 a 6 métricas com rótulo, valor e dica opcional. |
| `dataTable` | Tabela com até 6 colunas e 30 linhas. |
| `timeline` | Etapas ordenadas com status `done`, `current` ou `pending`. |
| `sourceList` | Fontes reais com título, URL `http(s)` e trecho opcional. |

Os limites de tamanho de cada campo estão nos schemas Zod de
`lib/ai/ui/catalog.ts` e são aplicados tanto na chamada da tool quanto na
renderização do histórico.

## Contrato da tool

Entrada (`renderUiInputSchema`):

```ts
{
  component: "callout" | "infoCard" | "statGrid" | "dataTable" | "timeline" | "sourceList"
  props: { ... }
}
```

Saída (`renderUiOutputSchema`):

```ts
{
  uiVersion: number
  component: string
  props: object
}
```

`uiVersion` é gravado no output para permitir compatibilidade futura. O
renderer aceita versões iguais ou anteriores a `UI_CATALOG_VERSION`; versões
mais novas exibem fallback de erro. Payloads inválidos nunca são renderizados.

## Identificação das chamadas

A identificação é feita pelo nome da tool:

```ts
getToolName(part) === RENDER_UI_TOOL_NAME
```

`RENDER_UI_TOOL_NAME` fica em `lib/ai/ui/catalog.ts` e é usado tanto no registro
da tool quanto no roteamento do chat, evitando strings duplicadas.

## Estados do renderer

| Estado da tool part | UI |
| --- | --- |
| `input-streaming` / sem input | `loading` — skeleton com “Gerando visualização...”. |
| `input-available`, `approval-requested`, `approval-responded` | `waiting` — valida o input e mostra preview reduzido com indicador. |
| `output-available` | `success` — valida o output, checa `uiVersion` e renderiza. |
| `output-error` | `error` — card de erro com a mensagem da tool. |
| input/output inválido, componente desconhecido ou versão futura | `error` — fallback seguro. |

## Persistência e histórico

Não há tabela nova nem migração. As tool parts completas (`input`, `output`,
`uiVersion`) já são gravadas em `Message.parts` (jsonb) em
`lib/ai/chat-service.ts` / `app/api/chat/route.ts`. Ao abrir um chat existente,
`GET /api/chats/[id]` devolve as partes e o renderer revalida tudo em runtime.

Consequências:

- A interface é reconstruída mesmo após recarregar a página.
- Mudanças futuras de schema não quebram o histórico: payload inválido vira
  fallback de erro.
- Nenhum HTML arbitrário é armazenado ou renderizado.

## Prompt

A seção `generative-ui` (`lib/ai/prompts/sections/generative-ui.ts`) anuncia o
catálogo e as regras:

- no máximo dois blocos por resposta;
- não repetir em texto os mesmos dados exibidos no componente;
- `sourceList` apenas com URLs reais já consultadas;
- nunca inventar dados para preencher um componente;
- preferir Markdown quando ele resolver melhor.

Qualquer mudança nesse texto exige incremento de `SYSTEM_PROMPT_VERSION` em
`lib/ai/prompts/registry.ts` e registro no changelog.

## Como adicionar um componente

1. Adicionar o schema de props e a descrição em `lib/ai/ui/catalog.ts`.
2. Incluir o nome em `uiComponentNames` e no `renderUiInputSchema`.
3. Criar o componente em `components/ai-ui/`.
4. Registrar em `components/ai-ui/registry.tsx` (tanto no mapa quanto no switch).
5. Incrementar `UI_CATALOG_VERSION` se o contrato de componentes existentes mudar.
6. Se o texto do prompt mudar, incrementar `SYSTEM_PROMPT_VERSION`.
7. Adicionar uma fixture em `app/styleguide/generative-ui-gallery.tsx`.
8. Validar com `npm run lint` e `npm run typecheck`.

## Segurança e limites

- Toda entrada e saída é validada com Zod no servidor e revalidada no cliente.
- URLs de `sourceList` aceitam apenas `http`/`https`.
- O registry é uma allowlist: componentes fora dele não são renderizados.
- O renderer não executa HTML, scripts ou conteúdo remoto.
- O modelo não acessa dados além do que foi enviado na conversa ou obtido via
  `fetchUrl`.

## Teste manual

1. Configure uma chave BYOK e envie um pedido que gere tabela, métricas ou fontes.
2. Confirme que o bloco aparece dentro da resposta sem duplicar o texto.
3. Recarregue a página e abra o chat pelo histórico; a UI deve reaparecer.
4. Abra `/styleguide#generative-ui` para validar visual e estados.

## Futuro

Componentes de nível de aplicação (tipo 02) devem reutilizar o mesmo catálogo,
adicionando um campo de escopo (`scope: "chat" | "app"`) e um canal de eventos
para a IA alterar a UI global. Esse fluxo não faz parte desta fase.
