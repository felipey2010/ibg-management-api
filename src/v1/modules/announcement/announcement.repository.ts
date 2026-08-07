import { prisma } from '../../../config/database.js';
import { announcement_status } from '../../../generated/enums.js';
import type { Announcement, CreateAnnouncementBody, UpdateAnnouncementBody } from './announcement.types.js';

const parseAnnouncementDates = (payload: CreateAnnouncementBody | UpdateAnnouncementBody) => ({
  ...payload,
  published_at: payload.published_at ? new Date(payload.published_at) : undefined,
  starts_at: payload.starts_at ? new Date(payload.starts_at) : undefined,
  ends_at: payload.ends_at ? new Date(payload.ends_at) : undefined,
});

export const announcementRepository = {
  getAll: async (): Promise<Announcement[]> => prisma.announcements.findMany({ where: { archived_at: null } }),

  findById: async (id: string): Promise<Announcement | null> => prisma.announcements.findUnique({ where: { id } }),

  createAnnouncement: async (payload: CreateAnnouncementBody): Promise<Announcement> =>
    prisma.announcements.create({
      data: {
        ...parseAnnouncementDates(payload),
        status: payload.status ?? announcement_status.DRAFT,
      },
    } as any),

  updateAnnouncement: async (id: string, payload: UpdateAnnouncementBody): Promise<Announcement> =>
    prisma.announcements.update({ where: { id }, data: parseAnnouncementDates(payload) } as any),

  deleteAnnouncement: async (id: string): Promise<Announcement> =>
    prisma.announcements.update({
      where: { id },
      data: {
        archived_at: new Date(),
        status: announcement_status.ARCHIVED,
      },
    } as any),
};
