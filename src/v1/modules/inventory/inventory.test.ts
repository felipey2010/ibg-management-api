import request from 'supertest';
import { createApp } from '../../../app.js';

const app = createApp();

describe('Inventory request validation', () => {
  test('rejects an item without a unit', async () => {
    const response = await request(app).post('/api/v1/inventory').send({ name: 'Chairs' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
