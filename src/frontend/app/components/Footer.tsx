import ContentWrapper from './ContentWrapper';

export default function Footer() {
  return (
    <footer className="w-full bg-brand-5 text-white text-xs font-extralight">
      <ContentWrapper className="py-10 flex flex-col justify-center items-center gap-y-5 sm:gap-y-10">
        <p>
          Made with <span className="text-red-600">❤️</span> by
        </p>
        <div className="flex gap-x-7 sm:gap-x-14">
          <p>Daniel Hecht</p>
          <p>Edwin Schweigert</p>
          <p>Nui Ruppert</p>
        </div>
        <p>© 2025 EvalEase</p>
      </ContentWrapper>
    </footer>
  );
}
