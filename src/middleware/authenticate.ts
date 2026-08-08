import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { authRepository } from '../v1/modules/auth/auth.repository.js';
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

    if (
      typeof payload !== 'object' ||
      payload === null ||
      typeof (payload as any).sessionId !== 'string'
    ) {
      throw new HttpError(401, 'Token de acesso inválido');
    }

    const session = await authRepository.findSessionById((payload as any).sessionId);
    const user = session?.users;

    if (
      !session ||
      session.id !== (payload as any).sessionId ||
      session.revoked_at ||
      session.expires_at < new Date() ||
      !user ||
      user.status !== 'ACTIVE'
    ) {
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
