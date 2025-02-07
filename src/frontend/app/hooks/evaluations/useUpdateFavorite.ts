import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

interface IUpdateFavoritePayload {
  _id: string;
  isFavorite: boolean;
}

async function updateFavorite(payload: IUpdateFavoritePayload) {
  const response = await axios.put(urls.api.evaluationsFavorite, payload);
  return response.data;
}

/**
 * Updates the favorite status of an evaluation.
 */
export function useUpdateFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFavorite,
    onSuccess: () => {
      // Invalidate cache to refetch the evaluations
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
    },
  });
}
