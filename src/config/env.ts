const defaultApi = 'http://localhost:9001/api';

export const appConfig = {
  backendUrl: import.meta.env.VITE_API_URL || defaultApi,
} as const;

export default appConfig;
