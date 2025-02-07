import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

interface IDeleteSruveyQuestionByIdProps {
  surveyId: string;
  questionId: string;
}

async function deleteSurveyQuestionById({
  surveyId,
  questionId,
}: IDeleteSruveyQuestionByIdProps) {
  const response = await axios.delete(
    `${urls.api.surveys}/${surveyId}/questions/${questionId}`,
    { data: { questionId } },
  );
  return response.data;
}

/**
 * Deletes a survey question.
 */
export function useDeleteSurveyQuestionById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSurveyQuestionById,
    onSuccess: () => {
      // Invalidate cache to refetch the surveys
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });
}
