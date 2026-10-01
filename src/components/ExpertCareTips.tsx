import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Share2, 
  CheckCircle2, 
  HeartHandshake,
  Baby,
  Home,
  UtensilsCrossed,
  Car,
  Check,
  Tag,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';
import { BlogPost, BlogCategory } from '../types';
import { TouchHorizontalScroll } from './TouchHorizontalScroll';

interface ExpertCareTipsProps {
  onOpenBookingModal: (serviceId?: string) => void;
}

export const ExpertCareTips: React.FC<ExpertCareTipsProps> = ({ onOpenBookingModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Filter posts based on category & search query
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.categoryLabel.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'home_maintenance':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
      case 'cooking_hygiene':
        return 'bg-orange-50 text-orange-800 border-orange-200/60';
      case 'child_safety':
        return 'bg-amber-50 text-amber-800 border-amber-200/60';
      case 'elder_care':
        return 'bg-sky-50 text-sky-800 border-sky-200/60';
      case 'driver':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/60';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home_maintenance':
        return <Home className="w-3.5 h-3.5" />;
      case 'cooking_hygiene':
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
      case 'child_safety':
        return <Baby className="w-3.5 h-3.5" />;
      case 'elder_care':
        return <HeartHandshake className="w-3.5 h-3.5" />;
      case 'driver':
        return <Car className="w-3.5 h-3.5" />;
      default:
        return <Tag className="w-3.5 h-3.5" />;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section id="care-tips" className="py-10 sm:py-14 bg-white border-y border-gray-100 scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Expert Care Tips & Knowledge Hub
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2723] tracking-tight">
            Guides for Cooks, Cleaners, Nannies, Senior Care & Drivers
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5A53] leading-relaxed">
            Practical, expert-reviewed advice to help you maintain a spotless home, manage kitchen hygiene, ensure child safety, care for elders, and hire dependable personal chauffeurs.
          </p>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              All Articles ({BLOG_POSTS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('cooking_hygiene')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedCategory === 'cooking_hygiene'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Cook & Food Safety
            </button>
            <button
              onClick={() => setSelectedCategory('home_maintenance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedCategory === 'home_maintenance'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Home Cleaning
            </button>
            <button
              onClick={() => setSelectedCategory('child_safety')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedCategory === 'child_safety'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <Baby className="w-3.5 h-3.5" /> Child Safety
            </button>
            <button
              onClick={() => setSelectedCategory('elder_care')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedCategory === 'elder_care'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" /> Elderly Care
            </button>
            <button
              onClick={() => setSelectedCategory('driver')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedCategory === 'driver'
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Driver & Car Care
            </button>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search care guides & topics..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2A5A43] focus:bg-white transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#FAF9F5] p-1 rounded-xl border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                title="Swipeable Carousel View"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
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
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#2A5A43] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Articles List / Carousel */}
        {filteredPosts.length > 0 ? (
          viewMode === 'carousel' ? (
            <TouchHorizontalScroll
              hintText="Touch & swipe horizontally to explore care guides"
              itemClassName="w-[88vw] sm:w-[350px] md:w-[380px] shrink-0 snap-center sm:snap-start h-auto"
            >
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group bg-[#FAF9F5] rounded-3xl border border-gray-200/80 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
                >
                  <div>
                    {/* Article Thumbnail Image */}
                    <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                        decoding="async"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 shadow-xs ${getCategoryBadgeStyle(post.category)}`}>
                          {getCategoryIcon(post.category)}
                          {post.categoryLabel}
                        </span>
                      </div>
                      {post.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#D96C4E] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-200" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Article Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                        <span>•</span>
                        <span>{post.publishDate}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1C2723] group-hover:text-[#2A5A43] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#4A5A53] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Article Footer & Author */}
                  <div className="px-6 pb-6 pt-2 border-t border-gray-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80';
                        }}
                        className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#1C2723]">{post.author.name}</div>
                        <div className="text-[10px] text-gray-400">{post.author.role}</div>
                      </div>
                    </div>

                    <span className="p-2 rounded-xl bg-white text-[#2A5A43] group-hover:bg-[#2A5A43] group-hover:text-white transition-colors border border-gray-200 shadow-xs">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              ))}
            </TouchHorizontalScroll>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group bg-[#FAF9F5] rounded-3xl border border-gray-200/80 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    {/* Article Thumbnail Image */}
                    <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                        decoding="async"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 shadow-xs ${getCategoryBadgeStyle(post.category)}`}>
                          {getCategoryIcon(post.category)}
                          {post.categoryLabel}
                        </span>
                      </div>
                      {post.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#D96C4E] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-200" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Article Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                        <span>•</span>
                        <span>{post.publishDate}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1C2723] group-hover:text-[#2A5A43] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#4A5A53] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Article Footer & Author */}
                  <div className="px-6 pb-6 pt-2 border-t border-gray-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80';
                        }}
                        className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#1C2723]">{post.author.name}</div>
                        <div className="text-[10px] text-gray-400">{post.author.role}</div>
                      </div>
                    </div>

                    <span className="p-2 rounded-xl bg-white text-[#2A5A43] group-hover:bg-[#2A5A43] group-hover:text-white transition-colors border border-gray-200 shadow-xs">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="p-12 text-center bg-[#FAF9F5] rounded-3xl border border-gray-200 max-w-md mx-auto space-y-3">
            <BookOpen className="w-8 h-8 mx-auto text-gray-400" />
            <h4 className="font-serif font-bold text-lg text-[#1C2723]">No Care Guides Found</h4>
            <p className="text-xs text-gray-500">We couldn't find any articles matching "{searchQuery}". Try selecting a different category or clearing your search.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#2A5A43] text-white text-xs font-bold"
            >
              Reset Article Filters
            </button>
          </div>
        )}

        {/* CTA Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#1C2723] to-[#2A5A43] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Caregiver Assistance
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Need Experienced Staff to Implement These Care Routines?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Book trained house maids, certified nannies, or compassionate senior attendants with complete 100% verified staff dossiers and replacement guarantees.
            </p>
          </div>
          <button
            onClick={() => onOpenBookingModal()}
            className="px-6 py-3.5 rounded-full bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Hire Verified Care Assistant</span>
          </button>
        </div>

      </div>

      {/* FULL ARTICLE READ MODAL / DRAWER */}
      {activePost && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 text-left relative my-auto">
            
            {/* Modal Sticky Close Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getCategoryBadgeStyle(activePost.category)}`}>
                {getCategoryIcon(activePost.category)}
                {activePost.categoryLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#1C2723] transition-colors relative"
                  title="Share Article Link"
                  aria-label="Share Article"
                >
                  {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                  {copiedLink && (
                    <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#1C2723] transition-colors"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-100">
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-3 text-xs text-gray-200 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activePost.readTime}</span>
                  <span>•</span>
                  <span>Published {activePost.publishDate}</span>
                </div>
                <h1 id="article-modal-title" className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  {activePost.title}
                </h1>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Author Info Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200/80">
                <div className="flex items-center gap-3">
                  <img
                    src={activePost.author.avatar}
                    alt={activePost.author.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80';
                    }}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <div className="font-bold text-[#1C2723] text-sm">{activePost.author.name}</div>
                    <div className="text-xs text-[#2A5A43] font-medium">{activePost.author.role}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 hidden sm:inline-block">
                  Verified Care Expert
                </span>
              </div>

              {/* Introduction */}
              <div className="text-sm text-[#1C2723] leading-relaxed font-medium bg-[#FAF9F5] p-5 rounded-2xl border-l-4 border-[#2A5A43]">
                {activePost.content.introduction}
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {activePost.content.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="font-serif text-lg font-bold text-[#1C2723]">
                      {sec.heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4A5A53] leading-relaxed">
                      {sec.body}
                    </p>
                    {sec.bullets && (
                      <ul className="space-y-2 pt-1">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#1C2723]">
                            <CheckCircle2 className="w-4 h-4 text-[#2A5A43] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#2A5A43]/20 space-y-3">
                <h3 className="font-serif font-bold text-base text-[#2A5A43] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D96C4E]" /> Key Takeaways for Households
                </h3>
                <ul className="space-y-2">
                  {activePost.content.takeaways.map((tk, tkIdx) => (
                    <li key={tkIdx} className="text-xs sm:text-sm text-[#4A5A53] flex items-start gap-2">
                      <span className="text-[#D96C4E] font-bold">•</span>
                      <span>{tk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Footer CTA */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Looking for trusted domestic help in your city?
                </div>
                <button
                  onClick={() => {
                    const category = activePost.category === 'cooking_hygiene'
                      ? 'cook_chef'
                      : activePost.category === 'child_safety'
                      ? 'babysitter'
                      : activePost.category === 'elder_care'
                      ? 'elderly_care'
                      : activePost.category === 'driver'
                      ? 'driver'
                      : 'house_cleaning';
                    setActivePost(null);
                    onOpenBookingModal(category);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Request Staff Profile</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Structured Data (JSON-LD) for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Maid for Ghar Expert Care Tips",
          "description": "Guides and expert articles on domestic help management, child safety, senior care, and home hygiene.",
          "blogPost": BLOG_POSTS.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": "2026-07-01",
            "author": {
              "@type": "Person",
              "name": post.author.name,
              "jobTitle": post.author.role
            },
            "image": post.coverImage
          }))
        })}
      </script>

    </section>
  );
};
