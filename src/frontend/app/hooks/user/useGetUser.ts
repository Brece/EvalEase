import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { IUserObject } from '../../utils/interfaces';
import { urls } from '../../utils/urls';

async function getUser() {
  const response = await axios.get(urls.api.user);
  return response.data;
}

/**
 * Fetches the user information.
 */
export function useGetUser() {
  return useQuery<IUserObject>({
    queryKey: ['user'],
    queryFn: getUser,
  });
}
