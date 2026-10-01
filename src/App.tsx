import React, { useState, useEffect, Component, ErrorInfo, ReactNode, Suspense, lazy } from 'react';
import { AlertTriangle, RefreshCw, Sparkles, Calendar, MapPin } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuickInquiryCard } from './components/QuickInquiryCard';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { ExpertCareTips } from './components/ExpertCareTips';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { FloatingNavigation } from './components/FloatingNavigation';
import { MobileBottomDock } from './components/MobileBottomDock';
import { Footer } from './components/Footer';
import { CallFloater } from './components/CallFloater';
import { WhatsAppFloater } from './components/WhatsAppFloater';
import { ServiceCatalog } from './components/ServiceCatalog';
import { DomesticHelper, BookingRequest, CustomInquiry, Testimonial } from './types';
import { INITIAL_REVIEWS, SERVICE_CATEGORIES } from './constants/appData';
import { BLOG_POSTS } from './constants/blogData';

import { BookingModal } from './components/BookingModal';

// Preloading is no longer necessary as BookingModal is bundled directly for 0ms instant display
const loadBookingModal = () => {};

// Helper to retry dynamic imports if network drops momentarily on shared hosts like Hostinger
const lazyWithRetry = (importFn: () => Promise<any>) =>
  lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.warn('Initial chunk load failed, retrying once...', error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return await importFn();
    }
  });

