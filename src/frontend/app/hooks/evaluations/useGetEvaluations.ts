import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

async function getEvaluations() {
  const response = await axios.get(urls.api.evaluations);
  return response.data;
}

/**
 * Fetches the evaluations.
 */
export function useGetEvaluations() {
  return useQuery({
    queryKey: ['evaluations'],
    queryFn: getEvaluations,
  });
}
