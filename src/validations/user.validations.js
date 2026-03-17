import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "../db/users.schema.js";

const validPassword = z
  .string()
  .min(6, "Password must have 6 characters")
  .refine(
    (value) => /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
    "Password must contain atleast one special character"
  )
  .refine(
    (value) => /[A-Z]/.test(value),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (value) => /[0-9]/.test(value),
    "Password must contain at least one number"
  )
  .refine(
    (value) => /[a-z]/.test(value),
    "Password must contain at least one lowercase letter"
  );

export const insertUserSchema = z.object({
  body: createInsertSchema(users, {
    email: (schema) => schema.email.email(),
    password: validPassword,
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    usernameOrEmail: z.string(),
    password: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    usernameOrEmail: z.string(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    password: validPassword,
  }),
});
