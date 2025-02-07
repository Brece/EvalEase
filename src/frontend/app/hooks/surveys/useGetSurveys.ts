import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

async function getSurveys() {
  const response = await axios.get(urls.api.surveys);
  return response.data;
}

/**
 * Fetches the surveys.
 */
export function useGetSurveys() {
  return useQuery({
    queryKey: ['surveys'],
    queryFn: getSurveys,
  });
}
