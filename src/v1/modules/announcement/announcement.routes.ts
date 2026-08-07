import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { announcementController } from './announcement.controller.js';
import { createAnnouncementSchema, updateAnnouncementSchema } from './announcement.schema.js';

export const announcementRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Announcement
 *     description: Announcement management
 */

/**
 * @openapi
 * /api/v1/announcements:
 *   get:
 *     tags:
 *       - Announcement
 *     summary: List announcements
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully
 */
announcementRouter.get('/', announcementController.listAnnouncements);

/**
 * @openapi
 * /api/v1/announcements/{id}:
 *   get:
 *     tags:
 *       - Announcement
 *     summary: Get announcement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully
 */
announcementRouter.get('/:id', announcementController.getAnnouncement);

/**
 * @openapi
 * /api/v1/announcements:
 *   post:
 *     tags:
 *       - Announcement
 *     summary: Create a new announcement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Announcement created successfully
 */
announcementRouter.post('/', validateRequest(createAnnouncementSchema), announcementController.createAnnouncement);

/**
 * @openapi
 * /api/v1/announcements/{id}:
 *   put:
 *     tags:
 *       - Announcement
 *     summary: Update an existing announcement
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
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 */
announcementRouter.put('/:id', validateRequest(updateAnnouncementSchema), announcementController.updateAnnouncement);

/**
 * @openapi
 * /api/v1/announcements/{id}:
 *   delete:
 *     tags:
 *       - Announcement
 *     summary: Archive an announcement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement archived successfully
 */
announcementRouter.delete('/:id', announcementController.deleteAnnouncement);
