import { randomUUID } from 'crypto';
import request from 'supertest';
import { createApp } from '../../../app.js';
import { prisma } from '../../../config/database.js';

const app = createApp();

describe('Church module routes', () => {
  const unique = randomUUID();
  const testName = `Test Church ${unique}`;
  let originalSettings: any;

  beforeAll(async () => {
    originalSettings = await prisma.church_settings.findFirst();
  });

  test('GET /api/v1/church/settings returns church settings', async () => {
    const response = await request(app).get('/api/v1/church/settings');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
  });

  test('PUT /api/v1/church/settings updates church settings', async () => {
    const response = await request(app)
      .put('/api/v1/church/settings')
      .send({
        name: testName,
        description: 'Updated by test',
        email: 'test@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('name', testName);
    expect(response.body.data).toHaveProperty('email', 'test@example.com');
  });

  afterAll(async () => {
    try {
      if (originalSettings) {
        await prisma.church_settings.update({
          where: { id: originalSettings.id },
          data: {
            name: originalSettings.name,
            description: originalSettings.description,
            logo_file_id: originalSettings.logo_file_id,
            email: originalSettings.email,
            phone: originalSettings.phone,
            address_line: originalSettings.address_line,
            city: originalSettings.city,
            state: originalSettings.state,
            postal_code: originalSettings.postal_code,
            country: originalSettings.country,
            website: originalSettings.website,
            instagram_url: originalSettings.instagram_url,
            facebook_url: originalSettings.facebook_url,
            default_language: originalSettings.default_language,
            timezone: originalSettings.timezone,
          },
        });
      } else {
        await prisma.church_settings.deleteMany({ where: { name: testName } });
      }
    } catch (_) {
      // ignore cleanup failures
    } finally {
      await prisma.$disconnect();
    }
  });
});
