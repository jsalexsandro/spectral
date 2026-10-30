import { tool } from "ai"
import { UPDATE_PLAN_TOOL_NAME, updatePlanInputSchema } from "@/lib/ai/plan"

export { UPDATE_PLAN_TOOL_NAME }

export const updatePlanTool = tool({
  description:
    "Cria ou atualiza o plano de execução exibido ao usuário. Use no início de tarefas com múltiplos passos e atualize sempre que concluir uma etapa ou mudar o caminho. Mantenha no máximo uma etapa com status current. Não use para perguntas simples ou respostas de um único passo.",
  inputSchema: updatePlanInputSchema,
  execute: async ({ title, steps }) => ({
    title: title ?? "Plano",
    steps,
  }),
})
