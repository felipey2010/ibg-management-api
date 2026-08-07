import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env.js';

const apiFiles = ['src/**/*.ts'];

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IBG Management API',
      version: '1.0.0',
      description:
        'Church Management backend API built on Node.js, Express, TypeScript, Prisma, and PostgreSQL.',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: apiFiles,
});
