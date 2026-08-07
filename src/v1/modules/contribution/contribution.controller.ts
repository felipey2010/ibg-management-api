import type { Request, Response } from 'express';
import { contributionService } from './contribution.service.js';
import { successResponse } from '../../../utils/api-response.js';
import type { CreateContributionBody, UpdateContributionBody } from './contribution.types.js';

export const contributionController = {
  listContributions: async (_req: Request, res: Response): Promise<void> => {
    const contributions = await contributionService.listContributions();
    res.status(200).json(successResponse('Campanhas de contribuição recuperadas', contributions));
  },

  getContribution: async (req: Request, res: Response): Promise<void> => {
    const contribution = await contributionService.getContributionById(String(req.params.id));
    res.status(200).json(successResponse('Campanha de contribuição recuperada', contribution));
  },

  createContribution: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateContributionBody;
    const contribution = await contributionService.createContribution(body);
    res.status(201).json(successResponse('Campanha de contribuição criada', contribution));
  },

  updateContribution: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateContributionBody;
    const contribution = await contributionService.updateContribution(String(req.params.id), body);
    res.status(200).json(successResponse('Campanha de contribuição atualizada', contribution));
  },

  deleteContribution: async (req: Request, res: Response): Promise<void> => {
    await contributionService.deleteContribution(String(req.params.id));
    res.status(200).json(successResponse('Campanha de contribuição excluída'));
  },
};
