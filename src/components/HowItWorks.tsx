import React from 'react';
import { Sparkles, PhoneCall, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenBookingModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBookingModal }) => {
  const steps = [
    {
      stepNum: '01',
      title: 'Share Your Requirement',
      description: 'Select your preferred service (Maid, Cook, Nanny, Senior Care, Driver), shift hours, and city. Takes less than 2 minutes.',
      icon: <Sparkles className="w-6 h-6 text-[#2A5A43]" />
    },
    {
      stepNum: '02',
      title: 'Shortlist Verified Profiles',
      description: 'We curate candidates matching your location & diet. Review experience, 100% verified staff badges, and verified credential profiles.',
      icon: <PhoneCall className="w-6 h-6 text-[#D96C4E]" />
    },
    {
      stepNum: '03',
      title: 'Interview & Selection',
      description: 'Conduct a telephonic interview to evaluate candidate experience, skills, and comfort for your family.',
      icon: <UserCheck className="w-6 h-6 text-[#2A5A43]" />
    },
    {
      stepNum: '04',
      title: 'Seamless Placement & Support',
      description: 'Finalize placement with complete background verification dossiers. Enjoy free helper replacement guarantee whenever needed.',
      icon: <ShieldCheck className="w-6 h-6 text-[#D96C4E]" />
    }
  ];

  return (
    <section id="how-it-works" className="py-8 sm:py-10 bg-gradient-to-b from-[#FAF9F5] via-[#F1F5E8] to-[#FAF9F5] scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Simple 4-Step Process
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2723] tracking-tight">
            How Maid for Ghar Works
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5A53]">
            Hiring domestic help is simple, transparent, and completely risk-free.
          </p>
        </div>

        {/* Timeline Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {steps.map((st, idx) => (
            <div 
              key={idx}
              className="bg-white p-4.5 sm:p-5 rounded-2xl border border-[#2A5A43]/10 shadow-2xs relative flex flex-col justify-between space-y-3 hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-serif text-2xl font-bold text-[#2A5A43]/30">
                    {st.stepNum}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] flex items-center justify-center border border-gray-100">
                    {st.icon}
                  </div>
                </div>

                <h3 className="font-serif text-base font-bold text-[#2A5A43] mb-1.5">
                  {st.title}
                </h3>
                <p className="text-xs text-[#4A5A53] leading-relaxed">
                  {st.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#2A5A43]/30 font-bold text-base">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-8 text-center bg-white p-5 sm:p-6 rounded-2xl border border-[#2A5A43]/15 shadow-2xs max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left space-y-0.5">
            <div className="font-serif text-base sm:text-lg font-bold text-[#1C2723]">Ready to find reliable domestic help?</div>
            <div className="text-xs text-[#4A5A53]">Takes 2 minutes to request background-checked placement.</div>
          </div>
          <button
            onClick={onOpenBookingModal}
            className="px-5 py-2.5 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-bold text-xs uppercase tracking-wider shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Book Domestic Help</span>
          </button>
        </div>

      </div>
    </section>
  );
};
