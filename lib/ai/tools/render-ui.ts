import { tool } from "ai"
import {
  UI_CATALOG_VERSION,
  renderUiInputSchema,
  uiCatalogSummary,
} from "@/lib/ai/ui/catalog"

const description = [
  "Renderiza um componente visual estruturado dentro da conversa.",
  "Prefira esta ferramenta quando dados tabulares, métricas, etapas, fontes ou um destaque visual comunicarem melhor do que texto corrido.",
  "Componentes permitidos:",
  uiCatalogSummary,
  "Regras: use no máximo dois blocos por resposta; não repita no texto os mesmos dados exibidos no componente; use `sourceList` somente com URLs reais já consultadas; nunca invente dados apenas para preencher o componente.",
].join("\n")

export const renderUiTool = tool({
  description,
  inputSchema: renderUiInputSchema,
  execute: async (input) => ({
    uiVersion: UI_CATALOG_VERSION,
    component: input.component,
    props: input.props,
  }),
})
