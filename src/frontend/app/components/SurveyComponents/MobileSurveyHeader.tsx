import ContentWrapper from '../ContentWrapper';
import Logo from '@app/assets/images/logo.svg';
import { urls } from '../../utils/urls';

export default function MobileSurveyHeader() {

  return (
    <header className="w-full bg-brand-2 text-brand-7">
      <ContentWrapper className="flex justify-between items-center sm:py-5">
        <div className="w-[150px]">
          <a href={urls.survey}>
            <img src={Logo} alt="EvalEase Logo" />
          </a>
        </div>
        <div>

            <div className="flex justify-center gap-x-8">
              <nav>
                {' '}
                {/* Um Text untereinander anzuzeigen */}
                <p className="text-center text-xs font-semibold">
                  Hochschule Darmstadt
                </p>
                <p className="text-center text-xs font-semibold">
                  Prof. Dr. Kawa Nazemi
                </p>
                <p className="text-center text-xs font-semibold">Informatik</p>
                <p className="text-center text-xs font-semibold">
                  Human Computer Interaction
                </p>
              </nav>
            </div>

        </div>
      </ContentWrapper>
    </header>
  );
}
