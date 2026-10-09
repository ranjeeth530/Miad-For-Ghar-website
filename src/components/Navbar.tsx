import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  Menu, 
  X, 
  Home, 
  CheckCircle2, 
  Search, 
  PhoneCall,
  HelpCircle,
  Users
} from 'lucide-react';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';

interface NavbarProps {
  onOpenBookingModal: (serviceId?: string) => void;
  onPreloadBookingModal?: () => void;
  activeTab: 'main' | 'admin';
  setActiveTab: (tab: 'main' | 'admin') => void;
  onOpenInquiryModal?: () => void;
  onOpenSearchModal: () => void;
  pendingBookingsCount: number;
  isAdminLoggedIn: boolean;
  onOpenAdminLoginModal: () => void;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBookingModal,
  onPreloadBookingModal,
  activeTab,
  setActiveTab,
  onOpenInquiryModal,
  onOpenSearchModal,
  pendingBookingsCount,
  isAdminLoggedIn,
  onOpenAdminLoginModal,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Throttled high-performance scroll handler using requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }

      if (activeTab === 'main') {
        const sections = ['services', 'why-us', 'how-it-works', 'care-tips', 'reviews', 'faq'];
        const scrollPosition = window.scrollY + 180;

        let current = '';
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.offsetTop <= scrollPosition) {
            current = sections[i];
            break;
          }
        }
        setActiveSection(current);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for search, Escape to close mobile menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearchModal();
      } else if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearchModal, mobileMenuOpen]);

  const handleAdminClick = () => {
    if (activeTab === 'admin') {
      setActiveTab('main');
    } else {
      if (isAdminLoggedIn) {
        setActiveTab('admin');
      } else {
        onOpenAdminLoginModal();
      }
    }
  };

  const scrollToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    if (activeTab !== 'main') {
      setActiveTab('main');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `#${id}`);
          }
        }
      }, 80);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${id}`);
        }
      }
    }
  }, [activeTab, setActiveTab]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#2A5A43]/10 shadow-xs transition-all">
      {/* Scroll Reading Progress Bar */}
      <div 
        className="h-0.5 bg-[#D96C4E] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top Banner Notice - Trust & Quality */}
      <div className="bg-[#2A5A43] text-white text-[11px] sm:text-xs pt-[calc(0.375rem+env(safe-area-inset-top,0px))] pb-1.5 px-3 sm:px-4 text-center font-medium flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-[#F59E0B]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" /> 100% Verified Staff
        </span>
        <span className="hidden md:inline">• Free Helper Replacement Guarantee</span>
        <span className="md:hidden">• Free Replacement Guarantee</span>
        <span className="hidden lg:inline">• Dedicated Placement Coordinators Across 15 Cities</span>
        <a 
          href="tel:+919364798027" 
          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-0.5 rounded-full transition-colors ml-1"
          title="Direct Placement Helpline"
        >
          <PhoneCall className="w-3 h-3 text-amber-300" />
          <span>Call: 93647 98027</span>
        </a>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-2">
        {/* Brand Logo & City Picker */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div 
            onClick={() => { 
              setActiveTab('main'); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
              if (typeof window !== 'undefined' && window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }} 
            className="flex items-center cursor-pointer group shrink-0"
            title="Maid for Ghar - Home"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-[#FFD100] border border-[#E5B800] shadow-xs group-hover:bg-[#FFC700] transition-all duration-200">
              <img
                src={appLogo}
                alt="Maid for Ghar Logo"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-black/10 group-hover:scale-105 transition-transform duration-200 shrink-0 bg-transparent"
              />
              <div className="shrink-0">
                <div className="font-serif text-base sm:text-xl lg:text-2xl font-black tracking-tight text-[#0F2E20] leading-tight whitespace-nowrap">
                  Maid for Ghar
                </div>
                <div className="text-[9.5px] sm:text-[11px] font-extrabold text-[#1A4331] tracking-wider uppercase flex items-center gap-0.5 whitespace-nowrap leading-none mt-0.5">
                  <span>Verified Domestic Help</span>
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0F2E20] shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links with Clean Active Indicator */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs xl:text-sm font-semibold text-[#4A5A53]">
          <button 
            onClick={() => scrollToSection('services')} 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
              activeSection === 'services'
                ? 'bg-[#2A5A43] text-white shadow-xs' 
                : 'hover:text-[#2A5A43] hover:bg-gray-100/80'
            }`}
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('why-us')} 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
              activeSection === 'why-us' 
                ? 'bg-[#2A5A43] text-white shadow-xs' 
                : 'hover:text-[#2A5A43] hover:bg-gray-100/80'
            }`}
          >
            Verification
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
              activeSection === 'how-it-works' 
                ? 'bg-[#2A5A43] text-white shadow-xs' 
                : 'hover:text-[#2A5A43] hover:bg-gray-100/80'
            }`}
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('care-tips')} 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
              activeSection === 'care-tips' 
                ? 'bg-[#2A5A43] text-white font-semibold shadow-xs' 
                : 'hover:text-[#2A5A43] hover:bg-gray-100/80'
            }`}
          >
            Care Guides
          </button>
          <button 
            onClick={() => scrollToSection('reviews')} 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
              activeSection === 'reviews' 
                ? 'bg-[#2A5A43] text-white font-semibold shadow-xs' 
                : 'hover:text-[#2A5A43] hover:bg-gray-100/80'
            }`}
          >
            Reviews
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
              activeSection === 'faq' 
                ? 'bg-[#2A5A43] text-white font-semibold shadow-xs' 
                : 'hover:text-[#2A5A43] hover:bg-gray-100/80'
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Admin Portal Button (Only visible if owner logged in) */}
          {isAdminLoggedIn && (
            <button
              onClick={handleAdminClick}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#2A5A43] text-white border-[#2A5A43] shadow-xs'
                  : 'bg-[#F1F4EB] text-[#2A5A43] border-[#2A5A43]/20 hover:bg-[#2A5A43]/10'
              }`}
              title="Admin Placement Portal"
              aria-label={activeTab === 'admin' ? "Exit Admin View" : "Agency Admin Dashboard"}
            >
              {activeTab === 'admin' ? (
                <>
                  <Home className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="hidden md:inline">Exit Admin</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#2A5A43]" />
                  <span className="hidden md:inline">Admin</span>
                </>
              )}
              {pendingBookingsCount > 0 && activeTab === 'main' && (
                <span className="w-4 h-4 rounded-full bg-[#D96C4E] text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingBookingsCount}
                </span>
              )}
            </button>
          )}

          {/* Primary CTA: Book Helper */}
          <button
            onClick={() => onOpenBookingModal()}
            onMouseEnter={() => onPreloadBookingModal?.()}
            onPointerDown={() => onPreloadBookingModal?.()}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">Book Helper</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1C2723] hover:text-[#2A5A43] hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A5A43] rounded-xl cursor-pointer transition-colors"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Mobile Navigation Drawer"
          className="lg:hidden bg-white border-b border-[#2A5A43]/10 px-4 py-4 shadow-xl space-y-3 animate-in slide-in-from-top-2 text-left"
        >
          {/* Quick Search Action */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearchModal();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs font-semibold text-[#1C2723] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#2A5A43]" />
              <span>Search Services, Cities, FAQs...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-gray-400 bg-gray-200 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1 font-medium text-sm text-[#1C2723] pt-1">
            <button
              onClick={() => scrollToSection('services')}
              className="text-left py-2.5 px-2 hover:bg-[#FAF9F5] rounded-xl hover:text-[#2A5A43] flex items-center justify-between border-b border-gray-100 cursor-pointer"
            >
              <span>Explore All Services</span>
              <span className="text-xs text-[#2A5A43] font-semibold bg-[#2A5A43]/10 px-2 py-0.5 rounded-full">Catalog</span>
            </button>
            <button
              onClick={() => scrollToSection('why-us')}
              className="text-left py-2.5 px-2 hover:bg-[#FAF9F5] rounded-xl hover:text-[#2A5A43] flex items-center justify-between border-b border-gray-100 cursor-pointer"
            >
              <span>Verification & Safety Standards</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">100% Verified</span>
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2.5 px-2 hover:bg-[#FAF9F5] rounded-xl hover:text-[#2A5A43] flex items-center justify-between border-b border-gray-100 cursor-pointer"
            >
              <span>How Placement Works</span>
              <span className="text-xs text-gray-400 font-normal">3 Steps</span>
            </button>
            <button
              onClick={() => scrollToSection('care-tips')}
              className="text-left py-2.5 px-2 hover:bg-[#FAF9F5] rounded-xl hover:text-[#2A5A43] flex items-center justify-between border-b border-gray-100 cursor-pointer"
            >
              <span>Care Tips & Home Guides</span>
              <span className="text-xs text-[#D96C4E] font-semibold">Knowledge</span>
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left py-2.5 px-2 hover:bg-[#FAF9F5] rounded-xl hover:text-[#2A5A43] flex items-center justify-between border-b border-gray-100 cursor-pointer"
            >
              <span>Customer Reviews</span>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">4.9 ★</span>
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-2.5 px-2 hover:bg-[#FAF9F5] rounded-xl hover:text-[#2A5A43] flex items-center justify-between cursor-pointer"
            >
              <span>Frequently Asked Questions</span>
              <span className="text-xs text-gray-400 font-normal">FAQ</span>
            </button>
          </div>

          {/* Direct Callback & Book Button */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <a
              href="tel:+919364798027"
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2A5A43] font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#2A5A43]" />
              <span>Call Helpline: +91 93647 98027</span>
            </a>

            {onOpenInquiryModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiryModal();
                }}
                className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D96C4E]" />
                <span>Request Call Back (30 Min)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookingModal();
              }}
              onTouchStart={() => onPreloadBookingModal?.()}
              onMouseEnter={() => onPreloadBookingModal?.()}
              className="w-full py-2.5 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Book Domestic Help Now</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
