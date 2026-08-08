import { type NextFunction, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { HttpError } from './error-handler.js';

const SYSTEM_ADMIN_ROLE = 'SYSTEM_ADMIN';

export const authorize = (...requiredPermissions: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new HttpError(401, 'AutenticaÃ§Ã£o necessÃ¡ria');
      }

      const assignments = await prisma.user_roles.findMany({
        where: { user_id: req.user.id },
        include: { roles: { include: { role_permissions: { include: { permissions: true } } } } },
      });

      const roleCodes = assignments.map((assignment) => assignment.roles.code);
      const permissionCodes = new Set(
        assignments.flatMap((assignment) =>
          assignment.roles.role_permissions.map(
            (rolePermission) => rolePermission.permissions.code,
          ),
        ),
      );

      if (
        !roleCodes.includes(SYSTEM_ADMIN_ROLE) &&
        !requiredPermissions.every((permission) => permissionCodes.has(permission))
      ) {
        throw new HttpError(403, 'Acesso negado');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireSystemAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'AutenticaÃ§Ã£o necessÃ¡ria');
    }

    const assignment = await prisma.user_roles.findFirst({
      where: { user_id: req.user.id, roles: { code: SYSTEM_ADMIN_ROLE } },
      select: { user_id: true },
    });

    if (!assignment) {
      throw new HttpError(403, 'Acesso restrito a administradores do sistema');
    }

    next();
  } catch (error) {
    next(error);
  }
};
