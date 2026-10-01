import React, { useEffect } from 'react';
import { 
  X, 
  Info, 
  PhoneCall, 
  ShieldCheck, 
  FileText, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Building2,
  Sparkles,
  ArrowRight,
  Copy
} from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';

export type InfoModalTab = 'about' | 'contact' | 'privacy' | 'terms';

interface LegalInfoModalProps {
  isOpen: boolean;
  activeTab: InfoModalTab;
  onClose: () => void;
  onTabChange: (tab: InfoModalTab) => void;
  onOpenInquiryModal?: () => void;
  onOpenBookingModal?: () => void;
}

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onTabChange,
  onOpenInquiryModal,
  onOpenBookingModal
}) => {
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const handleCopyAddress = () => {
    const fullAddress = "Maid For Ghar, #1, Sangamesh Building, Muniswamappa Road, R.S. Palya, Kammanahalli Main Road, Bengaluru – 560033, Karnataka, India";
    navigator.clipboard?.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Navigation Tabs */}
        <div className="bg-[#FAF9F5] border-b border-gray-200 px-5 sm:px-8 pt-5 pb-3">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-200/80">
            <div className="flex items-center gap-3.5">
              <img
                src={appLogo}
                alt="Maid for Ghar Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-contain shadow-sm border border-gray-300 shrink-0"
              />
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C2723]">
                  {activeTab === 'about' && 'About Maid for Ghar'}
                  {activeTab === 'contact' && 'Contact Us & Customer Support'}
                  {activeTab === 'privacy' && 'Privacy Policy'}
                  {activeTab === 'terms' && 'Terms & Conditions'}
                </h3>
                <p className="text-[11.5px] text-[#4A5A53]">
                  Maid for Ghar • India's Verified Domestic Staffing Platform
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-3 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => onTabChange('about')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => onTabChange('contact')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Contact Us
            </button>
            <button
              type="button"
              onClick={() => onTabChange('privacy')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onTabChange('terms')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Terms & Conditions
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6 text-sm text-[#1C2723] leading-relaxed">
          
          {/* TAB 1: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A5A43] bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block">
                  Our Mission & Vision
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C2723]">
                  Empowering Indian Homes with Dignified, Trustworthy Domestic Staff
                </h4>
                <p className="text-xs sm:text-sm text-[#4A5A53]">
                  Founded with a vision to organize India's fragmented domestic staffing sector, <strong>Maid for Ghar</strong> connects families with verified, thoroughly vetted household professionals. We bridge modern households with experienced house maids, home cooks, loving babysitters, elderly companions, and personal drivers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#2A5A43] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h5 className="font-semibold text-sm text-[#1C2723]">100% Background Check</h5>
                  <p className="text-xs text-[#4A5A53]">
                    Every staff member undergoes Aadhaar biometric validation, court record check, past employer reference calls, and medical fitness screening.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#2A5A43] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h5 className="font-semibold text-sm text-[#1C2723]">Free Replacement Guarantee</h5>
                  <p className="text-xs text-[#4A5A53]">
                    If your helper needs leave or the match isn't a fit for your household routine, we arrange prompt free replacements without hassle.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-serif text-sm font-bold text-[#1C2723] uppercase tracking-wider">
                  Presence in 15+ Major Cities
                </h5>
                <p className="text-xs text-[#4A5A53]">
                  We currently operate full-scale verification hubs and support teams across Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, Gurugram, Noida, Chandigarh, Indore, Nagpur, Vizag, and Vijaywada.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBookingModal?.();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#2A5A43] hover:bg-[#1F4131] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Book Verified Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('contact')}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1C2723] font-semibold text-xs transition-all cursor-pointer"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Phone Support */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-[#2A5A43]">
                    <PhoneCall className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Helpline & Placement</span>
                  </div>
                  <div>
                    <a 
                      href="tel:+919364798027" 
                      className="text-base font-bold text-[#1C2723] hover:text-[#2A5A43] hover:underline block"
                    >
                      +91 93647 98027
                    </a>
                    <span className="text-xs text-[#4A5A53] block mt-0.5">
                      Direct Placement Helpline
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A5A53]">
                    Available 8:00 AM – 9:00 PM IST (Mon – Sun)
                  </p>
                </div>

                {/* Email Support */}
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#2A5A43]">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Email Assistance</span>
                  </div>
                  <div>
                    <a 
                      href="mailto:maidforghar@gmail.com" 
                      className="text-sm font-bold text-[#1C2723] hover:text-[#2A5A43] hover:underline block"
                    >
                      maidforghar@gmail.com
                    </a>
                    <a 
                      href="mailto:support@maidforghar.co.in" 
                      className="text-xs text-[#4A5A53] hover:underline block mt-0.5"
                    >
                      support@maidforghar.co.in
                    </a>
                  </div>
                  <p className="text-[11px] text-[#4A5A53]">
                    Direct support: +91 93647 98027
                  </p>
                </div>

              </div>

              {/* Corporate & Registered Office Address */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2A5A43] border border-emerald-200/60 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#1C2723]">Corporate & Registered Office</h5>
                      <p className="text-[11px] text-[#4A5A53]">Corporate Headquarters</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2A5A43] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    Bengaluru, Karnataka
                  </span>
                </div>

                {/* Structured Address Layout */}
                <div className="bg-[#FAF9F5] p-3.5 sm:p-4 rounded-xl border border-gray-200/70 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2A5A43] shrink-0" />
                    <span className="font-bold text-sm text-[#1C2723]">Maid For Ghar</span>
                    <span className="text-[10.5px] text-gray-400 font-normal">• Domestic Staffing Services</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-200/60">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Premises & Building</span>
                      <p className="font-semibold text-[#1C2723]">#1, Sangamesh Building</p>
                      <p className="text-[#4A5A53]">Muniswamappa Road</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Locality & Landmark</span>
                      <p className="font-semibold text-[#1C2723]">R.S. Palya</p>
                      <p className="text-[#4A5A53]">Kammanahalli Main Road</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">City & PIN Code</span>
                      <p className="font-semibold text-[#1C2723]">Bengaluru – 560033</p>
                      <p className="text-[#4A5A53]">PIN: 560033</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">State & Country</span>
                      <p className="font-semibold text-[#1C2723]">Karnataka</p>
                      <p className="text-[#4A5A53]">India</p>
                    </div>
                  </div>
                </div>

                {/* Office Timings & Navigation Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs text-[#4A5A53]">
                    <Clock className="w-3.5 h-3.5 text-[#2A5A43] shrink-0" />
                    <span>Office Hours: <strong>9:00 AM – 7:00 PM</strong> (Mon – Sat)</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Sangamesh+Building+Muniswamappa+Road+Kammanahalli+Main+Road+Bengaluru+560033"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      title="Open office location in Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      <span>Get Directions</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1C2723] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-gray-200/80"
                      title="Copy full address to clipboard"
                    >
                      {copiedAddress ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Address Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-600" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Callback Trigger */}
              <div className="p-4 rounded-2xl bg-[#2A5A43] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h5 className="font-serif font-bold text-sm text-white">Need an immediate recommendation?</h5>
                  <p className="text-xs text-emerald-100">
                    Request a phone call callback and our placement specialist will contact you in under 15 minutes.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://api.whatsapp.com/send?text=Hello%20Maid%20for%20Ghar!%20I%20would%20like%20to%20inquire%20about%20domestic%20staff."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenInquiryModal?.();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white text-[#2A5A43] hover:bg-gray-100 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Request Call Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs sm:text-sm text-[#4A5A53]">
              {/* Header Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full inline-block">
                    Privacy Policy & Data Security
                  </span>
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C2723]">
                  Privacy Policy & Data Security
                </h4>
                <p className="text-xs sm:text-sm text-[#1C2723] leading-relaxed">
                  At Maid For Ghar, we are committed to protecting the privacy, confidentiality, and security of our website visitors, customers, and service users. This Privacy Policy explains how we collect, use, share, and protect personal information when you visit our website or use our services.
                </p>
                <p className="text-xs text-amber-900 font-semibold pt-1 border-t border-amber-200/60">
                  By using our website or services, you acknowledge that you have read and understood this Privacy Policy.
                </p>
              </div>

              {/* 1. Information We Collect */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">1</span>
                  Information We Collect
                </h5>

                <div className="space-y-1.5 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Personal Information</h6>
                  <p>We may collect personal information that you voluntarily provide to us, including:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-xs text-[#1C2723]">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Mailing or residential address</li>
                    <li>Information required to arrange domestic-helper services or bookings</li>
                  </ul>
                </div>

                <div className="space-y-1.5 pl-1 sm:pl-2 pt-2 border-t border-gray-200/60">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Payment Information</h6>
                  <p>
                    Payments for our services may involve financial information such as credit card or UPI details. These transactions are processed securely through authorized third-party payment processors.
                  </p>
                  <p className="text-xs text-[#2A5A43] font-medium">
                    Maid For Ghar does not store or retain sensitive payment or financial information on its own servers.
                  </p>
                </div>

                <div className="space-y-1.5 pl-1 sm:pl-2 pt-2 border-t border-gray-200/60">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Website Usage Information</h6>
                  <p>We may automatically collect certain non-personal or technical information when you visit our website, including:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-xs text-[#1C2723]">
                    <li>IP address</li>
                    <li>Browser type and device information</li>
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>General website usage and navigation patterns</li>
                  </ul>
                  <p className="text-xs text-gray-500 pt-1">
                    This information helps us understand website traffic and improve our services and website functionality.
                  </p>
                </div>
              </div>

              {/* 2. How We Use Your Information */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">2</span>
                  How We Use Your Information
                </h5>
                <p>We may use the information we collect for the following purposes:</p>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Service Delivery</h6>
                  <p>To process bookings, arrange services, and facilitate the matching of customers with suitable domestic helpers.</p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Communication</h6>
                  <p>To send booking confirmations, appointment or schedule updates, important service notifications, security-related communications, and other relevant announcements.</p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Payment Processing</h6>
                  <p>To facilitate and complete payments and other financial transactions associated with the services you request.</p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Website Improvement</h6>
                  <p>To analyze website usage, identify technical issues, improve navigation, and optimize the website's functionality and display across different devices and browsers.</p>
                </div>
              </div>

              {/* 3. How We Share Your Information */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">3</span>
                  How We Share Your Information
                </h5>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs font-semibold text-emerald-900">
                  We do not sell or rent your personal information to third parties.
                </div>
                <p>We may share relevant information in the following circumstances:</p>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Service Partners</h6>
                  <p>
                    Where necessary to provide our services, relevant information may be securely shared with domestic-helper candidates, documentation agents, or other authorized service partners involved in arranging and delivering the requested service.
                  </p>
                  <p className="text-xs text-gray-500">
                    Such information will be limited to what is reasonably necessary for the relevant service.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Legal and Regulatory Requirements</h6>
                  <p>
                    We may disclose personal information where required or permitted by applicable law, regulation, legal proceedings, governmental authorities, court orders, or other lawful requests.
                  </p>
                </div>
              </div>

              {/* 4. Cookies & Advertising Technologies */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">4</span>
                  Cookies & Advertising Technologies
                </h5>
                <p>
                  Our website may use cookies and similar technologies to improve functionality, analyze website usage, and support advertising activities.
                </p>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Essential and Standard Cookies</h6>
                  <p>
                    Cookies may be used to remember preferences, maintain login or session information, and provide essential website functionality.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Google Analytics, Google Tag Manager & Google Ads</h6>
                  <p>
                    We may use services such as Google Analytics, Google Tag Manager, and Google Ads, which may use cookies and similar technologies to understand website activity and, where applicable, deliver or measure relevant advertising based on previous interactions with our website.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Microsoft Clarity</h6>
                  <p>
                    We may use Microsoft Clarity to understand how visitors interact with our website, including navigation patterns and interactions with website elements. This information helps us identify usability issues and improve website layouts, buttons, and overall functionality.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Managing Cookies and Advertising Preferences</h6>
                  <p>
                    You can manage, block, or delete cookies through your browser settings. You may also be able to manage personalized advertising preferences through the relevant advertising platform's settings.
                  </p>
                  <p className="text-xs text-gray-500">
                    Please note that disabling certain cookies may affect some website functionality.
                  </p>
                </div>
              </div>

              {/* 5. Data Security */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">5</span>
                  Data Security
                </h5>
                <p>
                  We take reasonable and appropriate measures to protect your personal information against unauthorized access, alteration, disclosure, misuse, or destruction.
                </p>
                <p>
                  We use security measures such as SSL/TLS encryption and appropriate server-level protections to safeguard information transmitted to or stored by us.
                </p>
                <p className="text-xs text-gray-500">
                  However, no method of transmitting or storing information electronically is completely secure. Therefore, while we strive to protect your personal information using reasonable security measures, we cannot guarantee absolute security.
                </p>
              </div>

              {/* 6. Your Rights and Choices */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">6</span>
                  Your Rights and Choices
                </h5>
                <p>Subject to applicable laws and regulations, you may have the following rights regarding your personal information:</p>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Access and Correction</h6>
                  <p>
                    You may request access to personal information we hold about you and ask us to correct inaccurate or incomplete information.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Data Deletion</h6>
                  <p>
                    You may request that we delete or remove your personal information from our records, subject to any legal, regulatory, contractual, or legitimate business requirements that require us to retain certain information.
                  </p>
                </div>

                <p className="text-xs text-[#2A5A43] font-medium pt-1">
                  To exercise these rights, please contact us using the details provided below. We may request reasonable information to verify your identity before processing your request.
                </p>
              </div>

              {/* 7. Changes to This Privacy Policy */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">7</span>
                  Changes to This Privacy Policy
                </h5>
                <p>
                  We may update or modify this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, or privacy practices.
                </p>
                <p>
                  Any updated version will be published on this page with a revised effective date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              {/* 8. Contact Us */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#2A5A43] text-white space-y-3">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white text-[#2A5A43] text-xs flex items-center justify-center shrink-0 font-bold">8</span>
                  Contact Us
                </h5>
                <p className="text-xs text-emerald-100">
                  If you have questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us:
                </p>

                <div className="space-y-2 text-xs text-emerald-100">
                  <div>
                    <p className="font-bold text-sm text-white">Maid For Ghar</p>
                    <span className="text-[11px] text-emerald-200 block">Corporate & Registered Office</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 leading-snug">
                      <p className="text-white font-medium">#1, Sangamesh Building, Muniswamappa Road</p>
                      <p className="text-emerald-100">R.S. Palya, Kammanahalli Main Road</p>
                      <p className="text-emerald-200 font-semibold">Bengaluru – 560033, Karnataka, India</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 pt-1 border-t border-white/10">
                    <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Email: <a href="mailto:maidforghar@gmail.com" className="underline hover:text-white font-medium">maidforghar@gmail.com</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Phone: <a href="tel:+919364798027" className="underline hover:text-white font-medium">+91 93647 98027</a></span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs sm:text-sm text-[#4A5A53]">
              
              {/* Header Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A5A43] bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block">
                  Service Agreement & Policies
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C2723]">
                  Terms & Conditions
                </h4>
                <p className="text-xs sm:text-sm text-[#1C2723] leading-relaxed">
                  These Terms & Conditions govern your access to and use of <strong>maidforghar.co.in</strong> and the domestic-help placement and related services provided by <strong>Maid For Ghar</strong>. Please read these terms carefully before completing your registration, interview process, or booking.
                </p>
                <p className="text-xs text-[#2A5A43] font-semibold pt-1 border-t border-emerald-200/60">
                  By registering with or using our services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
                </p>
              </div>

              {/* 1. Acceptance of Terms */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">1</span>
                  Acceptance of Terms
                </h5>
                <p>
                  By accessing our website, registering with Maid For Ghar, or using our services, you agree to comply with these Terms & Conditions, guidelines, and applicable operating policies.
                </p>
                <p>
                  Maid For Ghar reserves the right to modify, update, or amend these terms from time to time. Any changes will be published on our website. Your continued use of our website or services after such changes are published will constitute your acceptance of the revised terms.
                </p>
              </div>

              {/* 2. Fees & Payment Terms */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">2</span>
                  Fees & Payment Terms
                </h5>
                
                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Payment Methods</h6>
                  <p>
                    Payments may be made through the payment methods made available by Maid For Ghar, including online payment, cheque, or UPI. Appropriate invoices or payment receipts will be provided for applicable transactions.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Service Charges</h6>
                  <p>
                    The applicable placement or service charge becomes payable when the selected helper commences work for the client.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Direct Hiring of Introduced Candidates</h6>
                  <p>
                    Candidates introduced or referred to a client through Maid For Ghar are subject to the applicable placement/service fee.
                  </p>
                  <p>
                    Clients agree not to independently engage, employ, or retain a candidate introduced through our platform without completing the applicable payment obligations.
                  </p>
                  <p>
                    Any attempt to bypass the applicable placement fee may result in recovery proceedings or other legal action available under applicable law.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Respectful Treatment of Helpers</h6>
                  <p>
                    Clients are expected to treat domestic helpers with dignity, fairness, and respect. Employment decisions should be based on suitability and work-related considerations and should not involve unfair discrimination based on appearance, age, religion, or other personal characteristics.
                  </p>
                </div>
              </div>

              {/* 3. Helper Salary Terms */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">3</span>
                  Helper Salary Terms
                </h5>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Direct Salary Payments</h6>
                  <p>
                    The helper's salary must be paid directly by the client to the helper in accordance with the mutually agreed salary terms.
                  </p>
                  <p>
                    If a helper leaves the assignment, the client remains responsible for paying the helper for all days actually worked up to the date of departure.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Salary Advances</h6>
                  <p>
                    Any salary advance provided to a helper is made at the client's own discretion and risk.
                  </p>
                  <p>
                    Maid For Ghar is not responsible for recovering, adjusting, or reimbursing salary advances if a helper subsequently leaves the assignment.
                  </p>
                </div>
              </div>

              {/* 4. Refund Policy */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">4</span>
                  Refund Policy
                </h5>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Registration Fees</h6>
                  <p>
                    Registration fees of ₹1,000 / ₹1,500 / ₹2,000, as applicable to the selected service category, are non-refundable if a customer decides not to participate in interviews or otherwise chooses not to proceed after registration.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Exception to Registration-Fee Refund</h6>
                  <p>
                    A registration fee may be refunded if Maid For Ghar is unable to share any suitable helper profile with the customer within 25 working days from the applicable registration date.
                  </p>
                  <p>
                    Once at least one suitable helper profile has been shared, the registration fee will be considered utilized and will not be eligible for a refund.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Salary Budget and Market Conditions</h6>
                  <p>
                    Domestic-helper salary expectations may vary based on location, experience, duties, working hours, and prevailing market conditions.
                  </p>
                  <p>
                    If a client's salary budget is substantially below the prevailing market rate and the client declines to revise the budget where reasonably required, the availability of suitable candidates or replacement candidates may be affected. In such circumstances, the client will not be entitled to a refund solely due to the inability to find a candidate within the client's stated salary budget.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Worker Safety and Appropriate Conduct</h6>
                  <p>
                    Clients must not subject helpers to physical, emotional, verbal, or other forms of abuse, harassment, intimidation, or unsafe working conditions.
                  </p>
                  <p>
                    If a helper leaves an assignment due to mistreatment, unsafe conditions, or a material change in duties without prior agreement, Maid For Ghar may decline to provide a replacement or refund, subject to the circumstances of the case.
                  </p>
                </div>
              </div>

              {/* 5. Replacement Policy */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">5</span>
                  Replacement Policy
                </h5>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Replacement Candidates</h6>
                  <p>
                    Where a replacement is applicable under the selected service arrangement, Maid For Ghar will make reasonable efforts to provide suitable replacement profiles for the agreed duties.
                  </p>
                  <p>
                    Replacement timelines are generally 15 to 25 working days, depending on candidate availability and other circumstances.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Credit Note</h6>
                  <p>
                    If Maid For Ghar is unable to provide a suitable replacement within 25 working days where a replacement is applicable, the company may issue a credit note equivalent to the applicable service fee, which may be used for a future booking.
                  </p>
                  <p>
                    The credit note is not transferable or redeemable for cash unless otherwise agreed in writing.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Salary Clearance</h6>
                  <p>
                    Before a replacement candidate is deployed, the client must clear all outstanding salary and other legally payable dues owed to the previous helper.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Temporary Illness or Emergency Leave</h6>
                  <p>
                    If a helper takes temporary leave due to illness, a family emergency, or another genuine reason and confirms their intention to return, a replacement will generally not be provided during the agreed temporary absence.
                  </p>
                  <p>
                    If the helper does not return within 7 days, the client may request a replacement, subject to the applicable replacement terms.
                  </p>
                </div>
              </div>

              {/* 6. Duties, Employment Conditions & Work Satisfaction */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">6</span>
                  Duties, Employment Conditions & Work Satisfaction
                </h5>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Agreed Job Scope</h6>
                  <p>
                    The duties, working hours, salary, and other material employment conditions should be mutually agreed upon before the helper begins work.
                  </p>
                  <p>
                    Clients should not reduce the agreed salary or require helpers to perform substantial duties outside the agreed job scope without mutual agreement.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Notice for Replacement Requests</h6>
                  <p>
                    If a client is dissatisfied with a helper's performance and wishes to request a replacement, the client should provide at least 15 days' notice, wherever reasonably possible, to allow Maid For Ghar sufficient time to identify alternative candidates.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Joining and Candidate Finalization</h6>
                  <p>
                    The actual joining date of a helper may be affected by circumstances including transportation issues, weather conditions, medical situations, personal emergencies, or other unforeseen circumstances.
                  </p>
                  <p>
                    Once a candidate has been finalized by the client through the applicable communication process, including calls and/or review of available candidate documentation, the applicable service charges will remain payable in accordance with these Terms & Conditions.
                  </p>
                </div>
              </div>

              {/* 7. Miscellaneous Terms */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-3">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">7</span>
                  Miscellaneous Terms
                </h5>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Role of Maid For Ghar</h6>
                  <p>
                    Maid For Ghar primarily acts as a domestic-help recruitment, hiring, and candidate-introduction service.
                  </p>
                  <p>
                    We do not undertake responsibility for resolving routine day-to-day employment disputes, disagreements, or personal conflicts between clients and helpers.
                  </p>
                  <p>
                    Clients and helpers are expected to communicate respectfully and resolve routine employment matters directly wherever appropriate.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Police Verification and Background Checks</h6>
                  <p>
                    Unless specifically stated otherwise for a particular service, Maid For Ghar does not independently conduct police verification.
                  </p>
                  <p>
                    Clients are responsible for determining whether additional police verification, background checks, reference checks, or other verification procedures are required before engaging a helper.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Service Locations</h6>
                  <p>
                    Part-time domestic-help services are currently available in selected locations, including:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 pb-1">
                    {['Delhi NCR', 'Chennai', 'Hyderabad', 'Mumbai', 'Bengaluru', 'Pune'].map((city) => (
                      <div key={city} className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-[#1C2723] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#2A5A43]" />
                        <span>{city}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Availability may vary by locality, service category, and candidate availability.
                  </p>
                </div>

                <div className="space-y-1 pl-1 sm:pl-2">
                  <h6 className="font-semibold text-xs text-[#1C2723] uppercase tracking-wide">Cleaning Equipment</h6>
                  <p>
                    For mopping and similar cleaning activities, clients are required to provide appropriate cleaning equipment, including a mop stick or equivalent cleaning tool. Helpers are not required to perform mopping manually without the necessary equipment.
                  </p>
                </div>
              </div>

              {/* 8. Limitation of Responsibility */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">8</span>
                  Limitation of Responsibility
                </h5>
                <p>
                  Maid For Ghar makes reasonable efforts to facilitate candidate identification and placement. However, the company does not guarantee a particular candidate's future performance, conduct, availability, attendance, or continued employment.
                </p>
                <p>
                  Employment arrangements are ultimately between the client and the helper, and clients remain responsible for complying with applicable employment, wage, safety, and other legal requirements.
                </p>
              </div>

              {/* 9. Governing Law & Jurisdiction */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80 space-y-2">
                <h5 className="font-bold text-[#1C2723] text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#2A5A43] text-white text-xs flex items-center justify-center shrink-0">9</span>
                  Governing Law & Jurisdiction
                </h5>
                <p>
                  These Terms & Conditions shall be governed by and interpreted in accordance with the applicable laws of India.
                </p>
                <p>
                  Subject to applicable law, courts located in <strong>Bengaluru, Karnataka</strong> shall have jurisdiction over disputes arising from or relating to these Terms & Conditions or the services provided by Maid For Ghar.
                </p>
              </div>

              {/* 10. Contact Information */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#2A5A43] text-white space-y-3">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white text-[#2A5A43] text-xs flex items-center justify-center shrink-0 font-bold">10</span>
                  Contact Information
                </h5>

                <div className="space-y-2 text-xs text-emerald-100">
                  <div>
                    <p className="font-bold text-sm text-white">Maid For Ghar</p>
                    <span className="text-[11px] text-emerald-200 block">Corporate & Registered Office</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 leading-snug">
                      <p className="text-white font-medium">#1, Sangamesh Building, Muniswamappa Road</p>
                      <p className="text-emerald-100">R.S. Palya, Kammanahalli Main Road</p>
                      <p className="text-emerald-200 font-semibold">Bengaluru – 560033, Karnataka, India</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 pt-1 border-t border-white/10">
                    <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Email: <a href="mailto:maidforghar@gmail.com" className="underline hover:text-white font-medium">maidforghar@gmail.com</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Phone: <a href="tel:+919364798027" className="underline hover:text-white font-medium">+91 93647 98027</a></span>
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="bg-[#FAF9F5] border-t border-gray-200 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2A5A43]" />
            <span>100% Verified Staff Platform</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-[#1C2723] font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
