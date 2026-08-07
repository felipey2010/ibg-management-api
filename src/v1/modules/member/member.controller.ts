import { type Request, type Response } from 'express';
import { memberService } from './member.service.js';
import { successResponse } from '../../../utils/api-response.js';
import type { CreateMemberBody, UpdateMemberBody } from './member.types.js';

export const memberController = {
  listMembers: async (_req: Request, res: Response): Promise<void> => {
    const members = await memberService.listMembers();
    res.status(200).json(successResponse('Membros recuperados', members));
  },

  getMember: async (req: Request, res: Response): Promise<void> => {
    const member = await memberService.getMemberById(req.params.id as string);
    res.status(200).json(successResponse('Membro recuperado', member));
  },

  createMember: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateMemberBody;
    const member = await memberService.createMember(body);
    res.status(201).json(successResponse('Membro criado', member));
  },

  updateMember: async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateMemberBody;
    const member = await memberService.updateMember(req.params.id as string, body);
    res.status(200).json(successResponse('Membro atualizado', member));
  },

  deleteMember: async (req: Request, res: Response): Promise<void> => {
    await memberService.deleteMember(req.params.id as string);
    res.status(200).json(successResponse('Membro excluído'));
  },
};
