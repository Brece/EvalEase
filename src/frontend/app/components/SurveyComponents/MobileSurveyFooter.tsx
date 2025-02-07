import ContentWrapper from '../ContentWrapper';

export default function MobileSurveyFooter() {
  return (
    <footer className="w-full bg-brand-5 text-white text-xs font-extralight">
      <ContentWrapper className="py-10 flex flex-col justify-center items-center gap-y-5 sm:gap-y-10">
        <p>
          Made with <span className="text-red-600">❤️</span>
        </p>
        <p>© 2025 EvalEase</p>
      </ContentWrapper>
    </footer>
  );
}
