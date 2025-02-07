import { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';

import { isAuthenticated } from '../utils/auth';
import { urls } from '../utils/urls';

interface IPublicProps {
  component: ComponentType<any>;
  [key: string]: any;
}

/**
 * The Public component is a wrapper around a page component that is accessible  without being authenticated.
 */
export function Public({ component: PageComponent, ...props }: IPublicProps) {
  return <PageComponent {...props} />;
}

/**
 * The Protected component is a wrapper around a page component that is only accessible if the user is authenticated.
 */
export function Protected({ ...props }) {
  if (!isAuthenticated()) {
    return <Navigate to={urls.login} />;
  }

  return <Public component={props.component} {...props} />;
}
