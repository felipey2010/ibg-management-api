import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { HttpError } from '../../middleware/error-handler.js';
import { authRepository } from './auth.repository.js';
import type {
  AccessTokenPayload,
  AuthTokens,
  AuthUser,
  RefreshTokenPayload,
  RegisterRequestBody,
} from './auth.types.js';

const ACCESS_TOKEN_EXPIRES_IN = env.JWT_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;
const REFRESH_SESSION_TTL_DAYS = 30;

const buildAuthUser = (user: { id: string; email: string; display_name: string }): AuthUser => ({
  id: user.id,
  email: user.email,
  displayName: user.display_name,
});

const createAccessToken = (user: AuthUser): string => {
  const payload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
  };

  return jwt.sign(payload as string | object | Buffer, env.JWT_SECRET as jwt.Secret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

const createRefreshToken = (sessionId: string): string => {
  const payload: RefreshTokenPayload = { sessionId };
  return jwt.sign(payload as string | object | Buffer, env.JWT_SECRET as jwt.Secret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

const hashToken = async (token: string): Promise<string> => bcrypt.hash(token, 10);

const verifyRefreshTokenPayload = (token: string): RefreshTokenPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET as jwt.Secret) as unknown;

    if (typeof payload !== 'object' || payload === null || typeof (payload as any).sessionId !== 'string') {
      throw new HttpError(401, 'Token de refresh inválido');
    }

    return { sessionId: (payload as any).sessionId };
  } catch (err) {
    // Normalize JWT errors to an HttpError so endpoints return 401
    throw new HttpError(401, 'Token de refresh inválido');
  }
};

const createSession = async (
  sessionId: string,
  userId: string,
  refreshToken: string,
  ipAddress?: string | null,
  userAgent?: string | null,
) => {
  const refreshTokenHash = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  return authRepository.createSession({
    id: sessionId,
    user_id: userId,
    refresh_token_hash: refreshTokenHash,
    expires_at: expiresAt,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

const buildTokens = async (user: AuthUser): Promise<AuthTokens> => {
  const accessToken = createAccessToken(user);
  const sessionId = randomUUID();
  const refreshToken = createRefreshToken(sessionId);

  await createSession(sessionId, user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  };
};

export const authService = {
  registerUser: async (payload: RegisterRequestBody): Promise<AuthTokens> => {
    const existingUser = await authRepository.findUserByEmail(payload.email);

    if (existingUser) {
      throw new HttpError(409, 'Já existe um usuário com este e-mail');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await authRepository.createUser({
      email: payload.email,
      display_name: payload.display_name,
      password_hash: passwordHash,
      status: 'ACTIVE',
    });

    const authUser = buildAuthUser(user);
    return buildTokens(authUser);
  },

  loginUser: async (email: string, password: string): Promise<AuthTokens> => {
    const user = await authRepository.findUserByEmail(email);

    if (!user || !user.password_hash) {
      throw new HttpError(401, 'E-mail ou senha inválidos');
    }

    if (user.status !== 'ACTIVE') {
      throw new HttpError(403, 'Sua conta não está ativa');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new HttpError(401, 'E-mail ou senha inválidos');
    }

    await authRepository.updateLastLogin(user.id);

    const authUser = buildAuthUser(user);
    return buildTokens(authUser);
  },

  refreshTokens: async (refreshToken: string): Promise<AuthTokens> => {
    const payload = verifyRefreshTokenPayload(refreshToken);
    const session = await authRepository.findSessionById(payload.sessionId);

    if (!session) {
      throw new HttpError(401, 'Sessão de refresh token não encontrada');
    }

    if (session.revoked_at || session.expires_at < new Date()) {
      throw new HttpError(401, 'O refresh token não é mais válido');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, session.refresh_token_hash);

    if (!isTokenValid) {
      await authRepository.revokeSession(session.id);
      throw new HttpError(401, 'O refresh token não é mais válido');
    }

    if (!session.users || session.users.status !== 'ACTIVE') {
      throw new HttpError(403, 'User account is not active');
    }

    await authRepository.revokeSession(session.id);

    const authUser = buildAuthUser(session.users);
    const accessToken = createAccessToken(authUser);

    // Create a brand new session id and refresh token (rotate)
    const newSessionId = randomUUID();
    const newRefreshToken = createRefreshToken(newSessionId);
    await createSession(newSessionId, session.users.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    const payload = verifyRefreshTokenPayload(refreshToken);
    const session = await authRepository.findSessionById(payload.sessionId);

    if (!session) {
      throw new HttpError(401, 'Sessão de refresh token não encontrada');
    }

    if (session.revoked_at || session.expires_at < new Date()) {
      throw new HttpError(401, 'O refresh token não é mais válido');
    }

    await authRepository.revokeSession(session.id);
  },
};
