import { HttpError } from '../../../middleware/error-handler.js';
import { eventRepository } from './event.repository.js';
import type { CreateEventBody, Event, UpdateEventBody } from './event.types.js';

export const eventService = {
  listEvents: async (): Promise<Event[]> => eventRepository.getAll(),

  getEventById: async (id: string): Promise<Event> => {
    const event = await eventRepository.findById(id);

    if (!event) {
      throw new HttpError(404, 'Evento não encontrado');
    }

    return event;
  },

  createEvent: async (payload: CreateEventBody): Promise<Event> => eventRepository.createEvent(payload),

  updateEvent: async (id: string, payload: UpdateEventBody): Promise<Event> => {
    await eventService.getEventById(id);
    return eventRepository.updateEvent(id, payload);
  },

  deleteEvent: async (id: string): Promise<void> => {
    await eventService.getEventById(id);
    await eventRepository.deleteEvent(id);
  },
};
