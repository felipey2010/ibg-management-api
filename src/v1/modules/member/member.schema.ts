import { z } from 'zod';

const baseMemberSchema = {
  first_name: z.string().min(1, 'O primeiro nome é obrigatório'),
  last_name: z.string().min(1, 'O sobrenome é obrigatório'),
  birth_date: z.string().datetime().optional(),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().optional(),
  address_line: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  membership_status: z.string().optional(),
  membership_date: z.string().datetime().optional(),
  notes: z.string().optional(),
};

export const createMemberSchema = z.object({
  body: z.object({
    ...baseMemberSchema,
  }),
});

export const updateMemberSchema = z.object({
  body: z.object(baseMemberSchema).partial(),
});
