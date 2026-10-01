import type { ServiceDetail, FaqItem, Testimonial, DomesticHelper } from '../types.ts';

export const CITIES_LIST_LEFT: string[] = [
  "Mumbai",
  "Bengaluru",
  "Delhi NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad"
];

export const CITIES_LIST_RIGHT: string[] = [
  "Gurugram",
  "Noida",
  "Chandigarh",
  "Indore",
  "Nagpur",
  "Vizag",
  "Vijaywada"
];

export const CITIES_LIST: string[] = [...CITIES_LIST_LEFT, ...CITIES_LIST_RIGHT];

export const SERVICE_CATEGORIES: ServiceDetail[] = [
  {
    id: "house_cleaning",
    title: "House Maid & Deep Cleaning",
    shortDescription: "Reliable daily dusting, floor mopping, utensil washing, and deep house maintenance.",
    fullDescription: "Our trained house maids deliver thorough daily housekeeping including sweeping, deep floor washing, kitchen utensil sterilization, surface dusting, bathroom sanitation, and laundry care.",
    iconName: "Sparkles",
    heroImage: "/service_cleaning_pro.jpg",
    responsibilities: [
      "Sweeping, mopping & floor deep cleaning",
      "Washing utensils, kitchen countertop sanitization",
      "Dusting furniture, electronics, and decor items",
      "Bathroom washing & disinfectant cleaning",
      "Clothes washing, drying, folding & ironing",
      "Trash segregation & daily disposal"
    ],
    popularShifts: [
      "Part-time (2-4 hrs/day)",
      "Full-time (8-10 hrs/day)",
      "Live-in Helper"
    ],
    benefits: [
      "100% verified staff",
      "Free helper replacement guarantee",
      "Hygiene & sanitation trained"
    ]
  },
  {
    id: "cook_chef",
    title: "Home Cook & Gourmet Chef",
    shortDescription: "Delicious, hygienic home-cooked meals tailored to your dietary preferences.",
    fullDescription: "Professional home cooks and experienced chefs specialized in North Indian, South Indian, Jain, Continental, Diet & Healthy meals. Includes grocery prep and kitchen cleaning.",
    iconName: "UtensilsCrossed",
    heroImage: "https://images.pexels.com/photos/24252237/pexels-photo-24252237.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    responsibilities: [
      "Breakfast, lunch, evening snacks & dinner preparation",
      "Customized meal plans (Low oil, Jain, Diabetic, High protein)",
      "Vegetable cutting, chopping & raw ingredient prep",
      "Kitchen gas stove & workspace sanitization after cooking",
      "Managing pantry supplies & grocery list assistance"
    ],
    popularShifts: [
      "Morning & Evening Visit (2 visits/day)",
      "Full-day Cook (8 hrs/day)",
      "Live-in Cook"
    ],
    benefits: [
      "Strict food hygiene & health checkups",
      "Diet & recipe customization assessment",
      "Custom recipe customization"
    ]
  },
  {
    id: "babysitter",
    title: "Babysitter & Nanny Care",
    shortDescription: "Gentle, affectionate, and attentive childcare for infants, toddlers, and young kids.",
    fullDescription: "Compassionate, background-checked baby caretakers trained in newborn care, bottle feeding, diapering, toddler engagement, school prep, and child safety.",
    iconName: "Baby",
    heroImage: "https://images.pexels.com/photos/755049/pexels-photo-755049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    responsibilities: [
      "Infant feeding, bottle sterilization & bath care",
      "Toddler playtime engagement & educational activities",
      "Preparing healthy kids snacks & meals",
      "School readiness, bag packing & homework assistance",
      "Soothing bedtime routines & nap monitoring"
    ],
    popularShifts: [
      "Part-time (4 hrs/day)",
      "Full-day Nanny (8-12 hrs/day)",
      "Live-in Nanny"
    ],
    benefits: [
      "First-aid & child safety certified",
      "100% verified staff & medical screening",
      "Empathetic, motherly caregivers"
    ]
  },
  {
    id: "elderly_care",
    title: "Elderly Care & Companion",
    shortDescription: "Respectful, warm companionship and daily assistance for senior family members.",
    fullDescription: "Empathetic elderly caregivers providing assistance with mobility, medication reminders, companionship, personal hygiene, emotional support, and doctor visits.",
    iconName: "HeartHandshake",
    heroImage: "/service_elderly_care_companion.jpg",
    responsibilities: [
      "Timely medication reminders & blood pressure tracking",
      "Assistance in walking, bathing & dressing",
      "Engaging in conversation, walks & recreational activities",
      "Escorting to hospital appointments & morning walks",
      "Specialized care for Alzheimer's or Parkinson's assistance"
    ],
    popularShifts: [
      "Daytime Care (8-12 hrs/day)",
      "Night Shift Care",
      "Live-in Caregiver"
    ],
    benefits: [
      "Patient & gentle demeanor certified",
      "100% verified staff",
      "Dedicated relationship supervisor"
    ]
  },
  {
    id: "driver",
    title: "Professional Personal Driver",
    shortDescription: "Punctual, safe, and courteous personal chauffeurs for daily commute and outstation.",
    fullDescription: "Experienced drivers with valid commercial/private driving licenses, immaculate driving safety records, luxury car handling expertise, and route navigation mastery.",
    iconName: "Car",
    heroImage: "https://images.pexels.com/photos/22669772/pexels-photo-22669772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    responsibilities: [
      "Daily office commute & school drop/pick-up duty",
      "Outstation trips & weekend family driving",
      "Vehicle cleaning, tire pressure, and oil checkups",
      "Navigation via live GPS & heavy traffic handling",
      "Servicing visit coordination & car care maintenance"
    ],
    popularShifts: [
      "Full-day Duty (10-12 hrs/day)",
      "Resident Driver",
      "On-Demand Outstation"
    ],
    benefits: [
      "Valid driving license & 100% verified staff",
      "Zero alcohol policy strictly enforced",
      "Smooth, defensive driving record"
    ]
  },
  {
    id: "all_rounder",
    title: "All-Rounder Household Help",
    shortDescription: "Versatile domestic staff managing cooking, cleaning, errands, and house management.",
    fullDescription: "Multi-skilled household managers capable of cooking basic meals, keeping the home spotless, managing household groceries, receiving deliveries, and supervising domestic chores.",
    iconName: "Home",
    heroImage: "/service_all_rounder.jpg",
    responsibilities: [
      "Combined cooking & daily housekeeping",
      "Supermarket grocery errands & utility handling",
      "Home security oversight & gate management",
      "Pet feeding, walking & basic pet care",
      "Assisting family elders & hosting house guests"
    ],
    popularShifts: [
      "Full-time (10-12 hrs/day)",
      "Live-in Staff"
    ],
    benefits: [
      "Comprehensive multi-task verification",
      "100% verified staff",
      "Flexible duty routine"
    ]
  }
];

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Safety & Verification",
    question: "How does Maid for Ghar verify domestic staff background?",
    answer: "Every candidate undergoes a strict 5-stage screening process: 1) 100% verified staff authentic background and ID check, 2) Criminal and safety record verification, 3) Past employment reference verification, 4) Complete medical health checkup, and 5) In-person behavioral interview by our placement officers."
  },
  {
    id: "faq-2",
    category: "Booking & Interviews",
    question: "Can I interview the helper before hiring?",
    answer: "Yes! Once you submit your service request, we arrange a telephonic interview with shortlisted helpers promptly so you can evaluate their experience and communication before hiring."
  },
  {
    id: "faq-3",
    category: "Replacements",
    question: "What happens if I am not satisfied or the helper goes on leave?",
    answer: "Maid for Ghar offers a 100% Free Replacement Guarantee. If a helper goes on unscheduled leave or if you feel the fit is not ideal, we assign a verified replacement promptly without any additional hassle."
  },
  {
    id: "faq-4",
    category: "Duty & Hours",
    question: "What shift timings are available for domestic staff?",
    answer: "We offer customizable duty schedules: Part-Time (2-4 hours per visit), Full-Time Day Shift (8, 10, or 12 hours), and Live-In domestic help where the staff resides at your premises."
  }
];

