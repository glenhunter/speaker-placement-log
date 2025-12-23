import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

export const useMeasurements = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to fetch all measurements
  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ['measurements', user?.id],
    queryFn: () => storage.getAll(user?.id),
  });

  // Mutation to save a new measurement
  const saveMutation = useMutation({
    mutationFn: (measurementData) => storage.save(measurementData, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to save measurement:', error);
    },
  });

  // Mutation to update a measurement
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => storage.update(id, updates, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to update measurement:', error);
    },
  });

  // Mutation to delete a single measurement
  const deleteMutation = useMutation({
    mutationFn: (id) => storage.delete(id, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to delete measurement:', error);
    },
  });

  // Mutation to clear all measurements
  const clearMutation = useMutation({
    mutationFn: () => storage.clear(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
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
