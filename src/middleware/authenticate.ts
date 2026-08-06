import { type NextFunction, type Request, type Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { authRepository } from '../modules/auth/auth.repository.js';
import { HttpError } from './error-handler.js';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Token de autenticação ausente');
    }

    const token = authorizationHeader.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, env.JWT_SECRET as jwt.Secret) as unknown;

    if (typeof payload !== 'object' || payload === null || typeof (payload as any).userId !== 'string') {
      throw new HttpError(401, 'Token de acesso inválido');
    }

    const user = await authRepository.findUserById((payload as any).userId);

    if (!user || user.status !== 'ACTIVE') {
      throw new HttpError(401, 'Sessão de usuário inválida');
    }

    req.user = {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
    };

    next();
  } catch (error) {
    next(error);
  }
};
