import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { eventController } from './event.controller.js';
import { createEventSchema, updateEventSchema } from './event.schema.js';

export const eventRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Event
 *     description: Event management
 */

/**
 * @openapi
 * /api/v1/events:
 *   get:
 *     tags:
 *       - Event
 *     summary: List events
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */
eventRouter.get('/', eventController.listEvents);

/**
 * @openapi
 * /api/v1/events/{id}:
 *   get:
 *     tags:
 *       - Event
 *     summary: Get event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 */
eventRouter.get('/:id', eventController.getEvent);

/**
 * @openapi
 * /api/v1/events:
 *   post:
 *     tags:
 *       - Event
 *     summary: Create a new event
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
 *               start_at:
 *                 type: string
 *                 format: date-time
 *               end_at:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *               registration_enabled:
 *                 type: boolean
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *               maximum_participants:
 *                 type: integer
 *     required:
 *       - title
 *       - start_at
 *     responses:
 *       201:
 *         description: Event created successfully
 */
eventRouter.post('/', validateRequest(createEventSchema), eventController.createEvent);

/**
 * @openapi
 * /api/v1/events/{id}:
 *   put:
 *     tags:
 *       - Event
 *     summary: Update an existing event
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
 *               start_at:
 *                 type: string
 *                 format: date-time
 *               end_at:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *               registration_enabled:
 *                 type: boolean
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *               maximum_participants:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
eventRouter.put('/:id', validateRequest(updateEventSchema), eventController.updateEvent);

/**
 * @openapi
 * /api/v1/events/{id}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: Delete an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 */
eventRouter.delete('/:id', eventController.deleteEvent);
