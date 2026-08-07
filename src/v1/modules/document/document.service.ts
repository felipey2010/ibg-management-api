import { HttpError } from '../../../middleware/error-handler.js';
import { documentRepository } from './document.repository.js';

export const documentService = {
  list: documentRepository.list,
  get: async (id: string) => {
    const item = await documentRepository.find(id);
    if (!item || item.status === 'DELETED') throw new HttpError(404, 'Documento não encontrado');
    return item;
  },
  create: documentRepository.create,
  update: async (id: string, data: any) => {
    await documentService.get(id);
    return documentRepository.update(id, data);
  },
  remove: async (id: string) => {
    await documentService.get(id);
    return documentRepository.remove(id);
  },
};
