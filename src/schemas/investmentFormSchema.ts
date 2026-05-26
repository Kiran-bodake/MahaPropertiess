import { z } from "zod";

export const investmentFormSchema = z.object({
  name: z.string().min(2, "Please enter full name"),

  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number"),

  email: z.string().email("Enter valid email address"),

  budget: z.string().min(1, "Please select investment budget"),

  locality: z.string().min(2, "Please enter locality"),
});
