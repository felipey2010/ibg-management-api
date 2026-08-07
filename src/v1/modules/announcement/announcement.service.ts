import { HttpError } from '../../../middleware/error-handler.js';
import { announcementRepository } from './announcement.repository.js';
import type { Announcement, CreateAnnouncementBody, UpdateAnnouncementBody } from './announcement.types.js';

export const announcementService = {
  listAnnouncements: async (): Promise<Announcement[]> => announcementRepository.getAll(),

  getAnnouncementById: async (id: string): Promise<Announcement> => {
    const announcement = await announcementRepository.findById(id);

    if (!announcement || announcement.archived_at) {
      throw new HttpError(404, 'Anúncio não encontrado');
    }

    return announcement;
  },

  createAnnouncement: async (payload: CreateAnnouncementBody): Promise<Announcement> => announcementRepository.createAnnouncement(payload),

  updateAnnouncement: async (id: string, payload: UpdateAnnouncementBody): Promise<Announcement> => {
    await announcementService.getAnnouncementById(id);
    return announcementRepository.updateAnnouncement(id, payload);
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    await announcementService.getAnnouncementById(id);
    await announcementRepository.deleteAnnouncement(id);
  },
};
