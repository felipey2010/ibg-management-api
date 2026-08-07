import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

const app = createApp();

describe('Contribution module routes', () => {
  const unique = randomUUID();
  let contributionId: string | undefined;

  test('POST /api/v1/contributions creates a contribution campaign', async () => {
    const response = await request(app)
      .post('/api/v1/contributions')
      .send({
        title: `Test Contribution ${unique}`,
        type: 'FINANCIAL',
        financial_target: 1000,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title', `Test Contribution ${unique}`);

    contributionId = response.body.data.id;
  });

  test('GET /api/v1/contributions returns campaigns', async () => {
    const response = await request(app).get('/api/v1/contributions');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((item: any) => item.id === contributionId)).toBe(true);
  });

  test('GET /api/v1/contributions/{id} returns the created campaign', async () => {
    const response = await request(app).get(`/api/v1/contributions/${contributionId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id', contributionId);
    expect(response.body.data).toHaveProperty('type', 'FINANCIAL');
  });

  test('PUT /api/v1/contributions/{id} updates the campaign', async () => {
    const response = await request(app)
      .put(`/api/v1/contributions/${contributionId}`)
      .send({ title: `Updated Contribution ${unique}`, status: 'ACTIVE' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('title', `Updated Contribution ${unique}`);
    expect(response.body.data).toHaveProperty('status', 'ACTIVE');
  });

  test('DELETE /api/v1/contributions/{id} deletes the campaign', async () => {
    const response = await request(app).delete(`/api/v1/contributions/${contributionId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);

    const deletedContribution = await prisma.contribution_campaigns.findUnique({ where: { id: contributionId } });
    expect(deletedContribution).toBeNull();
  });

  afterAll(async () => {
    if (contributionId) {
      try {
        await prisma.contribution_campaigns.delete({ where: { id: contributionId } });
      } catch (_) {
        // ignore cleanup errors
      }
    }
    await prisma.$disconnect();
  });
});
