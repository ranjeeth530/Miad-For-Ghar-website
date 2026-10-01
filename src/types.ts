export type ServiceCategory = 
  | 'house_cleaning'
  | 'cook_chef'
  | 'babysitter'
  | 'elderly_care'
  | 'driver'
  | 'all_rounder';

export type ShiftType = 'part_time' | 'full_time_8h' | 'full_time_12h' | 'live_in_24h' | 'on_demand';

export type VerificationBadge = 
  | 'police_verified'
  | 'id_verified'
  | 'health_certified'
  | 'covid_vaccinated'
  | 'first_aid_trained'
  | 'background_checked';

export interface DomesticHelper {
  id: string;
  name: string;
  photoUrl: string;
  category: ServiceCategory;
  categoryTitle: string;
  experienceYears: number;
  city: string;
  localities: string[];
  rating: number;
  reviewsCount: number;
  languages: string[];
  shiftTypes: ShiftType[];
  badges: VerificationBadge[];
  specialties: string[];
  availability: 'Immediate' | 'Within 2 Days' | 'Next Week';
  bio: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  verifiedAt: string;
  completedJobs: number;
  featured?: boolean;
}

export interface ServiceDetail {
  id: ServiceCategory;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  heroImage: string;
  responsibilities: string[];
  popularShifts: string[];
  benefits: string[];
}

export interface BookingRequest {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  locality?: string;
  serviceCategory: ServiceCategory;
  serviceTitle: string;
  shiftType: ShiftType;
  helperId?: string;
  helperName?: string;
  startDate: string;
  timeSlot?: string;
  householdSize?: string;
  salaryRange?: string;
  specialInstructions?: string;
  status: 'Pending' | 'In Touch' | 'Interview Scheduled' | 'Helper Assigned' | 'Completed' | 'Cancelled';
  createdAt: string;
  smsConfirmationStatus?: 'Sent' | 'Delivered' | 'Pending';
  whatsappConfirmationStatus?: 'Sent' | 'Delivered' | 'Pending';
}

export interface CustomInquiry {
  id: string;
  name: string;
  phone: string;
  city: string;
  requirement: string;
  urgency: 'Immediate (Today)' | 'As Soon As Possible' | 'This Week' | 'General Query';
  createdAt: string;
  smsConfirmationStatus?: 'Sent' | 'Delivered' | 'Pending';
  whatsappConfirmationStatus?: 'Sent' | 'Delivered' | 'Pending';
}

export interface NotificationDispatchLog {
  id: string;
  channel: 'SMS' | 'WhatsApp';
  recipientName: string;
  recipientPhone: string;
  templateType: 'booking_confirmation' | 'callback_inquiry' | 'interview_scheduled' | 'custom_alert';
  message: string;
  status: 'Delivered' | 'Sent' | 'Failed';
  gateway: string;
  relatedId: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  location: string;
  serviceUsed: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Safety & Verification' | 'Booking & Interviews' | 'Replacements' | 'Duty & Hours';
}

export type BlogCategory = 'all' | 'home_maintenance' | 'cooking_hygiene' | 'child_safety' | 'elder_care' | 'driver';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'home_maintenance' | 'cooking_hygiene' | 'child_safety' | 'elder_care' | 'driver';
  categoryLabel: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  featured?: boolean;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string;
      bullets?: string[];
    }[];
    takeaways: string[];
  };
}
