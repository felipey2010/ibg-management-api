import { type NextFunction, type Request, type Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { HttpError } from './error-handler';

type RequestValidationResult = {
  body: unknown;
  params: unknown;
  query: unknown;
};

export const validateRequest = <TSchema extends ZodTypeAny>(schema: TSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    const parsedRequest = result.data as RequestValidationResult;

    req.body = parsedRequest.body as typeof req.body;
    req.params = parsedRequest.params as typeof req.params;
    req.query = parsedRequest.query as typeof req.query;
    next();
  };
};

export const requireAuth = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(401, 'Authentication required'));
};
