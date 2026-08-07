import { prisma } from '../../../config/database.js';
import { event_status } from '../../../generated/enums.js';
import type { CreateEventBody, Event, UpdateEventBody } from './event.types.js';

const parseEventDates = (payload: CreateEventBody | UpdateEventBody) => ({
  ...payload,
  start_at: payload.start_at ? new Date(payload.start_at) : undefined,
  end_at: payload.end_at ? new Date(payload.end_at) : undefined,
  registration_deadline: payload.registration_deadline ? new Date(payload.registration_deadline) : undefined,
});

export const eventRepository = {
  getAll: async (): Promise<Event[]> => prisma.events.findMany(),

  findById: async (id: string): Promise<Event | null> => prisma.events.findUnique({ where: { id } }),

  createEvent: async (payload: CreateEventBody): Promise<Event> =>
    prisma.events.create({
      data: {
        ...parseEventDates(payload),
        status: payload.status ?? event_status.DRAFT,
        registration_enabled: payload.registration_enabled ?? false,
      },
    } as any),

  updateEvent: async (id: string, payload: UpdateEventBody): Promise<Event> =>
    prisma.events.update({ where: { id }, data: parseEventDates(payload) } as any),

  deleteEvent: async (id: string): Promise<Event> => prisma.events.delete({ where: { id } } as any),
};
