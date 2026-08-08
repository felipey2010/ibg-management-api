import { prisma } from '../../../config/database.js';
import type {
  AdminUserStatus,
  CreatePermissionBody,
  CreateRoleBody,
  PaginationParams,
  UpdatePermissionBody,
  UpdateRoleBody,
} from './admin.types.js';

const userInclude = { user_roles_user_roles_user_idTousers: { include: { roles: true } } } as const;

export const adminRepository = {
  findUserById: (id: string) => prisma.users.findUnique({ where: { id }, include: userInclude }),

  listUsers: (pagination: PaginationParams) =>
    prisma.users.findMany({
      include: userInclude,
      orderBy: { created_at: 'desc' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    }),

  countUsers: () => prisma.users.count(),

  updateUserStatus: (id: string, status: AdminUserStatus) =>
    prisma.users.update({ where: { id }, data: { status } }),

  deleteUserSessions: (userId: string) =>
    prisma.user_sessions.deleteMany({ where: { user_id: userId } }),

  findRoleByCode: (code: string) => prisma.roles.findUnique({ where: { code } }),

  findRoleById: (id: string) =>
    prisma.roles.findUnique({
      where: { id },
      include: { role_permissions: { include: { permissions: true } } },
    }),

  listRoles: () =>
    prisma.roles.findMany({
      include: {
        role_permissions: { include: { permissions: true } },
        _count: { select: { user_roles: true } },
      },
      orderBy: { code: 'asc' },
    }),

  createRole: (payload: CreateRoleBody) =>
    prisma.roles.create({ data: { ...payload, is_system_role: false } }),

  updateRole: (id: string, payload: UpdateRoleBody) =>
    prisma.roles.update({ where: { id }, data: payload }),

  deleteRole: (id: string) => prisma.roles.delete({ where: { id } }),

  findUserRole: (userId: string, roleId: string) =>
    prisma.user_roles.findUnique({
      where: { user_id_role_id: { user_id: userId, role_id: roleId } },
    }),

  assignRole: (userId: string, roleId: string, assignedById: string) =>
    prisma.user_roles.create({
      data: { user_id: userId, role_id: roleId, assigned_by_id: assignedById },
    }),

  removeRole: (userId: string, roleId: string) =>
    prisma.user_roles.delete({ where: { user_id_role_id: { user_id: userId, role_id: roleId } } }),

  countActiveSystemAdmins: () =>
    prisma.user_roles.count({
      where: {
        roles: { code: 'SYSTEM_ADMIN' },
        users_user_roles_user_idTousers: { status: 'ACTIVE' },
      },
    }),

  listPermissions: () => prisma.permissions.findMany({ orderBy: { code: 'asc' } }),

  findPermissionById: (id: string) => prisma.permissions.findUnique({ where: { id } }),

  findPermissionsByCodes: (codes: string[]) =>
    prisma.permissions.findMany({ where: { code: { in: codes } } }),

  createPermission: (payload: CreatePermissionBody) => prisma.permissions.create({ data: payload }),

  updatePermission: (id: string, payload: UpdatePermissionBody) =>
    prisma.permissions.update({ where: { id }, data: payload }),

  deletePermission: (id: string) => prisma.permissions.delete({ where: { id } }),

  replaceRolePermissions: async (roleId: string, permissionIds: string[]) =>
    prisma.$transaction(async (tx) => {
      await tx.role_permissions.deleteMany({ where: { role_id: roleId } });
      if (permissionIds.length > 0) {
        await tx.role_permissions.createMany({
          data: permissionIds.map((permission_id) => ({ role_id: roleId, permission_id })),
        });
      }
    }),

  listAuditLogs: (
    pagination: PaginationParams,
    filters: { userId?: string; entityType?: string; action?: string },
  ) => {
    const where = {
      ...(filters.userId ? { user_id: filters.userId } : {}),
      ...(filters.entityType ? { entity_type: filters.entityType } : {}),
      ...(filters.action ? { action: filters.action } : {}),
    };
    return prisma.audit_logs.findMany({
      where,
      include: { users: { select: { id: true, email: true, display_name: true } } },
      orderBy: { created_at: 'desc' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });
  },

  countAuditLogs: (filters: { userId?: string; entityType?: string; action?: string }) =>
    prisma.audit_logs.count({
      where: {
        ...(filters.userId ? { user_id: filters.userId } : {}),
        ...(filters.entityType ? { entity_type: filters.entityType } : {}),
        ...(filters.action ? { action: filters.action } : {}),
      },
    }),

  createAuditLog: (payload: {
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    previousData?: unknown;
    newData?: unknown;
    ipAddress?: string;
  }) =>
    prisma.audit_logs.create({
      data: {
        user_id: payload.userId,
        action: payload.action,
        entity_type: payload.entityType,
        entity_id: payload.entityId,
        previous_data: payload.previousData as any,
        new_data: payload.newData as any,
        ip_address: payload.ipAddress,
      },
    }),
};
