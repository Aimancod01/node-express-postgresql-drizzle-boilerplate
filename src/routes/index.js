import { Router } from 'express';

import { userRoutes } from './user.route.js';
import { authRoutes } from './auth.route.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/users', authMiddleware, userRoutes);

export default router;
