import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/storage';

export const useMeasurements = () => {
  const queryClient = useQueryClient();

  // Query to fetch all measurements
  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => storage.getAll(),
  });

  // Mutation to save a new measurement
  const saveMutation = useMutation({
    mutationFn: (measurementData) => {
      return Promise.resolve(storage.save(measurementData));
    },
    onSuccess: () => {
      // Invalidate and refetch measurements after saving
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });

  // Mutation to update a measurement
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => {
      return Promise.resolve(storage.update(id, updates));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });

  // Mutation to delete a single measurement
  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return Promise.resolve(storage.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });

  // Mutation to clear all measurements
  const clearMutation = useMutation({
    mutationFn: () => {
      storage.clear();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });

  return {
    measurements,
    isLoading,
    saveMeasurement: saveMutation.mutate,
    updateMeasurement: updateMutation.mutate,
    deleteMeasurement: deleteMutation.mutate,
    clearMeasurements: clearMutation.mutate,
    isSaving: saveMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearing: clearMutation.isPending,
  };
};
