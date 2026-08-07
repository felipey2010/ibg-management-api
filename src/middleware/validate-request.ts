import { type NextFunction, type Request, type Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { HttpError } from './error-handler.js';

type RequestValidationResult = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
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

    // Assign parsed values safely. Some express request properties may be implemented as getters
    // so reassigning the whole object can fail — copy properties instead.
    if (parsedRequest.body !== undefined) {
      req.body = parsedRequest.body as typeof req.body;
    }

    // params is a plain object; replace reference to keep typings simple
    if (parsedRequest.params !== undefined) {
      req.params = parsedRequest.params as typeof req.params;
    }

    // query may be implemented with getters — copy keys instead of replacing the object
    if (parsedRequest.query && typeof parsedRequest.query === 'object') {
      const parsedQuery = parsedRequest.query as Record<string, unknown>;
      const currentQuery = req.query as Record<string, unknown>;
      Object.keys(parsedQuery).forEach((key) => {
        currentQuery[key] = parsedQuery[key];
      });
    }

    next();
  };
};

export const requireAuth = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(401, 'Autenticação necessária'));
};
