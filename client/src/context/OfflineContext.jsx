import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(() => {
    return localStorage.getItem('krishi_simulated_offline') === 'true';
  });
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return localStorage.getItem('krishi_last_sync') || new Date().toISOString();
  });

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      localStorage.setItem('krishi_simulated_offline', String(next));
      return next;
    });
  };

  const updateSyncTimestamp = () => {
    const now = new Date().toISOString();
    setLastSyncTime(now);
    localStorage.setItem('krishi_last_sync', now);
  };

  // If either the browser is offline or the farmer explicitly enabled offline preview
  const isOffline = !isBrowserOnline || isSimulatedOffline;

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        isBrowserOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        lastSyncTime,
        updateSyncTimestamp,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
