import type { Request, Response } from 'express';
import { successResponse } from '../../../utils/api-response.js';
import { documentService } from './document.service.js';

export const documentController = {
  list: async (_: Request, res: Response) => {
    res.json(successResponse('Documents retrieved', await documentService.list()));
  },
  get: async (req: Request, res: Response) => {
    res.json(
      successResponse('Document retrieved', await documentService.get(String(req.params.id))),
    );
  },
  create: async (req: Request, res: Response) => {
    res
      .status(201)
      .json(successResponse('Document created', await documentService.create(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(
      successResponse(
        'Document updated',
        await documentService.update(String(req.params.id), req.body),
      ),
    );
  },
  remove: async (req: Request, res: Response) => {
    await documentService.remove(String(req.params.id));
    res.json(successResponse('Document deleted'));
  },
};
