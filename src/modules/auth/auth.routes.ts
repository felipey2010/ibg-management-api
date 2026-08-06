import { Router } from 'express';

export const authRouter = Router();

authRouter.get('/status', (_req, res) => {
  res.status(200).json({ success: true, message: 'Auth module scaffold ready' });
});
