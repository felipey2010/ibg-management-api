import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { churchController } from './church.controller.js';
import { updateChurchSettingsSchema } from './church.schema.js';

export const churchRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Church
 *     description: Church settings and configuration
 */

/**
 * @openapi
 * /api/v1/church/settings:
 *   get:
 *     tags:
 *       - Church
 *     summary: Get church configuration settings
 *     responses:
 *       200:
 *         description: Church settings retrieved successfully
 */
churchRouter.get('/settings', churchController.getSettings);

/**
 * @openapi
 * /api/v1/church/settings:
 *   put:
 *     tags:
 *       - Church
 *     summary: Update church configuration settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logo_file_id:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Church settings updated successfully
 */
churchRouter.put('/settings', validateRequest(updateChurchSettingsSchema), churchController.updateSettings);
