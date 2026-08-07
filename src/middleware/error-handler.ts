import { type NextFunction, type Request, type Response } from 'express';
import { ZodError, type ZodIssue } from 'zod';
import { logger } from '../config/logger.js';
import { errorResponse } from '../utils/api-response.js';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const translateValidationIssue = (issue: ZodIssue): string => {
  // Custom schema messages are already Portuguese; translate Zod's defaults.
  if (!issue.message.startsWith('Invalid input') && !issue.message.startsWith('Too small')) {
    return issue.message;
  }

  switch (issue.code) {
    case 'invalid_type':
      return 'Tipo de valor inválido';
    case 'invalid_format':
      return issue.format === 'email' ? 'E-mail inválido' : 'Formato inválido';
    case 'too_small':
      return 'Valor menor que o permitido';
    case 'too_big':
      return 'Valor maior que o permitido';
    default:
      return 'Valor inválido';
  }
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: translateValidationIssue(issue),
    }));

    res.status(400).json(errorResponse('Erro de validação', errors));
    return;
  }

  if (error instanceof HttpError) {
    logger.warn({ statusCode: error.statusCode, message: error.message }, 'HTTP error');
    res.status(error.statusCode).json(errorResponse(error.message));
    return;
  }

  logger.error({ err: error }, 'Unhandled application error');
  res.status(500).json(errorResponse('Erro interno do servidor'));
};
