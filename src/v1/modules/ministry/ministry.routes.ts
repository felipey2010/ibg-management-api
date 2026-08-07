import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { ministryController } from './ministry.controller.js';
import { createMinistrySchema, updateMinistrySchema } from './ministry.schema.js';

export const ministryRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Ministry
 *     description: Ministry management
 */

/**
 * @openapi
 * /api/v1/ministries:
 *   get:
 *     tags:
 *       - Ministry
 *     summary: List all ministries
 *     responses:
 *       200:
 *         description: List of ministries
 */
ministryRouter.get('/', ministryController.listMinistries);

/**
 * @openapi
 * /api/v1/ministries/{id}:
 *   get:
 *     tags:
 *       - Ministry
 *     summary: Get a ministry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ministry retrieved successfully
 */
ministryRouter.get('/:id', ministryController.getMinistry);

/**
 * @openapi
 * /api/v1/ministries:
 *   post:
 *     tags:
 *       - Ministry
 *     summary: Create a new ministry
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
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Ministry created successfully
 */
ministryRouter.post('/', validateRequest(createMinistrySchema), ministryController.createMinistry);

/**
 * @openapi
 * /api/v1/ministries/{id}:
 *   put:
 *     tags:
 *       - Ministry
 *     summary: Update an existing ministry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Ministry updated successfully
 */
ministryRouter.put('/:id', validateRequest(updateMinistrySchema), ministryController.updateMinistry);

/**
 * @openapi
 * /api/v1/ministries/{id}:
 *   delete:
 *     tags:
 *       - Ministry
 *     summary: Delete a ministry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ministry deleted successfully
 */
ministryRouter.delete('/:id', ministryController.deleteMinistry);
