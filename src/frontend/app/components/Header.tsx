import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

import ContentWrapper from './ContentWrapper';
import Logo from '@app/assets/images/logo.svg';
import { urls } from '../utils/urls';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-2 text-brand-7">
      <ContentWrapper className="flex justify-between items-center sm:py-5">
        <div className="w-[220px]">
          <a onClick={() => navigate(urls.home)}>
            <img src={Logo} alt="EvalEase Logo" />
          </a>
        </div>
        <div>
          {authenticated ? (
            <nav className="flex justify-between items-center gap-x-24">
              <div className="flex justify-center gap-x-8">
                <a
                  className="mr-4 hover:text-brand-1 ease-in-out duration-200 cursor-pointer"
                  onClick={() => navigate(urls.home)}
                >
                  Home
                </a>
                <a
                  className="mr-4 hover:text-brand-1 ease-in-out duration-200 cursor-pointer"
                  onClick={() => navigate(urls.surveyBuilder)}
                >
                  Survey Builder
                </a>
              </div>
              <div>
                <a
                  className="flex items-center hover:text-brand-1 ease-in-out duration-200 cursor-pointer"
                  onClick={() => navigate(urls.profile)}
                >
                  <UserCircleIcon className="w-[50px] h-[50px]" />
                  <Cog6ToothIcon className="w-[24px] h-[24px]" />
                </a>
              </div>
            </nav>
          ) : null}
        </div>
      </ContentWrapper>
    </header>
  );
}
