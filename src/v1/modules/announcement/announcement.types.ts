export type Announcement = {
  id: string;
  title: string;
  content: string;
  status: string;
  published_at?: Date | null;
  starts_at?: Date | null;
  ends_at?: Date | null;
  created_by_id?: string | null;
  event_id?: string | null;
  created_at: Date;
  updated_at: Date;
  archived_at?: Date | null;
};

export type CreateAnnouncementBody = {
  title: string;
  content: string;
  status?: string;
  published_at?: string;
  starts_at?: string;
  ends_at?: string;
  created_by_id?: string;
  event_id?: string;
};

export type UpdateAnnouncementBody = Partial<CreateAnnouncementBody>;
