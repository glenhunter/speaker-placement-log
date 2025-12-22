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
    mutationFn: (measurementData) => storage.save(measurementData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
    onError: (error) => {
      console.error('Failed to save measurement:', error);
    },
  });

  // Mutation to update a measurement
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => storage.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
    onError: (error) => {
      console.error('Failed to update measurement:', error);
    },
  });

  // Mutation to delete a single measurement
  const deleteMutation = useMutation({
    mutationFn: (id) => storage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
    onError: (error) => {
      console.error('Failed to delete measurement:', error);
    },
  });

  // Mutation to clear all measurements
  const clearMutation = useMutation({
    mutationFn: () => storage.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
    onError: (error) => {
      console.error('Failed to clear measurements:', error);
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
    saveError: saveMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    clearError: clearMutation.error,
  };
};
