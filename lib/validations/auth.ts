import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "E-mail muito longo")
  .email("E-mail inválido");

const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres")
  .max(128, "A senha deve ter no máximo 128 caracteres");

export const checkEmailSchema = z.object({
  email: emailSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome")
    .max(80, "Nome muito longo"),
  email: emailSchema,
  password: passwordSchema,
});

export type CheckEmailInput = z.infer<typeof checkEmailSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
