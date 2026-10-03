import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, PhoneCall, Sparkles, Facebook, Instagram } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { CITIES_LIST } from '../constants/appData';
import { LegalInfoModal, InfoModalTab } from './LegalInfoModal';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';

interface FooterProps {
  onOpenBookingModal: () => void;
  onOpenInquiryModal: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectCity?: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBookingModal,
  onOpenInquiryModal,
  onSelectCategory,
  onSelectCity
}) => {
  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalTab | null>(null);

  const openModal = (tab: InfoModalTab) => {
    setActiveInfoModal(tab);
  };

  // Three equal vertical lists of 5 cities each
  const citiesCol1 = CITIES_LIST.slice(0, 5);
  const citiesCol2 = CITIES_LIST.slice(5, 10);
  const citiesCol3 = CITIES_LIST.slice(10, 15);

  return (
    <>
      <footer className="bg-[#1C2723] text-white pt-10 pb-8 border-t border-[#2A5A43]/30 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Brand Info */}
            <div className="sm:col-span-2 md:col-span-6 lg:col-span-3 space-y-3">
              <div 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="cursor-pointer inline-flex items-center gap-3 sm:gap-3.5 group px-4 py-2.5 rounded-2xl bg-[#FFD100] border border-[#E5B800] hover:bg-[#FFC700] transition-all duration-300 shadow-sm"
              >
                <img
                  src={appLogo}
                  alt="Maid for Ghar Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-contain shadow-sm border border-black/10 group-hover:scale-105 transition-transform duration-300 shrink-0"
                />
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#0F2E20] whitespace-nowrap block leading-tight">
                    Maid for Ghar
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#1F4131] tracking-widest uppercase flex items-center gap-1 mt-0.5">
                    Verified Domestic Help
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F2E20]" />
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
                India's trusted platform for background-verified domestic help. Connecting households with reliable house maids, experienced cooks, loving babysitters, senior attendants, and personal drivers.
              </p>

              <div className="space-y-1 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>100% Verified Staff Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Free Helper Replacement Guarantee</span>
                </div>
              </div>

              {/* Follow Us */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="font-serif text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                  Follow Us
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://www.facebook.com/profile.php?id=61594983362398"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow hover:bg-[#166fe5] hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
                    title="Follow Maid for Ghar on Facebook"
                    aria-label="Follow Maid for Ghar on Facebook"
                  >
                    <Facebook className="w-4 h-4 fill-white stroke-none group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/maidforghar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 group"
                    title="Follow Maid for Ghar on Instagram"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://api.whatsapp.com/send?phone=919364798027&text=Hello%20Maid%20for%20Ghar!%20I%20would%20like%20to%20inquire%20about%20verified%20domestic%20staff."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-200 group"
                    title="Chat with Maid for Ghar on WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white fill-current group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Domestic Services</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <button 
                    type="button"
                    onClick={() => onSelectCategory('house_cleaning')} 
                    className="hover:text-emerald-400 cursor-pointer block text-left transition-colors"
                  >
                    House Maid & Cleaning
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => onSelectCategory('cook_chef')} 
                    className="hover:text-emerald-400 cursor-pointer block text-left transition-colors"
                  >
                    Home Cook & Gourmet Chef
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => onSelectCategory('babysitter')} 
                    className="hover:text-emerald-400 cursor-pointer block text-left transition-colors"
                  >
                    Babysitter & Nanny Care
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => onSelectCategory('elderly_care')} 
                    className="hover:text-emerald-400 cursor-pointer block text-left transition-colors"
                  >
                    Elderly Caregiver & Companion
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => onSelectCategory('driver')} 
                    className="hover:text-emerald-400 cursor-pointer block text-left transition-colors"
                  >
                    Personal Driver
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => onSelectCategory('all_rounder')} 
                    className="hover:text-emerald-400 cursor-pointer block text-left transition-colors"
                  >
                    All-Rounder Household Staff
                  </button>
                </li>
              </ul>
            </div>

            {/* Operating Cities (15) */}
            <div className="sm:col-span-2 md:col-span-6 lg:col-span-3 space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">
                Operating Cities (15)
              </h4>

              {/* Three Vertical Lists with Precise Compact Spacing */}
              <div className="grid grid-cols-3 gap-x-2 sm:gap-x-3 text-xs text-gray-300 pt-0.5">
                {/* Column 1 (Cities 1 to 5) */}
                <ul className="space-y-1">
                  {citiesCol1.map((city) => (
                    <li key={city} className="leading-tight">
                      <button
                        type="button"
                        onClick={() => onSelectCity?.(city)}
                        className="text-left text-[11.5px] sm:text-xs text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap block truncate py-0.5"
                        title={`View verified domestic services in ${city}`}
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Column 2 (Cities 6 to 10) */}
                <ul className="space-y-1">
                  {citiesCol2.map((city) => (
                    <li key={city} className="leading-tight">
                      <button
                        type="button"
                        onClick={() => onSelectCity?.(city)}
                        className="text-left text-[11.5px] sm:text-xs text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap block truncate py-0.5"
                        title={`View verified domestic services in ${city}`}
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Column 3 (Cities 11 to 15) */}
                <ul className="space-y-1">
                  {citiesCol3.map((city) => (
                    <li key={city} className="leading-tight">
                      <button
                        type="button"
                        onClick={() => onSelectCity?.(city)}
                        className="text-left text-[11.5px] sm:text-xs text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap block truncate py-0.5"
                        title={`View verified domestic services in ${city}`}
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Links Section */}
            <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Important Links</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('about')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer block"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('contact')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer block"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <a
                    href="#care-tips"
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer block"
                  >
                    Expert Care Tips
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('privacy')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer block"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openModal('terms')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer block"
                  >
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Support */}
            <div className="sm:col-span-1 md:col-span-6 lg:col-span-2 space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Customer Support</h4>
              <p className="text-xs text-gray-300">
                Have a domestic requirement or replacement query? Speak with a placement manager.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+919364798027"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-400/30"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call: +91 93647 98027</span>
                </a>
                <button
                  onClick={onOpenInquiryModal}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#D96C4E]" />
                  <span>Request Call Back</span>
                </button>
                <button
                  onClick={onOpenBookingModal}
                  className="w-full py-2 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Book Placement</span>
                </button>
              </div>
            </div>

          </div>

          {/* SEO Keyword Index Bar for Google Search Dominance */}
          <div className="pt-5 border-t border-white/10 space-y-2">
            <h4 className="font-serif text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              Popular Domestic Help & Maid Hiring Searches Across India
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[10.5px] text-gray-400">
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Mumbai
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Bengaluru
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Delhi NCR
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Hyderabad
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Pune
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Chennai
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Kolkata
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Ahmedabad
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Gurgaon
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire Maid in Noida
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                100% Verified House Maid Near Me
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('house_cleaning')}>
                Hire 24-Hour Live-in Maid
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('cook_chef')}>
                Hire Cook for Home
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('babysitter')}>
                Hire Nanny & Babysitter
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('elderly_care')}>
                Hire Senior Care Attendant
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('driver')}>
                Hire Personal Driver Near Me
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-pointer" onClick={() => onSelectCategory('all_rounder')}>
                Hire All-Rounder Domestic Staff
              </span>
            </div>
          </div>

          {/* Bottom Rights */}
          <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div>
              © <strong>Maid for Ghar</strong>. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => openModal('privacy')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openModal('terms')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openModal('about')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                About Us
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openModal('contact')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Info / Legal Modal */}
      <LegalInfoModal
        isOpen={activeInfoModal !== null}
        activeTab={activeInfoModal || 'about'}
        onClose={() => setActiveInfoModal(null)}
        onTabChange={(tab) => setActiveInfoModal(tab)}
        onOpenInquiryModal={onOpenInquiryModal}
        onOpenBookingModal={onOpenBookingModal}
      />
    </>
  );
};
