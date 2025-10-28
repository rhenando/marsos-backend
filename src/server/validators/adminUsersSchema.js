import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "supplier", "buyer"]),
  status: z.enum(["pending", "approved", "suspended"]).default("pending"),
});

export const UpdateUserSchema = CreateUserSchema.partial();
