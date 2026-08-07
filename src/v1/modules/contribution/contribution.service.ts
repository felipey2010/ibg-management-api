import { HttpError } from '../../../middleware/error-handler.js';
import { contributionRepository } from './contribution.repository.js';
import type { ContributionCampaign, CreateContributionBody, UpdateContributionBody } from './contribution.types.js';

export const contributionService = {
  listContributions: async (): Promise<ContributionCampaign[]> => contributionRepository.getAll(),

  getContributionById: async (id: string): Promise<ContributionCampaign> => {
    const contribution = await contributionRepository.findById(id);

    if (!contribution) {
      throw new HttpError(404, 'Campanha de contribuição não encontrada');
    }

    return contribution;
  },

  createContribution: async (payload: CreateContributionBody): Promise<ContributionCampaign> => contributionRepository.createContribution(payload),

  updateContribution: async (id: string, payload: UpdateContributionBody): Promise<ContributionCampaign> => {
    await contributionService.getContributionById(id);
    return contributionRepository.updateContribution(id, payload);
  },

  deleteContribution: async (id: string): Promise<void> => {
    await contributionService.getContributionById(id);
    await contributionRepository.deleteContribution(id);
  },
};
