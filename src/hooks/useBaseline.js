import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { baselineStorage } from '@/lib/storage';
import { devError } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function useBaseline() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to fetch baseline
  const { data: baseline = null, isLoading } = useQuery({
    queryKey: ['baseline', user?.id],
    queryFn: () => baselineStorage.get(user?.id),
  });

  // Mutation to save baseline
  const saveMutation = useMutation({
    mutationFn: (baselineData) => baselineStorage.save(baselineData, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baseline', user?.id] });
    },
    onError: (error) => {
      devError('Failed to save baseline:', error);
    },
  });

  // Mutation to clear baseline
  const clearMutation = useMutation({
    mutationFn: () => baselineStorage.clear(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baseline', user?.id] });
    },
    onError: (error) => {
      devError('Failed to clear baseline:', error);
    },
  });

  return {
    baseline,
    isLoading,
    saveBaseline: saveMutation.mutate,
    clearBaseline: clearMutation.mutate,
    isSaving: saveMutation.isPending,
    isClearing: clearMutation.isPending,
    saveError: saveMutation.error,
    clearError: clearMutation.error,
  };
}