export const INITIAL_REVIEWS: Testimonial[] = [
  {
    id: "rev-1",
    authorName: "Priya & Rajesh Sharma",
    location: "Bandra West, Mumbai",
    serviceUsed: "House Maid & Daily Cleaning",
    rating: 5,
    comment: "Our live-in housemaid Sunita was placed within 48 hours. Her government ID and address documents were verified upfront. She is punctual, respectful, and keeps our home spotlessly clean.",
    date: "2 days ago"
  },
  {
    id: "rev-2",
    authorName: "Dr. Arvind Swaminathan",
    location: "Indiranagar, Bengaluru",
    serviceUsed: "Senior Citizen & Elderly Care",
    rating: 5,
    comment: "Found a compassionate attendant for my 78-year-old mother. The placement coordinator arranged a direct telephonic interview and verified previous family references seamlessly. Exceptional care and total peace of mind.",
    date: "4 days ago"
  },
  {
    id: "rev-3",
    authorName: "Sunita & Vikram Reddy",
    location: "Jubilee Hills, Hyderabad",
    serviceUsed: "Baby Care & Certified Nanny",
    rating: 5,
    comment: "As working parents, finding someone trustworthy for our 9-month-old baby was critical. Our nanny Lakshmi is warm, gentle, and certified in infant first aid. She provides daily updates and our toddler loves her.",
    date: "1 week ago"
  },
  {
    id: "rev-4",
    authorName: "Amitav & Sneha Roy",
    location: "Salt Lake City, Kolkata",
    serviceUsed: "All-Rounder Domestic Staff",
    rating: 5,
    comment: "Maid for Ghar delivered on every promise. Our helper manages dusting, morning mopping, kitchen utensils, and local grocery errands with great responsibility. Truly professional domestic assistance.",
    date: "2 weeks ago"
  },
  {
    id: "rev-5",
    authorName: "Meenakshi Nair",
    location: "Sector 50, Noida",
    serviceUsed: "Patient Care & Bedside Attendant",
    rating: 5,
    comment: "Post-surgery recovery care for my father was prompt and dependable. The caregiver was attentive, assisted with mobility, and maintained immaculate hygiene throughout the month.",
    date: "3 weeks ago"
  },
  {
    id: "rev-6",
    authorName: "Neha & Rohan Deshmukh",
    location: "Kothrud, Pune",
    serviceUsed: "Home Cook & Chef",
    rating: 4,
    comment: "Very happy with our family cook Ramesh. He prepares delicious Maharashtrian and North Indian dishes with minimal oil as requested. The initial candidate shortlist took an extra day, but the placement was well worth it.",
    date: "5 days ago"
  },
  {
    id: "rev-7",
    authorName: "Col. Harpreet & Simran Singh",
    location: "Sector 17, Chandigarh",
    serviceUsed: "House Maid & Daily Cleaning",
    rating: 4,
    comment: "The candidate profile dossier with Aadhaar validation gave our family complete confidence. The maid cleans meticulously every morning. Good communication from the support desk and courteous staff.",
    date: "10 days ago"
  },
  {
    id: "rev-8",
    authorName: "Pooja & Gaurav Kapoor",
    location: "DLF Phase 4, Gurugram",
    serviceUsed: "House Maid & Daily Cleaning",
    rating: 4,
    comment: "Smooth telephonic interview and quick onboarding. The domestic helper is polite and hard-working. The placement coordinator checked in after the first week to make sure everything was running smoothly.",
    date: "2 weeks ago"
  },
  {
    id: "rev-9",
    authorName: "Sandeep & Ananya Singhal",
    location: "Dwarka, Delhi NCR",
    serviceUsed: "Home Cook & Chef",
    rating: 4,
    comment: "Disciplined and hygienic cook. Arrives promptly every morning and prepares fresh rotis, sabzi, and dal on schedule. Very receptive to dietary feedback.",
    date: "1 month ago"
  },
  {
    id: "rev-10",
    authorName: "Kavita & Suresh Iyer",
    location: "Adyar, Chennai",
    serviceUsed: "House Maid & Daily Cleaning",
    rating: 3,
    comment: "The helper does good daily dusting and floor washing. Our initial helper had a language preference gap, but Maid for Ghar assigned a suitable replacement helper within their guarantee window. Satisfactory experience.",
    date: "3 weeks ago"
  },
  {
    id: "rev-11",
    authorName: "Nitin & Shweta Agrawal",
    location: "Vijay Nagar, Indore",
    serviceUsed: "All-Rounder Domestic Staff",
    rating: 3,
    comment: "Work quality is good and the staff is honest with household chores. There were a couple of leave days in the first fortnight, though customer support responded promptly to address our scheduling needs.",
    date: "1 month ago"
  },
  {
    id: "rev-12",
    authorName: "Tanvi & Abhishek Joshi",
    location: "Bodakdev, Ahmedabad",
    serviceUsed: "Professional Family Chauffeur",
    rating: 5,
    comment: "Hired an experienced family driver through Maid for Ghar. He has clean driving credentials, knows the city routes thoroughly, and is very punctual for office and school pick-ups.",
    date: "12 days ago"
  }
];

export const INITIAL_HELPERS: DomesticHelper[] = [];
