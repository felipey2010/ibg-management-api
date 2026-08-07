import { z } from 'zod';
import { contribution_type, contribution_campaign_status } from '../../../generated/enums.js';

const contributionTypeEnum = [contribution_type.FINANCIAL, contribution_type.ITEM] as const;
const contributionStatusEnum = [
  contribution_campaign_status.DRAFT,
  contribution_campaign_status.ACTIVE,
  contribution_campaign_status.CLOSED,
  contribution_campaign_status.ARCHIVED,
] as const;

export const createContributionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'O título da campanha é obrigatório'),
    description: z.string().optional(),
    type: z.enum(contributionTypeEnum).optional(),
    status: z.enum(contributionStatusEnum).optional(),
    event_id: z.string().uuid().optional(),
    starts_at: z.string().datetime().optional(),
    ends_at: z.string().datetime().optional(),
    financial_target: z.number().positive().optional(),
    created_by_id: z.string().uuid().optional(),
  }),
});

export const updateContributionSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(contributionTypeEnum).optional(),
    status: z.enum(contributionStatusEnum).optional(),
    event_id: z.string().uuid().optional(),
    starts_at: z.string().datetime().optional(),
    ends_at: z.string().datetime().optional(),
    financial_target: z.number().positive().optional(),
    created_by_id: z.string().uuid().optional(),
  }).partial(),
});
