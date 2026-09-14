import React, { useState, useRef, useEffect } from 'react';
import { Plane, Building2, Calendar, Clock, ChevronDown, Sparkles, Loader2, X, Navigation, ArrowUpDown } from 'lucide-react';
import { VehicleOption } from '../types';
import { LanguageCode, TRANSLATIONS } from '../data/translations';

export interface LocationSuggestion {
  displayName: string;
  shortName: string;
  lat: number;
  lng: number;
  type: string;
  city?: string;
}

const SEED_SUGGESTIONS: LocationSuggestion[] = [
  { displayName: 'Kerala, India', shortName: 'Kerala State, India', lat: 10.8505, lng: 76.2711, type: 'city', city: 'Kerala' },
  { displayName: 'Kochi (Cochin), Kerala', shortName: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673, type: 'city', city: 'Kochi' },
  { displayName: 'Trivandrum International Airport (TRV), Kerala', shortName: 'Trivandrum Airport, Kerala', lat: 8.4821, lng: 76.9200, type: 'airport', city: 'Thiruvananthapuram' },
  { displayName: 'Cochin International Airport (COK), Kerala', shortName: 'Cochin Airport (COK), Nedumbassery', lat: 10.1520, lng: 76.4019, type: 'airport', city: 'Kochi' },
  { displayName: 'Calicut International Airport (CCJ), Kozhikode', shortName: 'Calicut Airport, Kozhikode', lat: 11.1368, lng: 75.9553, type: 'airport', city: 'Kozhikode' },
  { displayName: 'Indira Gandhi International Airport (DEL)', shortName: 'IGI Airport, Delhi', lat: 28.5562, lng: 77.1000, type: 'airport', city: 'New Delhi' },
  { displayName: 'Chhatrapati Shivaji Maharaj Intl Airport (BOM)', shortName: 'Mumbai Airport', lat: 19.0896, lng: 72.8656, type: 'airport', city: 'Mumbai' },
  { displayName: 'Kempegowda International Airport (BLR)', shortName: 'Bengaluru Airport', lat: 13.1986, lng: 77.7066, type: 'airport', city: 'Bengaluru' },
  { displayName: 'Chennai International Airport (MAA)', shortName: 'Chennai Airport', lat: 12.9941, lng: 80.1709, type: 'airport', city: 'Chennai' },
  { displayName: 'Connaught Place, New Delhi', shortName: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, type: 'commercial', city: 'New Delhi' },
  { displayName: 'Bandra Kurla Complex, Mumbai', shortName: 'BKC, Mumbai', lat: 19.0596, lng: 72.8656, type: 'commercial', city: 'Mumbai' },
  { displayName: 'All India Institute of Medical Sciences (AIIMS)', shortName: 'AIIMS, New Delhi', lat: 28.5672, lng: 77.2100, type: 'hospital', city: 'New Delhi' },
];

const TRIP_PURPOSES = [
  { id: 'wedding', label: 'Wedding function', emoji: '💒' },
  { id: 'family', label: 'Family tour', emoji: '👨‍👩‍👧‍👦' },
  { id: 'office_drop', label: 'Office Drop / Pick', emoji: '🏢' },
  { id: 'office_trip', label: 'Office trip / Corporate', emoji: '💼' },
  { id: 'hospital', label: 'Hospital Visit', emoji: '🏥' },
];

interface QuickBookingWidgetProps {
  onStartBooking: (params: {
    pickup: string;
    destination: string;
    pickupLatLng?: { lat: number; lng: number };
    destinationLatLng?: { lat: number; lng: number };
    date: string;
    time: string;
    durationHours: number;
    vehicleId: string;
    flightNumber?: string;
    airlineName?: string;
    serviceType?: string;
    tripCause?: string;
  }) => void;
  vehicles: VehicleOption[];
  selectedVehicle: VehicleOption;
  onOpenVehicleModal: () => void;
  currentLanguage?: LanguageCode;
}