const GlobalSearchModal = lazyWithRetry(() => import('./components/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const AdminDashboard = lazyWithRetry(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLoginModal = lazyWithRetry(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1C2723] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200/80 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl font-bold text-[#1C2723]">
                Something went wrong
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                An unexpected error occurred while rendering the application. Your data remains safe and secure.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-left">
                <p className="text-xs font-mono text-red-700 break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-6 rounded-2xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainAppContent() {
  // Synchronously compute if current URL points to the secret owner route
  const isOwnerUrlRequested = () => {
    if (typeof window === 'undefined') return false;
    const search = (window.location.search || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();

    return (
      path === '/admin' ||
      path.startsWith('/admin/') ||
      path === '/portal-owner-login' ||
      path.startsWith('/portal-owner-login') ||
      hash === '#admin' ||
      hash === '#portal-owner-login' ||
      search.includes('portal-owner-login') ||
      search.includes('secure_owner_key') ||
      search.includes('owner_access_portal')
    );
  };

  const initialSecretRoute = isOwnerUrlRequested();

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('owner_authenticated') === 'true' && !!sessionStorage.getItem('admin_token');
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('admin_token');
  });

  // If secret owner route is requested, set activeTab to 'admin' right away
  const [activeTab, setActiveTab] = useState<'main' | 'admin'>(() => {
    return initialSecretRoute ? 'admin' : 'main';
  });

  // If secret owner route is visited and owner is NOT yet logged in, prompt passcode dialog immediately
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(() => {
    const hasAuth = sessionStorage.getItem('owner_authenticated') === 'true' && !!sessionStorage.getItem('admin_token');
    return initialSecretRoute && !hasAuth;
  });

  // App Data State
  const [helpers, setHelpers] = useState<DomesticHelper[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [reviews, setReviews] = useState<Testimonial[]>(INITIAL_REVIEWS);

  // Filter state for directory
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('user_city') || 'Mumbai';
    }
    return 'Mumbai';
  });

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user_city', newCity);
    }
  };

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [preselectedHelper, setPreselectedHelper] = useState<DomesticHelper | null>(null);
  
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Admin handlers
  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('owner_authenticated', 'true');
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setActiveTab('admin');
  };

  const handleAdminLogout = async () => {
    const currentToken = adminToken || sessionStorage.getItem('admin_token');
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentToken ? { 'X-Admin-Token': currentToken } : {})
        }
      });
    } catch (e) {
      console.warn('Server logout notification error:', e);
    }
    sessionStorage.removeItem('owner_authenticated');
    sessionStorage.removeItem('admin_token');
    setAdminToken(null);
    setIsAdminLoggedIn(false);
    setActiveTab('main');
    setBookings([]);
    setInquiries([]);
    // Remove admin param from URL history cleanly
    if (typeof window !== 'undefined' && (window.location.hash.includes('admin') || window.location.search.includes('admin'))) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
  };

  // Fetch initial public data & conditional admin data
  useEffect(() => {
    fetchHelpers();
    fetchReviews();

    // Prewarm browser image cache for zero-latency card renders
    try {
      const preloadImages = [
        ...SERVICE_CATEGORIES.map(s => s.heroImage),
        ...BLOG_POSTS.map(p => p.coverImage),
        ...BLOG_POSTS.map(p => p.author.avatar)
      ].filter(Boolean);

      preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    } catch {
      // Non-critical cache optimization
    }

    // Preload BookingModal bundle in idle time so clicking 'Book Now' opens instantaneously with zero network wait
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          loadBookingModal();
        });
      } else {
        setTimeout(() => {
          loadBookingModal();
        }, 1200);
      }
    }

    // Check for private secret owner URL route (e.g. /portal-owner-login, #portal-owner-login, or ?secure_owner_key=...)
    const checkSecretOwnerRoute = () => {
      const isSecretRoute = isOwnerUrlRequested();

      if (isSecretRoute) {
        const token = sessionStorage.getItem('admin_token');
        const hasAuth = sessionStorage.getItem('owner_authenticated') === 'true' && !!token;
        if (hasAuth && token) {
          setIsAdminLoggedIn(true);
          setAdminToken(token);
          setActiveTab('admin');
        } else {
          setActiveTab('admin');
          setIsAdminLoginOpen(true);
        }
      }
    };

    // Handle deep-linking hash auto-scrolling on initial render
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1 && !hash.includes('admin') && !hash.includes('portal-owner-login')) {
        const id = hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    checkSecretOwnerRoute();
    handleInitialHash();
    window.addEventListener('hashchange', checkSecretOwnerRoute);
    window.addEventListener('hashchange', handleInitialHash);
    window.addEventListener('popstate', checkSecretOwnerRoute);
    window.addEventListener('popstate', handleInitialHash);

    // Secret Admin Keyboard Shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleSecretAdminKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const token = sessionStorage.getItem('admin_token');
        const hasAuth = sessionStorage.getItem('owner_authenticated') === 'true' && !!token;
        if (hasAuth && token) {
          setIsAdminLoggedIn(true);
          setActiveTab(prev => (prev === 'admin' ? 'main' : 'admin'));
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleSecretAdminKey);

    return () => {
      window.removeEventListener('hashchange', checkSecretOwnerRoute);
      window.removeEventListener('hashchange', handleInitialHash);
      window.removeEventListener('popstate', checkSecretOwnerRoute);
      window.removeEventListener('popstate', handleInitialHash);
      window.removeEventListener('keydown', handleSecretAdminKey);
    };
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn && adminToken) {
      fetchBookings();
      fetchInquiries();

      // Poll for new booking placement requests every 4 seconds ONLY when logged in as admin
      const interval = setInterval(() => {
        fetchBookings();
      }, 4000);

      return () => clearInterval(interval);
    } else {
      setBookings([]);
      setInquiries([]);
    }
  }, [isAdminLoggedIn, adminToken]);

  const fetchBookings = async () => {
    const token = adminToken || sessionStorage.getItem('admin_token');
    if (!token) return;
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.log('Error fetching bookings');
    }
  };

  const fetchHelpers = async () => {
    try {
      const res = await fetch('/api/helpers');
      if (res.ok) {
        const data = await res.json();
        setHelpers(data);
      }
    } catch (e) {
      console.log('Using local fallback for helpers');
    }
  };

  const fetchInquiries = async () => {
    const token = adminToken || sessionStorage.getItem('admin_token');
    if (!token) return;
    try {
      const res = await fetch('/api/inquiries', {
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.log('Error fetching inquiries');
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(INITIAL_REVIEWS);
        }
      } else {
        setReviews(INITIAL_REVIEWS);
      }
    } catch (e) {
      console.log('Notice fetching reviews, using local fallback:', e);
      setReviews(INITIAL_REVIEWS);
    }
  };

  // Handlers
  const handleOpenBookingModal = (serviceId?: string) => {
    if (serviceId) {
      setBookingServiceId(serviceId);
    }
    setPreselectedHelper(null);
    setIsBookingOpen(true);
  };

  const handleBookHelper = (helper: DomesticHelper) => {
    setPreselectedHelper(helper);
    setBookingServiceId(helper.category);
    setIsBookingOpen(true);
  };

  const handleCreateBooking = async (bookingData: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        const newBooking = await res.json();
        if (isAdminLoggedIn) {
          setBookings(prev => [newBooking, ...prev]);
        }
        return newBooking;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit booking request. Please check details and try again.');
      }
    } catch (e: any) {
      console.error('Booking submission error:', e);
      throw e;
    }
  };

  const handleCreateInquiry = async (inquiryData: Omit<CustomInquiry, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        const newInq = await res.json();
        if (isAdminLoggedIn) {
          setInquiries(prev => [newInq, ...prev]);
        }
        return newInq;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit callback inquiry. Please check details and try again.');
      }
    } catch (e: any) {
      console.error('Inquiry submission error:', e);
      throw e;
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string, helperName?: string) => {
    const token = adminToken || sessionStorage.getItem('admin_token') || '';
    try {
      const payload: any = { status: newStatus };
      if (helperName !== undefined) {
        payload.helperName = helperName;
      }
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        const updated = await res.json();
        setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
        return updated;
      }
    } catch (e) {
      console.error('Update booking status error:', e);
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus as any, ...(helperName !== undefined ? { helperName } : {}) } : b));
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const token = adminToken || sessionStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    const token = adminToken || sessionStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setInquiries(prev => prev.filter(i => i.id !== inquiryId));
  };

  const handleDeleteHelper = async (helperId: string) => {
    const token = adminToken || sessionStorage.getItem('admin_token') || '';
    try {
      const res = await fetch(`/api/helpers/${helperId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setHelpers(prev => prev.filter(h => h.id !== helperId));
  };

  const handleAddHelper = async (helperData: any) => {
    const token = adminToken || sessionStorage.getItem('admin_token') || '';
    try {
      const res = await fetch('/api/helpers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(helperData)
      });
      if (res.status === 401) {
        handleAdminLogout();
        throw new Error('Unauthorized. Please log in again.');
      }
      if (res.ok) {
        const newHelper = await res.json();
        setHelpers(prev => [newHelper, ...prev]);
        return newHelper;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to add helper');
      }
    } catch (e: any) {
      console.error('Error adding helper:', e);
      throw e;
    }
  };

  const handleAddReview = async (reviewData: Omit<Testimonial, 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        const newRev = await res.json();
        setReviews(prev => [newRev, ...prev]);
        return newRev;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit review');
      }
    } catch (e: any) {
      console.error('Error adding review:', e);
      throw e;
    }
  };

  const handleHeroSearch = (city: string, category: string, shift: string) => {
    handleCityChange(city);
    setSelectedCategory(category);

    // Persist search log to backend
    fetch('/api/search-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, category, shift })
    }).catch(err => console.error('Failed to record search log:', err));
  };

  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1C2723] flex flex-col font-sans w-full max-w-full overflow-x-hidden pb-20 lg:pb-0">
      
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#2A5A43] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2A5A43] transition-all"
      >
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <Navbar
        onOpenBookingModal={handleOpenBookingModal}
        onPreloadBookingModal={loadBookingModal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInquiryModal={() => setIsInquiryOpen(true)}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        pendingBookingsCount={pendingBookingsCount}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLoginModal={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      {/* Main App vs Admin View */}
      {activeTab === 'main' ? (
        <main className="flex-1 focus:outline-none" id="main-content" tabIndex={-1}>
          {/* Hero Section */}
          <HeroSection
            onSearch={handleHeroSearch}
            onOpenBookingModal={handleOpenBookingModal}
            onPreloadBookingModal={loadBookingModal}
            onSubmitInquiry={handleCreateInquiry}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />

          {/* Full Service Catalog View */}
          <ServiceCatalog
            onOpenBookingModal={handleOpenBookingModal}
            onPreloadBookingModal={loadBookingModal}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
            }}
            selectedCity={selectedCity}
          />

          {/* Direct Callback Banner */}
          <QuickInquiryCard
            onSubmitInquiry={handleCreateInquiry}
          />

          {/* Verification & Trust Standards */}
          <WhyChooseUs />

          {/* How It Works Steps */}
          <HowItWorks
            onOpenBookingModal={() => handleOpenBookingModal()}
          />

          {/* Expert Care Tips Blog & Knowledge Hub */}
          <ExpertCareTips
            onOpenBookingModal={handleOpenBookingModal}
          />

          {/* Verified Customer Testimonials */}
          <Testimonials
            reviews={reviews}
            onAddReview={handleAddReview}
          />

          {/* Searchable FAQ Accordion */}
          <FaqSection />
        </main>
      ) : (
        /* Admin Dashboard View */
        <main className="flex-1 bg-[#FAF9F5]">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
              <div className="flex items-center gap-3 text-[#2A5A43] font-semibold text-sm">
                <span className="w-5 h-5 border-2 border-[#2A5A43] border-t-transparent rounded-full animate-spin" />
                <span>Loading Admin Placement Portal...</span>
              </div>
            </div>
          }>
            <AdminDashboard
              bookings={bookings}
              inquiries={inquiries}
              helpers={helpers}
              adminToken={adminToken}
              onUpdateStatus={handleUpdateStatus}
              onDeleteBooking={handleDeleteBooking}
              onDeleteInquiry={handleDeleteInquiry}
              onDeleteHelper={handleDeleteHelper}
              onAddHelper={handleAddHelper}
              onCloseAdmin={() => setActiveTab('main')}
              isAdminLoggedIn={isAdminLoggedIn}
              onAdminLogout={handleAdminLogout}
              onOpenAdminLoginModal={() => setIsAdminLoginOpen(true)}
              onOpenBookingModal={handleOpenBookingModal}
            />
          </Suspense>
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenBookingModal={() => handleOpenBookingModal()}
        onOpenInquiryModal={() => setIsInquiryOpen(true)}
        onSelectCategory={(catId) => {
          setActiveTab('main');
          setSelectedCategory(catId);
          setTimeout(() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onSelectCity={(cityName) => {
          setActiveTab('main');
          handleCityChange(cityName);
          setTimeout(() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Admin Login Authentication Modal */}
      {isAdminLoginOpen && (
        <Suspense fallback={null}>
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onSuccessLogin={handleAdminLoginSuccess}
          />
        </Suspense>
      )}

      {/* Step-by-Step Booking Modal (Synchronously rendered with 0ms delay) */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialServiceId={bookingServiceId}
          preselectedHelper={preselectedHelper}
          onSubmitBooking={handleCreateBooking}
        />
      )}

      {/* Quick Inquiry / Callback Modal */}
      <QuickInquiryCard
        isOpenModal={isInquiryOpen}
        onCloseModal={() => setIsInquiryOpen(false)}
        onSubmitInquiry={handleCreateInquiry}
      />

      {/* Global Command Palette / Quick Search Modal */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectService={(catId) => {
              setSelectedCategory(catId);
              handleOpenBookingModal(catId);
            }}
            onOpenBookingModal={handleOpenBookingModal}
            onSelectCity={(city) => {
              handleCityChange(city);
            }}
            onOpenInquiryModal={() => setIsInquiryOpen(true)}
          />
        </Suspense>
      )}

      {/* Floating Navigation Pill (Back to Top & Quick Section Jumper) */}
      <FloatingNavigation
        onOpenSearchModal={() => setIsSearchOpen(true)}
        onOpenBookingModal={handleOpenBookingModal}
        activeTab={activeTab}
      />

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomDock
        onOpenBookingModal={handleOpenBookingModal}
        onPreloadBookingModal={loadBookingModal}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        onOpenInquiryModal={() => setIsInquiryOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Floating Action Buttons: WhatsApp Floater (Above) & Call Floater (Below) */}
      <WhatsAppFloater />
      <CallFloater onOpenInquiryModal={() => setIsInquiryOpen(true)} />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainAppContent />
    </ErrorBoundary>
  );
}
