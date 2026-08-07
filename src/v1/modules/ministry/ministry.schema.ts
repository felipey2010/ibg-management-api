import { z } from 'zod';

export const createMinistrySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome do ministério é obrigatório'),
    description: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const updateMinistrySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
  }),
});
