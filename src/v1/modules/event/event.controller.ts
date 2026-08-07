import type { Request, Response } from 'express';
import { eventService } from './event.service.js';
import { successResponse } from '../../../utils/api-response.js';
import type { CreateEventBody, UpdateEventBody } from './event.types.js';

export const eventController = {
  listEvents: async (_req: Request, res: Response): Promise<void> => {
    const events = await eventService.listEvents();
    res.status(200).json(successResponse('Eventos recuperados', events));
  },

  getEvent: async (req: Request, res: Response): Promise<void> => {
    const event = await eventService.getEventById(String(req.params.id));
    res.status(200).json(successResponse('Evento recuperado', event));
  },

  createEvent: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateEventBody;
    const event = await eventService.createEvent(body);
    res.status(201).json(successResponse('Evento criado', event));
  },

  updateEvent: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateEventBody;
    const event = await eventService.updateEvent(String(req.params.id), body);
    res.status(200).json(successResponse('Evento atualizado', event));
  },

  deleteEvent: async (req: Request, res: Response): Promise<void> => {
    await eventService.deleteEvent(String(req.params.id));
    res.status(200).json(successResponse('Evento excluído'));
  },
};
