import { prisma } from '../../../config/database.js';
import type { CreateMemberBody, Member, UpdateMemberBody } from './member.types.js';
import { member_status } from '../../../generated/enums.js';

export const memberRepository = {
  getAll: async (): Promise<Member[]> => prisma.members.findMany({ where: { deleted_at: null } }),

  findById: async (id: string): Promise<Member | null> =>
    prisma.members.findUnique({ where: { id } }),

  createMember: async (payload: CreateMemberBody): Promise<Member> =>
    prisma.members.create({
      data: {
        ...payload,
        membership_status: payload.membership_status ?? member_status.ACTIVE,
      },
    } as any),

  updateMember: async (id: string, payload: UpdateMemberBody): Promise<Member> =>
    prisma.members.update({ where: { id }, data: payload } as any),

  deleteMember: async (id: string): Promise<Member> =>
    prisma.members.update({ where: { id }, data: { deleted_at: new Date() } } as any),
};
