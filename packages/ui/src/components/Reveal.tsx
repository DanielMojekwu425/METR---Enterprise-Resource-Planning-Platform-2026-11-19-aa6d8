import React from 'react';
import { motion } from 'motion/react';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Subtle scroll-entry animation wrapper using compositor-only transform + opacity.
 * viewport={{ once: true, amount: 0.12 }} keeps content accessible with zero layout shift.
 */
export function Reveal({ children, delay = 0, y = 16, className = '' }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
