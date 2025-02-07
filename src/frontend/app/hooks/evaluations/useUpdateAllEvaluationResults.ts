import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  ICategorizedQuestionResultsObject,
  IQuestionResultObject,
} from '../../utils/interfaces';
import { urls } from '../../utils/urls';

interface IUpdateAllEvaluationResultsProps {
  id: string;
  results: ICategorizedQuestionResultsObject[];
}

async function updateAllEvaluationResults({
  id,
  results,
}: IUpdateAllEvaluationResultsProps) {
  // Flatten the categorized results and send question results to the server
  const data: IQuestionResultObject[] = [];

  results.forEach((category) => {
    data.push(...category.questions);
  });

  const response = await axios.put(`${urls.api.evaluations}/${id}/results`, {
    data,
  });
  return response.data?.data;
}

/**
 * Updates all the results of an evaluation.
 */
export function useUpdateAllEvaluationResults(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAllEvaluationResults,
    onSuccess: () => {
      // Invalidate cache to refetch the evaluations
      queryClient.invalidateQueries({ queryKey: ['evaluation', id] });
    },
  });
}
