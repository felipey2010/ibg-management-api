import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { memberController } from './member.controller.js';
import { createMemberSchema, updateMemberSchema } from './member.schema.js';

export const memberRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Member
 *     description: Church member management
 */

/**
 * @openapi
 * /api/v1/members:
 *   get:
 *     tags:
 *       - Member
 *     summary: List all members
 *     responses:
 *       200:
 *         description: List of members
 */
memberRouter.get('/', memberController.listMembers);

/**
 * @openapi
 * /api/v1/members/{id}:
 *   get:
 *     tags:
 *       - Member
 *     summary: Get a member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member retrieved successfully
 */
memberRouter.get('/:id', memberController.getMember);

/**
 * @openapi
 * /api/v1/members:
 *   post:
 *     tags:
 *       - Member
 *     summary: Create a new member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - first_name
 *               - last_name
 *     responses:
 *       201:
 *         description: Member created successfully
 */
memberRouter.post('/', validateRequest(createMemberSchema), memberController.createMember);

/**
 * @openapi
 * /api/v1/members/{id}:
 *   put:
 *     tags:
 *       - Member
 *     summary: Update an existing member
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
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 */
memberRouter.put('/:id', validateRequest(updateMemberSchema), memberController.updateMember);

/**
 * @openapi
 * /api/v1/members/{id}:
 *   delete:
 *     tags:
 *       - Member
 *     summary: Delete a member
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 */
memberRouter.delete('/:id', memberController.deleteMember);
