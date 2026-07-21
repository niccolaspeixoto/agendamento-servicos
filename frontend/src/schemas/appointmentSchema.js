import { z } from "zod";

export const appointmentFormSchema = z.object({
  clientName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  clientPhone: z.string().regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos"),
});