import React from 'react';
import { ShieldCheck, UserCheck, RefreshCw, FileSearch, HeartHandshake, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const trustFeatures = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#2A5A43]" />,
      title: '5-Stage Screening Process',
      description: '100% verified screening, criminal background verification, past employer reference checks, and complete health checkup.'
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#D96C4E]" />,
      title: 'Free Helper Replacement',
      description: 'If staff goes on unscheduled leave or if you desire a different match, we assign a background-verified replacement candidate seamlessly.'
    },
    {
      icon: <UserCheck className="w-8 h-8 text-[#2A5A43]" />,
      title: 'Transparent Pricing',
      description: 'No hidden charges. Clear, fair, and straightforward pricing after interviewing and finalizing your domestic staff.'
    },
    {
      icon: <FileSearch className="w-8 h-8 text-[#D96C4E]" />,
      title: 'Document Dossier Provided',
      description: 'Complete physical & digital copies of 100% verified staff dossier, government ID proof, and candidate photograph.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-[#2A5A43]" />,
      title: 'Dedicated Placement Manager',
      description: 'A single point of contact supervisor to assist with duty scheduling, feedback resolution, replacement requests, and staff welfare.'
    },
    {
      icon: <Award className="w-8 h-8 text-[#D96C4E]" />,
      title: 'Hygienic & Skill Trained',
      description: 'Staff trained in modern appliance usage, food safety protocols, child hygiene standards, senior handling techniques, and courteous etiquette.'
    }
  ];

  return (
    <section id="why-us" className="py-8 sm:py-10 bg-[#FAF9F5] scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Verification & Safety First
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2723] tracking-tight">
            Why 15,000+ Families Trust Maid for Ghar
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5A53]">
            We bridge the gap between household safety and domestic staff reliability with uncompromised background checks and dedicated service guarantees.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {trustFeatures.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-white p-4.5 sm:p-5 rounded-2xl border border-[#2A5A43]/10 shadow-2xs hover:shadow-md transition-all duration-300 space-y-2.5 flex flex-col justify-start"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] flex items-center justify-center border border-gray-100 shrink-0">
                {React.cloneElement(feat.icon, { className: "w-5 h-5 " + (feat.icon.props.className.includes('#D96C4E') ? 'text-[#D96C4E]' : 'text-[#2A5A43]') })}
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#2A5A43]">
                {feat.title}
              </h3>
              <p className="text-xs text-[#4A5A53] leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
