export type ChurchSettings = {
  id: string;
  name: string;
  description?: string | null;
  logo_file_id?: string | null;
  email?: string | null;
  phone?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  website?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  default_language?: string;
  timezone?: string;
  created_at: Date;
  updated_at: Date;
};

export type UpdateChurchSettingsBody = Partial<Omit<ChurchSettings, 'id' | 'created_at' | 'updated_at'>>;
