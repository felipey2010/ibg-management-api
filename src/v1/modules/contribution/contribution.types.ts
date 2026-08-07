export type ContributionCampaign = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  event_id?: string | null;
  starts_at?: Date | null;
  ends_at?: Date | null;
  financial_target?: unknown | null;
  created_by_id?: string | null;
  created_at: Date;
  updated_at: Date;
  closed_at?: Date | null;
};

export type CreateContributionBody = {
  title: string;
  description?: string;
  type?: string;
  status?: string;
  event_id?: string;
  starts_at?: string;
  ends_at?: string;
  financial_target?: number;
  created_by_id?: string;
};

export type UpdateContributionBody = Partial<CreateContributionBody>;
