import { z } from 'zod';
import { document_status } from '../../../generated/enums.js';

const status = [document_status.ACTIVE, document_status.ARCHIVED, document_status.DELETED] as const;

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    category_id: z.string().uuid().optional(),
    file_id: z.string().uuid(),
    ministry_id: z.string().uuid().optional(),
    event_id: z.string().uuid().optional(),
    bible_study_id: z.string().uuid().optional(),
    uploaded_by_id: z.string().uuid(),
    status: z.enum(status).optional(),
  }),
});
export const updateDocumentSchema = z.object({
  body: createDocumentSchema.shape.body.omit({ file_id: true, uploaded_by_id: true }).partial(),
});
