import { prisma } from '../../../config/database.js';

export const documentRepository = {
  list: () =>
    prisma.documents.findMany({
      include: { document_categories: true, files: true, document_access: true },
      orderBy: { created_at: 'desc' },
    }),
  find: (id: string) =>
    prisma.documents.findUnique({
      where: { id },
      include: { document_categories: true, files: true, document_access: true },
    }),
  create: (data: any) => prisma.documents.create({ data }),
  update: (id: string, data: any) =>
    prisma.documents.update({
      where: { id },
      data: data.status === 'ARCHIVED' ? { ...data, archived_at: new Date() } : data,
    }),
  remove: (id: string) =>
    prisma.documents.update({
      where: { id },
      data: { status: 'DELETED', archived_at: new Date() },
    }),
};
