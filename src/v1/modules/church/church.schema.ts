import { z } from 'zod';

export const updateChurchSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'O nome da igreja é obrigatório'),
    description: z.string().optional(),
    logo_file_id: z.string().uuid().optional(),
    email: z.string().email('E-mail inválido').optional(),
    phone: z.string().optional(),
    address_line: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    website: z.string().optional(),
    instagram_url: z.string().optional(),
    facebook_url: z.string().optional(),
    default_language: z.string().optional(),
    timezone: z.string().optional(),
  }),
});
