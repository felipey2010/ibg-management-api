import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

const app = createApp();

describe('Ministry module routes', () => {
  const unique = randomUUID();
  const ministryName = `Test Ministry ${unique}`;
  let ministryId: string | undefined;

  test('POST /api/v1/ministries creates a ministry', async () => {
    const response = await request(app)
      .post('/api/v1/ministries')
      .send({
        name: ministryName,
        description: 'Ministry created during tests',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', ministryName);

    ministryId = response.body.data.id;
  });

  test('GET /api/v1/ministries returns ministries including the created one', async () => {
    const response = await request(app).get('/api/v1/ministries');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((ministry: any) => ministry.id === ministryId)).toBe(true);
  });

  test('GET /api/v1/ministries/{id} returns the created ministry', async () => {
    const response = await request(app).get(`/api/v1/ministries/${ministryId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id', ministryId);
    expect(response.body.data).toHaveProperty('name', ministryName);
  });

  test('PUT /api/v1/ministries/{id} updates the ministry', async () => {
    const response = await request(app)
      .put(`/api/v1/ministries/${ministryId}`)
      .send({ description: 'Updated by test', status: 'INACTIVE' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('description', 'Updated by test');
    expect(response.body.data).toHaveProperty('status', 'INACTIVE');
  });

  test('DELETE /api/v1/ministries/{id} deletes the ministry', async () => {
    const response = await request(app).delete(`/api/v1/ministries/${ministryId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);

    const deletedMinistry = await prisma.ministries.findUnique({ where: { id: ministryId } });
    expect(deletedMinistry).toBeNull();
  });

  afterAll(async () => {
    if (ministryId) {
      try {
        await prisma.ministries.delete({ where: { id: ministryId } });
      } catch (_) {
        // ignore cleanup errors
      }
    }
    await prisma.$disconnect();
  });
});
