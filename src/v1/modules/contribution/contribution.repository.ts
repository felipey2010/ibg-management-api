import { prisma } from '../../../config/database.js';
import { contribution_campaign_status, contribution_type } from '../../../generated/enums.js';
import type { ContributionCampaign, CreateContributionBody, UpdateContributionBody } from './contribution.types.js';

const parseContributionDates = (payload: CreateContributionBody | UpdateContributionBody) => ({
  ...payload,
  starts_at: payload.starts_at ? new Date(payload.starts_at) : undefined,
  ends_at: payload.ends_at ? new Date(payload.ends_at) : undefined,
});

export const contributionRepository = {
  getAll: async (): Promise<ContributionCampaign[]> => prisma.contribution_campaigns.findMany(),

  findById: async (id: string): Promise<ContributionCampaign | null> => prisma.contribution_campaigns.findUnique({ where: { id } }),

  createContribution: async (payload: CreateContributionBody): Promise<ContributionCampaign> =>
    prisma.contribution_campaigns.create({
      data: {
        ...parseContributionDates(payload),
        type: payload.type ?? contribution_type.FINANCIAL,
        status: payload.status ?? contribution_campaign_status.DRAFT,
      },
    } as any),

  updateContribution: async (id: string, payload: UpdateContributionBody): Promise<ContributionCampaign> =>
    prisma.contribution_campaigns.update({ where: { id }, data: parseContributionDates(payload) } as any),

  deleteContribution: async (id: string): Promise<ContributionCampaign> =>
    prisma.contribution_campaigns.delete({ where: { id } } as any),
};
