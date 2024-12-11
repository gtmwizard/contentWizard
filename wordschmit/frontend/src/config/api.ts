const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.MODE === 'production') {
    // Default production API URL - update this when backend is deployed
    return 'https://api.wordschmit.com';
  }
  
  // Default development URL
  return 'http://localhost:3001';
};

export const API_CONFIG = {
  baseURL: getBaseUrl(),
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
    },
    profile: {
      get: '/api/profile',
      update: '/api/profile',
    },
    content: {
      list: '/api/content',
      create: '/api/content',
      generate: '/api/content/generate',
      schedule: '/api/content/schedule',
    },
  },
  headers: {
    'Content-Type': 'application/json',
  },
};

export type ApiEndpoints = typeof API_CONFIG.endpoints; 