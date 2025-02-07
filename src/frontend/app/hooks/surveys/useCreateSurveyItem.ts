import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { urls } from '../../utils/urls';

interface ICreateSurveyItemProps {
  surveyId: string;
  data: {
    question: string;
    options: string[];
    displayType: string;
  };
}

async function createSurveyItem({ surveyId, data }: ICreateSurveyItemProps) {
  const response = await axios.post(`${urls.api.surveys}/${surveyId}`, {
    data,
  });
  return response.data;
}

/**
 * Creates a survey item.
 */
export function useCreateSurveyItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSurveyItem,
    onSuccess: () => {
      // Invalidate cache to refetch the surveys
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });
}
