import request from 'supertest';
import { createApp } from '../../../app.js';

const app = createApp();

describe('Bible study request validation', () => {
  test('rejects a study without a title', async () => {
    const response = await request(app).post('/api/v1/bible-studies').send({ topic: 'Grace' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
