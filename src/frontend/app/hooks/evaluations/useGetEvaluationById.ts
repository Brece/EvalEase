import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

async function getEvaluationById(id: string) {
  const response = await axios.get(`${urls.api.evaluations}/${id}`);
  return response.data;
}

export function useGetEvaluationById(id: string) {
  return useQuery({
    queryKey: ['evaluation', id],
    queryFn: () => getEvaluationById(id),
    retry: false, // Disable retries to display error message immediatly
  });
}
