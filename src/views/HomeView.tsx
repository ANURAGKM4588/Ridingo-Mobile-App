import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Star, 
  MapPin, 
  RotateCcw, 
  ChevronRight, 
  Car, 
  Plane, 
  Clock, 
  Wallet, 
  Calendar, 
  Headphones, 
  Globe, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { Booking, ServiceItem, VehicleOption } from '../types';
import { MOCK_BOOKINGS, MOCK_VEHICLES, PROMOTIONS, FEATURED_DRIVER } from '../data/mockData';
import { QuickBookingWidget } from '../components/QuickBookingWidget';
import { PromotionsCarousel } from '../components/PromotionsCarousel';
import { BrandReviews } from '../components/BrandReviews';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { LanguageCode, TRANSLATIONS } from '../data/translations';
import { RegionCode, formatPrice } from '../data/currencies';

interface HomeViewProps {
  onSelectService?: (service: ServiceItem) => void;
  onSelectVehicle: (vehicle: VehicleOption) => void;
  selectedVehicle: VehicleOption;
  onStartBooking: (params: any) => void;
  onOpenDriverProfile: (driver: any) => void;
  recentBookings?: Booking[];
  recentBooking?: Booking;
  onViewAllBookings?: () => void;
  onRepeatBooking?: (booking: Booking) => void;
  onNavigateTab?: (tab: 'home' | 'bookings' | 'activity' | 'wallet' | 'profile') => void;
  onOpenWallet?: () => void;
  onOpenSupport?: () => void;
  onOpenLanguage?: () => void;
  currentLanguage?: LanguageCode;
  currentRegion?: RegionCode;
  userName?: string;
}

