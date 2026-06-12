import axios from 'axios';

// Same-origin /api/v2/* via Front Door (cps-dotnet backend).
export const apiClient = axios.create({
  baseURL: '/api/v2',
  withCredentials: true,
  timeout: 30000,
});
