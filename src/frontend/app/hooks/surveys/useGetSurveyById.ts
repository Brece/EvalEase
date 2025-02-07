import axios from 'axios';
import { useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { urls } from '../../utils/urls';

async function getSurveyById(id: string) {
  const response = await axios.get(`${urls.api.surveys}/${id}`);
  return response.data;
}

export function useGetSurveyById(id: string) {
  const location = useLocation();
  const isSurveyBuilder = location.pathname.startsWith(urls.surveyBuilder);
  const isSurvey = location.pathname.startsWith(urls.survey);
  return useQuery({
    queryKey: ['surveys', id],
    queryFn: () =>
      (isSurveyBuilder || isSurvey) && id
        ? getSurveyById(id)
        : Promise.resolve(null), // Only fetch if ID exists
    enabled: !!id, // Disable query when ID is missing
    retry: false, // Disable retries to display error message immediatly
  });
}
