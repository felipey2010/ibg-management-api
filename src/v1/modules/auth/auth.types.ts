export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
  email: string;
  displayName: string;
};

export type RefreshTokenPayload = {
  sessionId: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type RegisterRequestBody = {
  email: string;
  password: string;
  display_name: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type RefreshRequestBody = {
  refreshToken: string;
};

export type LogoutRequestBody = {
  refreshToken: string;
};
