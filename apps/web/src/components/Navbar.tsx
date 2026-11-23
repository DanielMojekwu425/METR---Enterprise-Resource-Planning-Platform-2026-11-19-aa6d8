import React, { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { BrandMark, Button } from '@metr/ui';

const NAV_LINKS = [
  { href: '#workflow', label: 'Workflows' },
  { href: '#modules', label: 'Modules' },
  { href: '#architecture', label: 'Security' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#D7E0E8]">
      {/* Subtle precision scroll progress track */}
      <motion.div
        style={{ scaleX }}
        className="h-[2px] bg-[#0F766E] origin-left w-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          aria-label="3Metr Home"
          className="metr-focus rounded-[0.5rem] py-1"
        >
          <BrandMark />
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#526579] hover:text-[#102A43] transition-colors duration-150 whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#0F766E] hover:after:w-full after:transition-all after:duration-150 metr-focus rounded-[0.25rem]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden md:flex items-center shrink-0">
          <Button asAnchor href="#waitlist" variant="primary" size="sm">
            Join Waitlist
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-[0.5rem] border border-[#D7E0E8] text-[#172B4D] hover:bg-[#F5F7FA] metr-focus"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-white border-t border-[#E5EBF0]"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-3 rounded-[0.5rem] text-[15px] font-medium text-[#172B4D] hover:bg-[#F5F7FA] hover:text-[#0F766E] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-[#E5EBF0]">
                <a
                  href="#waitlist"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-[0.5rem] bg-[#0F766E] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#0D655E]"
                >
                  Join Waitlist
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
