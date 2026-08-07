import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

const app = createApp();

describe('Member module routes', () => {
  const unique = randomUUID();
  const memberEmail = `member+${unique}@example.com`;
  let memberId: string | undefined;

  test('POST /api/v1/members creates a member', async () => {
    const response = await request(app)
      .post('/api/v1/members')
      .send({
        first_name: 'Test',
        last_name: 'Member',
        email: memberEmail,
        membership_status: 'ACTIVE',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('email', memberEmail);

    memberId = response.body.data.id;
  });

  test('GET /api/v1/members returns the new member in the list', async () => {
    const response = await request(app).get('/api/v1/members');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((member: any) => member.id === memberId)).toBe(true);
  });

  test('GET /api/v1/members/{id} returns the created member', async () => {
    const response = await request(app).get(`/api/v1/members/${memberId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id', memberId);
    expect(response.body.data).toHaveProperty('email', memberEmail);
  });

  test('PUT /api/v1/members/{id} updates the member', async () => {
    const response = await request(app)
      .put(`/api/v1/members/${memberId}`)
      .send({ first_name: 'Updated', phone: '1234567890' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('first_name', 'Updated');
    expect(response.body.data).toHaveProperty('phone', '1234567890');
  });

  test('DELETE /api/v1/members/{id} soft deletes the member', async () => {
    const response = await request(app).delete(`/api/v1/members/${memberId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);

    const deletedMember = await prisma.members.findUnique({ where: { id: memberId } });
    expect(deletedMember).not.toBeNull();
    expect(deletedMember?.deleted_at).not.toBeNull();
  });

  afterAll(async () => {
    if (memberId) {
      try {
        await prisma.members.delete({ where: { id: memberId } });
      } catch (_) {
        // ignore cleanup errors
      }
    }
    await prisma.$disconnect();
  });
});
