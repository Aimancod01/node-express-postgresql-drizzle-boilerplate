import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { tokens } from "../db/tokens.schema.js";

export const insertTokenSchema = z.object({
  body: createInsertSchema(tokens),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const logoutTokenSchema = refreshTokenSchema;
