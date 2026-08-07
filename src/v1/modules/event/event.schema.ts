import { z } from 'zod';
import { event_status } from '../../../generated/enums.js';

const eventStatusEnum = [
  event_status.DRAFT,
  event_status.PUBLISHED,
  event_status.CANCELED,
  event_status.COMPLETED,
] as const;

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título do evento é obrigatório'),
    description: z.string().optional(),
    start_at: z.string().datetime('Data de início inválida'),
    end_at: z.string().datetime('Data de término inválida').optional(),
    location: z.string().optional(),
    status: z.enum(eventStatusEnum).optional(),
    registration_enabled: z.boolean().optional(),
    registration_deadline: z.string().datetime('Data de inscrição inválida').optional(),
    maximum_participants: z.number().int().positive().optional(),
    created_by_id: z.string().uuid().optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    start_at: z.string().datetime().optional(),
    end_at: z.string().datetime().optional(),
    location: z.string().optional(),
    status: z.enum(eventStatusEnum).optional(),
    registration_enabled: z.boolean().optional(),
    registration_deadline: z.string().datetime().optional(),
    maximum_participants: z.number().int().positive().optional(),
    created_by_id: z.string().uuid().optional(),
  }).partial(),
});
