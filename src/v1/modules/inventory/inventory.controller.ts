import type { Request, Response } from 'express';
import { successResponse } from '../../../utils/api-response.js';
import { inventoryService } from './inventory.service.js';

export const inventoryController = {
  list: async (_: Request, res: Response) => {
    res.json(successResponse('Inventory items retrieved', await inventoryService.list()));
  },
  get: async (req: Request, res: Response) => {
    res.json(
      successResponse(
        'Inventory item retrieved',
        await inventoryService.get(String(req.params.id)),
      ),
    );
  },
  create: async (req: Request, res: Response) => {
    res
      .status(201)
      .json(successResponse('Inventory item created', await inventoryService.create(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(
      successResponse(
        'Inventory item updated',
        await inventoryService.update(String(req.params.id), req.body),
      ),
    );
  },
  remove: async (req: Request, res: Response) => {
    await inventoryService.remove(String(req.params.id));
    res.json(successResponse('Inventory item deleted'));
  },
};
