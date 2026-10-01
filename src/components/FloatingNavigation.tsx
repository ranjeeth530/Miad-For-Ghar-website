import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Menu, X, Sparkles, ShieldCheck, ClipboardList, BookOpen, Star, HelpCircle, Search } from 'lucide-react';

interface FloatingNavigationProps {
  onOpenSearchModal: () => void;
  onOpenBookingModal: (serviceId?: string) => void;
  activeTab: 'main' | 'admin';
}

interface SectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: SectionItem[] = [
  { id: 'services', label: 'Services', icon: <Sparkles className="w-3.5 h-3.5 text-[#D96C4E]" /> },
  { id: 'why-us', label: 'Verification & Safety', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> },
  { id: 'how-it-works', label: 'How It Works', icon: <ClipboardList className="w-3.5 h-3.5 text-amber-600" /> },
  { id: 'care-tips', label: 'Care Guides', icon: <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> },
  { id: 'reviews', label: 'Reviews', icon: <Star className="w-3.5 h-3.5 text-amber-500" /> },
  { id: 'faq', label: 'FAQs', icon: <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> }
];

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  onOpenSearchModal,
  onOpenBookingModal,
  activeTab
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          setIsVisible(scrollY > 300);
          if (totalHeight > 0) {
            setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  if (activeTab !== 'main' || !isVisible) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  return (
    <div 
      ref={menuRef}
      className="fixed bottom-16 sm:bottom-6 left-3 sm:left-6 z-40 flex flex-col items-start gap-2 select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {/* Quick Jump Popover Menu */}
      {isMenuOpen && (
        <div 
          className="bg-white rounded-2xl shadow-2xl border border-[#2A5A43]/15 p-2 w-56 sm:w-64 mb-1 animate-in fade-in zoom-in-95 duration-150 text-left"
          role="menu"
          aria-label="Quick Page Navigation"
        >
          <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-[#1C2723]">
            <span>Jump to Section</span>
            <span className="text-[10px] text-gray-400 font-mono">{Math.round(scrollProgress)}% Scrolled</span>
          </div>

          <div className="py-1 space-y-0.5 max-h-64 overflow-y-auto">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#F1F4EB] text-gray-700 hover:text-[#2A5A43] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left"
                role="menuitem"
              >
                <span className="shrink-0">{sec.icon}</span>
                <span className="truncate">{sec.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-1.5 mt-1 border-t border-gray-100 flex items-center justify-between gap-1 text-[11px]">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenSearchModal();
              }}
              className="flex-1 px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3 h-3 text-[#2A5A43]" />
              <span>Search (⌘K)</span>
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenBookingModal();
              }}
              className="flex-1 px-2 py-1 rounded-lg bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Book</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Control Pill */}
      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-full shadow-lg border border-[#2A5A43]/15">
        {/* Back To Top Button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#F1F4EB] text-[#2A5A43] font-bold text-xs transition-all active:scale-95 cursor-pointer"
          title="Scroll to top of page (Home)"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#2A5A43]" />
          <span className="hidden sm:inline text-[11px]">Top</span>
        </button>

        {/* Section Jump Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer ${
            isMenuOpen 
              ? 'bg-[#2A5A43] text-white shadow-xs' 
              : 'bg-[#FAF9F5] hover:bg-[#F1F4EB] text-gray-700 hover:text-[#2A5A43]'
          }`}
          title="Jump directly to any page section"
          aria-label="Section Jump Menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="w-3.5 h-3.5" />
          ) : (
            <Menu className="w-3.5 h-3.5 text-[#2A5A43]" />
          )}
          <span className="hidden sm:inline text-[11px]">Sections</span>
        </button>

        {/* Quick Search Shortcut Trigger */}
        <button
          type="button"
          onClick={onOpenSearchModal}
          className="p-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#F1F4EB] text-[#2A5A43] transition-all active:scale-95 cursor-pointer hidden md:flex items-center justify-center"
          title="Quick Search (Cmd+K / Ctrl+K)"
          aria-label="Open Search"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
