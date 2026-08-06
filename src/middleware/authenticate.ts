import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './error-handler';

export const authenticate = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(401, 'Authentication required'));
};
