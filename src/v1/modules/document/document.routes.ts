import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { documentController } from './document.controller.js';
import { createDocumentSchema, updateDocumentSchema } from './document.schema.js';

export const documentRouter = Router();
/** @openapi
 * tags:
 *   - name: Documents
 *     description: Document metadata and access management
 * /api/v1/documents:
 *   get: { tags: [Documents], summary: List documents, responses: { 200: { description: Documents retrieved } } }
 *   post: { tags: [Documents], summary: Create document metadata, responses: { 201: { description: Document created } } }
 * /api/v1/documents/{id}:
 *   get: { tags: [Documents], summary: Get a document, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Document retrieved } } }
 *   put: { tags: [Documents], summary: Update document metadata, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Document updated } } }
 *   delete: { tags: [Documents], summary: Soft-delete a document, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Document deleted } } }
 */
documentRouter.get('/', documentController.list);
documentRouter.get('/:id', documentController.get);
documentRouter.post('/', validateRequest(createDocumentSchema), documentController.create);
documentRouter.put('/:id', validateRequest(updateDocumentSchema), documentController.update);
documentRouter.delete('/:id', documentController.remove);
