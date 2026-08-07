import { prisma } from '../../../config/database.js';
import type { ChurchSettings, UpdateChurchSettingsBody } from './church.types.js';

export const churchRepository = {
  getSettings: async (): Promise<ChurchSettings | null> => prisma.church_settings.findFirst(),

  createSettings: async (data: UpdateChurchSettingsBody): Promise<ChurchSettings> =>
    prisma.church_settings.create({ data } as any),

  updateSettings: async (id: string, data: UpdateChurchSettingsBody): Promise<ChurchSettings> =>
    prisma.church_settings.update({ where: { id }, data } as any),
};
