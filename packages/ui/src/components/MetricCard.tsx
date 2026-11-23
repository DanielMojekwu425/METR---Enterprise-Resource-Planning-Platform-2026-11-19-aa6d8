import React from 'react';

export interface MetricCardProps {
  eyebrow: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'neutral';
  className?: string;
}

/**
 * Metric Card: White surface, 16px corner radius, upper 11px eyebrow,
 * prominent 28px Manrope tabular numeral, and bottom directional micro-indicator.
 */
export function MetricCard({
  eyebrow,
  value,
  delta,
  deltaTone = 'neutral',
  className = '',
}: MetricCardProps) {
  return (
    <div className={`metr-card rounded-[1rem] p-5 flex flex-col justify-between gap-2 ${className}`}>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#526579]">
        {eyebrow}
      </span>
      <span className="font-[Manrope] font-tabular text-[26px] sm:text-[28px] font-bold leading-[34px] tracking-[-0.015em] text-[#172B4D]">
        {value}
      </span>
      {delta && (
        <span
          className={`text-[12px] font-semibold font-tabular ${
            deltaTone === 'positive' ? 'text-[#0F766E]' : 'text-[#526579]'
          }`}
        >
          {delta}
        </span>
      )}
    </div>
  );
}
