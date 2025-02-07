import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { urls } from '../../utils/urls';

async function deleteSurveyById(id: string) {
  const response = await axios.delete(`${urls.api.surveys}/${id}`);
  return response.data;
}

/**
 * Deletes a survey.
 */
export function useDeleteSurveyById() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteSurveyById,
    onSuccess: () => {
      // Invalidate cache to refetch the surveys, with a delay for redirect to prevent fetching deleted survey id
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['surveys'] });
      }, 100);

      // Navigate to the surveys default template
      navigate(`${urls.surveyBuilder}/0`);
    },
  });
}
