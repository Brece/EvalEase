import classNames from 'classnames';
import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  children: ReactNode;
  title: string;
}

export function Modal({ isOpen, setIsOpen, children, title }: IModalProps) {
  return (
    <div className={classNames('absolute', { hidden: !isOpen })}>
      <div
        className="fixed inset-0 z-40 w-full h-full bg-brand-6 opacity-35 left-0 right-0 top-0 bottom-0"
        onClick={() => setIsOpen(false)}
      ></div>

      <div className="z-50 min-w-[300px] flex flex-col gap-y-8 p-8 fixed top-[20%] left-[50%] -translate-x-[50%]  bg-brand-12 rounded-md">
        <h2 className="text-3xl font-semibold text-center">{title}</h2>
        <div
          className="absolute right-2 top-2 text-brand-3 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <XMarkIcon className="w-[24px] h-[24px]" />
        </div>
        {children}
      </div>
    </div>
  );
}
