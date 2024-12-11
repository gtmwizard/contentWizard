import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/config/api';

export function StatusCheck() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/health`);
        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
  }, []);

  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
        status === 'online' 
          ? 'bg-green-500/10 text-green-500' 
          : status === 'offline'
          ? 'bg-red-500/10 text-red-500'
          : 'bg-yellow-500/10 text-yellow-500'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          status === 'online'
            ? 'bg-green-500'
            : status === 'offline'
            ? 'bg-red-500'
            : 'bg-yellow-500'
        }`} />
        API: {status}
      </div>
    </div>
  );
} 