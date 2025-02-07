import Cookies from 'js-cookie';

/**
 * Check if the user is authenticated
 */
export function isAuthenticated() {
  const token = Cookies.get('app_token');

  return (token?.length ?? 0) > 0;
}
