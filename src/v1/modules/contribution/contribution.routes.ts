import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { contributionController } from './contribution.controller.js';
import { createContributionSchema, updateContributionSchema } from './contribution.schema.js';

export const contributionRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Contribution
 *     description: Contribution campaign management
 */

/**
 * @openapi
 * /api/v1/contributions:
 *   get:
 *     tags:
 *       - Contribution
 *     summary: List contribution campaigns
 *     responses:
 *       200:
 *         description: Contribution campaigns retrieved successfully
 */
contributionRouter.get('/', contributionController.listContributions);

/**
 * @openapi
 * /api/v1/contributions/{id}:
 *   get:
 *     tags:
 *       - Contribution
 *     summary: Get a contribution campaign by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution campaign retrieved successfully
 */
contributionRouter.get('/:id', contributionController.getContribution);

/**
 * @openapi
 * /api/v1/contributions:
 *   post:
 *     tags:
 *       - Contribution
 *     summary: Create a new contribution campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *               financial_target:
 *                 type: number
 *     required:
 *       - title
 *     responses:
 *       201:
 *         description: Contribution campaign created successfully
 */
contributionRouter.post('/', validateRequest(createContributionSchema), contributionController.createContribution);

/**
 * @openapi
 * /api/v1/contributions/{id}:
 *   put:
 *     tags:
 *       - Contribution
 *     summary: Update an existing contribution campaign
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *               financial_target:
 *                 type: number
 *     responses:
 *       200:
 *         description: Contribution campaign updated successfully
 */
contributionRouter.put('/:id', validateRequest(updateContributionSchema), contributionController.updateContribution);

/**
 * @openapi
 * /api/v1/contributions/{id}:
 *   delete:
 *     tags:
 *       - Contribution
 *     summary: Delete a contribution campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution campaign deleted successfully
 */
contributionRouter.delete('/:id', contributionController.deleteContribution);
