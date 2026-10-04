import { useState, useEffect, useCallback } from 'react';
import { haptics, HapticIntensity } from './haptics';

export function useHaptics() {
  const [intensity, setIntensityState] = useState<HapticIntensity>(() => haptics.getIntensity());

  useEffect(() => {
    // Keep local React state synchronized when haptics change anywhere in the app
    const unsubscribe = haptics.subscribe((newLevel) => {
      setIntensityState(newLevel);
    });
    return unsubscribe;
  }, []);

  const setIntensity = useCallback((level: HapticIntensity) => {
    haptics.setIntensity(level);
    if (level !== 'off') {
      haptics.playTap(level);
    }
  }, []);

  const cycleIntensity = useCallback(() => {
    return haptics.cycleIntensity();
  }, []);

  const playTap = useCallback(() => {
    haptics.playTap();
  }, []);

  const playSelect = useCallback(() => {
    haptics.playSelect();
  }, []);

  const playSuccess = useCallback(() => {
    haptics.playSuccess();
  }, []);

  const playTestFeedback = useCallback((level: HapticIntensity) => {
    haptics.playTestFeedback(level);
  }, []);

  return {
    intensity,
    setIntensity,
    cycleIntensity,
    isEnabled: intensity !== 'off',
    playTap,
    playSelect,
    playSuccess,
    playTestFeedback,
  };
}