export const QuickBookingWidget: React.FC<QuickBookingWidgetProps> = ({
  onStartBooking,
  selectedVehicle,
  currentLanguage = 'en-us',
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en-us'];
  const [selectedServiceTab, setSelectedServiceTab] = useState<'Hourly' | 'Airport' | 'Other'>('Hourly');
  const [pickup, setPickup] = useState('');
  const [pickupLatLng, setPickupLatLng] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [destination, setDestination] = useState('');
  const [destinationLatLng, setDestinationLatLng] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [flightNumber, setFlightNumber] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [tripCause, setTripCause] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:30');
  const [durationHours, setDurationHours] = useState(4);

  // Autocomplete dropdown state
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setActiveInput(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapLocations = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const tempPickup = pickup;
    const tempPickupLatLng = pickupLatLng;
    setPickup(destination);
    setPickupLatLng(destinationLatLng);
    setDestination(tempPickup);
    setDestinationLatLng(tempPickupLatLng);
  };

  const searchLocations = (query: string, field: 'from' | 'to') => {
    setActiveInput(field);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions(SEED_SUGGESTIONS.slice(0, 6));
      setIsLoading(false);
      return;
    }

    const seedMatches = SEED_SUGGESTIONS.filter(
      (s) =>
        s.displayName.toLowerCase().includes(query.toLowerCase()) ||
        s.shortName.toLowerCase().includes(query.toLowerCase()) ||
        s.city?.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(seedMatches);
    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1&accept-language=en`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        if (res.ok) {
          const data = await res.json();
          const fetched: LocationSuggestion[] = data.map((item: any) => ({
            displayName: item.display_name,
            shortName: item.display_name.split(',').slice(0, 2).join(',').trim(),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type || 'city',
            city: item.address?.city || item.address?.town || item.address?.state || '',
          }));
          setSuggestions((prev) => {
            const combined = [...seedMatches];
            for (const item of fetched) {
              if (!combined.some((c) => Math.abs(c.lat - item.lat) < 0.001)) {
                combined.push(item);
              }
            }
            return combined.slice(0, 8);
          });
        }
      } catch (err) {
        console.warn('Location search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);
  };

  const handleSelectSuggestion = (s: LocationSuggestion, field: 'from' | 'to') => {
    if (field === 'from') {
      setPickup(s.shortName);
      setPickupLatLng({ lat: s.lat, lng: s.lng });
    } else {
      setDestination(s.shortName);
      setDestinationLatLng({ lat: s.lat, lng: s.lng });
    }
    setActiveInput(null);
  };

  const handleDetectGPS = async (field: 'from' | 'to') => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      const fallback: LocationSuggestion = SEED_SUGGESTIONS[0];
      if (field === 'from') {
        setPickup(fallback.shortName);
        setPickupLatLng({ lat: fallback.lat, lng: fallback.lng });
      } else {
        setDestination(fallback.shortName);
        setDestinationLatLng({ lat: fallback.lat, lng: fallback.lng });
      }
      setIsLocating(false);
      setActiveInput(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
          if (res.ok) {
            const data = await res.json();
            const shortName = data.display_name ? data.display_name.split(',').slice(0, 2).join(',').trim() : 'Current Location';
            if (field === 'from') {
              setPickup(shortName);
              setPickupLatLng({ lat, lng });
            } else {
              setDestination(shortName);
              setDestinationLatLng({ lat, lng });
            }
          }
        } catch {
          const name = `Current Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
          if (field === 'from') {
            setPickup(name);
            setPickupLatLng({ lat, lng });
          } else {
            setDestination(name);
            setDestinationLatLng({ lat, lng });
          }
        } finally {
          setIsLocating(false);
          setActiveInput(null);
        }
      },
      () => {
        const fallback = SEED_SUGGESTIONS[0];
        if (field === 'from') {
          setPickup(fallback.shortName);
          setPickupLatLng({ lat: fallback.lat, lng: fallback.lng });
        } else {
          setDestination(fallback.shortName);
          setDestinationLatLng({ lat: fallback.lat, lng: fallback.lng });
        }
        setIsLocating(false);
        setActiveInput(null);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBooking({
      pickup: selectedServiceTab === 'Airport' ? (flightNumber ? `Flight ${flightNumber}` : 'Airport Pickup') : pickup,
      destination: selectedServiceTab === 'Airport' ? (airlineName ? `Airline: ${airlineName}` : 'Airport Drop') : destination,
      pickupLatLng,
      destinationLatLng,
      date,
      time,
      durationHours,
      vehicleId: selectedVehicle.id,
      flightNumber,
      airlineName,
      serviceType: selectedServiceTab,
      tripCause: selectedServiceTab === 'Other' ? tripCause : undefined,
    });
  };

  // Reusable Suggestions Dropdown Renderer for each specific row
  const renderDropdown = (field: 'from' | 'to') => {
    if (activeInput !== field) return null;

    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-[#131926] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-white">
        <div className="max-h-56 overflow-y-auto">
          {/* Use Current GPS Location */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleDetectGPS(field);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-emerald-950/40 hover:bg-emerald-950/60 text-left transition-colors border-b border-emerald-500/20 cursor-pointer group"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
            ) : (
              <Navigation className="w-4 h-4 text-emerald-400 fill-emerald-400/30 stroke-[2.2] flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                {isLocating
                  ? 'Detecting current GPS location...'
                  : field === 'from'
                  ? 'Use Current Location as Pickup'
                  : 'Use Current Location as Destination'}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">Detect address using device GPS</p>
            </div>
          </button>

          {isLoading && (
            <div className="px-4 py-2 flex items-center gap-2 text-xs text-slate-400 font-medium bg-[#192233] border-b border-white/5">
              <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin flex-shrink-0" />
              <span>Searching places...</span>
            </div>
          )}

          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(s, field);
              }}
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors border-b border-white/5 last:border-0 cursor-pointer group"
            >
              <span className="text-sm flex-shrink-0 mt-0.5">
                {s.type === 'airport' ? '✈️' : s.type === 'hospital' ? '🏥' : '📍'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 group-hover:text-[#fcd502] transition-colors truncate">
                  {s.shortName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{s.displayName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#131926] text-white rounded-[28px] p-5 sm:p-6 relative overflow-visible z-20 border border-white/10 shadow-xl space-y-4" ref={widgetRef}>
      {/* 1. Ridingo Service Selection Tabs (Hourly, Airport, Other) */}
      <div className="p-1.5 bg-[#192233] rounded-2xl flex items-center gap-1 border border-white/5">
        {(['Hourly', 'Airport', 'Other'] as const).map((tab) => {
          const isActive = selectedServiceTab === tab;
          const label = tab === 'Hourly' ? t.tabHourly : tab === 'Airport' ? t.tabAirport : t.tabOther;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedServiceTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#0B0F19] text-[#fcd502] shadow-md border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dynamic Inputs based on Service Tab */}
        {selectedServiceTab === 'Airport' ? (
          /* ── AIRPORT MODE ── */
          <div className="relative pt-1">
            <div className="relative bg-[#192233] rounded-2xl divide-y divide-white/5 border border-white/5">
              
              {/* TOP ROW: FLIGHT NUMBER */}
              <div className="flex items-center gap-3.5 px-3 py-2.5">
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-[#fcd502]" strokeWidth={2.4} />
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Flight Number (e.g. AI-202)"
                    className="w-full text-[15px] sm:text-base font-medium text-white placeholder:text-slate-500 bg-transparent outline-none truncate"
                    required
                  />
                </div>

                {flightNumber && (
                  <button
                    type="button"
                    onClick={() => setFlightNumber('')}
                    className="text-slate-400 hover:text-white p-1 flex-shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* BOTTOM ROW: AIRLINE NAME */}
              <div className="flex items-center gap-3.5 px-3 py-2.5">
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-[#fcd502]" strokeWidth={2.4} />
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={airlineName}
                    onChange={(e) => setAirlineName(e.target.value)}
                    placeholder="Airline Name (e.g. Air India)"
                    className="w-full text-[15px] sm:text-base font-medium text-white placeholder:text-slate-500 bg-transparent outline-none truncate"
                    required
                  />
                </div>

                {airlineName && (
                  <button
                    type="button"
                    onClick={() => setAirlineName('')}
                    className="text-slate-400 hover:text-white p-1 flex-shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── 2. REFERENCE LOCATION SELECTION BOX & SWITCHING BUTTON STYLE ── */
          <div className="relative pt-1">
            <div className="relative bg-[#192233] rounded-2xl border border-white/5 p-1">
              
              {/* TOP ROW: FROM LOCATION */}
              <div className="relative">
                <div className="flex items-center gap-3.5 px-2 py-2">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded-full border-2 border-[#fcd502] bg-[#192233]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => {
                        setPickup(e.target.value);
                        searchLocations(e.target.value, 'from');
                      }}
                      onFocus={() => {
                        searchLocations(pickup, 'from');
                      }}
                      placeholder="From location"
                      className="w-full text-[15px] sm:text-base font-medium text-white placeholder:text-slate-500 bg-transparent outline-none truncate"
                    />
                  </div>

                  {pickup && (
                    <button
                      type="button"
                      onClick={() => {
                        setPickup('');
                        setPickupLatLng(undefined);
                      }}
                      className="text-slate-400 hover:text-white p-1 flex-shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {renderDropdown('from')}
              </div>

              {/* MIDDLE CONNECTOR: 3 Vertical Dots + Divider + Circular Swap Button */}
              <div className="relative flex items-center my-0.5 py-0.5 px-2">
                <div className="w-6 flex flex-col items-center justify-center gap-1 flex-shrink-0">
                  <span className="w-[3px] h-[3px] rounded-full bg-slate-600" />
                  <span className="w-[3px] h-[3px] rounded-full bg-slate-600" />
                  <span className="w-[3px] h-[3px] rounded-full bg-slate-600" />
                </div>

                <div className="flex-1 border-t border-white/10 mx-2" />

                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="group relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 transition-all duration-200 flex items-center justify-center border border-white/10 cursor-pointer"
                    title="Switch From and To locations"
                    aria-label="Switch Locations"
                  >
                    <ArrowUpDown className="w-4 h-4 text-[#fcd502] group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* BOTTOM ROW: TO LOCATION */}
              <div className="relative">
                <div className="flex items-center gap-3.5 px-2 py-2">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#fcd502]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        searchLocations(e.target.value, 'to');
                      }}
                      onFocus={() => {
                        searchLocations(destination, 'to');
                      }}
                      placeholder="To destination"
                      className="w-full text-[15px] sm:text-base font-medium text-white placeholder:text-slate-500 bg-transparent outline-none truncate"
                    />
                  </div>

                  {destination && (
                    <button
                      type="button"
                      onClick={() => {
                        setDestination('');
                        setDestinationLatLng(undefined);
                      }}
                      className="text-slate-400 hover:text-white p-1 flex-shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {renderDropdown('to')}
              </div>
            </div>

            {/* Cause of the Trip Dropdown (when 'Other' tab is selected) */}
            {selectedServiceTab === 'Other' && (
              <div className="mt-3 relative flex items-center bg-[#192233] rounded-2xl px-4 py-2.5 border border-white/10 shadow-xs focus-within:border-[#fcd502] transition-all">
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                    {t.tripCauseLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={tripCause}
                      onChange={(e) => setTripCause(e.target.value)}
                      className={`w-full text-xs bg-transparent appearance-none focus:outline-none pr-5 cursor-pointer truncate transition-all ${
                        !tripCause ? 'text-slate-500 font-medium' : 'text-white font-extrabold'
                      }`}
                    >
                      <option value="" disabled hidden className="bg-[#131926] text-white">
                        Select your cause
                      </option>
                      {TRIP_PURPOSES.map((p) => (
                        <option key={p.id} value={p.label} className="bg-[#131926] text-white font-bold">
                          {p.emoji} {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Ridingo Date & Time Selection Section */}
        <div className="space-y-3 pt-1">
          {/* Quick Date Presets */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setDate(new Date().toISOString().split('T')[0])}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                date === new Date().toISOString().split('T')[0]
                  ? 'bg-[#0B0F19] text-[#fcd502] border border-white/10 shadow-xs'
                  : 'bg-[#192233] hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDate(tomorrow.toISOString().split('T')[0]);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#192233] hover:bg-white/10 text-slate-300 border border-white/5 transition-all cursor-pointer flex-shrink-0 active:scale-95"
            >
              Tomorrow
            </button>

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#192233] hover:bg-white/10 text-[#fcd502] border border-white/5 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-[#fcd502]" />
              <span>Leave Now</span>
            </button>
          </div>

          {/* Date & Time Input Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Date Card */}
            <div className="relative bg-[#192233] hover:bg-[#1C2538] rounded-2xl p-3 border border-white/10 hover:border-[#fcd502] focus-within:border-[#fcd502] transition-all flex flex-col justify-between group">
              <label className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#fcd502]" />
                <span>Date</span>
              </label>
              <div className="relative mt-1 flex items-center justify-between">
                <span className="text-xs font-black text-white truncate">
                  {date || 'Select Date'}
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white pointer-events-none flex-shrink-0" />
              </div>
            </div>

            {/* Time Card */}
            <div className="relative bg-[#192233] hover:bg-[#1C2538] rounded-2xl p-3 border border-white/10 hover:border-[#fcd502] focus-within:border-[#fcd502] transition-all flex flex-col justify-between group">
              <label className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#fcd502]" />
                <span>Time</span>
              </label>
              <div className="relative mt-1 flex items-center justify-between">
                <span className="text-xs font-black text-white truncate">
                  {time || 'Select Time'}
                </span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white pointer-events-none flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Duration Selector (Hourly Mode Only) */}
          {selectedServiceTab === 'Hourly' && (
            <div className="bg-[#192233] rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#fcd502]" />
                <span className="text-xs font-black text-white">Duration: {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {[2, 4, 8, 12].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
                      durationHours === hrs
                        ? 'bg-[#fcd502] text-black shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/5'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Book a Driver CTA Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-[#fcd502] hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center shadow-xl shadow-[#fcd502]/20 transition-all border border-amber-300 cursor-pointer active:scale-[0.98] mt-2"
        >
          <span>{t.bookDriverBtn}</span>
        </button>
      </form>
    </div>
  );
};
