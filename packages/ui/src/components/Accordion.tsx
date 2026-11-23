import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  category: string;
  question: string;
  answer: string;
  specRef?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  openId: string | null;
  onToggle: (id: string) => void;
}

/**
 * Precision Ledger & Flow Accordion:
 * Clean, non-bordered horizontal cards separated by 1px #E5EBF0 dividers.
 * Bold Manrope titles (18px) shift from #172B4D to #0F766E when active.
 */
export function Accordion({ items, openId, onToggle }: AccordionProps) {
  return (
    <div className="divide-y divide-[#E5EBF0] border-t border-b border-[#E5EBF0]">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="bg-transparent">
            <button
              type="button"
              id={`faq-trigger-${item.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => onToggle(item.id)}
              className="w-full py-6 px-1 flex items-center justify-between gap-6 text-left group metr-focus rounded-[0.5rem]"
            >
              <span
                className={`font-[Manrope] text-[18px] font-bold leading-[26px] tracking-[-0.01em] transition-colors duration-150 ${
                  isOpen ? 'text-[#0F766E]' : 'text-[#172B4D] group-hover:text-[#0F766E]'
                }`}
              >
                {item.question}
              </span>
              <ChevronDown
                size={20}
                strokeWidth={2}
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#0F766E]' : 'text-[#526579] group-hover:text-[#172B4D]'
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${item.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-8 pl-1 space-y-2.5">
                    <p className="text-[15px] leading-[24px] text-[#3E4947] max-w-[72ch]">
                      {item.answer}
                    </p>
                    {item.specRef && (
                      <p className="text-[12px] font-medium text-[#526579] font-tabular">
                        Reference · {item.specRef}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
