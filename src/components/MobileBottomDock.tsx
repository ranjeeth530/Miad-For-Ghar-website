import React, { useState, useEffect, useCallback } from 'react';
import { Home, Sparkles, HelpCircle, Search, CalendarCheck } from 'lucide-react';

interface MobileBottomDockProps {
  onOpenBookingModal: (serviceId?: string) => void;
  onPreloadBookingModal?: () => void;
  onOpenSearchModal: () => void;
  onOpenInquiryModal: () => void;
  activeTab: 'main' | 'admin';
  setActiveTab: (tab: 'main' | 'admin') => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  onOpenBookingModal,
  onPreloadBookingModal,
  onOpenSearchModal,
  activeTab,
  setActiveTab
}) => {
  const [activeItem, setActiveItem] = useState<'home' | 'services' | 'faq' | 'none'>('home');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (activeTab !== 'main') return;
          const scrollY = window.scrollY;

          if (scrollY < 200) {
            setActiveItem('home');
          } else {
            const servicesEl = document.getElementById('services');
            const faqEl = document.getElementById('faq');

            const servicesTop = servicesEl ? servicesEl.offsetTop - 150 : 0;
            const servicesBottom = servicesEl ? servicesTop + servicesEl.offsetHeight : 0;
            const faqTop = faqEl ? faqEl.offsetTop - 150 : 0;
            const faqBottom = faqEl ? faqTop + faqEl.offsetHeight : 0;

            if (scrollY >= faqTop && scrollY < faqBottom) {
              setActiveItem('faq');
            } else if (scrollY >= servicesTop && scrollY < servicesBottom) {
              setActiveItem('services');
            } else {
              setActiveItem('none');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = useCallback((id: string) => {
    if (activeTab !== 'main') {
      setActiveTab('main');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${id}`);
        }
      }, 60);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  }, [activeTab, setActiveTab]);

  const scrollToTop = () => {
    if (activeTab !== 'main') {
      setActiveTab('main');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-xl pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] px-3 flex items-center justify-around text-[10px] font-semibold text-[#4A5A53] select-none"
    >
      {/* Home */}
      <button
        type="button"
        id="mobile-nav-home"
        onClick={scrollToTop}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 relative ${
          activeItem === 'home'
            ? 'text-[#2A5A43] font-bold'
            : 'text-gray-500 hover:text-[#2A5A43]'
        }`}
        aria-label="Home"
      >
        <Home className={`w-4 h-4 ${activeItem === 'home' ? 'text-[#2A5A43]' : 'text-gray-500'}`} />
        <span>Home</span>
        {activeItem === 'home' && (
          <span className="w-1 h-1 rounded-full bg-[#2A5A43] absolute bottom-0.5" />
        )}
      </button>

      {/* Services */}
      <button
        type="button"
        id="mobile-nav-services"
        onClick={() => scrollToSection('services')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 relative ${
          activeItem === 'services'
            ? 'text-[#2A5A43] font-bold'
            : 'text-gray-500 hover:text-[#2A5A43]'
        }`}
        aria-label="Services Catalog"
      >
        <Sparkles className={`w-4 h-4 ${activeItem === 'services' ? 'text-[#D96C4E]' : 'text-gray-500'}`} />
        <span>Services</span>
        {activeItem === 'services' && (
          <span className="w-1 h-1 rounded-full bg-[#D96C4E] absolute bottom-0.5" />
        )}
      </button>

      {/* FAQ */}
      <button
        type="button"
        id="mobile-nav-faq"
        onClick={() => scrollToSection('faq')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 relative ${
          activeItem === 'faq'
            ? 'text-[#2A5A43] font-bold'
            : 'text-gray-500 hover:text-[#2A5A43]'
        }`}
        aria-label="Frequently Asked Questions"
      >
        <HelpCircle className={`w-4 h-4 ${activeItem === 'faq' ? 'text-[#2A5A43]' : 'text-gray-500'}`} />
        <span>FAQ</span>
        {activeItem === 'faq' && (
          <span className="w-1 h-1 rounded-full bg-[#2A5A43] absolute bottom-0.5" />
        )}
      </button>

      {/* Quick Search */}
      <button
        type="button"
        id="mobile-nav-search"
        onClick={onOpenSearchModal}
        className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-gray-500 hover:text-[#2A5A43] transition-all cursor-pointer active:scale-95"
        aria-label="Search"
      >
        <Search className="w-4 h-4 text-gray-500" />
        <span>Search</span>
      </button>

      {/* Direct Placement CTA */}
      <button
        type="button"
        id="mobile-nav-book"
        onClick={() => onOpenBookingModal()}
        onTouchStart={() => onPreloadBookingModal?.()}
        onMouseEnter={() => onPreloadBookingModal?.()}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl bg-[#D96C4E] text-white font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
        aria-label="Book Domestic Help"
      >
        <CalendarCheck className="w-4 h-4 text-amber-100" />
        <span>Book</span>
      </button>
    </nav>
  );
};