interface InAppSearchItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  category: 'Service' | 'Vehicle' | 'Location' | 'Feature' | 'Offer';
  icon: any;
  keywords: string[];
  action: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectService,
  onSelectVehicle,
  selectedVehicle,
  onStartBooking,
  onOpenDriverProfile,
  recentBookings,
  recentBooking,
  onViewAllBookings,
  onRepeatBooking,
  onNavigateTab,
  onOpenWallet,
  onOpenSupport,
  onOpenLanguage,
  currentLanguage = 'en-us',
  currentRegion = 'in',
  userName = 'Alexander Vance',
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en-us'];
  const firstName = userName ? userName.trim().split(' ')[0] : 'Alexander';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const recentBookingList = (recentBookings && recentBookings.length > 0) ? recentBookings : MOCK_BOOKINGS;

  // In-App Search Index Database
  const searchIndex: InAppSearchItem[] = useMemo(() => [
    // 1. Services
    {
      id: 'srv-hourly',
      title: 'Hourly Chauffeur Service',
      subtitle: 'Dedicated luxury driver with flexible hourly duration',
      path: 'Home ➔ Services ➔ Hourly Chauffeur',
      category: 'Service',
      icon: Clock,
      keywords: ['hourly', 'driver', 'chauffeur', 'car', 'hours', 'book', 'rent', 'time'],
      action: () => {
        if (onSelectService) {
          onSelectService({ id: 'hourly-driver', title: 'Hourly Driver', subtitle: 'Dedicated personal driver', priceStarting: '$50', iconName: 'Clock', category: 'hourly' });
        }
      }
    },
    {
      id: 'srv-airport',
      title: 'Airport Transfer & Pickup',
      subtitle: 'Flight tracking, terminal meet & greet, luggage assistance',
      path: 'Home ➔ Services ➔ Airport Chauffeur',
      category: 'Service',
      icon: Plane,
      keywords: ['airport', 'flight', 'terminal', 'lax', 'drop', 'pickup', 'plane', 'airline'],
      action: () => {
        if (onSelectService) {
          onSelectService({ id: 'airport-pickup', title: 'Airport Transfer', subtitle: 'Flight tracking meet & greet', priceStarting: '$65', iconName: 'Plane', category: 'special' });
        }
      }
    },
    {
      id: 'srv-wedding',
      title: 'Luxury Wedding & Event Chauffeur',
      subtitle: 'Decorated premium fleet for weddings, VIPgalas and VIP guests',
      path: 'Home ➔ Services ➔ Wedding & Event Fleet',
      category: 'Service',
      icon: Sparkles,
      keywords: ['wedding', 'event', 'vip', 'gala', 'party', 'marriage', 'function'],
      action: () => {
        onStartBooking({ serviceType: 'Hourly', tripCause: 'Wedding & VIP Event', durationHours: 6 });
      }
    },

    // 2. Luxury Vehicles
    {
      id: 'veh-rolls',
      title: 'Rolls-Royce Ghost (Extended)',
      subtitle: 'Ultra-luxury flagship with rear starlight headliner & champagne chiller',
      path: 'Services ➔ Luxury Fleet ➔ Rolls-Royce Ghost',
      category: 'Vehicle',
      icon: Car,
      keywords: ['rolls', 'royce', 'ghost', 'ultra', 'luxury', 'limo', 'prestige'],
      action: () => {
        const v = MOCK_VEHICLES.find(x => x.id === 'rolls-royce') || MOCK_VEHICLES[2];
        if (v) onSelectVehicle(v);
      }
    },
    {
      id: 'veh-mercedes',
      title: 'Mercedes-Benz S-Class (Maybach Trim)',
      subtitle: 'Executive luxury sedan with massage reclining seats',
      path: 'Services ➔ Executive Fleet ➔ Mercedes S-Class',
      category: 'Vehicle',
      icon: Car,
      keywords: ['mercedes', 'benz', 's-class', 'sclass', 'maybach', 'sedan', 'german'],
      action: () => {
        const v = MOCK_VEHICLES.find(x => x.id === 'mercedes-s') || MOCK_VEHICLES[0];
        if (v) onSelectVehicle(v);
      }
    },
    {
      id: 'veh-bmw',
      title: 'BMW 7 Series (VIP Executive)',
      subtitle: 'Theatre screen 31-inch display with Bowers & Wilkins audio',
      path: 'Services ➔ VIP Fleet ➔ BMW 7 Series',
      category: 'Vehicle',
      icon: Car,
      keywords: ['bmw', '7 series', '740i', '760i', 'theatre', 'vip', 'sedan'],
      action: () => {
        const v = MOCK_VEHICLES.find(x => x.id === 'bmw-7') || MOCK_VEHICLES[1];
        if (v) onSelectVehicle(v);
      }
    },
    {
      id: 'veh-suv',
      title: 'Cadillac Escalade (Luxury SUV)',
      subtitle: 'Full-size luxury SUV with captain chairs & large luggage room',
      path: 'Services ➔ SUV Fleet ➔ Cadillac Escalade',
      category: 'Vehicle',
      icon: Car,
      keywords: ['suv', 'cadillac', 'escalade', 'large', 'group', '7 seater', 'luggage'],
      action: () => {
        const v = MOCK_VEHICLES.find(x => x.id === 'escalade') || MOCK_VEHICLES[3] || MOCK_VEHICLES[0];
        if (v) onSelectVehicle(v);
      }
    },

    // 3. Destinations & Locations
    {
      id: 'loc-lax',
      title: 'LAX Airport Terminal 4 & Tom Bradley',
      subtitle: 'World Way, Los Angeles, CA 90045',
      path: 'Destinations ➔ California ➔ LAX International Airport',
      category: 'Location',
      icon: MapPin,
      keywords: ['lax', 'airport', 'terminal', 'tom bradley', 'los angeles', 'destination', 'flight'],
      action: () => {
        onStartBooking({ serviceType: 'Airport', destination: 'LAX Airport Terminal 4', flightNumber: 'AI-202' });
      }
    },
    {
      id: 'loc-hyatt',
      title: 'Grand Hyatt & Financial District',
      subtitle: 'Grand Ave & 5th Street, Downtown Center',
      path: 'Destinations ➔ Los Angeles ➔ Financial District',
      category: 'Location',
      icon: MapPin,
      keywords: ['hyatt', 'grand hyatt', 'hotel', 'financial', 'district', 'downtown', 'office'],
      action: () => {
        onStartBooking({ serviceType: 'Hourly', destination: 'Financial District & Grand Hyatt' });
      }
    },
    {
      id: 'loc-beverly',
      title: '742 Evergreen Terrace (Beverly Hills)',
      subtitle: 'Beverly Hills, CA 90210 (Saved Home)',
      path: 'Saved Locations ➔ Residence ➔ Beverly Hills',
      category: 'Location',
      icon: MapPin,
      keywords: ['beverly', 'hills', 'evergreen', 'home', 'residence', 'address'],
      action: () => {
        onStartBooking({ serviceType: 'Hourly', pickup: '742 Evergreen Terrace, Beverly Hills' });
      }
    },
    {
      id: 'loc-hangar',
      title: 'Van Nuys Private Airport Hangar 4B',
      subtitle: '16461 Sherman Way, Van Nuys, CA',
      path: 'Destinations ➔ Private Aviation ➔ Van Nuys Hangar',
      category: 'Location',
      icon: Plane,
      keywords: ['van nuys', 'hangar', 'private jet', 'charter', 'aviation'],
      action: () => {
        onStartBooking({ serviceType: 'Airport', destination: 'Van Nuys Airport Hangar 4B' });
      }
    },

    // 4. App Features & Tabs
    {
      id: 'feat-wallet',
      title: 'Wallet & Payment Methods',
      subtitle: 'UPI, Razorpay, Saved Credit Cards & Invoices',
      path: 'App ➔ Account ➔ Payment Methods & Wallet',
      category: 'Feature',
      icon: Wallet,
      keywords: ['wallet', 'payment', 'card', 'upi', 'razorpay', 'money', 'balance', 'credit'],
      action: () => {
        if (onOpenWallet) onOpenWallet();
        else if (onNavigateTab) onNavigateTab('wallet');
      }
    },
    {
      id: 'feat-bookings',
      title: 'Booking History & Tax Invoices',
      subtitle: 'Review past chauffeur rides, download bills and receipts',
      path: 'App ➔ History ➔ All Trips & Invoices',
      category: 'Feature',
      icon: Calendar,
      keywords: ['booking', 'history', 'trip', 'invoice', 'bill', 'receipt', 'past', 'tax'],
      action: () => {
        if (onViewAllBookings) onViewAllBookings();
        else if (onNavigateTab) onNavigateTab('bookings');
      }
    },
    {
      id: 'feat-tracking',
      title: 'Live Chauffeur GPS Tracking',
      subtitle: 'Real-time telemetry, driver location and ETA',
      path: 'App ➔ Activity ➔ Live Chauffeur GPS',
      category: 'Feature',
      icon: Compass,
      keywords: ['tracking', 'gps', 'live', 'map', 'driver', 'telemetry', 'eta', 'status'],
      action: () => {
        if (onNavigateTab) onNavigateTab('activity');
      }
    },
    {
      id: 'feat-support',
      title: '24/7 Safety Desk & Customer Support',
      subtitle: 'Instant live agent chat & SOS emergency line',
      path: 'App ➔ Support ➔ 24/7 Safety Desk',
      category: 'Feature',
      icon: Headphones,
      keywords: ['support', 'help', 'safety', 'desk', 'sos', 'chat', 'contact', 'call', 'agent'],
      action: () => {
        if (onOpenSupport) onOpenSupport();
      }
    },
    {
      id: 'feat-language',
      title: 'Language & Currency Settings',
      subtitle: 'Switch English, Malayalam, Hindi, USD, INR, EUR',
      path: 'App ➔ Settings ➔ Language & Currency',
      category: 'Feature',
      icon: Globe,
      keywords: ['language', 'currency', 'settings', 'region', 'malayalam', 'hindi', 'inr', 'usd'],
      action: () => {
        if (onOpenLanguage) onOpenLanguage();
      }
    },

    // 5. Offers & Promotions
    {
      id: 'off-first30',
      title: 'Promo Code: FIRST30 (30% OFF)',
      subtitle: 'Save 30% on your next luxury airport or hourly drive',
      path: 'Offers ➔ Promo Codes ➔ FIRST30',
      category: 'Offer',
      icon: Sparkles,
      keywords: ['promo', 'discount', 'first30', 'offer', 'coupon', 'code', 'save', '30%'],
      action: () => {
        alert('Applied promo code FIRST30! 30% discount applied to your booking.');
        onStartBooking({ serviceType: 'Hourly', promoCode: 'FIRST30' });
      }
    },
  ], [onSelectService, onSelectVehicle, onStartBooking, onOpenWallet, onOpenSupport, onOpenLanguage, onNavigateTab, onViewAllBookings]);

  // Filtered live results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return searchIndex.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle.toLowerCase().includes(q);
      const matchPath = item.path.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some(k => k.includes(q) || q.includes(k));
      return matchTitle || matchSub || matchPath || matchCat || matchKeywords;
    });
  }, [searchQuery, searchIndex]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (item: InAppSearchItem) => {
    item.action();
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const quickFilterTags = [
    { label: 'Airport', query: 'Airport' },
    { label: 'Mercedes', query: 'Mercedes' },
    { label: 'Rolls-Royce', query: 'Rolls' },
    { label: 'Wallet', query: 'Wallet' },
    { label: 'Invoice', query: 'Invoice' },
    { label: 'Beverly Hills', query: 'Beverly' },
  ];

  return (
    <div className="w-full animate-fade-in animate-scale-up transition-all duration-500 pb-4">

      {/* Greeting — 2-line clean typography matching reference design */}
      <div className="-mx-4 px-5 pt-2 pb-3 bg-white animate-drop-up stagger-1">
        <h1 className="text-[26px] sm:text-[28px] font-medium text-slate-900 leading-[1.15] tracking-tight">
          <span className="block">Good</span>
          <span className="block">afternoon, {firstName} 💪</span>
        </h1>
      </div>

      {/* ── INTERACTIVE FUNCTIONAL SEARCH BAR WITH LIVE DROPDOWN & FULL PATHS ── */}
      <div 
        ref={searchContainerRef}
        className="sticky top-0 z-40 bg-white -mx-4 px-4 py-2.5 border-b border-slate-200 shadow-sm animate-drop-up stagger-2"
      >
        <div className="relative w-full">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10">
            <Search className="w-4 h-4 text-[#fcd502]" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder={t.searchPlaceholder || "Search services, cars, locations, wallet..."}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#fcd502] focus:bg-white transition-all text-xs shadow-2xs"
          />

          {/* Clear Query Button */}
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              className="absolute inset-y-0 right-2.5 flex items-center justify-center w-6 h-6 my-auto rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              LIVE SEARCH DROPDOWN MENU WITH FULL PATH BREADCRUMBS
             ═══════════════════════════════════════════════════════════════ */}
          {(isSearchFocused || searchQuery.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-drop-up divide-y divide-slate-100 max-h-[380px] flex flex-col">
              
              {/* Dropdown Header Bar */}
              <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#a18200]" />
                  <span className="text-[11px] font-black text-slate-900 tracking-tight">
                    {searchQuery ? `Matching Results (${searchResults.length})` : 'Popular In-App Suggestions'}
                  </span>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Scrollable Results List */}
              <div className="overflow-y-auto p-2 space-y-1 scrollbar-none flex-1">
                {searchQuery.trim().length > 0 ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectResult(item)}
                          className="w-full p-2.5 rounded-2xl hover:bg-slate-100 flex items-start gap-3 text-left transition-colors cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-slate-900 group-hover:bg-[#fcd502] text-[#fcd502] group-hover:text-[#121212] flex items-center justify-center flex-shrink-0 transition-colors shadow-2xs mt-0.5">
                            <IconComponent className="w-4 h-4 stroke-[2.2]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900 group-hover:text-black block truncate">
                                {item.title}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider flex-shrink-0 ${
                                item.category === 'Service' ? 'bg-amber-100 text-amber-800' :
                                item.category === 'Vehicle' ? 'bg-blue-100 text-blue-800' :
                                item.category === 'Location' ? 'bg-purple-100 text-purple-800' :
                                item.category === 'Offer' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {item.category}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {item.subtitle}
                            </p>

                            {/* ── FULL PATH BREADCRUMB IN RESULT ── */}
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#a18200] bg-[#fcd502]/10 px-2 py-0.5 rounded-md w-fit">
                              <span className="truncate">{item.path}</span>
                              <ArrowRight className="w-2.5 h-2.5 flex-shrink-0 stroke-[2.5]" />
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center px-4 space-y-1.5">
                      <Search className="w-6 h-6 text-slate-300 mx-auto" />
                      <p className="text-xs font-black text-slate-800">No results found for "{searchQuery}"</p>
                      <p className="text-[11px] text-slate-400 font-medium">Try searching for Airport, Mercedes, Wallet, or Beverly Hills</p>
                    </div>
                  )
                ) : (
                  // Quick suggestion chips when search bar is focused but query is empty
                  <div className="p-2 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                        Quick Keywords
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickFilterTags.map((tag) => (
                          <button
                            key={tag.label}
                            type="button"
                            onClick={() => setSearchQuery(tag.query)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#fcd502]/20 hover:text-slate-900 text-slate-700 font-bold text-[11px] border border-slate-200/80 transition-colors cursor-pointer"
                          >
                            #{tag.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
                        Top App Destinations
                      </span>
                      {searchIndex.slice(0, 4).map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectResult(item)}
                            className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <IconComponent className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="font-bold text-slate-800 truncate">{item.title}</span>
                            </div>
                            <span className="text-[9px] font-bold text-[#a18200] flex-shrink-0 pl-2">
                              {item.category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ─── */}
      <div className="space-y-4 pt-4">
        {/* Quick Booking Floating Widget */}
        <div className="animate-drop-up stagger-3">
          <QuickBookingWidget
            onStartBooking={onStartBooking}
            vehicles={MOCK_VEHICLES}
            selectedVehicle={selectedVehicle}
            onOpenVehicleModal={() => { }}
            currentLanguage={currentLanguage}
          />
        </div>

        {/* Horizontal Scrollable Recent Bookings Section */}
        {recentBookingList.length > 0 && (
          <div className="space-y-3 animate-drop-up stagger-4">
            <div className="flex items-center justify-between px-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fcd502] animate-pulse flex-shrink-0" />
                <h3 className="font-extrabold text-sm text-slate-900">Recent Bookings</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black">
                  {recentBookingList.length}
                </span>
              </div>

              {onViewAllBookings && (
                <button
                  onClick={onViewAllBookings}
                  className="text-[11px] font-bold text-[#a18200] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Horizontal Scroll Track */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5 snap-x snap-mandatory -mx-4 px-4 scroll-pl-4">
              {recentBookingList.map((booking) => (
                <div
                  key={booking.id}
                  className="w-[285px] sm:w-[320px] flex-shrink-0 snap-start bg-white rounded-3xl p-4 border border-slate-200/90 shadow-md space-y-2.5 relative overflow-hidden transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono text-[10px] font-extrabold text-slate-400">
                      #{booking.bookingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black uppercase">
                      {booking.date}
                    </span>
                  </div>

                  <h4 className="font-black text-xs text-slate-900 truncate">
                    {booking.serviceTitle}
                  </h4>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#fcd502] fill-[#fcd502]/25 stroke-[2] flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-800 truncate text-[11px]">{booking.pickupLocation}</span>
                    </div>
                    <div className="flex items-start gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-900 fill-slate-900/20 stroke-[2] flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-800 truncate text-[11px]">{booking.destinationLocation}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900">${booking.priceTotal.toFixed(2)}</span>

                    {onRepeatBooking && (
                      <button
                        onClick={() => onRepeatBooking(booking)}
                        className="px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-black text-[#fcd502] font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                        <span>Repeat</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spotlight Master Chauffeur */}
        <div className="glass-card rounded-3xl p-4 border border-slate-200 bg-gradient-to-r from-slate-900 via-zinc-900 to-[#121212] text-white shadow-xl relative overflow-hidden group animate-drop-up stagger-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#fcd502] text-[#121212] text-[10px] font-black uppercase tracking-wider">
              Spotlight Chauffeur
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" /> {FEATURED_DRIVER.rating} (384)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={FEATURED_DRIVER.photo}
              alt={FEATURED_DRIVER.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#fcd502] shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm text-white truncate">{FEATURED_DRIVER.name}</h4>
              <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                {FEATURED_DRIVER.yearsExperience} Yrs Exp • Uniformed • Certified
              </p>
              <button
                onClick={() => onOpenDriverProfile(FEATURED_DRIVER)}
                className="mt-1.5 text-[11px] text-[#fcd502] font-bold hover:underline flex items-center gap-1"
              >
                View Chauffeur Profile →
              </button>
            </div>
          </div>
        </div>

        {/* Promotions Carousel */}
        <div className="animate-drop-up stagger-6">
          <PromotionsCarousel
            promotions={PROMOTIONS}
            onClaimPromotion={(promo) => {
              alert(`Applied promo code ${promo.code} to your next booking!`);
            }}
          />
        </div>

        {/* Verified User Reviews & Rating Badges */}
        <div className="animate-drop-up stagger-6">
          <BrandReviews />
        </div>

        {/* Why Choose Us */}
        <div className="animate-drop-up stagger-6">
          <WhyChooseUs />
        </div>
      </div>
    </div>
  );
};
