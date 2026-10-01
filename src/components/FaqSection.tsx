import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MinusCircle, PlusCircle } from 'lucide-react';
import { FAQS } from '../constants/appData';

export const FaqSection: React.FC = () => {
  // All FAQ items start closed by default (empty array)
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleFaq = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const hasAnyOpen = openIds.length > 0;

  const handleToggleAll = () => {
    if (hasAnyOpen) {
      setOpenIds([]); // Close all
    } else {
      setOpenIds(FAQS.map(faq => faq.id)); // Expand all
    }
  };

  return (
    <section id="faq" className="py-8 sm:py-10 bg-[#FAF9F5] scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="text-center space-y-1.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> Clear Answers & Transparency
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2723] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5A53]">
            Everything you need to know about background checks, interviews, replacements, and duty hours.
          </p>

          {/* Quick Collapse All / Expand All Action */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              id="faq-toggle-all-btn"
              onClick={handleToggleAll}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#2A5A43] transition-all cursor-pointer shadow-2xs hover:border-[#2A5A43]/30"
              aria-label={hasAnyOpen ? 'Close all questions' : 'Expand all questions'}
            >
              {hasAnyOpen ? (
                <>
                  <MinusCircle className="w-3.5 h-3.5 text-[#D96C4E]" />
                  <span>Collapse All ({openIds.length} open)</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5 text-[#2A5A43]" />
                  <span>Expand All Questions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2.5">
          {FAQS.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div 
                key={faq.id}
                id={`faq-card-${faq.id}`}
                className={`bg-white rounded-xl border transition-all shadow-2xs ${
                  isOpen ? 'border-[#2A5A43]/30 shadow-xs' : 'border-[#2A5A43]/10 hover:border-[#2A5A43]/20'
                }`}
              >
                <button
                  type="button"
                  id={`faq-btn-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-ans-${faq.id}`}
                  className="w-full px-4 py-3 sm:py-3.5 text-left flex items-center justify-between gap-3 font-serif font-bold text-xs sm:text-sm text-[#1C2723] hover:text-[#2A5A43] transition-colors focus:outline-none cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#F1F4EB] text-[#2A5A43] shrink-0 font-semibold">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#2A5A43] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div 
                    id={`faq-ans-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${faq.id}`}
                    className="px-4 pb-3.5 pt-0 text-xs text-[#4A5A53] leading-relaxed border-t border-gray-100 mt-1 animate-in fade-in duration-200"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Contact Note */}
        <div className="mt-6 text-center text-xs text-[#4A5A53] flex items-center justify-center gap-1.5 flex-wrap">
          <span>Have a unique question? Our placement desk is available on call to answer any queries at</span>
          <a href="tel:+919364798027" className="font-bold text-[#2A5A43] hover:underline inline-flex items-center gap-1">
            <span>+91 93647 98027</span>
          </a>
        </div>

      </div>
    </section>
  );
};
