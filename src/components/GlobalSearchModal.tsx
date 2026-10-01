import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  MapPin, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  CalendarCheck,
  CornerDownLeft,
  Users
} from 'lucide-react';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';
import { SERVICE_CATEGORIES, CITIES_LIST, FAQS } from '../constants/appData';
import { BLOG_POSTS } from '../constants/blogData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceId: string) => void;
  onOpenBookingModal: (serviceId?: string) => void;
  onSelectCity?: (city: string) => void;
  onOpenInquiryModal?: () => void;
}

type TabCategory = 'all' | 'services' | 'cities' | 'articles' | 'faqs';

interface SearchResultItem {
  id: string;
  type: 'service' | 'city' | 'article' | 'faq' | 'action';
  title: string;
  subtitle?: string;
  badge?: string;
  onSelect: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  onOpenBookingModal,
  onSelectCity,
  onOpenInquiryModal
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveTab('all');
    }
  }, [isOpen]);

  const q = query.trim().toLowerCase();

  const scrollToSection = (id: string) => {
    onClose();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  const handleCityPick = (city: string) => {
    onClose();
    if (onSelectCity) {
      onSelectCity(city);
    }
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compile unified searchable items
  const items = useMemo<SearchResultItem[]>(() => {
    const list: SearchResultItem[] = [];

    // Quick Actions (always relevant, especially when query is empty)
    if (!q || 'book helper placement'.includes(q)) {
      list.push({
        id: 'action-book',
        type: 'action',
        title: 'Book a Verified Domestic Helper',
        subtitle: 'Start our step-by-step placement form with immediate coordinator assignment',
        badge: 'Quick Action',
        onSelect: () => {
          onClose();
          onOpenBookingModal();
        }
      });
    }

    if (!q || 'helpline call phone contact inquiry 93647 98027 9364798027'.includes(q)) {
      list.push({
        id: 'action-helpline',
        type: 'action',
        title: 'Call Placement Desk: +91 93647 98027',
        subtitle: 'Direct Helpline & Instant Callback (8 AM - 9 PM daily)',
        badge: 'Helpline',
        onSelect: () => {
          onClose();
          if (onOpenInquiryModal) onOpenInquiryModal();
        }
      });
    }

    if (!q || 'verified staff services directory maids cooks'.includes(q)) {
      list.push({
        id: 'action-staff',
        type: 'action',
        title: 'Explore Domestic Services Catalog',
        subtitle: 'Browse all house maids, cooks, babysitters, elderly care & drivers',
        badge: 'Catalog',
        onSelect: () => scrollToSection('services')
      });
    }

    // Services
    if (activeTab === 'all' || activeTab === 'services') {
      const matched = SERVICE_CATEGORIES.filter(s =>
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.fullDescription.toLowerCase().includes(q)
      );
      matched.forEach(s => {
        list.push({
          id: `service-${s.id}`,
          type: 'service',
          title: s.title,
          subtitle: s.shortDescription,
          badge: 'Service',
          onSelect: () => {
            onClose();
            onSelectService(s.id);
          }
        });
      });
    }

    // Cities
    if (activeTab === 'all' || activeTab === 'cities') {
      const matched = CITIES_LIST.filter(c => !q || c.toLowerCase().includes(q));
      matched.forEach(c => {
        list.push({
          id: `city-${c}`,
          type: 'city',
          title: `${c} Domestic Staffing`,
          subtitle: `Verified house maids, cooks & nannies available in ${c}`,
          badge: 'City Hub',
          onSelect: () => handleCityPick(c)
        });
      });
    }

    // Articles / Blog
    if (activeTab === 'all' || activeTab === 'articles') {
      const matched = BLOG_POSTS.filter(p =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
      matched.forEach(p => {
        list.push({
          id: `article-${p.id}`,
          type: 'article',
          title: p.title,
          subtitle: p.excerpt,
          badge: p.categoryLabel,
          onSelect: () => scrollToSection('care-tips')
        });
      });
    }

    // FAQs
    if (activeTab === 'all' || activeTab === 'faqs') {
      const matched = FAQS.filter(f =>
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
      matched.forEach(f => {
        list.push({
          id: `faq-${f.id}`,
          type: 'faq',
          title: f.question,
          subtitle: f.answer,
          badge: 'FAQ',
          onSelect: () => scrollToSection('faq')
        });
      });
    }

    return list;
  }, [q, activeTab, onSelectService, onOpenBookingModal, onOpenInquiryModal]);

  // Reset selectedIndex when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [q, activeTab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (items.length > 0 ? (prev + 1) % items.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (items.length > 0 ? (prev - 1 + items.length) % items.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex, onClose]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'service':
        return <Sparkles className="w-4 h-4 text-[#D96C4E]" />;
      case 'city':
        return <MapPin className="w-4 h-4 text-[#2A5A43]" />;
      case 'article':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'action':
        return <CalendarCheck className="w-4 h-4 text-[#D96C4E]" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden text-left flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global Search & Command Palette"
      >
        {/* Search Bar Header */}
        <div className="p-3.5 sm:p-4 border-b border-gray-100 flex items-center gap-3 bg-[#FAF9F5]">
          <img 
            src={appLogo} 
            alt="Maid for Ghar" 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shadow-xs border border-black/10 shrink-0" 
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A5A43] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, cities, care guides, FAQs... (↑↓ to navigate, Enter to open)"
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#1C2723] focus:outline-none placeholder:text-gray-400"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-gray-400 bg-gray-200/80 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Category Tabs */}
        <div className="px-3 sm:px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {(['all', 'services', 'cities', 'articles', 'faqs'] as TabCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#2A5A43] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'all' ? 'All Results' : tab}
            </button>
          ))}
          <span className="text-[10px] text-gray-400 ml-auto hidden sm:inline shrink-0">
            {items.length} items
          </span>
        </div>

        {/* Search Results List */}
        <div 
          ref={listRef} 
          className="p-2 sm:p-3 overflow-y-auto space-y-1 flex-1 max-h-[60vh]"
        >
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 space-y-2">
              <Search className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-[#1C2723]">No matches found for "{query}"</p>
              <p className="text-xs text-gray-400">Try searching for "Maid", "Cook", "Pune", "Replacement", or "Verification".</p>
            </div>
          ) : (
            items.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-2.5 sm:p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group ${
                    isSelected 
                      ? 'bg-[#2A5A43] text-white shadow-xs' 
                      : 'hover:bg-gray-50 text-[#1C2723]'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#2A5A43]'
                    }`}>
                      {getItemIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#1C2723]'}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                            isSelected 
                              ? 'bg-white/20 text-white' 
                              : 'bg-emerald-50 text-[#2A5A43] border border-[#2A5A43]/20'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-200 mr-1">
                        <span>Press</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Shortcuts */}
        <div className="p-3 bg-[#FAF9F5] border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px] font-mono">↑</kbd>
              <kbd className="px-1 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px] font-mono">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px] font-mono">↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px] font-mono">ESC</kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                onClose();
                onOpenBookingModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Book Staff Directly</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
