import { z } from 'zod';
import { bible_study_status } from '../../../generated/enums.js';

const status = [
  bible_study_status.PLANNED,
  bible_study_status.ACTIVE,
  bible_study_status.COMPLETED,
  bible_study_status.CANCELED,
] as const;

export const createBibleStudySchema = z.object({
  body: z.object({
    title: z.string().min(1),
    topic: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(status).optional(),
    ministry_id: z.string().uuid().optional(),
    created_by_id: z.string().uuid().optional(),
  }),
});
export const updateBibleStudySchema = z.object({
  body: createBibleStudySchema.shape.body.partial(),
});
