export type LoginSuccessPayload = {
  user: {
    id: number | string;
    roles: string[];
  };
  token: string;
  refresh_token: string;
};

export type LegacyLoginResponseBody = {
  token?: unknown;
  access_token?: unknown;
  refresh_token?: unknown;
  refreshToken?: unknown;
  user?: { id?: unknown };
  id?: unknown;
};
