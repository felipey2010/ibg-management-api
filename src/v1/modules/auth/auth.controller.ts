import { type Request, type Response } from 'express';
import { authService } from './auth.service.js';
import type { LoginRequestBody, RefreshRequestBody, RegisterRequestBody } from './auth.types.js';
import { successResponse } from '../../../utils/api-response.js';
import { HttpError } from '../../../middleware/error-handler.js';

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as RegisterRequestBody;
    const tokens = await authService.registerUser(body);

    res.status(201).json(successResponse('Usuário registrado com sucesso', tokens));
  },

  login: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as LoginRequestBody;
    const tokens = await authService.loginUser(body.email, body.password);

    res.status(200).json(successResponse('Login realizado com sucesso', tokens));
  },

  refresh: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as RefreshRequestBody;
    const tokens = await authService.refreshTokens(body.refreshToken);

    res.status(200).json(successResponse('Refresh token emitido', tokens));
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as RefreshRequestBody;
    await authService.logout(body.refreshToken);

    res.status(200).json(successResponse('Logout realizado com sucesso'));
  },

  me: async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new HttpError(401, 'Autenticação necessária');
    }

    res.status(200).json(successResponse('Usuário atual recuperado', req.user));
  },
};
