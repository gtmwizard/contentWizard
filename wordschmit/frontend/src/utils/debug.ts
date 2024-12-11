import { API_CONFIG } from '@/config/api';

export const debugConfig = () => {
  if (import.meta.env.MODE === 'development') {
    console.group('🔧 App Configuration');
    console.log('Environment:', import.meta.env.MODE);
    console.log('API URL:', API_CONFIG.baseURL);
    console.log('API Endpoints:', API_CONFIG.endpoints);
    console.groupEnd();
  }
}; 