import { z } from 'zod';

const uuid = z.string().uuid('ID inválido');
const roleCode = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[A-Z][A-Z0-9_]*$/, 'Use letras maiúsculas, números e sublinhados');
const userStatus = z.enum(['PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'SUSPENDED', 'INACTIVE']);

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const userIdSchema = z.object({ params: z.object({ id: uuid }) });
export const userRoleSchema = z.object({ params: z.object({ id: uuid, roleCode }) });
export const roleIdSchema = z.object({ params: z.object({ id: uuid }) });
export const permissionIdSchema = z.object({ params: z.object({ id: uuid }) });

export const updateUserStatusSchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ status: userStatus }),
});

export const assignRoleSchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ roleCode }),
});

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    code: roleCode,
    description: z.string().trim().max(500).optional(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({ id: uuid }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      code: roleCode.optional(),
      description: z.string().trim().max(500).nullable().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, 'Informe ao menos um campo para atualizar'),
});

export const replaceRolePermissionsSchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ permissionCodes: z.array(roleCode).max(100) }),
});

export const createPermissionSchema = z.object({
  body: z.object({ code: roleCode, description: z.string().trim().max(500).optional() }),
});

export const updatePermissionSchema = z.object({
  params: z.object({ id: uuid }),
  body: z
    .object({
      code: roleCode.optional(),
      description: z.string().trim().max(500).nullable().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, 'Informe ao menos um campo para atualizar'),
});

export const auditLogSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    userId: uuid.optional(),
    entityType: z.string().trim().min(1).max(100).optional(),
    action: z.string().trim().min(1).max(100).optional(),
  }),
});
