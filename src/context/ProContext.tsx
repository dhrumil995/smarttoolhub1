import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

interface ProContextType {
  isPro: boolean;
  setIsPro: (val: boolean) => void;
  togglePro: () => void;
  activatePro: () => void;
  deactivatePro: () => void;
  aiConfigured: boolean;
  checkHealth: () => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to false so user starts on Free tier and must subscribe/purchase to get Pro
  const [isPro, setIsProState] = useState<boolean>(() => {
    const saved = safeStorage.getItem('smarttoolhub_pro_active');
    return saved === 'true';
  });

  const [aiConfigured, setAiConfigured] = useState<boolean>(true);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setAiConfigured(Boolean(data.aiConfigured));
      }
    } catch {
      // Keep optimistic default
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const setIsPro = (val: boolean) => {
    setIsProState(val);
    safeStorage.setItem('smarttoolhub_pro_active', String(val));
  };

  const togglePro = () => {
    setIsPro(!isPro);
  };

  const activatePro = () => {
    setIsPro(true);
  };

  const deactivatePro = () => {
    setIsPro(false);
  };

  return (
    <ProContext.Provider
      value={{
        isPro,
        setIsPro,
        togglePro,
        activatePro,
        deactivatePro,
        aiConfigured,
        checkHealth,
      }}
    >
      {children}
    </ProContext.Provider>
  );
};

export const usePro = (): ProContextType => {
  const context = useContext(ProContext);
  if (!context) {
    throw new Error('usePro must be used within a ProProvider');
  }
  return context;
};
