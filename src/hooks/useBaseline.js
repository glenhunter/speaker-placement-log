import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { baselineStorage } from '@/lib/storage';
import { devError } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function useBaseline() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to fetch all baselines (active baseline is first item)
  const { data: allBaselines = [], isLoading } = useQuery({
    queryKey: ['baselines', user?.id],
    queryFn: () => baselineStorage.getAll(user?.id),
  });

  // Active baseline is the most recent (first in array)
  const baseline = allBaselines.length > 0 ? allBaselines[0] : null;

  // Previous baselines (all except the active one)
  const previousBaselines = allBaselines.slice(1);

  // Mutation to save baseline
  const saveMutation = useMutation({
    mutationFn: (baselineData) => baselineStorage.save(baselineData, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baselines', user?.id] });
    },
    onError: (error) => {
      devError('Failed to save baseline:', error);
    },
  });

  // Mutation to delete a specific baseline
  const deleteMutation = useMutation({
    mutationFn: (id) => baselineStorage.delete(id, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baselines', user?.id] });
    },
    onError: (error) => {
      devError('Failed to delete baseline:', error);
    },
  });

  // Mutation to clear all baselines
  const clearMutation = useMutation({
    mutationFn: () => baselineStorage.clear(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baselines', user?.id] });
    },
    onError: (error) => {
      devError('Failed to clear baselines:', error);
    },
  });

  return {
    baseline,
    previousBaselines,
    allBaselines,
    isLoading,
    saveBaseline: saveMutation.mutate,
    deleteBaseline: deleteMutation.mutate,
    clearBaseline: clearMutation.mutate,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearing: clearMutation.isPending,
    saveError: saveMutation.error,
    deleteError: deleteMutation.error,
    clearError: clearMutation.error,
  };
}
