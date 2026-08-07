import { prisma } from '../../../config/database.js';

export const inventoryRepository = {
  list: () =>
    prisma.inventory_items.findMany({
      include: { inventory_categories: true, storage_locations: true },
      orderBy: { name: 'asc' },
    }),
  find: (id: string) =>
    prisma.inventory_items.findUnique({
      where: { id },
      include: {
        inventory_categories: true,
        storage_locations: true,
        inventory_movements: { orderBy: { created_at: 'desc' } },
      },
    }),
  create: (data: any) => prisma.inventory_items.create({ data }),
  update: (id: string, data: any) => prisma.inventory_items.update({ where: { id }, data }),
  remove: (id: string) => prisma.inventory_items.delete({ where: { id } }),
};
