import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './error-handler.js';

export const authorize = (..._requiredPermissions: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    next(new HttpError(403, 'Forbidden'));
  };
};
