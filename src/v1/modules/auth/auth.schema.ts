import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('É necessário um e-mail válido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    display_name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('É necessário um e-mail válido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'O refresh token é obrigatório'),
  }),
});

export const logoutSchema = refreshSchema;
