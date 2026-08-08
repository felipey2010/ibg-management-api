import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate.js';
import { requireSystemAdmin } from '../../../middleware/authorize.js';
import { validateRequest } from '../../../middleware/validate-request.js';
import { adminController } from './admin.controller.js';
import {
  assignRoleSchema,
  auditLogSchema,
  createPermissionSchema,
  createRoleSchema,
  paginationSchema,
  permissionIdSchema,
  replaceRolePermissionsSchema,
  roleIdSchema,
  updatePermissionSchema,
  updateRoleSchema,
  updateUserStatusSchema,
  userIdSchema,
  userRoleSchema,
} from './admin.schema.js';

/** Administrator-only API. Every route below requires an active SYSTEM_ADMIN role. */
export const adminRouter = Router();

adminRouter.use(authenticate, requireSystemAdmin);

adminRouter.get('/users', validateRequest(paginationSchema), adminController.listUsers);
adminRouter.get('/users/:id', validateRequest(userIdSchema), adminController.getUser);
adminRouter.patch(
  '/users/:id/status',
  validateRequest(updateUserStatusSchema),
  adminController.updateUserStatus,
);
adminRouter.post(
  '/users/:id/revoke-sessions',
  validateRequest(userIdSchema),
  adminController.revokeUserSessions,
);
adminRouter.post('/users/:id/roles', validateRequest(assignRoleSchema), adminController.assignRole);
adminRouter.delete(
  '/users/:id/roles/:roleCode',
  validateRequest(userRoleSchema),
  adminController.removeRole,
);

adminRouter.get('/roles', adminController.listRoles);
adminRouter.post('/roles', validateRequest(createRoleSchema), adminController.createRole);
adminRouter.patch('/roles/:id', validateRequest(updateRoleSchema), adminController.updateRole);
adminRouter.delete('/roles/:id', validateRequest(roleIdSchema), adminController.deleteRole);
adminRouter.put(
  '/roles/:id/permissions',
  validateRequest(replaceRolePermissionsSchema),
  adminController.replaceRolePermissions,
);

adminRouter.get('/permissions', adminController.listPermissions);
adminRouter.post(
  '/permissions',
  validateRequest(createPermissionSchema),
  adminController.createPermission,
);
adminRouter.patch(
  '/permissions/:id',
  validateRequest(updatePermissionSchema),
  adminController.updatePermission,
);
adminRouter.delete(
  '/permissions/:id',
  validateRequest(permissionIdSchema),
  adminController.deletePermission,
);

adminRouter.get('/audit-logs', validateRequest(auditLogSchema), adminController.listAuditLogs);
