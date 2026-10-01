import React, { useState, useEffect } from 'react';
import { formatDateToIndian, formatDateTimeToIndian, formatTime12Hour } from '../utils/dateUtils';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Phone, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Plus, 
  Sparkles,
  MessageSquare,
  Lock,
  LogOut,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  TrendingUp,
  BarChart3,
  Download,
  FileSpreadsheet,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Zap,
  Check,
  X,
  RefreshCw,
  RotateCcw,
  Play,
  Send,
  Radio,
  Smartphone,
  MessageCircle,
  ExternalLink,
  Database,
  CalendarCheck
} from 'lucide-react';
import { BookingRequest, CustomInquiry, DomesticHelper, NotificationDispatchLog } from '../types';

interface AdminNotification {
  id: string;
  title: string;
  customerName: string;
  serviceTitle: string;
  city: string;
  timestamp: string;
  bookingId: string;
  isRead: boolean;
}

interface AdminDashboardProps {
  bookings: BookingRequest[];
  inquiries: CustomInquiry[];
  helpers: DomesticHelper[];
  adminToken?: string | null;
  onUpdateStatus: (bookingId: string, newStatus: string, helperName?: string) => Promise<any>;
  onDeleteBooking: (bookingId: string) => Promise<any>;
  onDeleteInquiry?: (inquiryId: string) => Promise<any>;
  onDeleteHelper?: (helperId: string) => Promise<any>;
  onAddHelper: (helper: any) => Promise<any>;
  onCloseAdmin: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
  onOpenAdminLoginModal: () => void;
  onOpenBookingModal?: (serviceId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  inquiries,
  helpers,
  adminToken,
  onUpdateStatus,
  onDeleteBooking,
  onDeleteInquiry,
  onDeleteHelper,
  onAddHelper,
  onCloseAdmin,
  isAdminLoggedIn,
  onAdminLogout,
  onOpenAdminLoginModal,
  onOpenBookingModal
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'inquiries' | 'search_logs' | 'notifications'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchStats, setSearchStats] = useState<any>(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<BookingRequest | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false);
  const [logsToast, setLogsToast] = useState<string | null>(null);
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [isConfirmingClearLogs, setIsConfirmingClearLogs] = useState<boolean>(false);

  // Live ticking date state (12-hour format)
  const [liveAdminDate, setLiveAdminDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveAdminDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Notification Logs States
  const [notificationLogs, setNotificationLogs] = useState<NotificationDispatchLog[]>([]);
  const [isLoadingNotifLogs, setIsLoadingNotifLogs] = useState<boolean>(false);
  const [notifChannelFilter, setNotifChannelFilter] = useState<'all' | 'SMS' | 'WhatsApp'>('all');
  const [notifSearchQuery, setNotifSearchQuery] = useState<string>('');
  const [testSendModalOpen, setTestSendModalOpen] = useState<boolean>(false);
  const [testSendForm, setTestSendForm] = useState<{
    name: string;
    phone: string;
    channel: 'both' | 'sms' | 'whatsapp';
    message: string;
  }>({
    name: '',
    phone: '',
    channel: 'both',
    message: ''
  });
  const [testSendLoading, setTestSendLoading] = useState<boolean>(false);
  const [testSendResult, setTestSendResult] = useState<string | null>(null);
  const [isConfirmingClearNotifLogs, setIsConfirmingClearNotifLogs] = useState<boolean>(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'booking' | 'inquiry' | 'helper';
    id: string;
    name: string;
  } | null>(null);

  // Real-time Notification States
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<AdminNotification | null>(null);
  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(null);

  const knownBookingIdsRef = React.useRef<Set<string>>(new Set());
  const isInitialLoadRef = React.useRef<boolean>(true);

  // Audio Chime Synthesizer using Web Audio API
  const playNotificationSound = React.useCallback(() => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Chime melody: G5 -> C6
      osc1.frequency.setValueAtTime(783.99, now);
      osc1.frequency.setValueAtTime(1046.50, now + 0.12);

      osc2.frequency.setValueAtTime(1174.66, now);
      osc2.frequency.setValueAtTime(1567.98, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      // Audio playback blocked or uninitialized
    }
  }, [isSoundEnabled]);

  // Monitor incoming bookings and trigger real-time notifications
  React.useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    if (isInitialLoadRef.current) {
      // On initial mount, populate set of existing IDs so we only alert on genuinely NEW bookings
      bookings.forEach(b => knownBookingIdsRef.current.add(b.id));
      isInitialLoadRef.current = false;
      return;
    }

    // Check for newly added bookings
    const newBookings = bookings.filter(b => !knownBookingIdsRef.current.has(b.id));

