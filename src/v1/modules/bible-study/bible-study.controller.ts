import type { Request, Response } from 'express';
import { successResponse } from '../../../utils/api-response.js';
import { bibleStudyService } from './bible-study.service.js';

export const bibleStudyController = {
  list: async (_: Request, res: Response) => {
    res.json(successResponse('Bible studies retrieved', await bibleStudyService.list()));
  },
  get: async (req: Request, res: Response) => {
    res.json(
      successResponse('Bible study retrieved', await bibleStudyService.get(String(req.params.id))),
    );
  },
  create: async (req: Request, res: Response) => {
    res
      .status(201)
      .json(successResponse('Bible study created', await bibleStudyService.create(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(
      successResponse(
        'Bible study updated',
        await bibleStudyService.update(String(req.params.id), req.body),
      ),
    );
  },
  remove: async (req: Request, res: Response) => {
    await bibleStudyService.remove(String(req.params.id));
    res.json(successResponse('Bible study deleted'));
  },
};
