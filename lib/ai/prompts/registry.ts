export const SYSTEM_PROMPT_VERSION = 4

export type SystemPromptChange = {
  version: number
  date: string
  summary: string
}

export const systemPromptChangelog: readonly SystemPromptChange[] = [
  {
    version: 1,
    date: "2026-10-30",
    summary:
      "Prompt base inicial com identidade, estilo, capacidades, segurança e contexto do usuário.",
  },
  {
    version: 2,
    date: "2026-10-30",
    summary:
      "Anuncia a tool nativa fetchUrl e orienta uso responsável, citação da fonte e limites de rede.",
  },
  {
    version: 3,
    date: "2026-10-30",
    summary:
      "Anuncia a tool renderUi, o catálogo de componentes generativos e as regras de uso, citação e não duplicação de dados.",
  },
  {
    version: 4,
    date: "2026-10-30",
    summary:
      "Adiciona execução em etapas com a tool updatePlan, planejamento antes de tarefas multi-passo e replanejamento após falhas.",
  },
]
