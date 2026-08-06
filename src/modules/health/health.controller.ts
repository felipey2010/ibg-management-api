import { type Request, type Response } from 'express';
import { successResponse } from '../../utils/api-response';

export const healthController = {
  getHealth: (_req: Request, res: Response): void => {
    res.status(200).json(successResponse('API is reachable', { status: 'ok' }));
  },
};
