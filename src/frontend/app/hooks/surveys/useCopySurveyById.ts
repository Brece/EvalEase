import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { urls } from '../../utils/urls';

async function copySurveyById({ surveyId }: { surveyId: string }) {
  const response = await axios.post(`${urls.api.surveys}/${surveyId}/copy`);
  return response.data;
}

/**
 * Copies a survey.
 */
export function useCopySurveyById() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: copySurveyById,
    onSuccess: (survey) => {
      // Invalidate cache to refetch the surveys
      queryClient.invalidateQueries({ queryKey: ['surveys'] });

      // Redirect to new survey copy
      navigate(`${urls.surveyBuilder}/${survey._id}`);
    },
  });
}
