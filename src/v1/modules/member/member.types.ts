export type Member = {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  birth_date?: Date | null;
  email?: string | null;
  phone?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  membership_status: string;
  membership_date?: Date | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
};

export type CreateMemberBody = {
  first_name: string;
  last_name: string;
  birth_date?: string;
  email?: string;
  phone?: string;
  address_line?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  membership_status?: string;
  membership_date?: string;
  notes?: string;
};

export type UpdateMemberBody = Partial<CreateMemberBody>;
