import { Router } from 'express';
import { validateRequest } from '../../../middleware/validate-request.js';
import { inventoryController } from './inventory.controller.js';
import { createInventoryItemSchema, updateInventoryItemSchema } from './inventory.schema.js';

export const inventoryRouter = Router();
/** @openapi
 * tags:
 *   - name: Inventory
 *     description: Inventory item management
 * /api/v1/inventory:
 *   get: { tags: [Inventory], summary: List inventory items, responses: { 200: { description: Items retrieved } } }
 *   post: { tags: [Inventory], summary: Create an inventory item, responses: { 201: { description: Item created } } }
 * /api/v1/inventory/{id}:
 *   get: { tags: [Inventory], summary: Get an inventory item, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Item retrieved } } }
 *   put: { tags: [Inventory], summary: Update an inventory item, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Item updated } } }
 *   delete: { tags: [Inventory], summary: Delete an inventory item, parameters: [{ in: path, name: id, required: true, schema: { type: string } }], responses: { 200: { description: Item deleted } } }
 */
inventoryRouter.get('/', inventoryController.list);
inventoryRouter.get('/:id', inventoryController.get);
inventoryRouter.post('/', validateRequest(createInventoryItemSchema), inventoryController.create);
inventoryRouter.put('/:id', validateRequest(updateInventoryItemSchema), inventoryController.update);
inventoryRouter.delete('/:id', inventoryController.remove);
