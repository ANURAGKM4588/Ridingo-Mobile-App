import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Clock, ArrowRight, Car, Shield, Plane, Building2, Plus, Minus, Sparkles, ChevronDown } from 'lucide-react';
import { VehicleOption } from '../types';
import { LanguageCode, TRANSLATIONS } from '../data/translations';

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
  onOpenVehicleModal,
  currentLanguage = 'en-us',
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en-us'];
  const [selectedServiceTab, setSelectedServiceTab] = useState<'Hourly' | 'Airport' | 'Other'>('Hourly');
  const [pickup, setPickup] = useState('742 Evergreen Terrace, Beverly Hills');
  const [destination, setDestination] = useState('LAX Airport Terminal 4');
  const [flightNumber, setFlightNumber] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [tripCause, setTripCause] = useState<string>('Wedding function');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:30');
  const [durationHours, setDurationHours] = useState(4);

  const handleServiceTabChange = (tab: 'Hourly' | 'Airport' | 'Other') => {
    setSelectedServiceTab(tab);
    if (tab === 'Airport') {
      setDestination('LAX International Airport (Terminals)');
    } else if (tab === 'Hourly') {
      setDestination('Hourly Chauffeur Service (Multiple Stops)');
    } else {
      setDestination('Custom Pickup & Drop Destination');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBooking({
      pickup: selectedServiceTab === 'Airport' ? (flightNumber ? `Flight ${flightNumber}` : 'Airport Pickup') : pickup,
      destination: selectedServiceTab === 'Airport' ? (airlineName ? `Airline: ${airlineName}` : 'Airport Terminal') : destination,
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

  return (
    <div className="w-full glass-card rounded-3xl p-4 sm:p-5 relative overflow-hidden border border-white/80 shadow-xl bg-gradient-to-br from-white via-[#FAFAFA] to-slate-50">
      {/* Header Accent */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#fcd502] animate-pulse flex-shrink-0"></span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 truncate">
            {t.widgetTitle}
          </span>
        </div>
      </div>

      {/* Dynamic Service Selection Tabs (Hourly, Airport, Other) */}
      <div className="mb-3.5 p-1 bg-slate-200/70 backdrop-blur-md rounded-2xl flex items-center gap-1 border border-slate-300/40 shadow-inner">
        {(['Hourly', 'Airport', 'Other'] as const).map((tab) => {
          const isActive = selectedServiceTab === tab;
          const label = tab === 'Hourly' ? t.tabHourly : tab === 'Airport' ? t.tabAirport : t.tabOther;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleServiceTabChange(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#121212] text-[#fcd502] shadow-md scale-[1.02] border border-zinc-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Dynamic Inputs based on Service Tab */}
        {selectedServiceTab === 'Airport' ? (
          <div className="space-y-2">
            {/* Flight Number */}
            <div className="relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-2 border border-slate-200/60 focus-within:border-[#fcd502] transition-all">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#fcd502] shadow-sm z-20 mr-2.5 flex-shrink-0">
                <Plane className="w-4 h-4 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{t.flightNoLabel}</label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="Enter Flight Number (e.g. AI-202)"
                  className="w-full text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 truncate"
                  required
                />
              </div>
            </div>

            {/* Airline Name */}
            <div className="relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-2 border border-slate-200/60 focus-within:border-[#fcd502] transition-all">
              <div className="w-7 h-7 rounded-xl bg-[#121212] flex items-center justify-center text-white shadow-sm z-20 mr-2.5 flex-shrink-0">
                <Building2 className="w-3.5 h-3.5 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{t.airlineLabel}</label>
                <input
                  type="text"
                  value={airlineName}
                  onChange={(e) => setAirlineName(e.target.value)}
                  placeholder="Enter Airline Name (e.g. Air India)"
                  className="w-full text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 truncate"
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 relative">
            <div className="absolute left-[17px] top-[22px] bottom-[22px] w-[1.5px] border-l-2 border-dashed border-slate-300 z-10 pointer-events-none" />

            {/* Pickup */}
            <div className="relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-2 border border-slate-200/60 focus-within:border-[#fcd502] transition-all">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#fcd502] shadow-sm z-20 mr-2.5 flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{t.pickupLabel}</label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Pickup address"
                  className="w-full text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 truncate"
                  required
                />
              </div>
            </div>

            {/* Destination */}
            <div className="relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-2 border border-slate-200/60 focus-within:border-[#fcd502] transition-all">
              <div className="w-7 h-7 rounded-xl bg-[#121212] flex items-center justify-center text-white shadow-sm z-20 mr-2.5 flex-shrink-0">
                <Navigation className="w-3.5 h-3.5 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{t.destinationLabel}</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                  className="w-full text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 truncate"
                  required
                />
              </div>
            </div>

            {/* Cause of the Trip Dropdown (Renders when 'Other' tab is selected) */}
            {selectedServiceTab === 'Other' && (
              <div className="relative flex items-center bg-white rounded-2xl px-3 py-2 border border-slate-200 shadow-sm focus-within:border-[#fcd502] transition-all">
                <div className="w-7 h-7 rounded-xl bg-[#121212] flex items-center justify-center text-[#fcd502] shadow-sm z-20 mr-2.5 flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-black uppercase tracking-wider text-[#a18200]">
                    {t.tripCauseLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={tripCause}
                      onChange={(e) => setTripCause(e.target.value)}
                      className="w-full text-xs font-extrabold text-slate-900 bg-transparent appearance-none focus:outline-none pr-5 cursor-pointer truncate"
                    >
                      {TRIP_PURPOSES.map((p) => (
                        <option key={p.id} value={p.label}>
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

        {/* Date, Time & Duration row with iOS style pickers & Stepper */}
        <div className={`grid ${selectedServiceTab === 'Hourly' ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5`}>
          {/* iOS Date Picker */}
          <div className="bg-slate-100/90 rounded-xl p-2 border border-slate-200/60 focus-within:border-[#fcd502] transition-all">
            <label className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <Calendar className="w-3 h-3 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" /> {t.dateLabel}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-[11px] font-extrabold text-slate-900 bg-transparent focus:outline-none mt-0.5 cursor-pointer"
            />
          </div>

          {/* iOS Time Picker */}
          <div className="bg-slate-100/90 rounded-xl p-2 border border-slate-200/60 focus-within:border-[#fcd502] transition-all">
            <label className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <Clock className="w-3 h-3 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" /> {t.timeLabel}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-[11px] font-extrabold text-slate-900 bg-transparent focus:outline-none mt-0.5 cursor-pointer"
            />
          </div>

          {/* Duration Stepper (+ / -) - Only for Hourly service */}
          {selectedServiceTab === 'Hourly' && (
            <div className="bg-slate-100/90 rounded-xl p-2 border border-slate-200/60 flex flex-col justify-between">
              <label className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-3 h-3 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" /> {t.durationLabel}
              </label>
              <div className="flex items-center justify-between mt-0.5">
                <button
                  type="button"
                  onClick={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                  className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold flex items-center justify-center transition-all"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-[11px] font-extrabold text-slate-900 select-none">
                  {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
                </span>
                <button
                  type="button"
                  onClick={() => setDurationHours((prev) => Math.min(24, prev + 1))}
                  className="w-5 h-5 rounded-full bg-[#fcd502] hover:bg-lime-500 active:scale-95 text-[#121212] font-bold flex items-center justify-center transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#121212] hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all group border border-zinc-800"
        >
          <span>{t.bookDriverBtn}</span>
          <div className="w-6 h-6 rounded-full bg-[#fcd502] text-[#121212] flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-[#121212]" />
          </div>
        </button>
      </form>

      {/* Trust snippet */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" /> {t.insuredBadge}
        </span>
        <span className="text-[#a18200] font-bold">{t.uniformedBadge}</span>
      </div>
    </div>
  );
};
