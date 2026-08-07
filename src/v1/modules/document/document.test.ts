import request from 'supertest';
import { createApp } from '../../../app.js';

const app = createApp();

describe('Document request validation', () => {
  test('publishes the new module paths in OpenAPI', async () => {
    const response = await request(app).get('/api-docs.json');
    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty('/api/v1/inventory');
    expect(response.body.paths).toHaveProperty('/api/v1/bible-studies');
    expect(response.body.paths).toHaveProperty('/api/v1/documents');
  });

  test('requires a file and uploader when creating document metadata', async () => {
    const response = await request(app).post('/api/v1/documents').send({ title: 'Church policy' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
