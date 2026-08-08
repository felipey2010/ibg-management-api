import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

describe('Admin routes', () => {
  const app = createApp();
  const unique = randomUUID();
  const adminEmail = `admin+${unique}@example.com`;
  const memberEmail = `member+${unique}@example.com`;
  const password = 'Password123';
  const permissionCode = `TEST_PERMISSION_${unique.replace(/-/g, '_').toUpperCase()}`;
  let adminId: string;
  let memberId: string;
  let adminAccessToken: string;
  let memberAccessToken: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);
    const [admin, member] = await Promise.all([
      prisma.users.create({
        data: {
          email: adminEmail,
          display_name: 'Admin Test',
          password_hash: passwordHash,
          status: 'ACTIVE',
        },
      }),
      prisma.users.create({
        data: {
          email: memberEmail,
          display_name: 'Member Test',
          password_hash: passwordHash,
          status: 'ACTIVE',
        },
      }),
    ]);
    adminId = admin.id;
    memberId = member.id;

    const systemAdminRole = await prisma.roles.upsert({
      where: { code: 'SYSTEM_ADMIN' },
      update: {},
      create: { name: 'System Administrator', code: 'SYSTEM_ADMIN', is_system_role: true },
    });
    await prisma.user_roles.create({ data: { user_id: adminId, role_id: systemAdminRole.id } });

    const [adminLogin, memberLogin] = await Promise.all([
      request(app).post('/api/v1/auth/login').send({ email: adminEmail, password }),
      request(app).post('/api/v1/auth/login').send({ email: memberEmail, password }),
    ]);
    adminAccessToken = adminLogin.body.data.accessToken;
    memberAccessToken = memberLogin.body.data.accessToken;
  });

  test('rejects unauthenticated and non-administrator requests', async () => {
    const unauthenticated = await request(app).get('/api/v1/admin/users');
    expect(unauthenticated.status).toBe(401);

    const member = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${memberAccessToken}`);
    expect(member.status).toBe(403);
  });

  test('allows a SYSTEM_ADMIN to manage permissions and writes an audit log', async () => {
    const createPermission = await request(app)
      .post('/api/v1/admin/permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ code: permissionCode });
    expect(createPermission.status).toBe(201);

    const auditLogs = await request(app)
      .get('/api/v1/admin/audit-logs?action=CREATE&entityType=permissions')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(auditLogs.status).toBe(200);
    expect(auditLogs.body.data.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ user_id: adminId, entity_type: 'permissions' }),
      ]),
    );
  });

  afterAll(async () => {
    await prisma.permissions.deleteMany({ where: { code: permissionCode } });
    await prisma.audit_logs.deleteMany({ where: { user_id: { in: [adminId, memberId] } } });
    await prisma.user_sessions.deleteMany({ where: { user_id: { in: [adminId, memberId] } } });
    await prisma.user_roles.deleteMany({ where: { user_id: adminId } });
    await prisma.users.deleteMany({ where: { id: { in: [adminId, memberId] } } });
    await prisma.$disconnect();
  });
});
