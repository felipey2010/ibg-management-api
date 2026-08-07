import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

const app = createApp();

describe('Event module routes', () => {
  const unique = randomUUID();
  let eventId: string | undefined;

  test('POST /api/v1/events creates an event', async () => {
    const response = await request(app)
      .post('/api/v1/events')
      .send({
        title: `Test Event ${unique}`,
        start_at: new Date(Date.now() + 1000 * 60).toISOString(),
        location: 'Test location',
        registration_enabled: true,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title', `Test Event ${unique}`);

    eventId = response.body.data.id;
  });

  test('GET /api/v1/events returns events', async () => {
    const response = await request(app).get('/api/v1/events');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((item: any) => item.id === eventId)).toBe(true);
  });

  test('GET /api/v1/events/{id} returns the created event', async () => {
    const response = await request(app).get(`/api/v1/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id', eventId);
    expect(response.body.data).toHaveProperty('location', 'Test location');
  });

  test('PUT /api/v1/events/{id} updates the event', async () => {
    const response = await request(app)
      .put(`/api/v1/events/${eventId}`)
      .send({ title: `Updated Event ${unique}`, maximum_participants: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('title', `Updated Event ${unique}`);
    expect(response.body.data).toHaveProperty('maximum_participants', 100);
  });

  test('DELETE /api/v1/events/{id} deletes the event', async () => {
    const response = await request(app).delete(`/api/v1/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);

    const deletedEvent = await prisma.events.findUnique({ where: { id: eventId } });
    expect(deletedEvent).toBeNull();
  });

  afterAll(async () => {
    if (eventId) {
      try {
        await prisma.events.delete({ where: { id: eventId } });
      } catch (_) {
        // ignore cleanup errors
      }
    }
    await prisma.$disconnect();
  });
});
