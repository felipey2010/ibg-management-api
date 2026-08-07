export type Ministry = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  created_by_id?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateMinistryBody = {
  name: string;
  description?: string;
  status?: string;
};

export type UpdateMinistryBody = Partial<CreateMinistryBody>;
