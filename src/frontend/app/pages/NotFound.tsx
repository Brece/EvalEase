import { useNavigate } from 'react-router';

import Button from '../components/Button';
import { urls } from '../utils/urls';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-semibold text-brand-3">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-brand-5 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            label="Go back home"
            onClick={() => navigate(urls.home)}
            color="primary"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
