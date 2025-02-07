import classNames from 'classnames';

interface IButtonProps {
  label: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  width?: 'full' | 'auto';
  type?: 'button' | 'submit';
  color?: 'primary' | 'secondary' | 'ternary' | 'active' | 'inactive';
  hasIcon?: boolean;
  icon?: React.ElementType;
  onClick?: () => void;
}

/**
 * The Button component is a reusable button component.
 */
export default function Button({
  label,
  size = 'small',
  width = 'auto',
  type = 'button',
  color = 'primary',
  hasIcon = false,
  icon: IconComponent,
  className,
  onClick = () => {},
}: IButtonProps) {
  return (
    <button
      className={classNames(
        'w-auto rounded-md text-white hover:opacity-80 ease-in-out duration-200',
        {
          'px-4 py-2': size === 'small',
          'px-6 py-3': size === 'medium',
          'px-8 py-4': size === 'large',
          'w-full': width === 'full',
          'bg-brand-3': color === 'secondary',
          'bg-brand-8': color === 'primary',
          'bg-brand-1': color === 'active',
          'bg-brand-9': color === 'inactive',
          'bg-brand-7': color === 'ternary',
          'flex justify-between items-center': hasIcon && IconComponent,
        },
        className,
      )}
      type={type}
      onClick={onClick}
    >
      {label}
      {hasIcon && IconComponent && (
        <IconComponent className="w-[18px] h-[18px]" />
      )}
    </button>
  );
}
