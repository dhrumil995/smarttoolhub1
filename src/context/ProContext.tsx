import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProContextType {
  isPro: boolean;
  setIsPro: (val: boolean) => void;
  togglePro: () => void;
  activatePro: () => void;
  aiConfigured: boolean;
  checkHealth: () => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to true so user can immediately use their API for pro features, but let them toggle to Free to test
  const [isPro, setIsProState] = useState<boolean>(() => {
    const saved = localStorage.getItem('smarttoolhub_pro_active');
    return saved !== null ? saved === 'true' : true;
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
    localStorage.setItem('smarttoolhub_pro_active', String(val));
  };

  const togglePro = () => {
    setIsPro(!isPro);
  };

  const activatePro = () => {
    setIsPro(true);
  };

  return (
    <ProContext.Provider
      value={{
        isPro,
        setIsPro,
        togglePro,
        activatePro,
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
