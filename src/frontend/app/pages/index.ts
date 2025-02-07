import React from 'react';

/**
 * This file is used to lazy load pages in the app.
 */
export const Pages = {
  // TODO: Add more pages here for lazy loading
  Login: React.lazy(() => import('./Login')),
  Home: React.lazy(() => import('./Home')),
  Profile: React.lazy(() => import('./Profile')),
  NotFound: React.lazy(() => import('./NotFound')),
  Evaluation: React.lazy(() => import('./Evaluation')),
  Presentation: React.lazy(() => import('./Presentation')),
  SurveyBuilder: React.lazy(() => import('./SurveyBuilder')),
  Survey: React.lazy(() => import('./Survey')),
  EvaluationResult: React.lazy(() => import('./EvaluationResult')),
};
