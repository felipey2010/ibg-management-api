import { type Request, type Response } from 'express';
import { successResponse } from '../../../utils/api-response.js';
import { adminService } from './admin.service.js';
import type {
  AdminUserStatus,
  CreatePermissionBody,
  CreateRoleBody,
  UpdatePermissionBody,
  UpdateRoleBody,
} from './admin.types.js';

const context = (req: Request) => ({ userId: req.user!.id, ipAddress: req.ip });
const pagination = (req: Request) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 20,
  };
};

export const adminController = {
  listUsers: async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .json(successResponse('Usuários recuperados', await adminService.listUsers(pagination(req))));
  },

  getUser: async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .json(
        successResponse('Usuário recuperado', await adminService.getUser(req.params.id as string)),
      );
  },

  updateUserStatus: async (req: Request, res: Response): Promise<void> => {
    const user = await adminService.updateUserStatus(
      req.params.id as string,
      (req.body as { status: AdminUserStatus }).status,
      context(req),
    );
    res.status(200).json(successResponse('Status do usuário atualizado', user));
  },

  revokeUserSessions: async (req: Request, res: Response): Promise<void> => {
    const count = await adminService.revokeUserSessions(req.params.id as string, context(req));
    res.status(200).json(successResponse('Sessões do usuário revogadas', { count }));
  },

  assignRole: async (req: Request, res: Response): Promise<void> => {
    await adminService.assignRole(
      req.params.id as string,
      (req.body as { roleCode: string }).roleCode,
      context(req),
    );
    res.status(204).send();
  },

  removeRole: async (req: Request, res: Response): Promise<void> => {
    await adminService.removeRole(
      req.params.id as string,
      req.params.roleCode as string,
      context(req),
    );
    res.status(204).send();
  },

  listRoles: async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(successResponse('Funções recuperadas', await adminService.listRoles()));
  },

  createRole: async (req: Request, res: Response): Promise<void> => {
    const role = await adminService.createRole(req.body as CreateRoleBody, context(req));
    res.status(201).json(successResponse('Função criada', role));
  },

  updateRole: async (req: Request, res: Response): Promise<void> => {
    const role = await adminService.updateRole(
      req.params.id as string,
      req.body as UpdateRoleBody,
      context(req),
    );
    res.status(200).json(successResponse('Função atualizada', role));
  },

  deleteRole: async (req: Request, res: Response): Promise<void> => {
    await adminService.deleteRole(req.params.id as string, context(req));
    res.status(204).send();
  },

  replaceRolePermissions: async (req: Request, res: Response): Promise<void> => {
    await adminService.replaceRolePermissions(
      req.params.id as string,
      (req.body as { permissionCodes: string[] }).permissionCodes,
      context(req),
    );
    res.status(204).send();
  },

  listPermissions: async (_req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .json(successResponse('Permissões recuperadas', await adminService.listPermissions()));
  },

  createPermission: async (req: Request, res: Response): Promise<void> => {
    const permission = await adminService.createPermission(
      req.body as CreatePermissionBody,
      context(req),
    );
    res.status(201).json(successResponse('Permissão criada', permission));
  },

  updatePermission: async (req: Request, res: Response): Promise<void> => {
    const permission = await adminService.updatePermission(
      req.params.id as string,
      req.body as UpdatePermissionBody,
      context(req),
    );
    res.status(200).json(successResponse('Permissão atualizada', permission));
  },

  deletePermission: async (req: Request, res: Response): Promise<void> => {
    await adminService.deletePermission(req.params.id as string, context(req));
    res.status(204).send();
  },

  listAuditLogs: async (req: Request, res: Response): Promise<void> => {
    const filters = {
      userId: req.query.userId as string | undefined,
      entityType: req.query.entityType as string | undefined,
      action: req.query.action as string | undefined,
    };
    res
      .status(200)
      .json(
        successResponse(
          'Registros de auditoria recuperados',
          await adminService.listAuditLogs(pagination(req), filters),
        ),
      );
  },
};
