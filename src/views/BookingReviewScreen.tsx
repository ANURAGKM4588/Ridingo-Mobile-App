import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Car, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Plane, 
  Building2, 
  Check,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { VehicleOption, Booking } from '../types';
import { MOCK_VEHICLES, FEATURED_DRIVER } from '../data/mockData';
import { RegionCode, formatPrice } from '../data/currencies';

interface BookingReviewScreenProps {
  draft: {
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
  };
  onBack: () => void;
  onConfirm: (booking: Booking) => void;
  currentRegion?: RegionCode;
}

export const BookingReviewScreen: React.FC<BookingReviewScreenProps> = ({
  draft,
  onBack,
  onConfirm,
  currentRegion = 'in',
}) => {
  // Editable State initialized from draft
  const [serviceType, setServiceType] = useState(draft.serviceType || 'Hourly');
  const [pickup, setPickup] = useState(draft.pickup || '742 Evergreen Terrace, Beverly Hills');
  const [destination, setDestination] = useState(draft.destination || 'LAX Airport Terminal 4');
  const [flightNumber, setFlightNumber] = useState(draft.flightNumber || 'AI-202');
  const [airlineName, setAirlineName] = useState(draft.airlineName || 'Air India');
  const [tripCause, setTripCause] = useState(draft.tripCause || 'Wedding function');
  const [date, setDate] = useState(draft.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(draft.time || '14:30');
  const [durationHours, setDurationHours] = useState(draft.durationHours || 4);
  const [selectedVehicleId, setSelectedVehicleId] = useState(draft.vehicleId || 'sedan');
  const [isEditing, setIsEditing] = useState(false);

  // Vehicle rates
  const vehicleRates: Record<string, { hourly: number; extra: number; name: string }> = {
    sedan: { hourly: 15, extra: 15, name: 'Sedan' },
    suv: { hourly: 22, extra: 20, name: 'SUV' },
    luxury: { hourly: 35, extra: 30, name: 'Luxury' },
    hatchback: { hourly: 12, extra: 12, name: 'Hatchback' },
  };

  const currentRate = vehicleRates[selectedVehicleId] || vehicleRates['sedan'];
  const baseFare = currentRate.hourly * durationHours;
  const serviceFee = 4.50;
  const totalFare = baseFare + serviceFee;
  const extraHourRate = currentRate.extra;

  const handleProceed = () => {
    const selectedVeh = MOCK_VEHICLES.find(v => v.id === selectedVehicleId) || MOCK_VEHICLES[0];
    const newBooking: Booking = {
      id: `bk-${Math.floor(100 + Math.random() * 900)}`,
      bookingNumber: `RDG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: serviceType === 'Airport' ? 'airport-pickup' : 'hourly-driver',
      serviceTitle: serviceType === 'Airport' ? `Airport Transfer (${airlineName} ${flightNumber})` : `Hourly Chauffeur (${durationHours} Hours)`,
      pickupLocation: serviceType === 'Airport' ? `Flight ${flightNumber}` : pickup,
      destinationLocation: serviceType === 'Airport' ? `Airline: ${airlineName}` : destination,
      date: `${date}, ${time}`,
      time: time,
      durationHours: durationHours,
      vehicle: selectedVeh,
      driver: FEATURED_DRIVER,
      status: 'upcoming',
      priceTotal: totalFare,
      priceBreakdown: {
        baseFare: baseFare,
        safetyInsurance: 0,
        serviceFee: serviceFee
      },
      paymentMethod: 'UPI / Credit Card',
      createdDate: new Date().toISOString().split('T')[0],
      serviceType: serviceType as any,
      flightNumber: serviceType === 'Airport' ? flightNumber : undefined,
      airlineName: serviceType === 'Airport' ? airlineName : undefined,
      tripCause: serviceType === 'Other' ? tripCause : undefined,
      driverPreferences: {
        language: 'English',
        uniformRequired: true,
        nonSmokingRequired: true,
        seniorDriverOnly: false,
        femaleDriverPreferred: false
      }
    };
    onConfirm(newBooking);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0F19] text-white animate-fade-in overflow-hidden">
      {/* Fixed Centered Header */}
      <div className="bg-[#0B0F19]/95 pt-[max(env(safe-area-inset-top,54px),54px)] pb-3 px-4 border-b border-white/10 flex items-center justify-between shadow-xs flex-shrink-0 z-30">
        <div className="w-12 flex items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-white/20 transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <h2 className="font-extrabold text-sm text-white tracking-tight text-center flex-1 truncate px-2">
          Booking Confirmation
        </h2>
        <div className="w-12 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-[#fcd502] hover:underline cursor-pointer whitespace-nowrap active:scale-95"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Middle Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-[#0B0F19]">
        {/* 1. Trip & Location Details Card */}
        <div className="bg-[#131926] rounded-2xl p-4 border border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {serviceType} Service Details
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#fcd502]/20 text-[#fcd502] border border-[#fcd502]/30 text-[10px] font-bold">
              {isEditing ? 'Editing Mode' : 'Confirmed'}
            </span>
          </div>

          {serviceType === 'Airport' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#192233] flex items-center justify-center text-[#fcd502] flex-shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Flight Number</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="w-full text-xs font-bold text-white border-b border-white/20 bg-transparent focus:outline-none focus:border-[#fcd502] py-0.5"
                    />
                  ) : (
                    <span className="text-xs font-extrabold text-white">{flightNumber || 'Not specified'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#192233] flex items-center justify-center text-[#fcd502] flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Airline Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={airlineName}
                      onChange={(e) => setAirlineName(e.target.value)}
                      className="w-full text-xs font-bold text-white border-b border-white/20 bg-transparent focus:outline-none focus:border-[#fcd502] py-0.5"
                    />
                  ) : (
                    <span className="text-xs font-extrabold text-white">{airlineName || 'Not specified'}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 relative">
              <div className="absolute left-[15px] top-[18px] bottom-[18px] w-[1.5px] border-l-2 border-dashed border-white/15 z-0" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-[#192233] flex items-center justify-center text-[#fcd502] flex-shrink-0">
                  <MapPin className="w-4 h-4 fill-[#fcd502]/20" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">From</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full text-xs font-bold text-white border-b border-white/20 bg-transparent focus:outline-none focus:border-[#fcd502] py-0.5"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white truncate block">{pickup}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-[#192233] flex items-center justify-center text-[#fcd502] flex-shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">To</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full text-xs font-bold text-white border-b border-white/20 bg-transparent focus:outline-none focus:border-[#fcd502] py-0.5"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white truncate block">{destination}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cause of Trip tag */}
          {serviceType === 'Other' && (
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#fcd502]" />
              <span className="text-[10px] font-bold text-[#fcd502] uppercase">Trip Purpose:</span>
              <span className="text-xs font-black text-white">{tripCause}</span>
            </div>
          )}
        </div>

        {/* 2. Date, Time & Duration Selection */}
        <div className="bg-[#131926] rounded-2xl p-4 border border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Schedule & Duration
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Editable</span>
          </div>

          <div className={`grid ${serviceType === 'Hourly' ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
            {/* Date */}
            <div className="bg-[#192233] p-2.5 rounded-xl border border-white/10">
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#fcd502]" /> Date
              </span>
              {isEditing ? (
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-extrabold text-white bg-transparent mt-1 focus:outline-none"
                />
              ) : (
                <span className="text-xs font-extrabold text-white block mt-1">{date}</span>
              )}
            </div>

            {/* Time */}
            <div className="bg-[#192233] p-2.5 rounded-xl border border-white/10">
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#fcd502]" /> Time
              </span>
              {isEditing ? (
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs font-extrabold text-white bg-transparent mt-1 focus:outline-none"
                />
              ) : (
                <span className="text-xs font-extrabold text-white block mt-1">{time}</span>
              )}
            </div>

            {/* Duration - Only shown for Hourly service */}
            {serviceType === 'Hourly' && (
              <div className="bg-[#192233] p-2.5 rounded-xl border border-white/10 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#fcd502]" /> Hours
                </span>
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-extrabold text-white">
                    {durationHours}h
                  </span>
                  <button
                    type="button"
                    onClick={() => setDurationHours((prev) => Math.min(24, prev + 1))}
                    className="w-5 h-5 rounded-full bg-[#fcd502] hover:bg-[#fcd502]/90 active:scale-95 text-slate-950 font-bold flex items-center justify-center transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Vehicle Model Selection */}
        <div className="bg-[#131926] rounded-2xl p-4 border border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Select Vehicle Category
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Tap to Change</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'sedan', name: 'Sedan', icon: Car, rate: `${formatPrice(15, currentRegion)}/hr` },
              { id: 'suv', name: 'SUV', icon: ShieldCheck, rate: `${formatPrice(22, currentRegion)}/hr` },
              { id: 'luxury', name: 'Luxury', icon: SparklesIcon, rate: `${formatPrice(35, currentRegion)}/hr` },
              { id: 'hatchback', name: 'Hatchback', icon: Car, rate: `${formatPrice(12, currentRegion)}/hr` },
            ].map((v) => {
              const isSel = selectedVehicleId === v.id;
              const IconComp = v.icon;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer active:scale-95 ${
                    isSel
                      ? 'bg-[#192233] text-white border-[#fcd502] shadow-md'
                      : 'bg-[#192233]/40 text-slate-300 border-white/10 hover:border-white/20 hover:bg-[#192233]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSel ? 'bg-[#fcd502] text-slate-950 font-bold' : 'bg-white/10 text-slate-300'}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block leading-none text-white">{v.name}</span>
                      <span className={`text-[9px] font-semibold ${isSel ? 'text-[#fcd502]' : 'text-slate-400'}`}>
                        {v.rate}
                      </span>
                    </div>
                  </div>
                  {isSel && <Check className="w-4 h-4 text-[#fcd502]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Total Fare & Extra Hour Rate Card */}
        <div className="bg-[#131926] border border-white/10 rounded-2xl p-4 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-slate-300">Fare Summary</span>
            <span className="text-[10px] text-slate-400">({durationHours} hrs × {formatPrice(currentRate.hourly, currentRegion)}/hr)</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white">{formatPrice(totalFare, currentRegion, 2)}</span>
              <span className="text-xs text-slate-400 font-normal"> (Total Estimated)</span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#fcd502]/20 border border-[#fcd502]/40 text-[#fcd502] text-[10px] font-extrabold">
                Extra: +{formatPrice(extraHourRate, currentRegion)}/hr
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-white/10 pt-2">
            <Info className="w-3 h-3 text-[#fcd502] flex-shrink-0" />
            <span>Extra hours charged automatically if trip extends beyond {durationHours} hours.</span>
          </div>
        </div>
      </div>

      {/* FIXED Bottom Action Bar */}
      <div className="bg-[#0B0F19] border-t border-white/10 p-3.5 px-4 pb-[max(env(safe-area-inset-bottom,0px)+0.85rem,1.25rem)] flex-shrink-0 shadow-lg z-30">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full h-13 py-3.5 rounded-2xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <span>Continue to Advance Payment</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

// Helper icon
function SparklesIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.83 4.17L19 9l-4.17 1.83L13 15l-1.83-4.17L7 9l4.17-1.83L13 3z" />
    </svg>
  );
}
