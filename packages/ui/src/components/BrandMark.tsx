import React from 'react';

export interface BrandMarkProps {
  inverted?: boolean;
  className?: string;
}

/**
 * 3Metr unified brand wordmark:
 * - "3": official attached metr-mark SVG
 * - "M": official attached metrM SVG geometry (without outer border rect)
 * - "ETR": Manrope ExtraBold wordmark suffix
 */
export function BrandMark({ inverted = false, className = '' }: BrandMarkProps) {
  const textColor = inverted ? 'text-white' : 'text-[#102A43]';
  const mStroke = inverted ? '#CBD5E1' : '#64748B';
  const accentColor = inverted ? '#2DD4BF' : '#0F766E';

  return (
    <span
      aria-label="3Metr"
      className={`inline-flex items-center whitespace-nowrap shrink-0 ${className}`}
    >
      <img
        src="/assets/aistudio/metr-mark_85805334.svg"
        alt=""
        width={26}
        height={26}
        aria-hidden="true"
        className={`h-[26px] w-[26px] shrink-0 object-contain -ml-[5px] -mr-[3.5px] ${
          inverted ? 'brightness-[1.75] saturate-[1.15]' : ''
        }`}
      />
      <svg
        width={18}
        height={18}
        viewBox="6.2 6.2 15.6 15.2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-[17.5px] w-[18px] shrink-0 -translate-y-[1px] mr-[1.5px]"
      >
        <path
          d="M7.5 19.5V9.5L14 15.5L20.5 9.5V19.5"
          stroke={mStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 15.5V20"
          stroke={accentColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="8.5" r="2" fill={accentColor} />
      </svg>
      <span
        aria-hidden="true"
        className={`font-[Manrope] text-[20px] font-extrabold tracking-[-0.03em] leading-none ${textColor}`}
      >
        ETR
      </span>
    </span>
  );
}
