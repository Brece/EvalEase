/**
 * This file contains all the URLs used in the application.
 */
export const urls = {
  // TODO: Add more page URLs here
  login: '/login',
  home: '/',
  profile: '/profile',
  evaluation: '/evaluation',
  presentation: '/presentation',
  surveyBuilder: '/survey-builder',
  survey: '/survey',
  evaluationResult: '/result',

  // TODO: Add more API URLs here
  api: {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    evaluations: '/api/v1/evaluations',
    evaluationsFavorite: '/api/v1/evaluations/favorite',
    evaluationsResult: '/api/v1/evaluations/result',
    surveys: '/api/v1/surveys',
    user: '/api/v1/user',
  },
};
