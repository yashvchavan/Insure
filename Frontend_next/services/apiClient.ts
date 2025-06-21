import axios from 'axios';
import { getAuthTokens } from './authService';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  // Determine role based on endpoint if needed
  const role = config.url?.startsWith('/admin') ? 'admin' : 'user';
  const tokens = getAuthTokens(role);
  
  if ((await tokens).accessToken) {
    config.headers.Authorization = `Bearer ${(await tokens).accessToken}`;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const role = originalRequest.url?.startsWith('/admin') ? 'admin' : 'user';
        const response = await axios.post('/api/auth/refresh', { role });
        const newAccessToken = response.data.accessToken;
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (logout user)
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;