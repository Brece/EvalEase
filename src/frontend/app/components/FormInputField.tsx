import React from 'react';
import classNames from 'classnames';

interface IFormInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  className?: string;
  error?: string;
}

/**
 * The FormInputField component is a reusable form input field component.
 */
function FormInputField(
  {
    name,
    label,
    type = 'text',
    error,
    className,
    ...rest
  }: IFormInputFieldProps,
  ref: React.Ref<HTMLInputElement>,
) {
  return (
    <div
      className={classNames(
        'flex flex-col sm:flex-row justify-end items-start sm:items-center mb-10 relative',
        className,
      )}
    >
      <label htmlFor={name} className="mr-8 mb-3 sm:mb-0 text-right flex-grow">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        name={name}
        className="w-full sm:w-[80%] border-black rounded-md"
        {...rest}
      />
      {error && (
        <p className="absolute -bottom-6 sm:bottom-auto sm:top-12 sm:left-[20%] text-brand-3 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
export default React.forwardRef(FormInputField);
