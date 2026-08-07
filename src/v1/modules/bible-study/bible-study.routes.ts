import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { bibleStudyController } from './bible-study.controller.js';
import { createBibleStudySchema, updateBibleStudySchema } from './bible-study.schema.js';

export const bibleStudyRouter = Router();
/** @openapi
 * tags:
 *   - name: Bible Studies
 *     description: Bible study management
 * /api/v1/bible-studies:
 *   get: { tags: [Bible Studies], summary: List bible studies, responses: { 200: { description: Studies retrieved } } }
 *   post: { tags: [Bible Studies], summary: Create a bible study, responses: { 201: { description: Study created } } }
 * /api/v1/bible-studies/{id}:
 *   get: { tags: [Bible Studies], summary: Get a bible study, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Study retrieved } } }
 *   put: { tags: [Bible Studies], summary: Update a bible study, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Study updated } } }
 *   delete: { tags: [Bible Studies], summary: Delete a bible study, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Study deleted } } }
 */
bibleStudyRouter.get('/', bibleStudyController.list);
bibleStudyRouter.get('/:id', bibleStudyController.get);
bibleStudyRouter.post('/', validateRequest(createBibleStudySchema), bibleStudyController.create);
bibleStudyRouter.put('/:id', validateRequest(updateBibleStudySchema), bibleStudyController.update);
bibleStudyRouter.delete('/:id', bibleStudyController.remove);