    if (newBookings.length > 0) {
      newBookings.forEach(b => {
        knownBookingIdsRef.current.add(b.id);
        const notif: AdminNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: '⚡ New Booking Request Received!',
          customerName: b.customerName,
          serviceTitle: b.serviceTitle,
          city: b.city,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bookingId: b.id,
          isRead: false
        };

        setNotifications(prev => [notif, ...prev]);
        setActiveToast(notif);
        playNotificationSound();
      });
    }
  }, [bookings, playNotificationSound]);

  // Auto-dismiss active toast alert after 7 seconds
  React.useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSelectNotification = (notif: AdminNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setActiveTab('bookings');
    setStatusFilter('all');
    setHighlightedBookingId(notif.bookingId);
    setIsNotificationMenuOpen(false);

    const targetBooking = bookings.find(b => b.id === notif.bookingId);
    if (targetBooking) {
      setSelectedBookingForDetails(targetBooking);
    }

    // Remove highlight after 4 seconds
    setTimeout(() => {
      setHighlightedBookingId(null);
    }, 4000);
  };

  const showLogsToastMessage = (msg: string) => {
    setLogsToast(msg);
    setTimeout(() => {
      setLogsToast(null);
    }, 3000);
  };

  const fetchSearchStats = React.useCallback(async (showToast = false) => {
    setIsLoadingLogs(true);
    try {
      const token = adminToken || sessionStorage.getItem('admin_token') || '';
      const res = await fetch('/api/search-logs/stats', {
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        onAdminLogout();
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setSearchStats(data);
      const nowFormatted = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastRefreshedAt(nowFormatted);
      if (showToast) {
        showLogsToastMessage('Search analytics logs refreshed!');
      }
    } catch (err) {
      console.error('Error fetching search stats:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [adminToken, onAdminLogout]);

  React.useEffect(() => {
    if (activeTab === 'search_logs') {
      fetchSearchStats(false);
    }
  }, [activeTab, fetchSearchStats]);

  // Live Auto-Refresh Interval
  React.useEffect(() => {
    if (activeTab === 'search_logs' && isAutoRefresh) {
      const interval = setInterval(() => {
        fetchSearchStats(false);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeTab, isAutoRefresh, fetchSearchStats]);

  const handleClearLogs = async () => {
    try {
      const token = adminToken || sessionStorage.getItem('admin_token') || '';
      const res = await fetch('/api/search-logs', {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) {
        setIsConfirmingClearLogs(false);
        showLogsToastMessage('All search logs cleared.');
        fetchSearchStats(false);
      }
    } catch (err) {
      console.error('Error clearing search logs:', err);
    }
  };

  // Notification Logs Fetching & Testing
  const fetchNotificationLogs = React.useCallback(async (showToast = false) => {
    setIsLoadingNotifLogs(true);
    try {
      const token = adminToken || sessionStorage.getItem('admin_token') || '';
      const res = await fetch('/api/notifications/logs', {
        headers: { 'x-admin-token': token }
      });
      if (res.status === 401) {
        onAdminLogout();
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setNotificationLogs(data || []);
      if (showToast) {
        showLogsToastMessage('SMS & WhatsApp notification logs refreshed!');
      }
    } catch (err) {
      console.error('Error fetching notification logs:', err);
    } finally {
      setIsLoadingNotifLogs(false);
    }
  }, [adminToken, onAdminLogout]);

  React.useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotificationLogs(false);
    }
  }, [activeTab, fetchNotificationLogs]);

  const handleTestSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSendForm.phone) return;
    setTestSendLoading(true);
    setTestSendResult(null);
    try {
      const token = adminToken || sessionStorage.getItem('admin_token') || '';
      const res = await fetch('/api/notifications/test-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(testSendForm)
      });
      const data = await res.json();
      if (res.ok) {
        setTestSendResult(`Success: Dispatched alert to ${testSendForm.phone}!`);
        fetchNotificationLogs(false);
        setTimeout(() => {
          setTestSendModalOpen(false);
          setTestSendResult(null);
          setTestSendForm({ name: '', phone: '', channel: 'both', message: '' });
        }, 1500);
      } else {
        setTestSendResult(`Error: ${data.error || 'Failed to dispatch'}`);
      }
    } catch (err) {
      setTestSendResult('Error: Failed to dispatch notification.');
    } finally {
      setTestSendLoading(false);
    }
  };

  const handleClearNotifLogs = async () => {
    try {
      const token = adminToken || sessionStorage.getItem('admin_token') || '';
      const res = await fetch('/api/notifications/logs', {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (res.ok) {
        setIsConfirmingClearNotifLogs(false);
        showLogsToastMessage('All notification dispatch logs cleared.');
        fetchNotificationLogs(false);
      }
    } catch (err) {
      console.error('Error clearing notif logs:', err);
    }
  };

  const handleExportNotificationLogs = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const headers = [
      'Log ID',
      'Channel',
      'Recipient Name',
      'Recipient Phone',
      'Template Type',
      'Gateway',
      'Status',
      'Message Text',
      'Timestamp'
    ];
    const rows = notificationLogs.map(l => [
      l.id,
      l.channel,
      l.recipientName,
      l.recipientPhone,
      l.templateType,
      l.gateway,
      l.status,
      l.message.replace(/\n/g, ' '),
      l.timestamp
    ]);
    downloadCSV(`maidforghar_notifications_${dateStr}.csv`, headers, rows);
  };

  // If not logged in as Admin, display restricted access view
  if (!isAdminLoggedIn) {
    return (
      <div className="pt-12 sm:pt-20 pb-20 px-4 max-w-lg mx-auto text-center">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2A5A43]/20 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#D96C4E] mx-auto flex items-center justify-center border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" /> Agency Owner Access Only
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C2723]">
              Admin Dashboard (Owner Restricted)
            </h2>
            <p className="text-xs text-[#4A5A53] mt-2 leading-relaxed">
              The Admin Dashboard is strictly reserved for the Agency Owner and authorized staff to manage customer placement requests, assign verified domestic help, and update helper profiles. Customers do not have access to this portal.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-gray-200 text-left space-y-2">
            <div className="text-xs font-semibold text-[#1C2723] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2A5A43]" /> Owner Passcode Authentication
            </div>
            <p className="text-[11px] text-[#4A5A53]">
              Enter your verified owner passcode to access administrative management tools.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onOpenAdminLoginModal}
              className="w-full py-3.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Enter Admin Passcode</span>
            </button>
            <button
              onClick={onCloseAdmin}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1C2723] text-xs font-semibold transition-colors"
            >
              Return to Customer View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stats
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const assignedCount = bookings.filter(b => b.status === 'Helper Assigned').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const downloadCSV = (filename: string, headers: string[], rows: (string | number | boolean)[][]) => {
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportBookings = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const headers = [
      'Booking ID',
      'Customer Name',
      'Phone Number',
      'Service Required',
      'Shift Type',
      'City',
      'Locality',
      'Start Date',
      'Household Size',
      'Assigned Staff',
      'Status',
      'Created At'
    ];
    const rows = filteredBookings.map(b => [
      b.id,
      b.customerName,
      b.phone,
      b.serviceTitle,
      b.shiftType.replace('_', ' '),
      b.city,
      b.locality || '',
      formatDateToIndian(b.startDate),
      b.householdSize || '',
      b.helperName || 'Unassigned',
      b.status,
      b.createdAt || ''
    ]);
    downloadCSV(`maidforghar_bookings_${dateStr}.csv`, headers, rows);
  };

  const handleExportInquiries = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const headers = [
      'Inquiry ID',
      'Customer Name',
      'Phone Number',
      'City',
      'Requirement Details',
      'Urgency Level',
      'Timestamp'
    ];
    const rows = inquiries.map(inq => [
      inq.id,
      inq.name,
      inq.phone,
      inq.city,
      inq.requirement,
      inq.urgency,
      inq.createdAt || ''
    ]);
    downloadCSV(`maidforghar_callbacks_${dateStr}.csv`, headers, rows);
  };

  const handleExportHelpers = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const headers = [
      'Staff ID',
      'Name',
      'Category',
      'Experience (Years)',
      'City',
      'Localities',
      'Rating',
      'Languages Spoken'
    ];
    const rows = helpers.map(h => [
      h.id,
      h.name,
      h.categoryTitle,
      h.experienceYears,
      h.city,
      (h.localities || []).join('; '),
      h.rating,
      (h.languages || []).join('; ')
    ]);
    downloadCSV(`maidforghar_staff_directory_${dateStr}.csv`, headers, rows);
  };

  return (
    <div className="pt-6 sm:pt-10 pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left min-h-screen relative">
      
      {/* FLOATING REAL-TIME BOOKING TOAST ALERT */}
      {activeToast && (
        <div className="fixed top-4 sm:top-20 left-3 right-3 sm:left-auto sm:right-6 md:right-8 z-50 sm:max-w-md bg-[#1C2723] text-white p-3.5 sm:p-5 rounded-2xl shadow-2xl border-2 border-[#D96C4E] animate-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#D96C4E] text-white shrink-0 animate-pulse mt-0.5">
                <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                    Real-time Alert
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">{activeToast.timestamp}</span>
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-white">
                  {activeToast.title}
                </h4>
                <p className="text-xs text-gray-200 leading-snug">
                  <strong className="text-amber-300">{activeToast.customerName}</strong> requested <strong className="text-white">{activeToast.serviceTitle}</strong> in <span className="text-emerald-300 font-semibold">{activeToast.city}</span>.
                </p>
                <div className="pt-1.5 sm:pt-2">
                  <button
                    onClick={() => handleSelectNotification(activeToast)}
                    className="px-3 py-1.5 rounded-lg bg-[#2A5A43] hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review Booking Request</span> →
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer"
              aria-label="Close Toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-[10px] font-bold uppercase tracking-wider">
              <LayoutDashboard className="w-3 h-3" /> Agency Admin Portal
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authenticated
            </div>
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Sync Active</span>
            </div>
            {/* Cloud Firestore Indicator */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-300 shadow-2xs" title="Connected to Google Cloud Firestore (marklar-apparatus-g1ttq)">
              <Database className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Cloud Firestore Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <img 
              src={appLogo} 
              alt="Maid for Ghar Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-contain shadow-sm border border-gray-300 shrink-0" 
            />
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1C2723]">
                Admin Dashboard
              </h1>
              <p className="text-[11px] text-[#4A5A53] mt-0.5">
                Real-time domestic staff booking requests, helper assignments, and dispatch status.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Date Calendar Widget with 12-Hour Live Clock */}
          <div className="px-2.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-gray-200 flex items-center gap-1.5 text-xs text-[#1C2723] font-medium shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#2A5A43]" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-gray-700">{liveAdminDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              <span className="text-[#2A5A43] font-mono text-[10px] font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                {formatTime12Hour(liveAdminDate, true)}
              </span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
              isSoundEnabled
                ? 'bg-emerald-50 text-[#2A5A43] border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
            }`}
            title={isSoundEnabled ? 'Alert Sounds Enabled (Click to Mute)' : 'Alert Sounds Muted (Click to Enable)'}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2A5A43]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
            <span className="hidden sm:inline text-[11px]">{isSoundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          {/* Real-time Notification Center Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-[#1C2723] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors relative cursor-pointer"
              title="Notifications Center"
            >
              {unreadCount > 0 ? (
                <BellRing className="w-3.5 h-3.5 text-[#D96C4E] animate-bounce" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-gray-600" />
              )}
              <span className="text-[11px]">Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#D96C4E] text-white text-[9px] font-extrabold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationMenuOpen && (
              <>
                {/* Mobile Backdrop Overlay */}
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 sm:hidden" 
                  onClick={() => setIsNotificationMenuOpen(false)} 
                />

                <div className="fixed sm:absolute inset-x-3 sm:inset-auto top-20 sm:top-full sm:right-0 sm:mt-2 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden text-left animate-in fade-in duration-150">
                  <div className="p-3.5 sm:p-4 bg-[#FAF9F5] border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-[#D96C4E]" />
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C2723]">Real-time Notifications</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-bold text-[#2A5A43] hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setIsNotificationMenuOpen(false)}
                        className="text-gray-400 hover:text-gray-700 p-1 rounded-lg sm:hidden cursor-pointer"
                        aria-label="Close Notifications"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[55vh] sm:max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 sm:p-8 text-center text-xs text-gray-400 space-y-1">
                        <Bell className="w-6 h-6 mx-auto text-gray-300" />
                        <div>No booking alerts yet</div>
                        <div className="text-[10px] text-gray-400">New requests will sound an alert here automatically</div>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleSelectNotification(n)}
                          className={`p-3 sm:p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 ${
                            !n.isRead ? 'bg-amber-50/60 border-l-4 border-l-[#D96C4E]' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-xl text-white shrink-0 ${!n.isRead ? 'bg-[#D96C4E]' : 'bg-gray-200 text-gray-600'}`}>
                            <Bell className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#1C2723] truncate">{n.customerName}</span>
                              <span className="text-[10px] text-gray-400 shrink-0 ml-2">{n.timestamp}</span>
                            </div>
                            <div className="text-xs text-[#2A5A43] font-medium truncate">{n.serviceTitle}</div>
                            <div className="text-[11px] text-gray-500">{n.city} • <span className="font-semibold text-amber-700">Pending Review</span></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 sm:p-3 bg-gray-50 border-t border-gray-200 text-center">
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
                      Auto-synced with active booking requests
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onAdminLogout}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Lock Admin Session"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px]">Lock</span>
          </button>
          <button
            onClick={onCloseAdmin}
            className="px-3 py-1.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Return to Customer Website"
          >
            <span>← Public Website</span>
          </button>
        </div>
      </div>

      {/* Compact Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5">
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Bookings</div>
            <div className="font-serif text-xl font-bold text-[#1C2723] leading-none mt-1">{totalBookings}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#D96C4E]/20 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#D96C4E] uppercase tracking-wider">Pending Review</div>
            <div className="font-serif text-xl font-bold text-[#D96C4E] leading-none mt-1">{pendingCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D96C4E] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#2A5A43]/20 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#2A5A43] uppercase tracking-wider">Staff Assigned</div>
            <div className="font-serif text-xl font-bold text-[#2A5A43] leading-none mt-1">{assignedCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2A5A43] flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-blue-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Completed / Active</div>
            <div className="font-serif text-xl font-bold text-blue-700 leading-none mt-1">{completedCount}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Compact Tabs */}
      <div className="flex items-center gap-1.5 border-b border-gray-200 mb-3.5 overflow-x-auto whitespace-nowrap pb-0.5">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-[#2A5A43] text-[#2A5A43]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> 
          <span>Staff Requests ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-[#2A5A43] text-[#2A5A43]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> 
          <span>Quick Callbacks ({inquiries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('search_logs')}
          className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'search_logs'
              ? 'border-[#2A5A43] text-[#2A5A43]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#D96C4E]" /> 
          <span>Search Demand Logs</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 
          <span>SMS & WA Dispatch Logs</span>
        </button>
      </div>

      {/* TAB 1: COMPACT DOMESTIC STAFF BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <div className="space-y-2.5">
          
          {/* Compact Filter & Search Bar */}
          <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search name, phone, city, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-[#FAF9F5] border border-gray-200 rounded-lg text-xs font-medium text-[#1C2723] focus:outline-none focus:ring-1 focus:ring-[#2A5A43]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <span>Showing <strong className="text-[#1C2723]">{filteredBookings.length}</strong> of {bookings.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-gray-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#FAF9F5] border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1C2723] focus:outline-none focus:ring-1 focus:ring-[#2A5A43]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Helper Assigned">Helper Assigned</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {onOpenBookingModal && (
                <button
                  type="button"
                  onClick={() => onOpenBookingModal()}
                  className="px-2.5 py-1 rounded-lg bg-[#D96C4E] hover:bg-[#c45a3d] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  title="Create New Placement Request"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-amber-200" />
                  <span>+ New Booking</span>
                </button>
              )}

              <button
                onClick={handleExportBookings}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#2A5A43] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="Export Bookings to CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#2A5A43]" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Mobile Booking Cards (Visible on mobile, hidden on sm+) */}
          <div className="sm:hidden space-y-2.5">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-xs text-gray-400 border border-gray-200 shadow-2xs">
                No domestic staff booking requests match the filter.
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className={`bg-white rounded-xl p-3.5 border transition-all text-left shadow-2xs space-y-2.5 ${
                    highlightedBookingId === b.id
                      ? 'border-[#D96C4E] ring-2 ring-[#D96C4E]/30 bg-amber-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Top Bar: Customer & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-[#1C2723] truncate">{b.customerName}</span>
                        <span className="text-[10px] font-mono font-bold text-[#2A5A43] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          #{b.id}
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] truncate mt-0.5">
                        {b.serviceTitle} • {b.shiftType.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <select
                      value={b.status}
                      onChange={(e) => onUpdateStatus(b.id, e.target.value)}
                      className={`shrink-0 px-2 py-1 rounded-lg text-[10.5px] font-bold border focus:outline-none cursor-pointer ${
                        b.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : b.status === 'Helper Assigned'
                          ? 'bg-emerald-50 text-[#2A5A43] border-emerald-300'
                          : b.status === 'Interview Scheduled'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : b.status === 'Completed'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Touch">In Touch</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Helper Assigned">Helper Assigned</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Details Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#2A5A43] shrink-0" />
                      <span className="truncate">{b.city} {b.locality ? `(${b.locality})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">Start: {formatDateToIndian(b.startDate)}</span>
                    </div>
                  </div>

                  {/* Staff Assignment & Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="text-[11px] truncate pr-2">
                      {b.helperName ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-[#2A5A43] font-bold text-[10px] border border-emerald-200 truncate">
                          <ShieldCheck className="w-3 h-3 text-[#2A5A43] shrink-0" /> {b.helperName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">Staff: Unassigned</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDetails(b)}
                        className="px-2 py-1 rounded-lg bg-[#2A5A43]/10 hover:bg-[#2A5A43]/20 text-[#2A5A43] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                      <a
                        href={`tel:${b.phone}`}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-50 text-[#2A5A43] transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="WhatsApp Customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'booking', id: b.id, name: `Booking #${b.id} (${b.customerName})` })}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop/Tablet Compact Bookings Table (Hidden on mobile, visible on sm+) */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-gray-200 text-[#4A5A53] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-3 py-2">Customer & Contact</th>
                    <th className="px-3 py-2">Service & Shift</th>
                    <th className="px-3 py-2">City & Start Date</th>
                    <th className="px-3 py-2">Assigned Staff</th>
                    <th className="px-3 py-2">Placement Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-[#1C2723]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 px-3 text-center text-xs text-gray-400">
                        No domestic staff booking requests match the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        className={`transition-all duration-300 ${
                          highlightedBookingId === b.id
                            ? 'bg-amber-100/90 ring-1 ring-[#D96C4E] shadow-xs font-semibold'
                            : 'hover:bg-gray-50/90'
                        }`}
                      >
                        {/* Customer Column */}
                        <td className="px-3 py-2 align-top">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-[#1C2723]">{b.customerName}</span>
                            <span className="text-[10px] font-mono font-bold text-[#2A5A43] bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                              #{b.id}
                            </span>
                          </div>
                          <div className="text-gray-500 text-[11px] flex items-center gap-2 mt-0.5">
                            <a 
                              href={`tel:${b.phone}`}
                              className="text-gray-600 hover:text-[#2A5A43] flex items-center gap-0.5 hover:underline font-mono"
                              title="Click to call customer"
                            >
                              <Phone className="w-3 h-3 text-[#D96C4E]" /> {b.phone}
                            </a>
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 text-[10px] font-bold"
                              title="Message customer on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" /> Chat
                            </a>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-emerald-50 text-[9px] font-bold text-emerald-800 border border-emerald-200" title="SMS confirmation delivered">
                              <Smartphone className="w-2.5 h-2.5 text-emerald-600" /> SMS
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-green-50 text-[9px] font-bold text-green-800 border border-green-200" title="WhatsApp confirmation delivered">
                              <MessageCircle className="w-2.5 h-2.5 text-green-600" /> WA
                            </span>
                          </div>
                        </td>

                        {/* Service & Shift Column */}
                        <td className="px-3 py-2 align-top">
                          <div className="font-bold text-xs text-[#1C2723]">{b.serviceTitle}</div>
                          <div className="flex items-center gap-1 flex-wrap mt-0.5">
                            <span className="inline-block px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 text-[10px] font-medium capitalize">
                              {b.shiftType.replace('_', ' ')}
                            </span>
                            {b.householdSize && (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                                {b.householdSize}
                              </span>
                            )}
                            {b.salaryRange && (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                                {b.salaryRange}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Location & Start Date Column */}
                        <td className="px-3 py-2 align-top">
                          <div className="font-bold text-xs flex items-center gap-1 text-[#1C2723]">
                            <MapPin className="w-3 h-3 text-[#2A5A43] shrink-0" /> 
                            <span>{b.city}</span>
                            {b.locality && <span className="text-gray-500 font-normal text-[11px]">({b.locality})</span>}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" /> 
                            <span>Start: <strong className="text-gray-700">{formatDateToIndian(b.startDate)}</strong></span>
                          </div>
                        </td>

                        {/* Assigned Staff Column */}
                        <td className="px-3 py-2 align-top">
                          {b.helperName ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-[#2A5A43] border border-emerald-200 font-bold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#2A5A43]" />
                              <span>{b.helperName}</span>
                            </div>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] italic">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="px-3 py-2 align-top">
                          <select
                            value={b.status}
                            onChange={(e) => onUpdateStatus(b.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors focus:outline-none cursor-pointer ${
                              b.status === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : b.status === 'Helper Assigned'
                                ? 'bg-emerald-50 text-[#2A5A43] border-emerald-300'
                                : b.status === 'Interview Scheduled'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : b.status === 'Completed'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Touch">In Touch</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Helper Assigned">Helper Assigned</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions Column */}
                        <td className="px-3 py-2 align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDetails(b)}
                              className="px-2 py-1 rounded-md bg-[#2A5A43]/10 hover:bg-[#2A5A43]/20 text-[#2A5A43] text-[10.5px] font-bold transition-colors cursor-pointer"
                              title="View & Manage Booking Request"
                            >
                              Manage
                            </button>
                            <a
                              href={`tel:${b.phone}`}
                              className="p-1 rounded-md text-[#2A5A43] hover:bg-emerald-50 transition-colors"
                              title={`Call ${b.customerName}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'booking', id: b.id, name: `Booking #${b.id} (${b.customerName})` })}
                              className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none transition-colors cursor-pointer"
                              title="Delete Booking"
                              aria-label={`Delete booking ${b.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES LIST */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C2723]">Quick Callback Requests</h3>
              <p className="text-xs text-gray-500">Inquiries submitted via the fast phone call-back form</p>
            </div>
            <button
              onClick={handleExportInquiries}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#2A5A43] text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
              title="Export Quick Callbacks to CSV/Excel format"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#2A5A43]" />
              <span>Export Callbacks CSV</span>
            </button>
          </div>
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No quick callback requests logged yet.</div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#1C2723]">{inq.name} ({inq.phone})</div>
                    <div className="text-[#4A5A53]">Requirement: "{inq.requirement}"</div>
                    <div className="text-gray-400 text-[10px]">City: {inq.city} • Urgency: {inq.urgency}</div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <a
                      href={`tel:${inq.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-[#2A5A43] hover:bg-[#1E4231] text-white font-bold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
                      aria-label={`Call client ${inq.name} at ${inq.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Client
                    </a>
                    {onDeleteInquiry && (
                      <button
                        onClick={() => setDeleteConfirm({ type: 'inquiry', id: inq.id, name: `Callback Request from ${inq.name}` })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        title="Delete Request"
                        aria-label={`Delete callback request from ${inq.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HERO SEARCH ANALYTICS */}
      {activeTab === 'search_logs' && (
        <div className="space-y-6">
          {/* Header & Controls Bar */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#1C2723] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#D96C4E]" />
                  Hero Search Activity & Market Demand
                </h3>
                {lastRefreshedAt && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
                    Updated {lastRefreshedAt}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time search logs captured when visitors select cities, service types, and duty shifts in the hero search bar.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              {/* Auto Refresh Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                title="Toggle 8-second auto refresh interval"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isAutoRefresh
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isAutoRefresh ? 'fill-white' : 'text-gray-400'}`} />
                <span>{isAutoRefresh ? 'Auto Live (8s)' : 'Auto-Refresh Off'}</span>
              </button>

              {/* Refresh Logs Button */}
              <button
                type="button"
                disabled={isLoadingLogs}
                onClick={() => fetchSearchStats(true)}
                className="px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] disabled:opacity-60 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                <span>{isLoadingLogs ? 'Refreshing...' : 'Refresh Logs'}</span>
              </button>

              {/* Clear Logs Button */}
              {searchStats?.recentLogs && searchStats.recentLogs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingClearLogs(true)}
                  title="Clear all search logs"
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Toast Notification Banner */}
          {logsToast && (
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{logsToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setLogsToast(null)}
                className="text-emerald-600 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoadingLogs && !searchStats ? (
            <div className="p-12 text-center text-gray-500 text-sm bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#2A5A43] animate-spin" />
              <span>Fetching search analytics & logs...</span>
            </div>
          ) : searchStats ? (
            <>
              {/* Analytics Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Searches Logged</div>
                  <div className="font-serif text-3xl font-bold text-[#1C2723] mt-1">{searchStats.totalSearches}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Captured in real-time
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#2A5A43]/20 shadow-xs">
                  <div className="text-[11px] font-bold text-[#2A5A43] uppercase tracking-wider">Top Searched City</div>
                  <div className="font-serif text-2xl font-bold text-[#1C2723] mt-1">
                    {Object.entries(searchStats.cityCounts || {})
                      .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'}
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">
                    {String(Object.entries(searchStats.cityCounts || {})
                      .sort((a: any, b: any) => b[1] - a[1])[0]?.[1] || 0)} search queries
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#D96C4E]/20 shadow-xs">
                  <div className="text-[11px] font-bold text-[#D96C4E] uppercase tracking-wider">Top Service Category</div>
                  <div className="font-serif text-xl font-bold text-[#1C2723] mt-1 capitalize">
                    {(Object.entries(searchStats.categoryCounts || {})
                      .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'all')
                      .replace('_', ' ')}
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">
                    {String(Object.entries(searchStats.categoryCounts || {})
                      .sort((a: any, b: any) => b[1] - a[1])[0]?.[1] || 0)} search queries
                  </div>
                </div>
              </div>

              {/* City & Category Distribution Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cities */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#1C2723] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D96C4E]" /> Most Searched Cities
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(searchStats.cityCounts || {}).length > 0 ? (
                      Object.entries(searchStats.cityCounts || {}).map(([city, count]: any) => {
                        const pct = Math.round((count / (searchStats.totalSearches || 1)) * 100);
                        return (
                          <div key={city} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold text-[#1C2723]">
                              <span>{city}</span>
                              <span className="text-gray-500">{count} searches ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#2A5A43] rounded-full" style={{ width: `${Math.max(pct, 5)}%` }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-gray-400 py-4 text-center">No city search data yet.</div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#1C2723] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#2A5A43]" /> Service Category Demand
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(searchStats.categoryCounts || {}).length > 0 ? (
                      Object.entries(searchStats.categoryCounts || {}).map(([cat, count]: any) => {
                        const pct = Math.round((count / (searchStats.totalSearches || 1)) * 100);
                        const displayTitle = cat === 'all' ? 'All Services' : cat.replace('_', ' ');
                        return (
                          <div key={cat} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold text-[#1C2723] capitalize">
                              <span>{displayTitle}</span>
                              <span className="text-gray-500">{count} searches ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#D96C4E] rounded-full" style={{ width: `${Math.max(pct, 5)}%` }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-gray-400 py-4 text-center">No category search data yet.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Search Logs Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h4 className="font-serif font-bold text-sm text-[#1C2723]">
                      Recent Search Queries Log
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Log Filter Input */}
                    <div className="relative w-full sm:w-56">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={logSearchQuery}
                        onChange={(e) => setLogSearchQuery(e.target.value)}
                        placeholder="Filter logs by city or category..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2A5A43] placeholder:text-gray-400"
                      />
                      {logSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setLogSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      Showing {searchStats.recentLogs?.length || 0} entries
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="p-3">Log ID</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Category Filter</th>
                        <th className="p-3">Shift Filter</th>
                        <th className="p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(() => {
                        const logs = searchStats.recentLogs || [];
                        const filtered = logs.filter((log: any) => {
                          if (!logSearchQuery) return true;
                          const q = logSearchQuery.toLowerCase();
                          return (
                            log.id?.toLowerCase().includes(q) ||
                            log.city?.toLowerCase().includes(q) ||
                            log.category?.toLowerCase().includes(q) ||
                            log.shift?.toLowerCase().includes(q)
                          );
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-400">
                                {logSearchQuery ? `No logs found matching "${logSearchQuery}"` : 'No search logs recorded yet.'}
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((log: any) => (
                          <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-3 font-mono text-[11px] text-gray-500">{log.id}</td>
                            <td className="p-3 font-bold text-[#1C2723]">{log.city}</td>
                            <td className="p-3 text-[#2A5A43] font-medium capitalize">
                              {log.category === 'all' ? 'All Services' : log.category.replace('_', ' ')}
                            </td>
                            <td className="p-3 text-gray-600 capitalize">
                              {log.shift === 'all' ? 'All Shifts' : log.shift.replace('_', ' ')}
                            </td>
                            <td className="p-3 text-gray-400 text-[11px]">
                              {formatDateTimeToIndian(log.timestamp)}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 text-xs bg-white rounded-2xl border border-gray-200 space-y-2">
              <TrendingUp className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-700">No search logs recorded yet.</p>
              <p className="text-gray-400 max-w-sm mx-auto">
                Live search queries and filter selections by prospective clients will be tracked and displayed here in real-time.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUTOMATED NOTIFICATIONS DISPATCH CENTER */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Notification Engine Stats & Test Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-600" /> Total Dispatched
              </div>
              <div className="font-serif text-2xl font-bold text-[#1C2723] mt-1">{notificationLogs.length}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Automated Client Alerts</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <div className="text-[11px] font-bold text-blue-600 uppercase flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> SMS Confirmations
              </div>
              <div className="font-serif text-2xl font-bold text-blue-700 mt-1">
                {notificationLogs.filter(l => l.channel === 'SMS').length}
              </div>
              <div className="text-[10px] text-blue-500 mt-0.5">Direct mobile SMS</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
              <div className="text-[11px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Alerts
              </div>
              <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">
                {notificationLogs.filter(l => l.channel === 'WhatsApp').length}
              </div>
              <div className="text-[10px] text-emerald-500 mt-0.5">Verified WhatsApp Cloud</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <div className="text-[11px] font-bold text-amber-600 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Delivery Rate
              </div>
              <div className="font-serif text-2xl font-bold text-amber-700 mt-1">100%</div>
              <div className="text-[10px] text-amber-600 mt-0.5">Zero Dropped Alerts</div>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, phone, message..."
                  value={notifSearchQuery}
                  onChange={(e) => setNotifSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs font-semibold text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
                />
              </div>

              {/* Channel Filter */}
              <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setNotifChannelFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    notifChannelFilter === 'all'
                      ? 'bg-[#2A5A43] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Channels
                </button>
                <button
                  type="button"
                  onClick={() => setNotifChannelFilter('SMS')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    notifChannelFilter === 'SMS'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  SMS Only
                </button>
                <button
                  type="button"
                  onClick={() => setNotifChannelFilter('WhatsApp')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    notifChannelFilter === 'WhatsApp'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  WhatsApp Only
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setTestSendModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Send SMS/WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => fetchNotificationLogs(true)}
                disabled={isLoadingNotifLogs}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-50"
                title="Refresh Logs"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingNotifLogs ? 'animate-spin text-[#2A5A43]' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleExportNotificationLogs}
                className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Export Notification Logs to CSV"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmingClearNotifLogs(true)}
                className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-600 cursor-pointer"
                title="Clear All Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification Logs Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-[#FAF9F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <h4 className="font-serif font-bold text-sm text-[#1C2723]">
                  Live Dispatched SMS & WhatsApp History
                </h4>
              </div>
              <span className="text-xs text-gray-400">
                Total {notificationLogs.length} messages logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200 text-[10px]">
                  <tr>
                    <th className="p-3.5">Channel</th>
                    <th className="p-3.5">Recipient & Contact</th>
                    <th className="p-3.5">Template / Purpose</th>
                    <th className="p-3.5">Message Content</th>
                    <th className="p-3.5">Gateway Provider</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Time Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-[#1C2723]">
                  {(() => {
                    const filtered = notificationLogs.filter(l => {
                      if (notifChannelFilter !== 'all' && l.channel !== notifChannelFilter) return false;
                      if (!notifSearchQuery) return true;
                      const q = notifSearchQuery.toLowerCase();
                      return (
                        l.recipientName?.toLowerCase().includes(q) ||
                        l.recipientPhone?.toLowerCase().includes(q) ||
                        l.message?.toLowerCase().includes(q) ||
                        l.relatedId?.toLowerCase().includes(q)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400">
                            {notifSearchQuery ? `No logs match "${notifSearchQuery}"` : 'No automated confirmation logs recorded yet.'}
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5">
                          {l.channel === 'SMS' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                              <Smartphone className="w-3 h-3 text-blue-600" /> SMS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                              <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-[#1C2723]">{l.recipientName}</div>
                          <div className="text-gray-500 font-mono text-[11px]">{l.recipientPhone}</div>
                          {l.relatedId && (
                            <div className="text-[10px] text-gray-400 mt-0.5">Ref #{l.relatedId}</div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[10px] uppercase tracking-wider">
                            {l.templateType.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <p className="text-[11px] text-gray-700 line-clamp-2 leading-relaxed bg-[#FAF9F5] p-2 rounded-lg border border-gray-200/80 font-mono">
                            {l.message}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <span className="text-[11px] text-gray-600 font-medium">
                            {l.gateway}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {l.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-[11px] text-gray-500 whitespace-nowrap">
                          {formatDateTimeToIndian(l.timestamp)}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Booking Request Management & Details Modal */}
      {selectedBookingForDetails && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBookingForDetails(null);
          }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 text-left my-auto">
            {/* Modal Header */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-[#2A5A43] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                      Booking #{selectedBookingForDetails.id}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-emerald-200">
                      {selectedBookingForDetails.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 truncate">
                    {selectedBookingForDetails.customerName} • {selectedBookingForDetails.serviceTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div 
              className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs text-[#1C2723]"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Customer Information Card */}
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#2A5A43]/15 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#2A5A43] flex items-center justify-between">
                  <span>Customer & Contact Information</span>
                  <span className="text-gray-400 font-normal">Created: {formatDateTimeToIndian(selectedBookingForDetails.createdAt)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Customer Name:</span>
                    <span className="font-bold text-[#1C2723]">{selectedBookingForDetails.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Contact Number:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-[#1C2723]">{selectedBookingForDetails.phone}</span>
                      <a
                        href={`tel:${selectedBookingForDetails.phone}`}
                        className="p-1 rounded bg-[#2A5A43] text-white hover:bg-[#1E4231] transition-colors inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5"
                        title="Direct Phone Call"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${selectedBookingForDetails.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5"
                        title="WhatsApp Chat"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                  {selectedBookingForDetails.email && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 text-[11px] block">Email Address:</span>
                      <span className="font-medium text-gray-700">{selectedBookingForDetails.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service & Placement Requirements Card */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Placement & Service Details
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-gray-500 text-[11px] block">Required Service:</span>
                    <span className="font-bold text-[#1C2723]">{selectedBookingForDetails.serviceTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Duty Shift:</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {selectedBookingForDetails.shiftType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">City & Locality:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedBookingForDetails.city} {selectedBookingForDetails.locality ? `(${selectedBookingForDetails.locality})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] block">Preferred Start Date:</span>
                    <span className="font-semibold text-[#2A5A43]">
                      {formatDateToIndian(selectedBookingForDetails.startDate)}
                    </span>
                  </div>
                  {selectedBookingForDetails.salaryRange && (
                    <div>
                      <span className="text-gray-500 text-[11px] block">Monthly Budget:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        {selectedBookingForDetails.salaryRange}
                      </span>
                    </div>
                  )}
                  {selectedBookingForDetails.householdSize && (
                    <div>
                      <span className="text-gray-500 text-[11px] block">Household Size:</span>
                      <span className="font-semibold text-gray-800">
                        {selectedBookingForDetails.householdSize}
                      </span>
                    </div>
                  )}
                </div>

                {selectedBookingForDetails.specialInstructions && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-500 text-[11px] block mb-0.5">Special Instructions / Notes:</span>
                    <p className="bg-gray-50 p-2 rounded-lg text-gray-700 italic text-[11.5px] border border-gray-100">
                      "{selectedBookingForDetails.specialInstructions}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update & Staff Assignment */}
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-gray-200 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#2A5A43]">
                  Admin Placement Actions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Placement Status:
                    </label>
                    <select
                      value={selectedBookingForDetails.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await onUpdateStatus(selectedBookingForDetails.id, newStatus);
                        setSelectedBookingForDetails({
                          ...selectedBookingForDetails,
                          status: newStatus as any
                        });
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Touch">In Touch</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Helper Assigned">Helper Assigned</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Assigned Verified Staff:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedBookingForDetails.helperId || ''}
                        onChange={async (e) => {
                          const chosenHelperId = e.target.value;
                          const chosenHelper = helpers.find(h => h.id === chosenHelperId);
                          const nextStatus = chosenHelper ? 'Helper Assigned' : selectedBookingForDetails.status;
                          const nextHelperName = chosenHelper ? chosenHelper.name : '';
                          await onUpdateStatus(selectedBookingForDetails.id, nextStatus, nextHelperName);
                          setSelectedBookingForDetails({
                            ...selectedBookingForDetails,
                            helperId: chosenHelperId || undefined,
                            helperName: nextHelperName || undefined,
                            status: nextStatus as any
                          });
                        }}
                        className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43] cursor-pointer"
                      >
                        <option value="">-- No Helper Assigned --</option>
                        {helpers.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.categoryTitle} • {h.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Instant Live Notification CTA */}
                <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] text-gray-500">
                    Send real-time SMS & WhatsApp notification to customer:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestSendForm({
                        name: selectedBookingForDetails.customerName,
                        phone: selectedBookingForDetails.phone,
                        channel: 'both',
                        message: `Hello ${selectedBookingForDetails.customerName}, your domestic help booking #${selectedBookingForDetails.id} for ${selectedBookingForDetails.serviceTitle} in ${selectedBookingForDetails.city} is currently in status: "${selectedBookingForDetails.status}". Our placement coordinator will connect with you.`
                      });
                      setTestSendModalOpen(true);
                      setSelectedBookingForDetails(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Alert to Customer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#FAF9F5] border-t border-gray-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  const targetId = selectedBookingForDetails.id;
                  const targetName = selectedBookingForDetails.customerName;
                  setSelectedBookingForDetails(null);
                  setDeleteConfirm({
                    type: 'booking',
                    id: targetId,
                    name: `Booking #${targetId} (${targetName})`
                  });
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Booking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Notification Logs Modal */}
      {isConfirmingClearNotifLogs && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 sm:p-6 shadow-2xl border border-gray-200 text-left space-y-3.5 max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#1C2723]">Clear Notification Logs?</h4>
                <p className="text-xs text-gray-500">This will delete all logged SMS & WhatsApp dispatch records.</p>
              </div>
            </div>
            <p className="text-xs text-[#4A5A53]">
              Are you sure you want to clear all notification dispatch records?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsConfirmingClearNotifLogs(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearNotifLogs}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Send SMS & WhatsApp Notification Modal */}
      {testSendModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-gray-200 text-left space-y-3.5 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C2723] truncate">Test Dispatch Notification</h4>
                  <p className="text-[11px] text-gray-500 truncate">Send an instant SMS / WhatsApp confirmation alert</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTestSendModalOpen(false);
                  setTestSendResult(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {testSendResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                testSendResult.startsWith('Success')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{testSendResult}</span>
              </div>
            )}

            <form onSubmit={handleTestSendNotification} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#4A5A53] uppercase tracking-wider block mb-1">
                  Recipient Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={testSendForm.name}
                  onChange={(e) => setTestSendForm({ ...testSendForm, name: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4A5A53] uppercase tracking-wider block mb-1">
                  Mobile / WhatsApp Number:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9364798027 or +919364798027"
                  value={testSendForm.phone}
                  onChange={(e) => setTestSendForm({ ...testSendForm, phone: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4A5A53] uppercase tracking-wider block mb-1">
                  Dispatch Channel:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestSendForm({ ...testSendForm, channel: 'both' })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer text-center ${
                      testSendForm.channel === 'both'
                        ? 'bg-[#2A5A43] text-white border-[#2A5A43]'
                        : 'bg-[#FAF9F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    SMS & WA
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestSendForm({ ...testSendForm, channel: 'sms' })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer text-center ${
                      testSendForm.channel === 'sms'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-[#FAF9F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    SMS Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestSendForm({ ...testSendForm, channel: 'whatsapp' })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer text-center ${
                      testSendForm.channel === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[#FAF9F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4A5A53] uppercase tracking-wider block mb-1">
                  Custom Alert Message (Optional):
                </label>
                <textarea
                  rows={3}
                  placeholder="Leave empty to use automatic standard booking confirmation template..."
                  value={testSendForm.message}
                  onChange={(e) => setTestSendForm({ ...testSendForm, message: e.target.value })}
                  className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl p-3 text-xs text-[#1C2723] focus:outline-none focus:ring-2 focus:ring-[#2A5A43]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setTestSendModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testSendLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testSendLoading ? 'Dispatching...' : 'Send Live Confirmation Alert'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Search Logs Confirmation Modal */}
      {isConfirmingClearLogs && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 sm:p-6 shadow-2xl border border-gray-200 text-left space-y-3.5 max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#1C2723]">Clear Search Analytics?</h4>
                <p className="text-xs text-gray-500">This will remove all recorded search query logs.</p>
              </div>
            </div>
            <p className="text-xs text-[#4A5A53]">
              Are you sure you want to clear all recorded search query logs?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsConfirmingClearLogs(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearLogs}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
              >
                Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 sm:p-6 shadow-2xl border border-gray-200 text-left space-y-3.5 max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 id="delete-dialog-title" className="font-serif font-bold text-base text-[#1C2723]">Confirm Deletion</h4>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-[#4A5A53]">
              Are you sure you want to permanently delete <strong className="text-[#1C2723]">{deleteConfirm.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteConfirm.type === 'booking') {
                    await onDeleteBooking(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'inquiry' && onDeleteInquiry) {
                    await onDeleteInquiry(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'helper' && onDeleteHelper) {
                    await onDeleteHelper(deleteConfirm.id);
                  }
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
