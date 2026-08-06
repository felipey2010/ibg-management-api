import { prisma } from '../../config/database.js';
import { user_status } from '../../generated/enums.js';

export const authRepository = {
  findUserByEmail: (email: string) => prisma.users.findUnique({ where: { email } }),

  findUserById: (id: string) => prisma.users.findUnique({ where: { id } }),

  createUser: (payload: {
    email: string;
    display_name: string;
    password_hash: string;
    status?: string;
  }) =>
    prisma.users.create({
      data: {
        email: payload.email,
        display_name: payload.display_name,
        password_hash: payload.password_hash,
        status: payload.status as user_status,
      },
    }),

  createSession: (payload: {
    id?: string;
    user_id: string;
    refresh_token_hash: string;
    expires_at: Date;
    ip_address?: string | null;
    user_agent?: string | null;
  }) =>
    prisma.user_sessions.create({
      data: {
        id: payload.id,
        user_id: payload.user_id,
        refresh_token_hash: payload.refresh_token_hash,
        expires_at: payload.expires_at,
        ip_address: payload.ip_address,
        user_agent: payload.user_agent,
      },
    }),

  findSessionById: (sessionId: string) =>
    prisma.user_sessions.findUnique({ where: { id: sessionId }, include: { users: true } }),

  revokeSession: (sessionId: string) =>
    prisma.user_sessions.update({
      where: { id: sessionId },
      data: { revoked_at: new Date() },
    }),

  updateLastLogin: (userId: string) =>
    prisma.users.update({
      where: { id: userId },
      data: { last_login_at: new Date() },
    }),
};
