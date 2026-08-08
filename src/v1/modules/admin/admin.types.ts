export type AdminUserStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';

export type PaginationParams = {
  page: number;
  limit: number;
};

export type CreateRoleBody = {
  name: string;
  code: string;
  description?: string;
};

export type UpdateRoleBody = Partial<CreateRoleBody>;

export type CreatePermissionBody = {
  code: string;
  description?: string;
};

export type UpdatePermissionBody = Partial<CreatePermissionBody>;
