import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { authenticate } from '../../middleware/authenticate.js';
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), authController.register);
authRouter.post('/login', validateRequest(loginSchema), authController.login);
authRouter.post('/refresh', validateRequest(refreshSchema), authController.refresh);
authRouter.post('/logout', validateRequest(logoutSchema), authController.logout);
authRouter.get('/me', authenticate, authController.me);
authRouter.get('/status', (_req, res) => {
  res.status(200).json({ success: true, message: 'Módulo de autenticação pronto' });
});
