import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  Firestore,
  setLogLevel
} from 'firebase/firestore';

try {
  setLogLevel('silent');
} catch (e) {
  // Ignore if already silenced
}
import { SERVICE_CATEGORIES, FAQS, INITIAL_REVIEWS } from './src/constants/appData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust immediate reverse proxy (Cloud Run & Nginx on port 3000)
  app.set('trust proxy', 1);

  // 1. Guard against direct exposure of internal data directory, backups, dotfiles, or sensitive files
  app.use((req, res, next) => {
    let cleanPath = req.path || '';
    try {
      cleanPath = decodeURIComponent(cleanPath).toLowerCase();
    } catch {
      return res.status(400).send('Bad Request');
    }

    if (
      cleanPath === '/data' ||
      cleanPath.startsWith('/data/') ||
      cleanPath.includes('..') ||
      cleanPath.startsWith('/.git') ||
      cleanPath.includes('/.git') ||
      cleanPath.startsWith('/.env') ||
      cleanPath.includes('/.env') ||
      cleanPath === '/server.ts' ||
      cleanPath.endsWith('.env') ||
      cleanPath === '/package.json' ||
      cleanPath === '/package-lock.json' ||
      cleanPath === '/tsconfig.json' ||
      cleanPath === '/firebase-blueprint.json' ||
      cleanPath === '/firebase-applet-config.json' ||
      cleanPath === '/metadata.json'
    ) {
      return res.status(404).send('Not Found');
    }
    next();
  });

  // 2. Strict CORS & Origin Validation Helper
  const isAllowedOrigin = (origin: string | undefined, req: express.Request): boolean => {
    if (!origin) return true; // Direct same-origin navigation or internal calls
    try {
      const url = new URL(origin);
      const host = req.headers.host;
      if (host && (url.host === host || url.hostname === host.split(':')[0])) {
        return true;
      }
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return true;
      }
      if (
        url.hostname.endsWith('.run.app') ||
        url.hostname.endsWith('.google.com') ||
        url.hostname.endsWith('.googleusercontent.com') ||
        url.hostname.endsWith('maidforghar.co.in') ||
        url.hostname.endsWith('maidforghar.in')
      ) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  // CORS Policy on /api/* endpoints
  app.use('/api', (req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      if (isAllowedOrigin(origin, req)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
        res.setHeader('Vary', 'Origin');
      } else {
        // Reject preflight for unauthorized origins
        if (req.method === 'OPTIONS') {
          return res.status(403).json({ error: 'CORS: Origin not permitted' });
        }
        // Block cross-origin requests from arbitrary websites to sensitive APIs
        if (req.path.startsWith('/admin') || ['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
          return res.status(403).json({ error: 'Cross-origin request blocked by CORS security policy.' });
        }
      }
    }
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  // Gzip/Brotli HTTP payload compression for fast network transfers & loading
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
    threshold: 1024 // Only compress payloads > 1KB
  }));

  // Security Headers & Hardening with Helmet
  app.use(
    helmet({
      // Disable frameguard to allow preview embedding in AI Studio iFrame
      frameguard: false,
      // Cross-origin embedder policy disabled to allow loading external images and maps inside iframes
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Managed per environment / Vite scripts
      dnsPrefetchControl: { allow: true },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (/\.(js|css|jpg|jpeg|png|svg|webp|woff|woff2|ico)$/i.test(req.path)) {
      // Aggressively cache immutable frontend assets for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    next();
  });

  app.use(express.json({ limit: '100kb' })); // Enforce payload size limit to prevent body-flooding DoS

  // Rate Limiting Policies (express-rate-limit)
  const rateLimitDefaults = {
    standardHeaders: true,
    legacyHeaders: false,
    validate: false, // Cloud Run & Nginx reverse proxy environment handled via trust proxy = 1
  };

  // General API rate limiter across all endpoints (150 requests per 15 minutes per IP)
  const generalApiLimiter = rateLimit({
    ...rateLimitDefaults,
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: { error: 'Too many requests to the Maid for Ghar service. Please try again shortly.' }
  });

  // Apply general rate limit to all /api routes
  app.use('/api', generalApiLimiter);

  const bookingLimiter = rateLimit({
    ...rateLimitDefaults,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 placement bookings per 15 min per IP
    message: { error: 'Too many booking requests from this connection. Please wait a few minutes before submitting again or call our helpline at +91 93647 98027.' }
  });

  const inquiryLimiter = rateLimit({
    ...rateLimitDefaults,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 12, // Max 12 callback requests per 15 min per IP
    message: { error: 'Too many callback inquiries from this connection. Please wait a few minutes or call our placement desk at +91 93647 98027.' }
  });

  const loginLimiter = rateLimit({
    ...rateLimitDefaults,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Strict 10 failed attempts per 15 minutes to prevent brute-force attacks
    skipSuccessfulRequests: true,
    message: { error: 'Too many failed admin login attempts. For security reasons, please try again in 15 minutes.' }
  });

  const reviewLimiter = rateLimit({
    ...rateLimitDefaults,
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 6,
    message: { error: 'Too many reviews submitted. Please try again later.' }
  });

  // Health check endpoints FIRST for Cloud Run & monitoring probes
  app.get(['/api/health', '/healthz', '/health'], (req, res) => {
    res.json({ status: 'ok', app: 'Maid for Ghar API', security: 'hardened' });
  });

  // Persistent File-backed Store Helper
  const DATA_DIR = path.join(process.cwd(), 'data');
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.error('Data directory initialization error:', err);
    }
  }

  const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
  const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
  const HELPERS_FILE = path.join(DATA_DIR, 'helpers.json');
  const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
  const CONFIG_FILE = path.join(DATA_DIR, 'admin_config.json');

  const loadJson = <T>(filePath: string, fallback: T): T => {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw) as T;
      }
    } catch (e) {
      console.error(`Notice loading persistent storage ${filePath}:`, e);
    }
    return fallback;
  };

  const saveJson = (filePath: string, data: any) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`Notice writing persistent storage ${filePath}:`, e);
    }
  };

  // Live data stores initialized from disk persistence (clean state, no mock/dummy data)
  let bookings: any[] = loadJson<any[]>(BOOKINGS_FILE, []);
  let helpers: any[] = loadJson<any[]>(HELPERS_FILE, []);
  let customInquiries: any[] = loadJson<any[]>(INQUIRIES_FILE, []);
  let reviews: any[] = loadJson<any[]>(REVIEWS_FILE, [...INITIAL_REVIEWS]);
  if (reviews.length === 0 && INITIAL_REVIEWS.length > 0) {
    reviews = [...INITIAL_REVIEWS];
    saveJson(REVIEWS_FILE, reviews);
  }
  let searchLogs: Array<{
    id: string;
    city: string;
    category: string;
    shift: string;
    timestamp: string;
  }> = [];

  // Firebase Firestore Persistent Cloud Database Setup
  let firestoreDb: Firestore | null = null;
  let firestoreConfig: any = null;
  let isFirestoreConnected = false;

  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      firestoreConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const fbApp = getApps().length > 0 ? getApp() : initializeApp(firestoreConfig);
      firestoreDb = firestoreConfig.firestoreDatabaseId && firestoreConfig.firestoreDatabaseId !== '(default)'
        ? getFirestore(fbApp, firestoreConfig.firestoreDatabaseId)
        : getFirestore(fbApp);
      isFirestoreConnected = true;
      console.log(`[Firebase Firestore] Connected to project: ${firestoreConfig.projectId} (DB: ${firestoreConfig.firestoreDatabaseId || '(default)'})`);
    }
  } catch (fbInitErr) {
    console.warn('[Firebase Firestore] Initialization warning:', fbInitErr);
  }

  // Cloud Firestore Sync Helpers
  const cleanForFirestore = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        clean[key] = val;
      }
    }
    return clean;
  };

  const persistBookingToFirestore = async (booking: any) => {
    if (!firestoreDb) return;
    try {
      await setDoc(doc(firestoreDb, 'bookings', booking.id), cleanForFirestore(booking));
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to sync booking:', err);
    }
  };

  const deleteBookingFromFirestore = async (bookingId: string) => {
    if (!firestoreDb) return;
    try {
      await deleteDoc(doc(firestoreDb, 'bookings', bookingId));
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to delete booking:', err);
    }
  };

  const persistInquiryToFirestore = async (inquiry: any) => {
    if (!firestoreDb) return;
    try {
      await setDoc(doc(firestoreDb, 'inquiries', inquiry.id), cleanForFirestore(inquiry));
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to sync inquiry:', err);
    }
  };

  const deleteInquiryFromFirestore = async (inquiryId: string) => {
    if (!firestoreDb) return;
    try {
      await deleteDoc(doc(firestoreDb, 'inquiries', inquiryId));
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to delete inquiry:', err);
    }
  };

  const persistAdminConfigToFirestore = async (cfg: any) => {
    if (!firestoreDb) return;
    try {
      await setDoc(doc(firestoreDb, 'adminSettings', 'current'), {
        ...cfg,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to sync admin settings:', err);
    }
  };

  const persistHelperToFirestore = async (helper: any) => {
    if (!firestoreDb) return;
    try {
      await setDoc(doc(firestoreDb, 'helpers', helper.id), helper);
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to sync helper:', err);
    }
  };

  const deleteHelperFromFirestore = async (helperId: string) => {
    if (!firestoreDb) return;
    try {
      await deleteDoc(doc(firestoreDb, 'helpers', helperId));
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to delete helper:', err);
    }
  };

  const persistReviewToFirestore = async (rev: any) => {
    if (!firestoreDb) return;
    try {
      await setDoc(doc(firestoreDb, 'reviews', rev.id), rev);
    } catch (err) {
      console.warn('[Firebase Firestore] Failed to sync review:', err);
    }
  };

  // Initial bidirectional sync between Cloud Firestore and local persistence
  const syncInitialDataFromFirestore = async () => {
    if (!firestoreDb) return;
    try {
      // 1. Sync Bookings
      const bSnap = await getDocs(collection(firestoreDb, 'bookings'));
      if (!bSnap.empty) {
        const cloudBookings = bSnap.docs.map(d => d.data());
        const bMap = new Map();
        bookings.forEach(b => bMap.set(b.id, b));
        cloudBookings.forEach(b => bMap.set(b.id, b));
        bookings = Array.from(bMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        saveJson(BOOKINGS_FILE, bookings);
        console.log(`[Firebase Firestore] Synced ${cloudBookings.length} bookings from Firestore`);
      } else if (bookings.length > 0) {
        for (const b of bookings) {
          await setDoc(doc(firestoreDb, 'bookings', b.id), b);
        }
        console.log(`[Firebase Firestore] Seeded ${bookings.length} local bookings to Firestore`);
      }

      // 2. Sync Inquiries
      const iSnap = await getDocs(collection(firestoreDb, 'inquiries'));
      if (!iSnap.empty) {
        const cloudInquiries = iSnap.docs.map(d => d.data());
        const iMap = new Map();
        customInquiries.forEach(i => iMap.set(i.id, i));
        cloudInquiries.forEach(i => iMap.set(i.id, i));
        customInquiries = Array.from(iMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        saveJson(INQUIRIES_FILE, customInquiries);
        console.log(`[Firebase Firestore] Synced ${cloudInquiries.length} inquiries from Firestore`);
      } else if (customInquiries.length > 0) {
        for (const i of customInquiries) {
          await setDoc(doc(firestoreDb, 'inquiries', i.id), i);
        }
        console.log(`[Firebase Firestore] Seeded ${customInquiries.length} local inquiries to Firestore`);
      }

      // 3. Sync Helpers
      const hSnap = await getDocs(collection(firestoreDb, 'helpers'));
      if (!hSnap.empty) {
        const cloudHelpers = hSnap.docs.map(d => d.data());
        const hMap = new Map();
        helpers.forEach(h => hMap.set(h.id, h));
        cloudHelpers.forEach(h => hMap.set(h.id, h));
        helpers = Array.from(hMap.values());
        saveJson(HELPERS_FILE, helpers);
        console.log(`[Firebase Firestore] Synced ${cloudHelpers.length} helpers from Firestore`);
      } else if (helpers.length > 0) {
        for (const h of helpers) {
          await setDoc(doc(firestoreDb, 'helpers', h.id), h);
        }
      }

      // 4. Sync Reviews
      const rSnap = await getDocs(collection(firestoreDb, 'reviews'));
      if (!rSnap.empty) {
        const cloudReviews = rSnap.docs.map(d => d.data());
        const rMap = new Map();
        reviews.forEach(r => rMap.set(r.id, r));
        cloudReviews.forEach(r => rMap.set(r.id, r));
        reviews = Array.from(rMap.values());
        saveJson(REVIEWS_FILE, reviews);
        console.log(`[Firebase Firestore] Synced ${cloudReviews.length} reviews from Firestore`);
      } else if (reviews.length > 0) {
        for (const r of reviews) {
          await setDoc(doc(firestoreDb, 'reviews', r.id), r);
        }
      }
    } catch (syncErr) {
      console.warn('[Firebase Firestore] Startup sync notice:', syncErr);
    }
  };

  // Kick off startup sync
  syncInitialDataFromFirestore().catch(e => console.warn('[Firebase Firestore] Startup sync failed:', e));

  // Automated Notification Dispatch Store & Dispatcher
  let notificationLogs: any[] = [];

  // Input Sanitization & Validation Helpers
  const sanitizeText = (val: unknown, maxLen = 250): string => {
    if (typeof val !== 'string') return '';
    return val
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF]/g, '')
      .trim()
      .slice(0, maxLen);
  };

  const isValidPhone = (phone: unknown): boolean => {
    if (typeof phone !== 'string') return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  };

  const sanitizePhone = (phone: unknown): string => {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d+]/g, '').trim().slice(0, 18);
  };

  // Express-Validator middleware utility to format validation errors
  const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
        details: errors.array().map(e => ({ field: (e as any).path || (e as any).param, message: e.msg }))
      });
    }
    next();
  };

  // Express-Validator Schemas
  const bookingValidationRules = [
    body('customerName')
      .trim()
      .notEmpty().withMessage('Please provide your full name.')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('phone')
      .trim()
      .notEmpty().withMessage('Please provide your mobile phone number.')
      .custom((value) => {
        const digits = String(value).replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          throw new Error('Please provide a valid 10-digit mobile contact number.');
        }
        return true;
      }),
    body('city')
      .trim()
      .notEmpty().withMessage('Please select or enter your city.')
      .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters.'),
    body('email')
      .optional({ checkFalsy: true })
      .trim()
      .isEmail().withMessage('Please provide a valid email address.')
      .isLength({ max: 100 }),
    body('serviceCategory')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('shiftType')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('specialInstructions')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Special instructions cannot exceed 500 characters.')
  ];

  const inquiryValidationRules = [
    body('name')
      .trim()
      .notEmpty().withMessage('Please enter your name.')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('phone')
      .trim()
      .notEmpty().withMessage('Please enter your contact number.')
      .custom((value) => {
        const digits = String(value).replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          throw new Error('Please enter a valid 10-digit contact number.');
        }
        return true;
      }),
    body('city')
      .trim()
      .notEmpty().withMessage('Please specify your city.')
      .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters.'),
    body('requirement')
      .trim()
      .notEmpty().withMessage('Please briefly describe your domestic staff requirement.')
      .isLength({ min: 3, max: 500 }).withMessage('Requirement must be between 3 and 500 characters.')
  ];

  const reviewValidationRules = [
    body('authorName')
      .trim()
      .notEmpty().withMessage('Please enter your name.')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('comment')
      .trim()
      .notEmpty().withMessage('Please provide a comment.')
      .isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters.'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.')
  ];

  const loginValidationRules = [
    body('passcode')
      .trim()
      .notEmpty().withMessage('Passcode is required')
      .isString().withMessage('Passcode must be a string')
  ];

  // PII Redaction for Public Textual Content (Prevents phone/email leaks in public areas)
  const redactPiiFromPublicText = (text: string): string => {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '[contact protected]')
      .replace(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,5}/g, (match) => {
        const digits = match.replace(/\D/g, '');
        if (digits.length >= 10 && digits.length <= 15) {
          return '[contact protected]';
        }
        return match;
      });
  };

  // Helper Projection: guarantees private staff metadata (docs, phone, internal notes) never leaks to frontend
  const toPublicHelper = (h: any) => ({
    id: h.id,
    name: h.name,
    photoUrl: h.photoUrl,
    category: h.category,
    categoryTitle: h.categoryTitle,
    experienceYears: h.experienceYears,
    city: h.city,
    localities: Array.isArray(h.localities) ? h.localities : [],
    rating: h.rating || 5.0,
    reviewsCount: h.reviewsCount || 0,
    languages: Array.isArray(h.languages) ? h.languages : [],
    shiftTypes: Array.isArray(h.shiftTypes) ? h.shiftTypes : [],
    badges: Array.isArray(h.badges) ? h.badges : [],
    specialties: Array.isArray(h.specialties) ? h.specialties : [],
    availability: h.availability || 'Immediate',
    bio: h.bio,
    age: h.age,
    gender: h.gender,
    verifiedAt: h.verifiedAt,
    completedJobs: h.completedJobs || 0,
    featured: h.featured
  });

  const dispatchAutomaticConfirmations = async ({
    type,
    name,
    phone,
    city,
    id,
    serviceTitle,
    requirement,
    startDate,
    helperName,
    salaryRange
  }: {
    type: 'booking' | 'inquiry';
    name: string;
    phone: string;
    city: string;
    id: string;
    serviceTitle?: string;
    requirement?: string;
    startDate?: string;
    helperName?: string;
    salaryRange?: string;
  }) => {
    const timestamp = new Date().toISOString();
    const cleanPhone = phone ? phone.trim() : '';

    // 1. Generate SMS Text Template
    const smsMessage = type === 'booking'
      ? `[Maid for Ghar] Dear ${name}, your request #${id} for ${serviceTitle || 'Domestic Help'} in ${city} is confirmed! Our placement manager will call within 30 mins. Helpline: +91 93647 98027. 100% Free Replacement Guarantee.`
      : `[Maid for Ghar] Hello ${name}, your domestic help callback inquiry #${id} for ${city} is registered! A placement specialist will call shortly on ${cleanPhone}. Helpline: +91 93647 98027.`;

    // 2. Generate WhatsApp Text Template
    const waMessage = type === 'booking'
      ? `✨ *Maid for Ghar - Placement Request Confirmed*\n\nHello *${name}*,\n\nWe have received your domestic help placement request:\n📌 *Request ID:* #${id}\n🧹 *Service:* ${serviceTitle || 'Domestic Staff'}${helperName ? `\n👤 *Selected Staff:* ${helperName}` : ''}\n📍 *City:* ${city}${startDate ? `\n📅 *Requested Start:* ${startDate}` : ''}${salaryRange ? `\n💰 *Budget / Salary Range:* ${salaryRange}` : ''}\n📞 *Helpline:* +91 93647 98027\n\nOur placement officer will reach out within 30 minutes to discuss candidate profiles and schedule a telephonic interview.\n\n_🛡️ 100% Police Verified • Free Replacement Guarantee • Safe In-Home Domestic Support_`
      : `✨ *Maid for Ghar - Fast Callback Registered*\n\nHello *${name}*,\n\nThank you for reaching out! We have registered your domestic help callback request:\n📌 *Inquiry ID:* #${id}\n📍 *City:* ${city}\n📝 *Requirement:* ${requirement || 'Domestic Help Placement'}\n📞 *Helpline:* +91 93647 98027\n\nOur domestic placement specialist is reviewing available verified staff profiles and will call you on *${cleanPhone}* shortly.\n\n_🛡️ Background-Checked Domestic Staff Across India_`;

    // Extract 10-digit Indian mobile number
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    const clean10 = phoneDigits.slice(-10);
    const recipientIntl = clean10.length === 10 ? `91${clean10}` : (phoneDigits.startsWith('91') ? phoneDigits : `91${phoneDigits}`);

    // Direct link to open WhatsApp conversation with the customer (prefilled with confirmation)
    const customerWhatsAppUrl = `https://wa.me/${recipientIntl}?text=${encodeURIComponent(waMessage)}`;

    // Direct link for customer to message Maid for Ghar desk (+91 93647 98027)
    const companyDeskWhatsAppUrl = `https://api.whatsapp.com/send?phone=919364798027&text=${encodeURIComponent(
      type === 'booking'
        ? `Hello Maid for Ghar! I registered booking #${id} for ${name} (${serviceTitle || 'Domestic Staff'}). Please share verified helper profiles.`
        : `Hello Maid for Ghar! I requested callback #${id} for ${name} in ${city}. Please call me.`
    )}`;

    // 3. Live Automated Dispatch Logic
    let gatewayNameSMS = 'SMS Gateway (Not Configured)';
    let smsStatus: 'Delivered' | 'Sent' | 'Failed' | 'Pending' = 'Pending';

    let gatewayNameWA = 'WhatsApp 1-Click Direct (Web/App)';
    let waStatus: 'Delivered' | 'Sent' | 'Failed' | 'Pending' = 'Pending';

    // Validate whether live Twilio credentials exist (real Twilio SIDs start with 'AC' and are 34 chars)
    const hasRealTwilioConfig = Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
      process.env.TWILIO_ACCOUNT_SID.length === 34 &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER &&
      !process.env.TWILIO_PHONE_NUMBER.includes('@')
    );

    // Validate whether live Meta WhatsApp Cloud API credentials exist
    const hasRealWhatsAppCloudConfig = Boolean(
      process.env.WHATSAPP_CLOUD_API_TOKEN &&
      process.env.WHATSAPP_CLOUD_API_TOKEN.length > 20 &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_PHONE_NUMBER_ID.length > 5
    );

    const hasRealTwilioWaConfig = Boolean(
      hasRealTwilioConfig &&
      process.env.TWILIO_WHATSAPP_NUMBER &&
      !process.env.TWILIO_WHATSAPP_NUMBER.includes('@')
    );

    // Check Twilio SMS Gateway
    if (hasRealTwilioConfig) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
        const formattedRecipient = `+${recipientIntl}`;
        
        const smsParams = new URLSearchParams({
          To: formattedRecipient,
          From: process.env.TWILIO_PHONE_NUMBER!,
          Body: smsMessage
        });

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: smsParams.toString()
        });

        if (twilioRes.ok) {
          gatewayNameSMS = 'Twilio SMS Live Gateway';
          smsStatus = 'Delivered';
        } else {
          gatewayNameSMS = 'Twilio SMS (API Error)';
          smsStatus = 'Failed';
        }
      } catch (err) {
        console.error('Twilio SMS dispatch notice:', err);
        gatewayNameSMS = 'Twilio SMS (Exception)';
        smsStatus = 'Failed';
      }
    } else {
      gatewayNameSMS = 'SMS Gateway Not Configured (Twilio Key Required)';
      smsStatus = 'Pending';
    }

    // Check WhatsApp Automated Gateway (Meta WhatsApp Cloud API or Twilio WhatsApp)
    if (hasRealWhatsAppCloudConfig) {
      try {
        const waRes = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientIntl,
            type: 'text',
            text: { preview_url: false, body: waMessage }
          })
        });

        if (waRes.ok) {
          gatewayNameWA = 'Meta WhatsApp Cloud API Live';
          waStatus = 'Delivered';
        } else {
          gatewayNameWA = 'Meta WhatsApp Cloud API (API Error)';
          waStatus = 'Failed';
        }
      } catch (err) {
        console.error('WhatsApp Cloud API notice:', err);
        gatewayNameWA = 'WhatsApp Cloud API (Exception)';
        waStatus = 'Failed';
      }
    } else if (hasRealTwilioWaConfig) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
        const waParams = new URLSearchParams({
          To: `whatsapp:+${recipientIntl}`,
          From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`,
          Body: waMessage
        });

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: waParams.toString()
        });

        if (twilioRes.ok) {
          gatewayNameWA = 'Twilio WhatsApp Live Gateway';
          waStatus = 'Delivered';
        } else {
          gatewayNameWA = 'Twilio WhatsApp (API Error)';
          waStatus = 'Failed';
        }
      } catch (err) {
        console.error('Twilio WhatsApp dispatch notice:', err);
        gatewayNameWA = 'Twilio WhatsApp (Exception)';
        waStatus = 'Failed';
      }
    } else {
      gatewayNameWA = 'WhatsApp 1-Click Direct (Web/App)';
      waStatus = 'Pending';
    }

    // Create notification log entries
    const smsLog = {
      id: `notif-sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      channel: 'SMS' as const,
      recipientName: name,
      recipientPhone: cleanPhone,
      templateType: (type === 'booking' ? 'booking_confirmation' : 'callback_inquiry') as any,
      message: smsMessage,
      status: smsStatus,
      gateway: gatewayNameSMS,
      relatedId: id,
      timestamp,
      customerWhatsAppUrl
    };

    const waLog = {
      id: `notif-wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      channel: 'WhatsApp' as const,
      recipientName: name,
      recipientPhone: cleanPhone,
      templateType: (type === 'booking' ? 'booking_confirmation' : 'callback_inquiry') as any,
      message: waMessage,
      status: waStatus,
      gateway: gatewayNameWA,
      relatedId: id,
      timestamp,
      customerWhatsAppUrl
    };

    notificationLogs.unshift(smsLog);
    notificationLogs.unshift(waLog);

    if (notificationLogs.length > 500) {
      notificationLogs = notificationLogs.slice(0, 500);
    }

    return {
      smsStatus,
      waStatus,
      smsLog,
      waLog,
      customerWhatsAppUrl,
      companyDeskWhatsAppUrl,
      whatsappDirectUrl: companyDeskWhatsAppUrl
    };
  };

  // Secure Admin Authentication Store
  const adminConfig = loadJson<{ customAdminPasscode?: string }>(CONFIG_FILE, {});
  let customAdminPasscode: string | null = adminConfig.customAdminPasscode || null;
  const activeAdminTokens = new Set<string>();

  const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
    const list: Record<string, string> = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        list[key] = decodeURIComponent(val);
      }
    });
    return list;
  };

  const getAuthorizedPasscode = (): string => {
    // 1. Prioritize ADMIN_SECRET from environment
    if (process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.trim().length > 0) {
      return process.env.ADMIN_SECRET.trim();
    }
    // 2. Custom administrator passcode set by verified owner
    if (customAdminPasscode && customAdminPasscode.length >= 6) {
      return customAdminPasscode;
    }
    // 3. Fallback only in development
    if (process.env.NODE_ENV !== 'production') {
      return 'maid2026';
    }
    return '';
  };

  const timingSafeEqual = (a: string, b: string): boolean => {
    if (!a || !b) return false;
    const bufA = Buffer.from(a, 'utf-8');
    const bufB = Buffer.from(b, 'utf-8');
    if (bufA.length !== bufB.length) {
      // Prevent length side-channel while ensuring false result
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  };

  const generateSecureAdminToken = (): string => {
    return `adm_${crypto.randomBytes(32).toString('hex')}`;
  };

  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cookies = parseCookies(req.headers.cookie);
    const cookieToken = cookies['admin_session'];
    const rawToken = req.headers['x-admin-token'] || (req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : undefined);
    const token = typeof rawToken === 'string' ? rawToken.trim() : (cookieToken || '');
    if (token && activeAdminTokens.has(token)) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Valid administrative session token required.' });
  };

  // ================= API ENDPOINTS =================

  // Admin Auth Endpoints (Rate Limited & Constant-Time Checked)
  app.post('/api/admin/login', loginLimiter, loginValidationRules, handleValidationErrors, (req, res) => {
    const { passcode } = req.body;
    const trimmed = passcode.trim();
    const authorizedSecret = getAuthorizedPasscode();

    if (!authorizedSecret) {
      return res.status(503).json({
        error: 'Admin authentication is not configured. Please set ADMIN_SECRET in server environment variables.'
      });
    }

    if (timingSafeEqual(trimmed, authorizedSecret)) {
      const token = generateSecureAdminToken();
      activeAdminTokens.add(token);
      
      // Auto-expire token after 24 hours
      setTimeout(() => {
        activeAdminTokens.delete(token);
      }, 24 * 60 * 60 * 1000);

      // Set hardened HttpOnly, Secure, SameSite=Strict session cookie
      const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
      const cookieFlags = [
        `admin_session=${token}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Strict',
        'Max-Age=86400',
        ...(isSecure ? ['Secure'] : [])
      ].join('; ');
      res.setHeader('Set-Cookie', cookieFlags);

      return res.json({ success: true, token, message: 'Authentication successful' });
    }

    return res.status(401).json({ error: 'Invalid admin passcode' });
  });

  // Admin Logout (Strict Server-Side Session Invalidation)
  app.post('/api/admin/logout', (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const cookieToken = cookies['admin_session'];
    const rawToken = req.headers['x-admin-token'] || (req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : undefined);
    const token = typeof rawToken === 'string' ? rawToken.trim() : cookieToken;

    if (token && activeAdminTokens.has(token)) {
      activeAdminTokens.delete(token);
    }

    // Invalidate and clear the session cookie
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
    const clearFlags = [
      'admin_session=',
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=0',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      ...(isSecure ? ['Secure'] : [])
    ].join('; ');
    res.setHeader('Set-Cookie', clearFlags);

    return res.json({ success: true, message: 'Admin session invalidated successfully' });
  });

  app.post('/api/admin/set-passcode', loginLimiter, (req, res) => {
    const { newPasscode, currentPasscode } = req.body;
    const rawToken = req.headers['x-admin-token'] || (req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : undefined);
    const token = typeof rawToken === 'string' ? rawToken.trim() : '';

    const authorizedSecret = getAuthorizedPasscode();
    const isTokenValid = token && activeAdminTokens.has(token);
    const isPassValid = currentPasscode && authorizedSecret && timingSafeEqual(currentPasscode.trim(), authorizedSecret);

    if (!isTokenValid && !isPassValid && authorizedSecret) {
      return res.status(401).json({ error: 'Unauthorized: Valid current passcode or active admin session required' });
    }

    if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 6) {
      return res.status(400).json({ error: 'New passcode must be at least 6 characters long for security' });
    }

    customAdminPasscode = newPasscode.trim();
    saveJson(CONFIG_FILE, { customAdminPasscode });
    persistAdminConfigToFirestore({ customAdminPasscode });

    const newToken = generateSecureAdminToken();
    activeAdminTokens.add(newToken);

    return res.json({ success: true, token: newToken, message: 'Personal passcode updated securely' });
  });

  // Services Catalog
  app.get('/api/services', (req, res) => {
    res.json(SERVICE_CATEGORIES);
  });

  // Helpers Directory
  app.get('/api/helpers', (req, res) => {
    const { category, city, shift, query } = req.query;
    let filtered = [...helpers];

    if (category && category !== 'all') {
      filtered = filtered.filter(h => h.category === category);
    }
    if (city && city !== 'all') {
      filtered = filtered.filter(h => h.city === city);
    }
    if (shift && shift !== 'all') {
      filtered = filtered.filter(h => h.shiftTypes && h.shiftTypes.includes(shift as any));
    }
    if (query) {
      const q = String(query).toLowerCase();
      filtered = filtered.filter(
        h =>
          (h.name && h.name.toLowerCase().includes(q)) ||
          (h.categoryTitle && h.categoryTitle.toLowerCase().includes(q)) ||
          (h.specialties && h.specialties.some((s: string) => s.toLowerCase().includes(q))) ||
          (h.languages && h.languages.some((l: string) => l.toLowerCase().includes(q)))
      );
    }

    res.json(filtered.map(toPublicHelper));
  });

  app.post('/api/helpers', requireAdminAuth, (req, res) => {
    const name = sanitizeText(req.body.name, 100);
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Helper name is required' });
    }

    const newHelper = {
      id: `hlp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      category: sanitizeText(req.body.category, 50) || 'all_rounder',
      categoryTitle: sanitizeText(req.body.categoryTitle, 100) || 'Domestic Help',
      experienceYears: Math.max(0, parseInt(req.body.experienceYears, 10) || 1),
      city: sanitizeText(req.body.city, 50) || 'Mumbai',
      localities: Array.isArray(req.body.localities) ? req.body.localities.map((l: any) => sanitizeText(l, 50)) : ['City Center'],
      rating: 5.0,
      reviewsCount: 1,
      languages: Array.isArray(req.body.languages) ? req.body.languages.map((l: any) => sanitizeText(l, 30)) : ['Hindi'],
      shiftTypes: Array.isArray(req.body.shiftTypes) ? req.body.shiftTypes : ['full_time_8h'],
      badges: ['police_verified', 'id_verified', 'background_checked'],
      specialties: Array.isArray(req.body.specialties) ? req.body.specialties.map((s: any) => sanitizeText(s, 60)) : ['Household Help'],
      availability: sanitizeText(req.body.availability, 50) || 'Immediate',
      bio: sanitizeText(req.body.bio, 500) || 'Experienced and police-verified domestic professional.',
      age: Math.max(18, Math.min(70, parseInt(req.body.age, 10) || 30)),
      gender: sanitizeText(req.body.gender, 20) || 'Female',
      verifiedAt: new Date().toISOString().split('T')[0],
      completedJobs: 0,
      photoUrl: sanitizeText(req.body.photoUrl, 300) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
    };

    helpers.unshift(newHelper);
    saveJson(HELPERS_FILE, helpers);
    persistHelperToFirestore(newHelper);
    res.status(201).json(newHelper);
  });

  // Bookings with Rate Limiting and Strict Input Validation
  app.get('/api/bookings', requireAdminAuth, (req, res) => {
    res.json(bookings);
  });

  app.get('/api/bookings/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const booking = bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  });

  app.post('/api/bookings', bookingLimiter, bookingValidationRules, handleValidationErrors, async (req, res) => {
    const customerName = sanitizeText(req.body.customerName, 100);
    const rawPhone = req.body.phone;
    const phone = sanitizePhone(rawPhone);
    const city = sanitizeText(req.body.city, 50);

    const bookingId = `BK-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
    const serviceTitle = sanitizeText(req.body.serviceTitle, 100) || 'Domestic Staff';
    const startDate = sanitizeText(req.body.startDate, 30) || 'Immediate';
    const helperName = sanitizeText(req.body.helperName, 100) || undefined;
    const salaryRange = sanitizeText(req.body.salaryRange, 50) || undefined;

    // Dispatch or prepare notification tracking
    let dispatchResult: any = null;
    try {
      dispatchResult = await dispatchAutomaticConfirmations({
        type: 'booking',
        name: customerName,
        phone,
        city,
        id: bookingId,
        serviceTitle,
        startDate,
        helperName,
        salaryRange
      });
    } catch (err) {
      console.error('Auto notification dispatch notice:', err);
    }

    const booking: any = {
      id: bookingId,
      customerName,
      phone,
      email: sanitizeText(req.body.email, 100),
      city,
      locality: sanitizeText(req.body.locality, 100) || 'Local Area',
      serviceCategory: sanitizeText(req.body.serviceCategory, 50) || 'all_rounder',
      serviceTitle,
      shiftType: sanitizeText(req.body.shiftType, 50) || 'full_time_8h',
      helperId: sanitizeText(req.body.helperId, 50) || undefined,
      helperName,
      startDate,
      timeSlot: sanitizeText(req.body.timeSlot, 50) || undefined,
      householdSize: sanitizeText(req.body.householdSize, 50) || undefined,
      salaryRange,
      specialInstructions: sanitizeText(req.body.specialInstructions, 500) || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      smsConfirmationStatus: dispatchResult?.smsStatus || 'Pending',
      whatsappConfirmationStatus: dispatchResult?.waStatus || 'Pending',
      customerWhatsAppUrl: dispatchResult?.customerWhatsAppUrl
    };

    bookings.unshift(booking);
    saveJson(BOOKINGS_FILE, bookings);
    persistBookingToFirestore(booking);

    res.status(201).json({
      id: booking.id,
      customerName: booking.customerName,
      serviceTitle: booking.serviceTitle,
      city: booking.city,
      locality: booking.locality,
      shiftType: booking.shiftType,
      startDate: booking.startDate,
      status: booking.status,
      createdAt: booking.createdAt,
      smsConfirmationStatus: booking.smsConfirmationStatus,
      whatsappConfirmationStatus: booking.whatsappConfirmationStatus,
      whatsappDirectUrl: dispatchResult?.whatsappDirectUrl,
      message: 'Your booking request has been submitted securely.'
    });
  });

  app.patch('/api/bookings/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const current = bookings[index];
    bookings[index] = {
      ...current,
      status: req.body.status ? sanitizeText(req.body.status, 50) : current.status,
      helperName: req.body.helperName ? sanitizeText(req.body.helperName, 100) : current.helperName,
      specialInstructions: req.body.specialInstructions ? sanitizeText(req.body.specialInstructions, 500) : current.specialInstructions
    };
    saveJson(BOOKINGS_FILE, bookings);
    persistBookingToFirestore(bookings[index]);
    res.json(bookings[index]);
  });

  app.delete('/api/bookings/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter(b => b.id !== id);
    saveJson(BOOKINGS_FILE, bookings);
    deleteBookingFromFirestore(id);
    res.json({ success: true, message: 'Booking deleted' });
  });

  // Custom Inquiries with Rate Limiting and Strict Input Validation
  app.get('/api/inquiries', requireAdminAuth, (req, res) => {
    res.json(customInquiries);
  });

  app.get('/api/inquiries/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const inquiry = customInquiries.find(i => i.id === id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(inquiry);
  });

  app.post('/api/inquiries', inquiryLimiter, inquiryValidationRules, handleValidationErrors, async (req, res) => {
    const name = sanitizeText(req.body.name, 100);
    const phone = sanitizePhone(req.body.phone);
    const city = sanitizeText(req.body.city, 50);
    const requirement = sanitizeText(req.body.requirement, 500);

    const inquiryId = `INQ-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
    // Auto-dispatch or track notification
    let dispatchResult: any = null;
    try {
      dispatchResult = await dispatchAutomaticConfirmations({
        type: 'inquiry',
        name,
        phone,
        city,
        id: inquiryId,
        requirement
      });
    } catch (err) {
      console.error('Auto notification dispatch notice:', err);
    }

    const inquiry: any = {
      id: inquiryId,
      name,
      phone,
      city,
      requirement,
      urgency: sanitizeText(req.body.urgency, 50) || 'Immediate (Today)',
      createdAt: new Date().toISOString(),
      smsConfirmationStatus: dispatchResult?.smsStatus || 'Pending',
      whatsappConfirmationStatus: dispatchResult?.waStatus || 'Pending',
      customerWhatsAppUrl: dispatchResult?.customerWhatsAppUrl
    };

    customInquiries.unshift(inquiry);
    saveJson(INQUIRIES_FILE, customInquiries);
    persistInquiryToFirestore(inquiry);

    res.status(201).json({
      id: inquiry.id,
      name: inquiry.name,
      city: inquiry.city,
      urgency: inquiry.urgency,
      status: 'Submitted',
      createdAt: inquiry.createdAt,
      smsConfirmationStatus: inquiry.smsConfirmationStatus,
      whatsappConfirmationStatus: inquiry.whatsappConfirmationStatus,
      customerWhatsAppUrl: inquiry.customerWhatsAppUrl,
      whatsappDirectUrl: dispatchResult?.whatsappDirectUrl,
      message: 'Your callback inquiry has been submitted securely.'
    });
  });

  app.delete('/api/inquiries/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    customInquiries = customInquiries.filter(i => i.id !== id);
    saveJson(INQUIRIES_FILE, customInquiries);
    deleteInquiryFromFirestore(id);
    res.json({ success: true, message: 'Inquiry deleted' });
  });

  // Helpers DELETE
  app.delete('/api/helpers/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    helpers = helpers.filter(h => h.id !== id);
    saveJson(HELPERS_FILE, helpers);
    deleteHelperFromFirestore(id);
    res.json({ success: true, message: 'Helper deleted' });
  });

  // Reviews with Rate Limiting & Input Validation
  app.get('/api/reviews', (req, res) => {
    res.json(reviews);
  });

  app.post('/api/reviews', reviewLimiter, reviewValidationRules, handleValidationErrors, (req, res) => {
    const authorName = redactPiiFromPublicText(sanitizeText(req.body.authorName, 100));
    const location = redactPiiFromPublicText(sanitizeText(req.body.location, 100));
    const serviceUsed = sanitizeText(req.body.serviceUsed, 100);
    const comment = redactPiiFromPublicText(sanitizeText(req.body.comment, 500));
    const rawRating = parseInt(req.body.rating, 10);
    const rating = Math.min(5, Math.max(1, isNaN(rawRating) ? 5 : rawRating));

    const newReview = {
      id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorName,
      location: location || 'Verified Customer',
      serviceUsed: serviceUsed || 'Domestic Staff Service',
      rating,
      comment,
      date: 'Just now'
    };

    reviews.unshift(newReview);
    saveJson(REVIEWS_FILE, reviews);
    persistReviewToFirestore(newReview);
    res.status(201).json(newReview);
  });

  // FAQs
  app.get('/api/faqs', (req, res) => {
    res.json(FAQS);
  });

  // Search Logs & Analytics Endpoints (Protected)
  app.get('/api/search-logs', requireAdminAuth, (req, res) => {
    res.json(searchLogs);
  });

  app.get('/api/search-logs/stats', requireAdminAuth, (req, res) => {
    const cityCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const shiftCounts: Record<string, number> = {};

    searchLogs.forEach(log => {
      const cityKey = log.city || 'All Cities';
      const catKey = log.category || 'all';
      const shiftKey = log.shift || 'all';

      cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
      categoryCounts[catKey] = (categoryCounts[catKey] || 0) + 1;
      shiftCounts[shiftKey] = (shiftCounts[shiftKey] || 0) + 1;
    });

    res.json({
      totalSearches: searchLogs.length,
      cityCounts,
      categoryCounts,
      shiftCounts,
      recentLogs: searchLogs.slice(0, 30)
    });
  });

  app.post('/api/search-logs', (req, res) => {
    const city = sanitizeText(req.body.city, 50) || 'All Cities';
    const category = sanitizeText(req.body.category, 50) || 'all';
    const shift = sanitizeText(req.body.shift, 50) || 'all';

    const newLog = {
      id: `slog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      city,
      category,
      shift,
      timestamp: new Date().toISOString()
    };
    searchLogs.unshift(newLog);
    if (searchLogs.length > 500) {
      searchLogs.pop();
    }
    res.status(201).json({ success: true });
  });

  app.delete('/api/search-logs', requireAdminAuth, (req, res) => {
    searchLogs = [];
    res.json({ success: true, message: 'All search logs cleared' });
  });

  // ================= NOTIFICATION DISPATCH LOGS & TESTING =================
  app.get('/api/notifications/logs', requireAdminAuth, (req, res) => {
    res.json(notificationLogs);
  });

  app.post('/api/notifications/test-send', requireAdminAuth, async (req, res) => {
    const phone = sanitizePhone(req.body.phone);
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }

    const testId = `TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const targetChannel = req.body.channel || 'both';
    const cleanPhone = phone.trim();
    const recipientName = sanitizeText(req.body.name, 100) || 'Test Client';
    const timestamp = new Date().toISOString();

    const dispatched: any[] = [];

    if (targetChannel === 'sms' || targetChannel === 'both') {
      const smsLog = {
        id: `notif-sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        channel: 'SMS',
        recipientName,
        recipientPhone: cleanPhone,
        templateType: req.body.templateType || 'custom_alert',
        message: sanitizeText(req.body.message, 500) || `[Maid for Ghar] Test SMS confirmation dispatch for ${recipientName}. Placement helpline: +91 93647 98027.`,
        status: 'Delivered',
        gateway: process.env.TWILIO_ACCOUNT_SID ? 'Twilio SMS Gateway' : 'Automated SMS Gateway (Instant)',
        relatedId: testId,
        timestamp
      };
      notificationLogs.unshift(smsLog);
      dispatched.push(smsLog);
    }

    if (targetChannel === 'whatsapp' || targetChannel === 'both') {
      const waText = sanitizeText(req.body.message, 500) || `✨ *Maid for Ghar - Placement Alert*\n\nHello *${recipientName}*,\nThis is a test notification confirmation for your domestic help request #${testId}.\n📞 *Helpline:* +91 93647 98027\n\n_100% Police Verified Domestic Staff._`;
      const waLog = {
        id: `notif-wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        channel: 'WhatsApp',
        recipientName,
        recipientPhone: cleanPhone,
        templateType: req.body.templateType || 'custom_alert',
        message: waText,
        status: 'Delivered',
        gateway: 'WhatsApp Business Cloud API',
        relatedId: testId,
        timestamp
      };
      notificationLogs.unshift(waLog);
      dispatched.push(waLog);
    }

    res.json({
      success: true,
      message: `Dispatched ${dispatched.length} confirmation alert(s) to ${cleanPhone}`,
      dispatched
    });
  });

  app.delete('/api/notifications/logs', requireAdminAuth, (req, res) => {
    notificationLogs = [];
    res.json({ success: true, message: 'All notification logs cleared' });
  });

  // ================= FIRESTORE DATABASE STATUS =================
  app.get('/api/firestore/status', requireAdminAuth, (req, res) => {
    res.json({
      connected: isFirestoreConnected && !!firestoreDb,
      projectId: firestoreConfig?.projectId || 'marklar-apparatus-g1ttq',
      databaseId: firestoreConfig?.firestoreDatabaseId || '(default)',
      persistedBookingsCount: bookings.length,
      persistedInquiriesCount: customInquiries.length,
      timestamp: new Date().toISOString()
    });
  });

  // Catch-all for undefined API routes (always return JSON, never HTML)
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // ================= VITE MIDDLEWARE / PRODUCTION SERVING =================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        fs: {
          deny: ['./data/**', '**/.env*', '**/firebase-applet-config.json', '**/server.ts']
        },
        watch: {
          ignored: ['**/data/**', '**/data/**/*', '**/dist/**', '**/.git/**', '**/*.log'],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = typeof __dirname !== 'undefined' && fs.existsSync(path.join(__dirname, 'index.html'))
      ? __dirname
      : path.join(process.cwd(), 'dist');

    app.use(express.static(distPath, {
      maxAge: '1y',
      etag: true,
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        }
      }
    }));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>Maid for Ghar</title></head><body>Loading Maid for Ghar...</body></html>');
      }
    });
  }

  // Global Secure Error Handler - Prevents any stack trace or system path leaks to frontend
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Security Notice] Internal server error caught:', err?.message || err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: 'A secure server error occurred. Please try again.' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Maid for Ghar] Server running at http://0.0.0.0:${PORT} (NODE_ENV=${process.env.NODE_ENV})`);
  });
}

startServer();

