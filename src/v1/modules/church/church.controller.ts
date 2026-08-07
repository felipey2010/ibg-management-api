import { type Request, type Response } from 'express';
import { churchService } from './church.service.js';
import { successResponse } from '../../../utils/api-response.js';
import type { UpdateChurchSettingsBody } from './church.types.js';

export const churchController = {
  getSettings: async (_req: Request, res: Response): Promise<void> => {
    const settings = await churchService.getSettings();
    res.status(200).json(successResponse('Configurações da igreja recuperadas', settings));
  },

  updateSettings: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateChurchSettingsBody;
    const settings = await churchService.updateSettings(body);
    res.status(200).json(successResponse('Configurações da igreja atualizadas', settings));
  },
};
