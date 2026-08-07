import { HttpError } from '../../../middleware/error-handler.js';
import { ministryRepository } from './ministry.repository.js';
import type { CreateMinistryBody, Ministry, UpdateMinistryBody } from './ministry.types.js';

export const ministryService = {
  listMinistries: async (): Promise<Ministry[]> => ministryRepository.getAll(),

  getMinistryById: async (id: string): Promise<Ministry> => {
    const ministry = await ministryRepository.findById(id);

    if (!ministry) {
      throw new HttpError(404, 'Ministério não encontrado');
    }

    return ministry;
  },

  createMinistry: async (payload: CreateMinistryBody): Promise<Ministry> => ministryRepository.createMinistry(payload),

  updateMinistry: async (id: string, payload: UpdateMinistryBody): Promise<Ministry> => {
    await ministryService.getMinistryById(id);
    return ministryRepository.updateMinistry(id, payload);
  },

  deleteMinistry: async (id: string): Promise<void> => {
    await ministryService.getMinistryById(id);
    await ministryRepository.deleteMinistry(id);
  },
};
