import { HttpError } from '../../../middleware/error-handler.js';
import { adminRepository } from './admin.repository.js';
import type {
  AdminUserStatus,
  CreatePermissionBody,
  CreateRoleBody,
  PaginationParams,
  UpdatePermissionBody,
  UpdateRoleBody,
} from './admin.types.js';

const SYSTEM_ADMIN_ROLE = 'SYSTEM_ADMIN';

type AuditContext = { userId: string; ipAddress?: string };

const userHasSystemAdminRole = (user: {
  user_roles_user_roles_user_idTousers: { roles: { code: string } }[];
}) =>
  user.user_roles_user_roles_user_idTousers.some(({ roles }) => roles.code === SYSTEM_ADMIN_ROLE);

const publicUser = (user: {
  id: string;
  email: string;
  display_name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  user_roles_user_roles_user_idTousers: { roles: { id: string; code: string; name: string } }[];
}) => ({
  id: user.id,
  email: user.email,
  displayName: user.display_name,
  status: user.status,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
  lastLoginAt: user.last_login_at,
  roles: user.user_roles_user_roles_user_idTousers.map(({ roles }) => ({
    id: roles.id,
    code: roles.code,
    name: roles.name,
  })),
});

const ensureSystemAdminRemains = async (user: {
  status: string;
  user_roles_user_roles_user_idTousers: { roles: { code: string } }[];
}) => {
  if (user.status === 'ACTIVE' && userHasSystemAdminRole(user)) {
    const activeSystemAdmins = await adminRepository.countActiveSystemAdmins();
    if (activeSystemAdmins <= 1) {
      throw new HttpError(
        409,
        'Não é permitido remover ou desativar o último administrador do sistema',
      );
    }
  }
};

const getUserOrThrow = async (userId: string) => {
  const user = await adminRepository.findUserById(userId);
  if (!user) {
    throw new HttpError(404, 'Usuário não encontrado');
  }
  return user;
};

const getRoleOrThrow = async (roleId: string) => {
  const role = await adminRepository.findRoleById(roleId);
  if (!role) {
    throw new HttpError(404, 'Função não encontrada');
  }
  return role;
};

const getPermissionOrThrow = async (permissionId: string) => {
  const permission = await adminRepository.findPermissionById(permissionId);
  if (!permission) {
    throw new HttpError(404, 'Permissão não encontrada');
  }
  return permission;
};

const ensureCustomRole = (role: { is_system_role: boolean; code: string }) => {
  if (role.is_system_role || role.code === SYSTEM_ADMIN_ROLE) {
    throw new HttpError(403, 'Funções do sistema não podem ser alteradas');
  }
};

