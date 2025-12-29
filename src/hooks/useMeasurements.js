import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/storage';
import { devError } from '@/lib/utils';
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
      devError('Failed to save measurement:', error);
    },
  });

  // Mutation to update a measurement with optimistic updates
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => storage.update(id, updates, user?.id),
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['measurements', user?.id] });

      // Snapshot the previous value
      const previousMeasurements = queryClient.getQueryData(['measurements', user?.id]);

      // Optimistically update the cache
      queryClient.setQueryData(['measurements', user?.id], (old) =>
        old?.map((m) => (m.id === id ? { ...m, ...updates } : m))
      );

      // Return context with the snapshot
      return { previousMeasurements };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousMeasurements) {
        queryClient.setQueryData(['measurements', user?.id], context.previousMeasurements);
      }
      devError('Failed to update measurement:', error);
    },
    onSettled: () => {
      // Refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
    },
  });

  // Mutation to delete a single measurement with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: (id) => storage.delete(id, user?.id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['measurements', user?.id] });

      // Snapshot the previous value
      const previousMeasurements = queryClient.getQueryData(['measurements', user?.id]);

      // Optimistically remove from cache
      queryClient.setQueryData(['measurements', user?.id], (old) =>
        old?.filter((m) => m.id !== id)
      );

      // Return context with the snapshot
      return { previousMeasurements };
    },
    onError: (error, id, context) => {
      // Rollback on error
      if (context?.previousMeasurements) {
        queryClient.setQueryData(['measurements', user?.id], context.previousMeasurements);
      }
      devError('Failed to delete measurement:', error);
    },
    onSettled: () => {
      // Refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
    },
  });

  // Mutation to clear all measurements
  const clearMutation = useMutation({
    mutationFn: () => storage.clear(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements', user?.id] });
    },
    onError: (error) => {
      devError('Failed to clear measurements:', error);
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
