import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { baselineStorage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

export function useBaseline() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to fetch baseline
  const { data: baseline = null, isLoading } = useQuery({
    queryKey: ['baseline'],
    queryFn: () => baselineStorage.get(),
    enabled: !!user,
  });

  // Mutation to save baseline
  const saveMutation = useMutation({
    mutationFn: (baselineData) => baselineStorage.save(baselineData, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baseline'] });
    },
    onError: (error) => {
      console.error('Failed to save baseline:', error);
    },
  });

  // Mutation to clear baseline
  const clearMutation = useMutation({
    mutationFn: () => baselineStorage.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baseline'] });
    },
    onError: (error) => {
      console.error('Failed to clear baseline:', error);
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
