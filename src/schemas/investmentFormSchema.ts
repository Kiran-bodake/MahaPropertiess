import { z } from "zod";

export const investmentFormSchema = z.object({
  name: z.string().min(2),

  phone: z.string().min(10),

  email: z.string().email(),

  budget: z.string().min(1),

  locality: z.string().min(1),
});
