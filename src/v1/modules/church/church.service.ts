import { HttpError } from '../../../middleware/error-handler.js';
import { churchRepository } from './church.repository.js';
import type { ChurchSettings, UpdateChurchSettingsBody } from './church.types.js';

export const churchService = {
  getSettings: async (): Promise<ChurchSettings | null> => churchRepository.getSettings(),

  updateSettings: async (payload: UpdateChurchSettingsBody): Promise<ChurchSettings> => {
    const existing = await churchRepository.getSettings();

    if (!existing) {
      return churchRepository.createSettings(payload);
    }

    return churchRepository.updateSettings(existing.id, payload);
  },
};
