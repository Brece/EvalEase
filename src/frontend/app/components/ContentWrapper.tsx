import classNames from 'classnames';
import { ReactNode } from 'react';

interface IContentWrapperProps {
  className?: string; // Optional class name
  children: ReactNode;
}

export default function ContentWrapper({
  className,
  children,
}: IContentWrapperProps) {
  return (
    <div
      className={classNames(
        'max-w-[1320px] h-full relative my-0 mx-auto py-5 px-5 sm:py-10 sm:px-12',
        className,
      )}
    >
      {children}
    </div>
  );
}
