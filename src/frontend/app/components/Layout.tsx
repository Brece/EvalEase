import { ReactNode } from 'react';
import { useLocation } from 'react-router';

import ContentWrapper from './ContentWrapper';
import Footer from './Footer';
import Header from './Header';
import MobileSurveyFooter from './SurveyComponents/MobileSurveyFooter';
import MobileSurveyHeader from './SurveyComponents/MobileSurveyHeader';
import { AuthProvider } from '../context/AuthContext';

interface ILayoutProps {
  children: ReactNode;
}

/**
 * The Layout component is a wrapper around the main content of the app.
 */
export default function Layout({ children }: ILayoutProps) {
  // Check if the current page is a mobile survey page for student
  const location = useLocation();
  const isSurveyPage = ['survey/', 'result'].some((path) =>
    location.pathname.includes(path),
  );

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        {isSurveyPage ? <MobileSurveyHeader /> : <Header />}

        {/* Main content */}
        <main className="flex-grow">
          <ContentWrapper>{children}</ContentWrapper>
        </main>

        {/* Footer */}
        {isSurveyPage ? <MobileSurveyFooter /> : <Footer />}
      </div>
    </AuthProvider>
  );
}
