import React, { useMemo, useState } from 'react';
import { Accordion, Reveal } from '@metr/ui';
import { FAQ_ITEMS } from '../data/metrContent';

const FAQ_CATEGORIES = ['All', 'Platform', 'Accounting', 'Security', 'Rollout'];

export function FaqSection() {
  const [category, setCategory] = useState('All');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const filteredItems = useMemo(() => {
    if (category === 'All') return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === category);
  }, [category]);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-[#F5F7FA] border-b border-[#E5EBF0] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 4 Columns: Framing & Category Filters */}
          <Reveal className="lg:col-span-4 space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0F766E] mb-3">
                Frequently Asked Questions
              </p>
              <h2 className="font-[Manrope] text-[28px] sm:text-[34px] font-bold leading-[1.2] tracking-[-0.02em] text-[#102A43]">
                Clear answers for business & finance leaders.
              </h2>
              <p className="mt-3 text-[15px] leading-[24px] text-[#526579]">
                Everything you need to know about multi-company accounting, team permissions, data
                privacy, and phased onboarding.
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter FAQ by topic"
              className="flex flex-wrap gap-2 pt-1"
            >
              {FAQ_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setCategory(cat);
                      const firstMatch =
                        cat === 'All'
                          ? FAQ_ITEMS[0]
                          : FAQ_ITEMS.find((item) => item.category === cat);
                      setOpenId(firstMatch ? firstMatch.id : null);
                    }}
                    className={`px-3 py-1.5 rounded-[0.5rem] text-[12px] font-semibold border transition-colors whitespace-nowrap metr-focus ${
                      active
                        ? 'bg-[#102A43] text-white border-[#102A43]'
                        : 'bg-white text-[#526579] border-[#D7E0E8] hover:text-[#172B4D] hover:border-[#526579]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Right 8 Columns: Clean Divided Accordion */}
          <div className="lg:col-span-8">
            <Accordion items={filteredItems} openId={openId} onToggle={handleToggle} />
          </div>
        </div>
      </div>
    </section>
  );
}
