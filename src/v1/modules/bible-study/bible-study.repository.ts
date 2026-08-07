import { prisma } from '../../../config/database.js';

export const bibleStudyRepository = {
  list: () =>
    prisma.bible_studies.findMany({
      include: { bible_study_meetings: true, bible_study_participants: true },
      orderBy: { created_at: 'desc' },
    }),
  find: (id: string) =>
    prisma.bible_studies.findUnique({
      where: { id },
      include: {
        bible_study_meetings: { orderBy: { scheduled_at: 'asc' } },
        bible_study_participants: true,
      },
    }),
  create: (data: any) => prisma.bible_studies.create({ data }),
  update: (id: string, data: any) => prisma.bible_studies.update({ where: { id }, data }),
  remove: (id: string) => prisma.bible_studies.delete({ where: { id } }),
};
