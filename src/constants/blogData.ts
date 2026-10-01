import { BlogPost } from '../types';
import chefAnanyaAvatar from '../assets/images/chef_ananya_deshpande_1790783893612.jpg';
import rameshSundaramAvatar from '../assets/images/ramesh_sundaram_male_1790784147858.jpg';
import poojaNarangAvatar from '../assets/images/pooja_narang_avatar_1790785312961.jpg';
import drNehaAvatar from '../assets/images/dr_neha_kulkarni_1790785327667.jpg';
import vikramJoshiAvatar from '../assets/images/vikram_joshi_avatar_1790785341412.jpg';
import rajeshChauhanAvatar from '../assets/images/rajesh_chauhan_driver_1790787403364.jpg';
import blogKitchenCookingImg from '../assets/images/blog_kitchen_cooking_1790785394490.jpg';
import blogHomeCleaningImg from '../assets/images/blog_home_cleaning_1790785411168.jpg';
import blogPersonalDriverImg from '../assets/images/blog_personal_driver_1790787389505.jpg';
import blogSeniorCareDignityImg from '../assets/images/blog_senior_care_dignity_1790787706221.jpg';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-cook-hygiene',
    title: 'Managing Your Home Cook: Kitchen Hygiene, Meal Planning & Spice Customization',
    slug: 'managing-home-cook-hygiene-meal-planning',
    category: 'cooking_hygiene',
    categoryLabel: 'Home Cook & Chef',
    excerpt: 'Best practices for onboarding a domestic cook, establishing food safety standards, planning balanced weekly menus, and communicating dietary preferences.',
    coverImage: blogKitchenCookingImg,
    readTime: '5 min read',
    author: {
      name: 'Chef Ananya Deshpande',
      role: 'Culinary Training & Nutrition Consultant',
      avatar: chefAnanyaAvatar
    },
    publishDate: 'September 22, 2026',
    featured: true,
    content: {
      introduction: 'A dependable home cook transforms family health by delivering fresh, balanced, and hygienic meals every single day. Setting clear kitchen protocols, weekly menu schedules, and hygiene habits from day one ensures wholesome meals tailored exactly to your family’s palate.',
      sections: [
        {
          heading: '1. Food Safety & Hand Hygiene Standards',
          body: 'Proper food handling prevents cross-contamination and stomach bugs. Ensure your cook washes hands thoroughly with anti-bacterial soap before touching vegetables or kneading dough, and ties hair securely.',
          bullets: [
            'Maintain separate color-coded chopping boards for raw vegetables and poultry/meat',
            'Wash and soak leafy greens in salted water to eliminate pesticide residues and dirt',
            'Always inspect and thoroughly boil milk and dairy upon morning delivery'
          ]
        },
        {
          heading: '2. Oil, Salt & Spice Calibration',
          body: 'Every family has unique health goals and spice tolerances. On the first two days, cook alongside your chef or demonstrate your exact measure for cold-pressed oil, salt, chili powder, and garam masala.',
          bullets: [
            'Use standardized measuring spoons rather than estimating pinches or free pours',
            'Specify whether your family prefers mild, medium, or traditional tempering (tadka)',
            'Instruct the cook to discard oil after deep-frying rather than repeatedly reheating it'
          ]
        },
        {
          heading: '3. Weekly Menu Planning & Grocery Management',
          body: 'Eliminate daily confusion by pinning a structured weekly meal plan on the refrigerator door. Include rotational proteins like lentils, paneer, sprouts, and seasonal greens for balanced nutrition.',
          bullets: [
            'Prepare a weekly staple grocery list every weekend to prevent last-minute missing ingredients',
            'Set aside dedicated airtight glass containers for pre-cut vegetables and refrigerated batters',
            'Instruct on safe leftover handling: cool cooked dishes before sealing and refrigerating within 90 minutes'
          ]
        }
      ],
      takeaways: [
        'Demonstrate spice levels and oil measurements directly during the cook’s initial trial meals.',
        'Sanitize gas burner hobs and cutting boards immediately after daily cooking concludes.',
        'Keep a whiteboard or printed weekly menu calendar visible in the kitchen.'
      ]
    }
  },
  {
    id: 'post-1',
    title: 'Essential Daily & Weekly Cleaning Checklist for Indian Homes',
    slug: 'essential-cleaning-checklist-indian-homes',
    category: 'home_maintenance',
    categoryLabel: 'Home Maintenance',
    excerpt: 'A structured blueprint to keep kitchens grease-free, bathrooms sanitized, and living spaces fresh without exhausting your household staff.',
    coverImage: blogHomeCleaningImg,
    readTime: '4 min read',
    author: {
      name: 'Pooja Narang',
      role: 'Head of Housekeeping Standards',
      avatar: poojaNarangAvatar
    },
    publishDate: 'September 18, 2026',
    featured: true,
    content: {
      introduction: 'Maintaining an organized and hygienic household in urban India requires a steady, structured routine. With seasonal dust, oil fumes from everyday tadkas, and heavy foot traffic, delegating clear tasks to your domestic helper ensures flawless results.',
      sections: [
        {
          heading: '1. Morning Surface & Floor Protocol',
          body: 'Floors should always be dry swept before any wet mopping to prevent mud streaks. Use a natural citrus or neem disinfectant solution for living areas, and ensure separate microfiber mops for balconies versus bedrooms.',
          bullets: [
            'Sweep all open areas and under low furniture first',
            'Wet mop with hot water and anti-bacterial floor cleaner',
            'Allow cross-ventilation for 20 minutes to dry floors fast'
          ]
        },
        {
          heading: '2. Kitchen Grease & Chimney De-oiling',
          body: 'Cooking with spices leaves microscopic oil layers on tiles and granite counters. Wiping counter surfaces right after cooking with a baking soda and warm dish-wash solution prevents stubborn yellow grease deposits.',
          bullets: [
            'Daily wiping of gas stove knobs and splashback tiles',
            'Weekly soaking of stainless steel utensil racks in hot soapy water',
            'Dry wiping microwave interiors and refrigerator handles daily'
          ]
        },
        {
          heading: '3. Bathroom Sanitation & Moisture Control',
          body: 'High humidity creates mold quickly in Indian city apartments. Train your helper to wipe glass shower partitions with a squeegee and keep bathroom exhaust fans running for at least 15 minutes after cleaning.'
        }
      ],
      takeaways: [
        'Always dry-sweep before wet mopping to protect tile luster.',
        'Use designated color-coded microfiber cloths for kitchen vs bathrooms.',
        'Provide non-toxic, safe cleaning gloves to your domestic staff.'
      ]
    }
  },
  {
    id: 'post-2',
    title: 'Toddler Safety at Home: Baby-Proofing Checklist for Working Parents',
    slug: 'toddler-safety-baby-proofing-guide',
    category: 'child_safety',
    categoryLabel: 'Child Safety',
    excerpt: 'Critical childproofing measures every apartment needs before leaving toddlers under the loving supervision of a nanny or babysitter.',
    coverImage: 'https://images.pexels.com/photos/755049/pexels-photo-755049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    readTime: '5 min read',
    author: {
      name: 'Dr. Neha Kulkarni',
      role: 'Pediatric Consultant & Child Safety Advisor',
      avatar: drNehaAvatar
    },
    publishDate: 'September 12, 2026',
    featured: true,
    content: {
      introduction: 'Curious toddlers explore their surroundings with boundless energy and zero fear of hazard. When hiring a nanny or babysitter, ensuring the physical environment is fortified against accidents gives parents complete peace of mind during office hours.',
      sections: [
        {
          heading: '1. Securing Heights, Balconies, and Window Grills',
          body: 'Never place chairs, ottomans, or storage boxes within climbing distance of balcony railings or windows. Install safety nets or invisible bird grills that can support body weight without obstructing daylight.',
          bullets: [
            'Keep balcony doors locked with high-mounted childproof latches',
            'Avoid keeping decorative pots near window parapets',
            'Check sliding window stoppers regularly'
          ]
        },
        {
          heading: '2. Electrical Outlets and Low Cord Hazards',
          body: 'Toddlers love poking small objects into wall sockets. Standard plastic socket plugs cost minimal amounts but prevent severe shocks. Anchor loose television cables and phone chargers behind heavy media consoles.',
          bullets: [
            'Install plastic safety caps into all unused low-lying sockets',
            'Secure floor lamps and trailing appliance cords along baseboards',
            'Keep hot water kettles and irons strictly on high kitchen shelves'
          ]
        },
        {
          heading: '3. Briefing Your Nanny on First Aid and Emergency Numbers',
          body: 'Always paste pediatric emergency contact cards on your refrigerator. Provide your nanny with a pre-packed child first-aid kit containing antiseptic ointment, fever thermometers, digital scales, and allergy drops with doctor-approved dosages.'
        }
      ],
      takeaways: [
        'Cushion sharp table corners with silicone edge bumpers.',
        'Store cleaning chemicals and medicines in keyed overhead cabinets.',
        'Review choking hazards: cut grapes and nuts into tiny halves before serving.'
      ]
    }
  },
  {
    id: 'post-3',
    title: 'Caring for Senior Citizens: Preventing Falls and Ensuring Dignity',
    slug: 'senior-care-preventing-falls-dignity',
    category: 'elder_care',
    categoryLabel: 'Elderly Care',
    excerpt: 'Compassionate practices, mobility support, and bathroom modifications to protect elderly parents and help attendants provide exceptional care.',
    coverImage: blogSeniorCareDignityImg,
    readTime: '6 min read',
    author: {
      name: 'Ramesh Sundaram',
      role: 'Geriatric Care Coordinator',
      avatar: rameshSundaramAvatar
    },
    publishDate: 'September 05, 2026',
    featured: false,
    content: {
      introduction: 'As parents age, maintaining their independence while ensuring safety becomes our highest priority. Slips and bathroom falls are the number one cause of sudden hospitalization in seniors. A trained elder caregiver combined with simple home retrofits makes all the difference.',
      sections: [
        {
          heading: '1. Bathroom Retrofits: Anti-Slip Mats and Grab Bars',
          body: 'Smooth ceramic bathroom tiles become dangerously slick when wet with soap or shampoo. Installing stainless steel grab rails beside commodes and inside shower areas provides immediate physical leverage.',
          bullets: [
            'Install textured anti-skid rubber suction mats in wet zones',
            'Mount 32mm stainless steel grab rails at ergonomic heights',
            'Place a waterproof sturdy shower stool for seated bathing'
          ]
        },
        {
          heading: '2. Medication Organization and Routine Tracking',
          body: 'Missed or duplicated doses of blood pressure or diabetes medication are common. Weekly 7-day pill organizers with morning, afternoon, and night compartments allow caregivers to track schedules without error.',
          bullets: [
            'Maintain a simple physical logbook for daily BP and blood sugar readings',
            'Set synchronized smartphone alarms for critical medication hours',
            'Keep emergency doctor and ambulance numbers prominently displayed'
          ]
        },
        {
          heading: '3. Emotional Well-being and Gentle Physical Mobility',
          body: 'Loneliness is as physically damaging to seniors as chronic illness. Encourage the attendant to accompany your parent on gentle 15-minute garden walks, listen to old songs, or solve word puzzles together.'
        }
      ],
      takeaways: [
        'Keep nightlights plugged into hallways leading from bedroom to bathroom.',
        'Never rush elderly parents when standing up from bed to avoid sudden dizziness.',
        'Treat elder attendants as partners in family health with mutual respect.'
      ]
    }
  },
  {
    id: 'post-4',
    title: 'Hiring a Professional Personal Driver: Defensive Driving, Punctuality & Car Care',
    slug: 'hiring-professional-personal-driver-guide',
    category: 'driver',
    categoryLabel: 'Professional Driver',
    excerpt: 'Comprehensive guide to hiring a verified private chauffeur for daily office commutes, school runs, outstation weekend trips, and vehicle preventive maintenance.',
    coverImage: blogPersonalDriverImg,
    readTime: '5 min read',
    author: {
      name: 'Rajesh Chauhan',
      role: 'Senior Fleet & Chauffeur Training Director',
      avatar: rajeshChauhanAvatar
    },
    publishDate: 'August 28, 2026',
    featured: false,
    content: {
      introduction: 'A dependable personal driver provides family safety, stress-free daily commutes, and peace of mind on city roads. From verifying commercial driving licenses and background records to mastering defensive driving in heavy urban traffic, selecting the right chauffeur protects your vehicle and your loved ones.',
      sections: [
        {
          heading: '1. Driving License Verification & Track Record Assessment',
          body: 'Never onboard a personal driver without validating both the original Smart Card Driving License and checking the Sarathi/mParivahan portal for pending traffic challans or suspension history. A pristine record demonstrates discipline.',
          bullets: [
            'Verify valid LMV / Commercial badge credentials directly via RTO database',
            'Conduct a 30-minute practical driving assessment covering braking, lane discipline, and reverse parking',
            'Check authentic past family references for road patience and non-rash driving'
          ]
        },
        {
          heading: '2. Daily Vehicle Care, Fluid Checks & Cleanliness Standards',
          body: 'A true professional chauffeur treats your car with utmost diligence. Establish a daily morning vehicle readiness routine before the first ignition turn of the day.',
          bullets: [
            'Inspect windshield washer fluid, engine oil levels, and tire PSI pressure every morning',
            'Microfiber dust cleaning of exterior surfaces and vacuuming floor mats before pickup',
            'Maintain a neat in-car travel kit: umbrella, tissue box, sanitized water bottles, and emergency phone charger'
          ]
        },
        {
          heading: '3. Professional Etiquette, Route Planning & Zero-Distraction Rules',
          body: 'Punctuality, discreet communication, and defensive route awareness separate an average driver from an exceptional personal chauffeur.',
          bullets: [
            'Enforce a strict zero-phone-use rule while vehicle is in motion — hands-free or phone stands only',
            'Check Google Maps live traffic 20 minutes prior to scheduled departures to bypass roadblocks',
            'Polite, respectful demeanor with seniors and school children during pickups and drop-offs'
          ]
        }
      ],
      takeaways: [
        'Always conduct a live practical road test in peak city traffic before finalizing hiring.',
        'Enforce a zero-tolerance policy regarding mobile phone usage and alcohol consumption.',
        'Establish a routine daily checklist for tire pressure, fluid levels, and interior vehicle sanitization.'
      ]
    }
  }
];
