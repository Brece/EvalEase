import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ISurveyObject } from '../../utils/interfaces';
import { urls } from '../../utils/urls';

interface IUpdateSurveyByIdProps {
  data: ISurveyObject;
}

async function updateSurveyById({ data }: IUpdateSurveyByIdProps) {
  const response = await axios.put(`${urls.api.surveys}/${data._id}`, { data });
  return response.data;
}

/**
 * Updates the order of questions in a survey.
 */
export function useUpdateSurveyById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSurveyById,
    onSuccess: () => {
      // Invalidate cache to refetch the surveys
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
    onError: (error) => {
      console.error('Error updating survey:', error);
    },
  });
}
