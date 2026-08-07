export type Event = {
  id: string;
  title: string;
  description?: string | null;
  start_at: Date;
  end_at?: Date | null;
  location?: string | null;
  status: string;
  registration_enabled: boolean;
  registration_deadline?: Date | null;
  maximum_participants?: number | null;
  created_by_id?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateEventBody = {
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  location?: string;
  status?: string;
  registration_enabled?: boolean;
  registration_deadline?: string;
  maximum_participants?: number;
  created_by_id?: string;
};

export type UpdateEventBody = Partial<CreateEventBody>;
