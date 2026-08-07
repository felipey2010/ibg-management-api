import { Router } from 'express';
import { healthController } from './health.controller.js';

/**
 * @openapi
 * tags:
 *   - name: Health
 *     description: Health checks
 */
export const healthRouter = Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Get application health status
 *     responses:
 *       200:
 *         description: Application is healthy
 */
healthRouter.get('/', healthController.getHealth);
