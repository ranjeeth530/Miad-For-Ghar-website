import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, X, Eye, EyeOff, Settings, CheckCircle2 } from 'lucide-react';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'set_passcode'>('login');
  
  // Login fields
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Set personal passcode fields
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Stored personal passcode
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    const trimmed = passcode.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: trimmed })
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('owner_authenticated', 'true');
        onSuccessLogin(data.token);
        setPasscode('');
        setError('');
      } else {
        setError(data.error || 'Incorrect Admin Passcode. Access denied.');
      }
    } catch (e) {
      setError('Connection error. Please ensure the server is running and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePersonalPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPasscode.trim().length < 6) {
      setError('Personal passcode must be at least 6 characters long for security.');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setError('Passcodes do not match. Please re-type carefully.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/set-passcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || ''
        },
        body: JSON.stringify({
          newPasscode: newPasscode.trim(),
          currentPasscode: passcode.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('owner_authenticated', 'true');
        setSuccessMsg('Personal passcode saved successfully! Logging in...');
        
        setTimeout(() => {
          onSuccessLogin(data.token);
        }, 600);
      } else {
        setError(data.error || 'Failed to update passcode.');
      }
    } catch (e) {
      setError('Connection error. Could not update passcode. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F5] rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-[#2A5A43]/20 relative text-left max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon with App Symbol */}
        <div className="flex items-center gap-3.5 mb-4">
          <img 
            src={appLogo} 
            alt="Maid for Ghar Logo" 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-contain shadow-md border-2 border-gray-200 shrink-0" 
          />
          <div className="w-12 h-12 rounded-2xl bg-[#2A5A43]/10 text-[#2A5A43] flex items-center justify-center border border-[#2A5A43]/20">
            <Lock className="w-6 h-6 text-[#2A5A43]" />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-serif text-xl font-black text-[#0F2E20]">Maid for Ghar</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs font-bold text-[#2A5A43] uppercase tracking-wider">Management Portal</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1C2723]">
          Admin Portal Access
        </h2>
        <p className="text-xs text-[#4A5A53] mt-1 leading-relaxed">
          Admin features (managing placement requests, assigning staff, and updating database records) are protected with passcode security.
        </p>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center bg-gray-200/70 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white text-[#1C2723] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Enter Passcode
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('set_passcode');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'set_passcode'
                ? 'bg-[#2A5A43] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Set Personal Passcode
          </button>
        </div>

        {activeTab === 'login' ? (
          /* Form: Enter Passcode */
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2723] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#2A5A43]" />
                Owner Access Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your owner passcode"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43] focus:border-transparent transition-all pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Status Hint */}
              <div className="mt-2.5 text-[11px] text-[#2A5A43] bg-[#2A5A43]/10 px-3 py-2 rounded-xl flex items-center gap-2 font-medium border border-[#2A5A43]/20">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Protected Owner Session. Enter your agency passcode to unlock management.
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs px-3.5 py-2.5 rounded-xl border border-red-200 flex items-center gap-2 animate-in shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !passcode.trim()}
                className="w-2/3 py-3 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Verifying...' : 'Unlock Admin View'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Form: Set Personal Passcode */
          <form onSubmit={handleSavePersonalPasscode} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2723] uppercase tracking-wider mb-1">
                New Personal Passcode
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPasscode}
                  onChange={(e) => {
                    setNewPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Create your custom passcode"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43] focus:border-transparent transition-all pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2723] uppercase tracking-wider mb-1">
                Confirm Personal Passcode
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPasscode}
                onChange={(e) => {
                  setConfirmPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Re-enter your custom passcode"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43] focus:border-transparent transition-all"
              />
            </div>

            <div className="text-[11px] text-[#4A5A53] bg-amber-50/80 p-3 rounded-xl border border-amber-200">
              💡 Your personal passcode will be securely saved in your browser for quick admin access.
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs px-3.5 py-2.5 rounded-xl border border-red-200 flex items-center gap-2 animate-in shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-1/3 py-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newPasscode.trim() || !confirmPasscode.trim()}
                className="w-2/3 py-3 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Saving...' : 'Save & Unlock Admin'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
