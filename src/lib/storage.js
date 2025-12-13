const STORAGE_KEY = 'distance-measurements';
const BASELINE_KEY = 'speaker-baseline';

export const storage = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (measurement) => {
    const measurements = storage.getAll();
    const newMeasurement = {
      ...measurement,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    measurements.push(newMeasurement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    return newMeasurement;
  },

  update: (id, updates) => {
    const measurements = storage.getAll();
    const index = measurements.findIndex(m => m.id === id);
    if (index !== -1) {
      measurements[index] = { ...measurements[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    }
    return measurements;
  },

  delete: (id) => {
    const measurements = storage.getAll();
    const filtered = measurements.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export const baselineStorage = {
  get: () => {
    const data = localStorage.getItem(BASELINE_KEY);
    return data ? JSON.parse(data) : null;
  },

  save: (baseline) => {
    localStorage.setItem(BASELINE_KEY, JSON.stringify(baseline));
    return baseline;
  },

  clear: () => {
    localStorage.removeItem(BASELINE_KEY);
  },
};
