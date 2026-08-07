import { HttpError } from '../../../middleware/error-handler.js';
import { inventoryRepository } from './inventory.repository.js';

export const inventoryService = {
  list: inventoryRepository.list,
  get: async (id: string) => {
    const item = await inventoryRepository.find(id);
    if (!item) throw new HttpError(404, 'Item de inventário não encontrado');
    return item;
  },
  create: inventoryRepository.create,
  update: async (id: string, data: any) => {
    await inventoryService.get(id);
    return inventoryRepository.update(id, data);
  },
  remove: async (id: string) => {
    await inventoryService.get(id);
    return inventoryRepository.remove(id);
  },
};
