import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { urls } from '../../utils/urls';

interface ICreateSurveyProps {
  title: string;
}

async function createSurvey({ title }: ICreateSurveyProps) {
  const response = await axios.post(urls.api.surveys, { data: title });
  return response.data;
}

/**
 * Creates a survey.
 */
export function useCreateSurvey() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createSurvey,
    onSuccess: (newSurvey) => {
      // Invalidate cache to refetch the surveys
      queryClient.invalidateQueries({ queryKey: ['surveys'] });

      // Redirect to new survey
      if (newSurvey?._id) {
        navigate(`${urls.surveyBuilder}/${newSurvey._id}`);
      }
    },
  });
}
