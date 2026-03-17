import { Router } from "express";

import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

userRoutes.route("/profile").get(userController.getUserProfile);

export { userRoutes };
