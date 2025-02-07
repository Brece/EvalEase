import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IQuestionResultObject } from '../../utils/interfaces';
import { urls } from '../../utils/urls';

interface IUpdateEvaluationresultByIdProps {
  data: IQuestionResultObject;
}

async function updateEvaluationResultById(
  payload: IUpdateEvaluationresultByIdProps,
) {
  const response = await axios.put(
    `${urls.api.evaluationsResult}/${payload.data._id}`,
    payload,
  );
  return response.data?.data;
}

/**
 * Updates the result of an evaluation.
 */
export function useUpdateEvaluationResultById(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvaluationResultById,
    onSuccess: () => {
      // Invalidate cache to refetch the evaluations
      queryClient.invalidateQueries({ queryKey: ['evaluation', id] });
    },
  });
}
