import { HttpError } from '../../../middleware/error-handler.js';
import { memberRepository } from './member.repository.js';
import type { CreateMemberBody, Member, UpdateMemberBody } from './member.types.js';

export const memberService = {
  listMembers: async (): Promise<Member[]> => memberRepository.getAll(),

  getMemberById: async (id: string): Promise<Member> => {
    const member = await memberRepository.findById(id);

    if (!member || member.deleted_at) {
      throw new HttpError(404, 'Membro não encontrado');
    }

    return member;
  },

  createMember: async (payload: CreateMemberBody): Promise<Member> => memberRepository.createMember(payload),

  updateMember: async (id: string, payload: UpdateMemberBody): Promise<Member> => {
    await memberService.getMemberById(id);
    return memberRepository.updateMember(id, payload);
  },

  deleteMember: async (id: string): Promise<void> => {
    await memberService.getMemberById(id);
    await memberRepository.deleteMember(id);
  },
};
