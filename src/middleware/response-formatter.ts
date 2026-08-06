import { type NextFunction, type Request, type Response } from 'express';

export const responseFormatter = (_req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json.bind(res);

  res.json = (body: unknown) => {
    const payload = body ?? { success: true, message: 'OK' };
    return originalJson(payload);
  };

  next();
};
