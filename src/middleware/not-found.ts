import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './error-handler.js';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(404, 'Rota não encontrada'));
};
