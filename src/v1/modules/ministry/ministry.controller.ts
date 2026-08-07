import { type Request, type Response } from 'express';
import { ministryService } from './ministry.service.js';
import { successResponse } from '../../../utils/api-response.js';
import type { CreateMinistryBody, UpdateMinistryBody } from './ministry.types.js';

export const ministryController = {
  listMinistries: async (_req: Request, res: Response): Promise<void> => {
    const ministries = await ministryService.listMinistries();
    res.status(200).json(successResponse('Ministérios recuperados', ministries));
  },

  getMinistry: async (req: Request, res: Response): Promise<void> => {
    const ministry = await ministryService.getMinistryById(req.params.id as string);
    res.status(200).json(successResponse('Ministério recuperado', ministry));
  },

  createMinistry: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateMinistryBody;
    const ministry = await ministryService.createMinistry(body);
    res.status(201).json(successResponse('Ministério criado', ministry));
  },

  updateMinistry: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateMinistryBody;
    const ministry = await ministryService.updateMinistry(req.params.id as string, body);
    res.status(200).json(successResponse('Ministério atualizado', ministry));
  },

  deleteMinistry: async (req: Request, res: Response): Promise<void> => {
    await ministryService.deleteMinistry(req.params.id as string);
    res.status(200).json(successResponse('Ministério excluído'));
  },
};
