import { z } from "zod";

export const checkEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
});

export type CheckEmailInput = z.infer<typeof checkEmailSchema>;
