import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

async function deleteEvaluationById(id: string) {
  const response = await axios.delete(`${urls.api.evaluations}/${id}`);
  return response.data;
}

/**
 * Deletes an evaluation.
 */
export function useDeleteEvaluationById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvaluationById,
    onSuccess: () => {
      // Invalidate cache to refetch the evaluations
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
    },
  });
}