export const adminService = {
  listUsers: async (pagination: PaginationParams) => {
    const [users, total] = await Promise.all([
      adminRepository.listUsers(pagination),
      adminRepository.countUsers(),
    ]);
    return { data: users.map(publicUser), pagination: { ...pagination, total } };
  },

  getUser: async (userId: string) => publicUser(await getUserOrThrow(userId)),

  updateUserStatus: async (userId: string, status: AdminUserStatus, context: AuditContext) => {
    const user = await getUserOrThrow(userId);
    if (user.status !== status && status !== 'ACTIVE') {
      await ensureSystemAdminRemains(user);
    }

    const updated = await adminRepository.updateUserStatus(userId, status);
    if (user.status !== status) {
      await adminRepository.deleteUserSessions(userId);
    }
    await adminRepository.createAuditLog({
      ...context,
      action: 'UPDATE_STATUS',
      entityType: 'users',
      entityId: userId,
      previousData: { status: user.status },
      newData: { status: updated.status },
    });
    return updated;
  },

  revokeUserSessions: async (userId: string, context: AuditContext) => {
    await getUserOrThrow(userId);
    const result = await adminRepository.deleteUserSessions(userId);
    await adminRepository.createAuditLog({
      ...context,
      action: 'REVOKE_SESSIONS',
      entityType: 'users',
      entityId: userId,
      newData: { revokedSessionCount: result.count },
    });
    return result.count;
  },

  assignRole: async (userId: string, roleCode: string, context: AuditContext) => {
    await getUserOrThrow(userId);
    const role = await adminRepository.findRoleByCode(roleCode);
    if (!role) {
      throw new HttpError(404, 'Função não encontrada');
    }
    if (await adminRepository.findUserRole(userId, role.id)) {
      throw new HttpError(409, 'Esta funçãoo já foi atribuída ao usuário');
    }
    await adminRepository.assignRole(userId, role.id, context.userId);
    await adminRepository.deleteUserSessions(userId);
    await adminRepository.createAuditLog({
      ...context,
      action: 'ASSIGN_ROLE',
      entityType: 'user_roles',
      entityId: userId,
      newData: { roleCode },
    });
  },

  removeRole: async (userId: string, roleCode: string, context: AuditContext) => {
    const user = await getUserOrThrow(userId);
    const role = await adminRepository.findRoleByCode(roleCode);
    if (!role || !(await adminRepository.findUserRole(userId, role.id))) {
      throw new HttpError(404, 'Atribuição de função não encontrada');
    }
    if (roleCode === SYSTEM_ADMIN_ROLE) {
      await ensureSystemAdminRemains(user);
    }
    await adminRepository.removeRole(userId, role.id);
    await adminRepository.deleteUserSessions(userId);
    await adminRepository.createAuditLog({
      ...context,
      action: 'REMOVE_ROLE',
      entityType: 'user_roles',
      entityId: userId,
      previousData: { roleCode },
    });
  },

  listRoles: () => adminRepository.listRoles(),

  createRole: async (payload: CreateRoleBody, context: AuditContext) => {
    if (payload.code === SYSTEM_ADMIN_ROLE) {
      throw new HttpError(403, 'A função SYSTEM_ADMIN é reservada ao sistema');
    }
    const role = await adminRepository.createRole(payload);
    await adminRepository.createAuditLog({
      ...context,
      action: 'CREATE',
      entityType: 'roles',
      entityId: role.id,
      newData: { name: role.name, code: role.code, description: role.description },
    });
    return role;
  },

  updateRole: async (roleId: string, payload: UpdateRoleBody, context: AuditContext) => {
    const role = await getRoleOrThrow(roleId);
    ensureCustomRole(role);
    const updated = await adminRepository.updateRole(roleId, payload);
    await adminRepository.createAuditLog({
      ...context,
      action: 'UPDATE',
      entityType: 'roles',
      entityId: roleId,
      previousData: { name: role.name, code: role.code, description: role.description },
      newData: { name: updated.name, code: updated.code, description: updated.description },
    });
    return updated;
  },

  deleteRole: async (roleId: string, context: AuditContext) => {
    const role = await getRoleOrThrow(roleId);
    ensureCustomRole(role);
    await adminRepository.deleteRole(roleId);
    await adminRepository.createAuditLog({
      ...context,
      action: 'DELETE',
      entityType: 'roles',
      entityId: roleId,
      previousData: { name: role.name, code: role.code },
    });
  },

  replaceRolePermissions: async (
    roleId: string,
    permissionCodes: string[],
    context: AuditContext,
  ) => {
    const role = await getRoleOrThrow(roleId);
    ensureCustomRole(role);
    const permissions = await adminRepository.findPermissionsByCodes(permissionCodes);
    if (permissions.length !== new Set(permissionCodes).size) {
      throw new HttpError(400, 'Uma ou mais permissÃµes nÃ£o existem');
    }
    await adminRepository.replaceRolePermissions(
      roleId,
      permissions.map((permission) => permission.id),
    );
    await adminRepository.createAuditLog({
      ...context,
      action: 'REPLACE_PERMISSIONS',
      entityType: 'roles',
      entityId: roleId,
      previousData: role.role_permissions.map(({ permissions: permission }) => permission.code),
      newData: permissions.map((permission) => permission.code),
    });
  },

  listPermissions: () => adminRepository.listPermissions(),

  createPermission: async (payload: CreatePermissionBody, context: AuditContext) => {
    const permission = await adminRepository.createPermission(payload);
    await adminRepository.createAuditLog({
      ...context,
      action: 'CREATE',
      entityType: 'permissions',
      entityId: permission.id,
      newData: permission,
    });
    return permission;
  },

  updatePermission: async (
    permissionId: string,
    payload: UpdatePermissionBody,
    context: AuditContext,
  ) => {
    const permission = await getPermissionOrThrow(permissionId);
    const updated = await adminRepository.updatePermission(permissionId, payload);
    await adminRepository.createAuditLog({
      ...context,
      action: 'UPDATE',
      entityType: 'permissions',
      entityId: permissionId,
      previousData: permission,
      newData: updated,
    });
    return updated;
  },

  deletePermission: async (permissionId: string, context: AuditContext) => {
    const permission = await getPermissionOrThrow(permissionId);
    await adminRepository.deletePermission(permissionId);
    await adminRepository.createAuditLog({
      ...context,
      action: 'DELETE',
      entityType: 'permissions',
      entityId: permissionId,
      previousData: permission,
    });
  },

  listAuditLogs: async (
    pagination: PaginationParams,
    filters: { userId?: string; entityType?: string; action?: string },
  ) => {
    const [data, total] = await Promise.all([
      adminRepository.listAuditLogs(pagination, filters),
      adminRepository.countAuditLogs(filters),
    ]);
    return { data, pagination: { ...pagination, total } };
  },
};
