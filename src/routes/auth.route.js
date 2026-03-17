import { Router } from "express";

import { authController } from "../controllers/index.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import {
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

  forgotPasswordSchema,
  insertUserSchema,
  loginUserSchema,
  logoutTokenSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from "../validations/index.js";

const authRoutes = Router();

authRoutes
  .route("/register")
  .post(validateMiddleware(insertUserSchema), authController.register);

authRoutes
  .route("/login")
  .post(validateMiddleware(loginUserSchema), authController.login);

authRoutes
  .route("/logout")
  .post(validateMiddleware(logoutTokenSchema), authController.logout);

authRoutes
  .route("/refresh-tokens")
  .post(validateMiddleware(refreshTokenSchema), authController.refreshTokens);

authRoutes
  .route("/forgot-password")
  .post(
    validateMiddleware(forgotPasswordSchema),
    authController.forgotPassword
  );

authRoutes
  .route("/reset-password")
  .post(validateMiddleware(resetPasswordSchema), authController.resetPassword);

export { authRoutes };
