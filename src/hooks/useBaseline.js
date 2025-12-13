import { useState, useEffect } from 'react';
import { baselineStorage } from '@/lib/storage';

export function useBaseline() {
  const [baseline, setBaseline] = useState(null);

  useEffect(() => {
    const stored = baselineStorage.get();
    setBaseline(stored);
  }, []);

  const saveBaseline = (baselineData) => {
    const saved = baselineStorage.save(baselineData);
    setBaseline(saved);
  };

  const clearBaseline = () => {
    baselineStorage.clear();
    setBaseline(null);
  };

  return {
    baseline,
    saveBaseline,
    clearBaseline,
  };
}
