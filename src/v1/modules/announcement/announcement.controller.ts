import type { Request, Response } from 'express';
import { announcementService } from './announcement.service.js';
import { successResponse } from '../../../utils/api-response.js';
import type { CreateAnnouncementBody, UpdateAnnouncementBody } from './announcement.types.js';

export const announcementController = {
  listAnnouncements: async (_req: Request, res: Response): Promise<void> => {
    const announcements = await announcementService.listAnnouncements();
    res.status(200).json(successResponse('Anúncios recuperados', announcements));
  },

  getAnnouncement: async (req: Request, res: Response): Promise<void> => {
    const announcement = await announcementService.getAnnouncementById(String(req.params.id));
    res.status(200).json(successResponse('Anúncio recuperado', announcement));
  },

  createAnnouncement: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateAnnouncementBody;
    const announcement = await announcementService.createAnnouncement(body);
    res.status(201).json(successResponse('Anúncio criado', announcement));
  },

  updateAnnouncement: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateAnnouncementBody;
    const announcement = await announcementService.updateAnnouncement(String(req.params.id), body);
    res.status(200).json(successResponse('Anúncio atualizado', announcement));
  },

  deleteAnnouncement: async (req: Request, res: Response): Promise<void> => {
    await announcementService.deleteAnnouncement(String(req.params.id));
    res.status(200).json(successResponse('Anúncio arquivado'));
  },
};
