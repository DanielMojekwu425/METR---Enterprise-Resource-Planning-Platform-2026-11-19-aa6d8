import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'inverted';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asAnchor?: boolean;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0F766E] text-white border border-transparent hover:bg-[#0D655E] active:bg-[#0B544E] shadow-[0_1px_2px_rgba(16,42,69,0.08)]',
  secondary:
    'bg-white text-[#172B4D] border border-[#D7E0E8] hover:bg-[#F5F7FA] hover:border-[#526579] active:bg-[#E5EBF0]',
  tertiary:
    'bg-transparent text-[#102A43] border border-transparent hover:bg-[#E5EBF0] active:bg-[#D7E0E8]',
  inverted:
    'bg-[#0F766E] text-white border border-[#2DD4BF]/30 hover:bg-[#0D655E] active:bg-[#0B544E]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[13px] leading-[18px]',
  md: 'px-5 py-3 text-[14px] leading-[20px]',
  lg: 'px-6 py-3.5 text-[15px] leading-[20px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  asAnchor = false,
  href,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[0.5rem] font-semibold tracking-[0.01em] whitespace-nowrap shrink-0 transition-colors duration-150 metr-focus disabled:opacity-50 disabled:cursor-not-allowed';

  const combined = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (asAnchor && href) {
    return (
      <a href={href} className={combined}>
        {children}
      </a>
    );
  }

  return (
    <button type={rest.type ?? 'button'} className={combined} {...rest}>
      {children}
    </button>
  );
}
