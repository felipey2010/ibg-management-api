import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { errorResponse } from '../utils/api-response.js';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json(errorResponse('Validation error', errors));
    return;
  }

  if (error instanceof HttpError) {
    logger.warn({ statusCode: error.statusCode, message: error.message }, 'HTTP error');
    res.status(error.statusCode).json(errorResponse(error.message));
    return;
  }

  logger.error({ err: error }, 'Unhandled application error');
  res.status(500).json(errorResponse('Internal server error'));
};
