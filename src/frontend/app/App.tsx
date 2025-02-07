import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';

import Layout from './components/Layout';
import { PageLoader } from './components/PageLoader';
import { Pages } from './pages/index';
import { Protected, Public } from './components/Guards';
import { urls } from './utils/urls';

/**
 * The App component is the root component of the app.
 */
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Layout>
        {/* prettier-ignore */}
        <Routes>
          {/* Public routes */}
          <Route path={urls.login} element={<Public component={Pages.Login} />} />

          {/* Protected routes */}
          <Route path={urls.home} element={<Protected component={Pages.Home} />} />
          <Route path={urls.profile} element={<Protected component={Pages.Profile} />} />
          <Route path={`${urls.evaluation}/:id`} element={<Protected component={Pages.Evaluation} />} />
          <Route path={`${urls.presentation}/:id`} element={<Protected component={Pages.Presentation} />} />
          <Route path={`${urls.surveyBuilder}/:id?`} element={<Protected component={Pages.SurveyBuilder} />} />
          <Route path={`${urls.survey}/:id`} element={<Public component={Pages.Survey} />} />
          <Route path={`${urls.evaluationResult}/:id`} element={<Public component={Pages.EvaluationResult} />} />

          {/* 404 */}
          <Route path="*" element={<Public component={Pages.NotFound} />} />
        </Routes>
      </Layout>
    </Suspense>
  );
}
