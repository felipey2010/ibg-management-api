import { prisma } from '../../../config/database.js';
import { ministry_status } from '../../../generated/enums.js';
import type { CreateMinistryBody, Ministry, UpdateMinistryBody } from './ministry.types.js';

export const ministryRepository = {
  getAll: async (): Promise<Ministry[]> => prisma.ministries.findMany(),

  findById: async (id: string): Promise<Ministry | null> => prisma.ministries.findUnique({ where: { id } }),

  createMinistry: async (payload: CreateMinistryBody): Promise<Ministry> =>
    prisma.ministries.create({
      data: {
        ...payload,
        status: payload.status ?? ministry_status.ACTIVE,
      },
    } as any),

  updateMinistry: async (id: string, payload: UpdateMinistryBody): Promise<Ministry> =>
    prisma.ministries.update({ where: { id }, data: payload } as any),

  deleteMinistry: async (id: string): Promise<Ministry> =>
    prisma.ministries.delete({ where: { id } } as any),
};
