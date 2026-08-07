import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';
import { authService } from './auth.service.js';
import { authRepository } from './auth.repository.js';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { jest } from '@jest/globals';

// Smoke test for module status
describe('Auth routes smoke', () => {
  const app = createApp();

  test('GET /api/v1/auth/status returns module ready message', async () => {
    const res = await request(app).get('/api/v1/auth/status');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Módulo de autenticação pronto');
  });
});

// Integration tests: full auth flows + edge cases
describe('Auth integration flows', () => {
  const app = createApp();
  const unique = randomUUID();
  const email = `fulltest+${unique}@example.com`;
  const password = 'Password123';
  const display_name = 'Integration User';
  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  test('register -> returns tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, display_name });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  test('register again -> 409', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, display_name });
    expect(res.status).toBe(409);
  });

  test('me -> returns current user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email', email);
  });

  test('login wrong password -> 401', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'WrongPass1' });
    expect(res.status).toBe(401);
  });

  test('login -> returns tokens', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  test('refresh -> rotates refresh token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.refreshToken).not.toBe(refreshToken);

    refreshToken = res.body.data.refreshToken;
    accessToken = res.body.data.accessToken;
  });

  test('refresh tampered -> 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'tampered.token.value' });
    expect(res.status).toBe(401);
  });

  test('refresh after revoke -> 401', async () => {
    const payload = jwt.verify(refreshToken as string, env.JWT_SECRET as jwt.Secret) as any;
    await prisma.user_sessions.update({
      where: { id: payload.sessionId },
      data: { revoked_at: new Date() },
    });

    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(401);
  });

  test('logout -> invalidates refresh token', async () => {
    const r = await request(app).post('/api/v1/auth/login').send({ email, password });
    const freshRefresh = r.body.data.refreshToken;

    const res = await request(app).post('/api/v1/auth/logout').send({ refreshToken: freshRefresh });
    expect(res.status).toBe(200);

    const res2 = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: freshRefresh });
    expect(res2.status).toBe(401);
  });

  afterAll(async () => {
    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (user) {
        await prisma.user_sessions.deleteMany({ where: { user_id: user.id } });
        await prisma.users.delete({ where: { id: user.id } });
      }
    } catch (_) {
      // ignore
    } finally {
      await prisma.$disconnect();
    }
  });
});

// Unit tests for auth.service with mocked repository
describe('Auth service unit tests (mocked)', () => {
  afterEach(() => jest.restoreAllMocks());

  test('registerUser throws 409 when user already exists', async () => {
    jest
      .spyOn(authRepository, 'findUserByEmail')
      .mockResolvedValue({ id: 'u1', email: 'a@b.com' } as any);
    await expect(
      authService.registerUser({ email: 'a@b.com', password: 'pass', display_name: 'A' } as any),
    ).rejects.toHaveProperty('statusCode', 409);
  });

  test('registerUser creates user and returns tokens', async () => {
    jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(null as any);
    jest
      .spyOn(authRepository, 'createUser')
      .mockResolvedValue({
        id: 'u2',
        email: 'x@y.com',
        display_name: 'X',
        password_hash: 'h',
        status: 'ACTIVE',
      } as any);
    jest.spyOn(authRepository, 'createSession').mockResolvedValue({} as any);

    const tokens = await authService.registerUser({
      email: 'x@y.com',
      password: 'pass',
      display_name: 'X',
    } as any);
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });

  test('loginUser rejects invalid credentials', async () => {
    jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue(null as any);
    await expect(authService.loginUser('no@user.com', 'pass')).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  test('loginUser rejects wrong password', async () => {
    jest
      .spyOn(authRepository, 'findUserByEmail')
      .mockResolvedValue({
        id: 'u3',
        email: 'b@c.com',
        display_name: 'B',
        password_hash: 'hash',
        status: 'ACTIVE',
      } as any);
    jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);
    await expect(authService.loginUser('b@c.com', 'wrong')).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  test('loginUser rejects inactive account', async () => {
    jest
      .spyOn(authRepository, 'findUserByEmail')
      .mockResolvedValue({
        id: 'u4',
        email: 'd@e.com',
        display_name: 'D',
        password_hash: 'hash',
        status: 'INACTIVE',
      } as any);
    await expect(authService.loginUser('d@e.com', 'pass')).rejects.toHaveProperty(
      'statusCode',
      403,
    );
  });

  test('refreshTokens rejects when session not found', async () => {
    const fakeSessionId = 'nonexistent';
    const token = jwt.sign({ sessionId: fakeSessionId } as any, env.JWT_SECRET as jwt.Secret, {
      expiresIn: '1h',
    });
    jest.spyOn(authRepository, 'findSessionById').mockResolvedValue(null as any);
    await expect(authService.refreshTokens(token)).rejects.toHaveProperty('statusCode', 401);
  });

  test('logout rejects when session not found', async () => {
    const fakeSessionId = 'nope';
    const token = jwt.sign({ sessionId: fakeSessionId } as any, env.JWT_SECRET as jwt.Secret, {
      expiresIn: '1h',
    });
    jest.spyOn(authRepository, 'findSessionById').mockResolvedValue(null as any);
    await expect(authService.logout(token)).rejects.toHaveProperty('statusCode', 401);
  });
});
