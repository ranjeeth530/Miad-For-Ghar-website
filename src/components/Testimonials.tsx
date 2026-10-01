import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  LayoutGrid, 
  LayoutList, 
  MessageSquarePlus, 
  Filter,
  Sparkles,
  Award,
  ThumbsUp
} from 'lucide-react';
import { Testimonial } from '../types';
import { TouchHorizontalScroll } from './TouchHorizontalScroll';

interface TestimonialsProps {
  reviews: Testimonial[];
  onAddReview: (review: Omit<Testimonial, 'id' | 'date'>) => Promise<any>;
}

const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarStyle = (name: string): string => {
  const styles = [
    'bg-[#2A5A43] text-white',
    'bg-[#D96C4E] text-white',
    'bg-[#1C2723] text-white',
    'bg-[#3B6E58] text-white',
    'bg-[#8D5B4C] text-white',
    'bg-[#234E52] text-white',
    'bg-[#B45309] text-white',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return styles[sum % styles.length];
};

const SERVICE_OPTIONS = [
  'House Maid & Deep Cleaning',
  'Home Cook & Chef',
  'Baby Care & Certified Nanny',
  'Elderly & Senior Citizen Care',
  'Patient Care & Bedside Attendant',
  'All-Rounder Household Helper'
];

export const Testimonials: React.FC<TestimonialsProps> = ({ reviews, onAddReview }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [ratingFilter, setRatingFilter] = useState<'all' | 5 | 4 | 3>('all');

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [serviceUsed, setServiceUsed] = useState(SERVICE_OPTIONS[0]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Safe fallback reviews list
  const safeReviews = reviews || [];

  // Ratings calculation
  const stats = useMemo(() => {
    if (safeReviews.length === 0) {
      return {
        total: 0,
        average: '0.0',
        count5: 0,
        count4: 0,
        count3: 0,
        pct5: 0,
        pct4: 0,
        pct3: 0
      };
    }

    const total = safeReviews.length;
    const sum = safeReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const average = (sum / total).toFixed(1);

    const count5 = safeReviews.filter(r => r.rating === 5).length;
    const count4 = safeReviews.filter(r => r.rating === 4).length;
    const count3 = safeReviews.filter(r => r.rating === 3 || r.rating < 4).length;

    const pct5 = Math.round((count5 / total) * 100);
    const pct4 = Math.round((count4 / total) * 100);
    const pct3 = Math.round((count3 / total) * 100);

    return { total, average, count5, count4, count3, pct5, pct4, pct3 };
  }, [safeReviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (ratingFilter === 'all') return safeReviews;
    if (ratingFilter === 3) {
      return safeReviews.filter(r => r.rating === 3 || r.rating < 4);
    }
    return safeReviews.filter(r => r.rating === ratingFilter);
  }, [safeReviews, ratingFilter]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setFeedbackError('Please fill in your name and review details.');
      return;
    }

    setLoading(true);
    setFeedbackError(null);
    try {
      await onAddReview({
        authorName: authorName.trim(),
        location: location.trim() || 'Verified Family',
        serviceUsed,
        rating,
        comment: comment.trim()
      });

      setShowForm(false);
      setAuthorName('');
      setLocation('');
      setComment('');
      setRating(5);
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 6000);
    } catch (err) {
      console.error(err);
      setFeedbackError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return '5 Stars - Exceptional Service ★★★★★';
      case 4:
        return '4 Stars - Very Good Experience ★★★★☆';
      case 3:
        return '3 Stars - Good & Satisfactory ★★★☆☆';
      default:
        return `${val} Stars`;
    }
  };

  return (
    <section id="reviews" className="py-10 sm:py-14 bg-[#FAF9F5] border-t border-[#2A5A43]/10 scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-[#D96C4E]" /> Customer Feedback & Reviews
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C2723] tracking-tight">
              Loved by Families Across India
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5A53] leading-relaxed">
              Read authentic feedback and verified ratings from families who trust Maid for Ghar for verified domestic staff, home cooks, and patient caregivers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* View Mode Toggle */}
            {safeReviews.length > 0 && (
              <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('carousel')}
                  title="Swipeable Carousel View"
                  className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'carousel'
                      ? 'bg-[#2A5A43] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Carousel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#2A5A43] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            )}

            {/* Write Review Trigger */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-amber-300" />
              <span>{showForm ? 'Close Form' : 'Write a Review'}</span>
            </button>
          </div>
        </div>

        {/* Rating Breakdown & Trust Scorecard (When reviews exist) */}
        {safeReviews.length > 0 ? (
          <>
            <div className="mb-8 bg-white p-5 sm:p-6 rounded-2xl border border-[#2A5A43]/15 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Average Rating Block */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-[#1C2723] font-serif">
                    {stats.average}
                  </span>
                  <span className="text-sm font-semibold text-[#4A5A53]">/ 5.0</span>
                </div>
                
                <div className="flex items-center gap-1 text-[#F59E0B] my-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>

                <p className="text-xs font-semibold text-[#1C2723] mt-0.5">
                  Based on {stats.total} verified family reviews
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Verified Placements
                </div>
              </div>

              {/* 3 to 5 Star Distribution Bars */}
              <div className="lg:col-span-5 space-y-2">
                <div className="text-xs font-bold text-[#1C2723] mb-2 flex items-center justify-between">
                  <span>Rating Breakdown</span>
                  <span className="text-[11px] font-medium text-[#4A5A53]">3 to 5 Star Distribution</span>
                </div>

                {/* 5 Stars */}
                <div 
                  onClick={() => setRatingFilter(ratingFilter === 5 ? 'all' : 5)}
                  className="flex items-center gap-2 text-xs cursor-pointer group"
                  title="Filter by 5 Stars"
                >
                  <span className="w-14 font-semibold text-[#1C2723] flex items-center gap-1 shrink-0 group-hover:text-[#2A5A43]">
                    5 Stars <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                  </span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#2A5A43] rounded-full transition-all duration-500" 
                      style={{ width: `${stats.pct5}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-[11px] text-[#4A5A53] shrink-0 font-medium">
                    {stats.count5} ({stats.pct5}%)
                  </span>
                </div>

                {/* 4 Stars */}
                <div 
                  onClick={() => setRatingFilter(ratingFilter === 4 ? 'all' : 4)}
                  className="flex items-center gap-2 text-xs cursor-pointer group"
                  title="Filter by 4 Stars"
                >
                  <span className="w-14 font-semibold text-[#1C2723] flex items-center gap-1 shrink-0 group-hover:text-[#2A5A43]">
                    4 Stars <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                  </span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#3B6E58] rounded-full transition-all duration-500" 
                      style={{ width: `${stats.pct4}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-[11px] text-[#4A5A53] shrink-0 font-medium">
                    {stats.count4} ({stats.pct4}%)
                  </span>
                </div>

                {/* 3 Stars */}
                <div 
                  onClick={() => setRatingFilter(ratingFilter === 3 ? 'all' : 3)}
                  className="flex items-center gap-2 text-xs cursor-pointer group"
                  title="Filter by 3 Stars"
                >
                  <span className="w-14 font-semibold text-[#1C2723] flex items-center gap-1 shrink-0 group-hover:text-[#2A5A43]">
                    3 Stars <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                  </span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.pct3}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-[11px] text-[#4A5A53] shrink-0 font-medium">
                    {stats.count3} ({stats.pct3}%)
                  </span>
                </div>
              </div>

              {/* Guarantee Highlights */}
              <div className="lg:col-span-3 bg-[#FAF9F5] p-3.5 rounded-xl border border-gray-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#1C2723]">
                  <Award className="w-4 h-4 text-[#D96C4E]" />
                  <span>Placement Assurance</span>
                </div>
                <p className="text-[11px] text-[#4A5A53] leading-relaxed">
                  Every review represents an authentic verified client who interviewed and engaged domestic staff through Maid for Ghar.
                </p>
                <div className="text-[11px] text-[#2A5A43] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2A5A43]" /> Free Helper Replacement Included
                </div>
              </div>
            </div>

            {/* Rating Filter Bar (3 to 5 Stars) */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A5A53] mr-1">
                <Filter className="w-3.5 h-3.5 text-[#2A5A43]" />
                <span>Filter by Rating:</span>
              </div>

              <button
                onClick={() => setRatingFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  ratingFilter === 'all'
                    ? 'bg-[#2A5A43] text-white shadow-2xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Reviews ({stats.total})
              </button>

              <button
                onClick={() => setRatingFilter(5)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  ratingFilter === 5
                    ? 'bg-[#2A5A43] text-white shadow-2xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>5 Stars</span>
                <span className="text-[#F59E0B]">★★★★★</span>
                <span className="text-[10px] opacity-80">({stats.count5})</span>
              </button>

              <button
                onClick={() => setRatingFilter(4)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  ratingFilter === 4
                    ? 'bg-[#2A5A43] text-white shadow-2xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>4 Stars</span>
                <span className="text-[#F59E0B]">★★★★</span>
                <span className="text-[10px] opacity-80">({stats.count4})</span>
              </button>

              <button
                onClick={() => setRatingFilter(3)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  ratingFilter === 3
                    ? 'bg-[#2A5A43] text-white shadow-2xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>3 Stars</span>
                <span className="text-[#F59E0B]">★★★</span>
                <span className="text-[10px] opacity-80">({stats.count3})</span>
              </button>
            </div>
          </>
        ) : !showForm ? (
          /* Zero Reviews Empty State Card */
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#2A5A43]/15 shadow-2xs text-center space-y-4 max-w-xl mx-auto my-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#2A5A43]/10 flex items-center justify-center text-[#2A5A43]">
              <Heart className="w-6 h-6 text-[#D96C4E]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C2723]">
                Be the First to Review Maid for Ghar
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5A53] leading-relaxed">
                Have you hired verified domestic staff, home cooks, or caregivers through us? Share your authentic experience to help other families make informed hiring decisions.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-300" />
              <span>Write a Customer Review</span>
            </button>
          </div>
        ) : null}

        {/* Submit Review Form Card */}
        {feedbackSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 max-w-3xl shadow-2xs animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Thank you for sharing your feedback!</p>
              <p className="text-[11px] text-emerald-700">Your verified review and rating have been added to our feedback board.</p>
            </div>
          </div>
        )}

        {showForm && (
          <form 
            onSubmit={handleSubmitReview} 
            className="mb-8 bg-white p-5 sm:p-6 rounded-2xl border border-[#2A5A43]/20 shadow-md space-y-4 max-w-3xl animate-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C2723]">
                  Share Your Family Feedback & Rating
                </h3>
                <p className="text-xs text-[#4A5A53]">
                  Help other families make informed hiring choices with honest 3 to 5 star ratings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
            
            {feedbackError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {feedbackError}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5A53] mb-1">
                  Your Name / Family Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera & Vikram Sharma"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-gray-200 focus:border-[#2A5A43] focus:ring-1 focus:ring-[#2A5A43] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5A53] mb-1">
                  City & Locality: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Koramangala, Bengaluru"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-gray-200 focus:border-[#2A5A43] focus:ring-1 focus:ring-[#2A5A43] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5A53] mb-1">
                  Service Category Hired:
                </label>
                <select
                  value={serviceUsed}
                  onChange={(e) => setServiceUsed(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-gray-200 focus:border-[#2A5A43] focus:ring-1 focus:ring-[#2A5A43] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] outline-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 3 to 5 Star Rating Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5A53] mb-1">
                  Rating (3 to 5 Stars): <span className="text-red-500">*</span>
                </label>
                
                <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF9F5] border border-gray-200 rounded-xl">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const active = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal < 3 ? 3 : starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                        title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            active 
                              ? 'fill-[#F59E0B] text-[#F59E0B]' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-[#2A5A43] ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Star Tier Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-bold uppercase text-[#4A5A53]">Quick Select:</span>
              <button
                type="button"
                onClick={() => setRating(5)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  rating === 5 ? 'bg-[#2A5A43] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ★★★★★ 5 Stars (Exceptional)
              </button>
              <button
                type="button"
                onClick={() => setRating(4)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  rating === 4 ? 'bg-[#2A5A43] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ★★★★☆ 4 Stars (Very Good)
              </button>
              <button
                type="button"
                onClick={() => setRating(3)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  rating === 3 ? 'bg-[#2A5A43] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ★★★☆☆ 3 Stars (Satisfactory)
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5A53] mb-1">
                Your Review & Experience: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Share your experience with the staff's punctuality, cooking/cleaning skills, hygiene, behavior, or placement process..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-gray-200 focus:border-[#2A5A43] focus:ring-1 focus:ring-[#2A5A43] rounded-xl p-3 text-xs text-[#1C2723] outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#4A5A53] italic">
                {getRatingLabel(rating)}
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting Review...' : 'Post Customer Review'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Empty State for Filter */}
        {safeReviews.length > 0 && filteredReviews.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-3">
            <p className="text-sm font-semibold text-[#1C2723]">
              No reviews found matching the {ratingFilter}-star rating filter.
            </p>
            <button
              onClick={() => setRatingFilter('all')}
              className="px-4 py-2 rounded-xl bg-[#2A5A43] text-white text-xs font-bold cursor-pointer hover:bg-[#1E4231] transition-all"
            >
              View All Customer Reviews
            </button>
          </div>
        )}

        {/* Reviews Presentation: Carousel or Grid */}
        {filteredReviews.length > 0 && (
          viewMode === 'carousel' ? (
            <TouchHorizontalScroll
              hintText="Touch & swipe horizontally to read customer reviews"
              itemClassName="w-[88vw] sm:w-[320px] md:w-[360px] shrink-0 snap-center sm:snap-start h-auto"
            >
              {filteredReviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-[#2A5A43]/10 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow h-full"
                >
                  <div className="space-y-3">
                    {/* Header: Stars & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-[#F59E0B]">
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <Star 
                              key={starIdx} 
                              className={`w-3.5 h-3.5 ${
                                starIdx <= rev.rating 
                                  ? 'fill-[#F59E0B] text-[#F59E0B]' 
                                  : 'text-gray-200 fill-gray-100'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#1C2723] ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                      <Quote className="w-4 h-4 text-[#2A5A43]/20 shrink-0" />
                    </div>

                    {/* Review Text */}
                    <p className="text-xs text-[#4A5A53] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tracking-wider shadow-2xs select-none ${getAvatarStyle(rev.authorName)}`}>
                        {getInitials(rev.authorName)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1C2723] flex items-center gap-1 truncate">
                          <span className="truncate">{rev.authorName}</span>
                          <span title="Verified Placement" className="inline-flex">
                            <CheckCircle2 className="w-3 h-3 text-[#2A5A43] shrink-0" />
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[#4A5A53] truncate">
                          {rev.location}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-semibold text-[#2A5A43] bg-[#2A5A43]/10 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                        {rev.serviceUsed}
                      </span>
                      {rev.date && (
                        <div className="text-[9.5px] text-gray-400 mt-0.5 font-medium">
                          {rev.date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </TouchHorizontalScroll>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredReviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-[#2A5A43]/10 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Header: Stars & Quote */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-[#F59E0B]">
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <Star 
                              key={starIdx} 
                              className={`w-3.5 h-3.5 ${
                                starIdx <= rev.rating 
                                  ? 'fill-[#F59E0B] text-[#F59E0B]' 
                                  : 'text-gray-200 fill-gray-100'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#1C2723] ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                      <Quote className="w-4 h-4 text-[#2A5A43]/20 shrink-0" />
                    </div>

                    {/* Review Text */}
                    <p className="text-xs text-[#4A5A53] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 tracking-wider shadow-2xs select-none ${getAvatarStyle(rev.authorName)}`}>
                        {getInitials(rev.authorName)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1C2723] flex items-center gap-1 truncate">
                          <span className="truncate">{rev.authorName}</span>
                          <span title="Verified Placement" className="inline-flex">
                            <CheckCircle2 className="w-3 h-3 text-[#2A5A43] shrink-0" />
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[#4A5A53] truncate">
                          {rev.location}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-semibold text-[#2A5A43] bg-[#2A5A43]/10 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                        {rev.serviceUsed}
                      </span>
                      {rev.date && (
                        <div className="text-[9.5px] text-gray-400 mt-0.5 font-medium">
                          {rev.date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </section>
  );
};
