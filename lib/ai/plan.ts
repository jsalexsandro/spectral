import { z } from "zod"

export const UPDATE_PLAN_TOOL_NAME = "updatePlan"

export const planStepStatusSchema = z.enum(["done", "current", "pending"])

export const updatePlanInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .optional()
    .describe("Título curto do plano. Ex.: Plano de pesquisa."),
  steps: z
    .array(
      z.object({
        title: z
          .string()
          .trim()
          .min(1)
          .max(120)
          .describe("Descrição curta da etapa."),
        description: z
          .string()
          .trim()
          .min(1)
          .max(300)
          .optional()
          .describe("Detalhe opcional sobre o que será feito na etapa."),
        status: planStepStatusSchema.describe(
          "done para concluída, current para a etapa em execução e pending para as próximas.",
        ),
      }),
    )
    .min(1)
    .max(10),
})

export type UpdatePlanInput = z.infer<typeof updatePlanInputSchema>
export type PlanStepStatus = z.infer<typeof planStepStatusSchema>
