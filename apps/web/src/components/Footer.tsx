import React from 'react';
import { BrandMark } from '@metr/ui';

export function Footer() {
  return (
    <footer className="bg-[#102A43] text-[#EDF0FF] border-t border-[#172B4D]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <BrandMark inverted />
            <p className="text-[14px] leading-[22px] text-[#B0C9E8] max-w-[44ch]">
              3Metr is a unified Enterprise Resource Planning platform built for connected sales,
              purchasing, service delivery, and double-entry financial reporting.
            </p>
            <p className="text-[12px] font-medium text-[#80D5CB]">
              Multi-Entity Operations &amp; Accounting Platform
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#80D5CB]">
              Platform Sections
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#D1E4FF]">
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  Connected Workflows
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-white transition-colors">
                  Platform Modules
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Security &amp; Controls
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors">
                  Rollout Roadmap
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#80D5CB]">
              Built-In Business Safeguards
            </h3>
            <ul className="space-y-2 text-[13px] text-[#B0C9E8]">
              <li>Multi-Company &amp; Multi-Currency Separation</li>
              <li>Automatic Double-Entry Financial Accuracy</li>
              <li>Role-Based Access &amp; Dual Approval Controls</li>
              <li>Continuous Automated Backups &amp; Recovery</li>
              <li>NDPA Data Privacy &amp; Full Audit History</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[#B0C9E8]">
          <p>© {new Date().getFullYear()} 3Metr Enterprise Resource Planning Platform.</p>
          <p>Unified Operations &amp; Double-Entry Finance</p>
        </div>
      </div>
    </footer>
  );
}
