import request from 'supertest';
import { createApp } from '../../../app.js';

describe('Health endpoint', () => {
  it('returns 200 for the health check endpoint', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
