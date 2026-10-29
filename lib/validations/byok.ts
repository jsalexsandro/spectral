import { z } from "zod";

export const saveProviderKeySchema = z.object({
  apiKey: z
    .string()
    .trim()
    .min(8, "Chave muito curta")
    .max(512, "Chave muito longa"),
});

export type SaveProviderKeyInput = z.infer<typeof saveProviderKeySchema>;
