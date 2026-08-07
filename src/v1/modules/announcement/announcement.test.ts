import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

const app = createApp();

describe('Announcement module routes', () => {
  const unique = randomUUID();
  let announcementId: string | undefined;

  test('POST /api/v1/announcements creates an announcement', async () => {
    const response = await request(app)
      .post('/api/v1/announcements')
      .send({
        title: `Test Announcement ${unique}`,
        content: 'Announcement content',
        status: 'PUBLISHED',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title', `Test Announcement ${unique}`);

    announcementId = response.body.data.id;
  });

  test('GET /api/v1/announcements returns announcements', async () => {
    const response = await request(app).get('/api/v1/announcements');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((item: any) => item.id === announcementId)).toBe(true);
  });

  test('GET /api/v1/announcements/{id} returns the created announcement', async () => {
    const response = await request(app).get(`/api/v1/announcements/${announcementId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id', announcementId);
    expect(response.body.data).toHaveProperty('content', 'Announcement content');
  });

  test('PUT /api/v1/announcements/{id} updates the announcement', async () => {
    const response = await request(app)
      .put(`/api/v1/announcements/${announcementId}`)
      .send({ title: `Updated Announcement ${unique}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('title', `Updated Announcement ${unique}`);
  });

  test('DELETE /api/v1/announcements/{id} archives the announcement', async () => {
    const response = await request(app).delete(`/api/v1/announcements/${announcementId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);

    const archivedAnnouncement = await prisma.announcements.findUnique({ where: { id: announcementId } });
    expect(archivedAnnouncement).not.toBeNull();
    expect(archivedAnnouncement?.archived_at).not.toBeNull();
  });

  afterAll(async () => {
    if (announcementId) {
      try {
        await prisma.announcements.delete({ where: { id: announcementId } });
      } catch (_) {
        // ignore cleanup failures
      }
    }
    await prisma.$disconnect();
  });
});
