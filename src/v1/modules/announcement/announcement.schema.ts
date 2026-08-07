import { z } from 'zod';
import { announcement_status } from '../../../generated/enums.js';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    content: z.string().min(1, 'O conteúdo é obrigatório'),
    status: z.enum([announcement_status.DRAFT, announcement_status.PUBLISHED, announcement_status.ARCHIVED]).optional(),
    published_at: z.string().datetime().optional(),
    starts_at: z.string().datetime().optional(),
    ends_at: z.string().datetime().optional(),
    created_by_id: z.string().uuid().optional(),
    event_id: z.string().uuid().optional(),
  }),
});

export const updateAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    status: z.enum([announcement_status.DRAFT, announcement_status.PUBLISHED, announcement_status.ARCHIVED]).optional(),
    published_at: z.string().datetime().optional(),
    starts_at: z.string().datetime().optional(),
    ends_at: z.string().datetime().optional(),
    created_by_id: z.string().uuid().optional(),
    event_id: z.string().uuid().optional(),
  }).partial(),
});
