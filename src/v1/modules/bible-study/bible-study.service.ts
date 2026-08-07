import { HttpError } from '../../../middleware/error-handler.js';
import { bibleStudyRepository } from './bible-study.repository.js';

export const bibleStudyService = {
  list: bibleStudyRepository.list,
  get: async (id: string) => {
    const item = await bibleStudyRepository.find(id);
    if (!item) throw new HttpError(404, 'Estudo bíblico não encontrado');
    return item;
  },
  create: bibleStudyRepository.create,
  update: async (id: string, data: any) => {
    await bibleStudyService.get(id);
    return bibleStudyRepository.update(id, data);
  },
  remove: async (id: string) => {
    await bibleStudyService.get(id);
    return bibleStudyRepository.remove(id);
  },
};
