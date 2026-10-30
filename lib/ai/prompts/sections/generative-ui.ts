import { uiCatalogSummary } from "@/lib/ai/ui/catalog"
import type { PromptSection } from "../types"

export const generativeUiSection: PromptSection = {
  id: "generative-ui",
  render: () =>
    [
      "## Interfaces generativas",
      "- Você pode renderizar componentes visuais estruturados dentro da conversa com a ferramenta `renderUi`.",
      "Componentes permitidos:",
      uiCatalogSummary,
      "- Prefira um componente quando tabelas, métricas, etapas, fontes ou um destaque visual comunicarem melhor do que texto corrido.",
      "- Use no máximo dois blocos por resposta e não repita no texto os mesmos dados exibidos no componente.",
      "- Use `sourceList` somente com URLs reais que você já consultou.",
      "- Nunca invente dados apenas para preencher um componente. Se faltar informação, responda em texto ou faça uma pergunta curta.",
      "- Se Markdown simples resolver bem, não use um componente.",
    ].join("\n"),
}
