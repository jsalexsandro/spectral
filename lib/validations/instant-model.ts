import { z } from "zod"
import { getModel } from "@/lib/ai/models"
import { isProviderId, type ProviderId } from "@/lib/ai/providers"

const providerSchema = z.custom<ProviderId>(
  (value) => typeof value === "string" && isProviderId(value),
  { message: "Provedor desconhecido" },
)

export const updateInstantModelSchema = z
  .object({
    provider: providerSchema,
    modelId: z.string().trim().min(1, "Informe o modelo"),
    enabled: z.boolean(),
  })
  .superRefine((data, context) => {
    if (!getModel(data.provider, data.modelId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Modelo desconhecido",
        path: ["modelId"],
      })
    }
  })

export type UpdateInstantModelInput = z.infer<
  typeof updateInstantModelSchema
>
