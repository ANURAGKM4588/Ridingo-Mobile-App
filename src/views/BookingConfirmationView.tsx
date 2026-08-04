import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Share2, 
  Clock, 
  ShieldCheck, 
  Navigation,
  ChevronLeft,
  Car,
  Plane,
  Building2,
  Sparkles,
  Calendar,
  CreditCard,
  DollarSign,
  Info,
  Check
} from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmationViewProps {
  booking: Booking;
  onTrackDriver: () => void;
  onClose: () => void;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  booking,
  onTrackDriver,
  onClose,
}) => {
  useEffect(() => {
    // Launch celebratory confetti when confirmation mounts
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#84CC16', '#A3E635', '#121212', '#00E676', '#3B82F6'],
      });
    } catch {
      // fallback
    }
  }, []);

  // Determine Category Mode
  const isAirport = booking.serviceType === 'Airport' || booking.serviceId === 'airport-pickup' || (booking.flightNumber && booking.flightNumber.length > 0);
  const isHourly = booking.serviceType === 'Hourly' || booking.serviceId === 'hourly-driver' || (!isAirport && booking.serviceType !== 'Other');
  const isCustomOther = booking.serviceType === 'Other' || booking.serviceType === 'Outstation' || booking.serviceType === 'Daily';

  // Calculate Advance Deposit (30%) & Remaining Balance (70%)
  const grandTotal = booking.priceTotal || 64.50;
  const advancePaid = Math.round(grandTotal * 0.30 * 100) / 100;
  const remainingBalance = Math.round((grandTotal - advancePaid) * 100) / 100;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 animate-fade-in pb-16">
      {/* Top Header with Solid Filled Background */}
      <div className="sticky -top-3 z-30 bg-white -mx-3.5 -mt-3 pt-3 pb-3 px-4 border-b border-slate-200 flex items-center justify-between shadow-sm">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Booking Confirmed</h2>
          <p className="text-[10px] text-slate-500 font-bold">Chauffeur Assigned & En Route</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Hero Celebration Card */}
      <div className="glass-card rounded-[36px] p-6 text-center space-y-3 bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/80 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-[#84CC16]/20 text-[#4D7C0F] mx-auto flex items-center justify-center shadow-inner mb-2 border border-[#84CC16]/30 animate-bounce-subtle">
          <CheckCircle2 className="w-10 h-10 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" />
        </div>

        <span className="px-3 py-1 rounded-full bg-[#84CC16] text-[#121212] text-xs font-black uppercase tracking-wider inline-block shadow-sm">
          ✓ Chauffeur Assigned & Dispatched
        </span>

        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
          {isAirport ? 'Airport Chauffeur Reserved!' : isHourly ? 'Hourly Driver Booked!' : 'Special Trip Confirmed!'}
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
          Professional driver assigned for your <strong className="text-slate-900 font-extrabold">{booking.vehicle?.name || 'Luxury Vehicle'}</strong>.
        </p>

        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Booking ID:</span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 font-mono font-extrabold text-xs text-slate-900 border border-slate-200 shadow-inner">
            #{booking.bookingNumber}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DYNAMIC TRIP CATEGORY SPECIFIC DETAILS CARD */}
      {/* ======================================================== */}

      {/* 1. AIRPORT TRIP CONFIRMATION CARD */}
      {isAirport && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-lg space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-lime-100 text-[#4D7C0F] flex items-center justify-center">
                <Plane className="w-4 h-4 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Airport Transfer Details</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flight Tracked Service</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#121212] text-[#84CC16] text-[10px] font-black uppercase tracking-wider">
              ✈️ Airport Trip
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Flight Number */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Flight Number</span>
              <span className="text-sm font-black text-slate-900 font-mono block mt-0.5">
                {booking.flightNumber || 'AI-202'}
              </span>
            </div>

            {/* Airline Name */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Airline</span>
              <span className="text-xs font-black text-slate-900 truncate block mt-0.5">
                {booking.airlineName || 'Air India'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-start gap-2.5 text-slate-700">
              <MapPin className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5 fill-[#84CC16]/25 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Pickup / Drop Terminal:</span>
                <span className="text-slate-600 font-medium">{booking.pickupLocation || 'LAX Terminal 4'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5 fill-slate-900/20 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Scheduled Pick-up Schedule:</span>
                <span className="text-slate-600 font-medium">{booking.date || 'Today'}, {booking.time || '14:30'}</span>
              </div>
            </div>
          </div>

          <div className="bg-lime-50 rounded-2xl p-3 border border-lime-200/80 flex items-center gap-2 text-xs text-[#4D7C0F] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#84CC16] flex-shrink-0 fill-[#84CC16]/25 stroke-[2]" />
            <span>Includes 45 mins complimentary airport waiting time & luggage assistance.</span>
          </div>
        </div>
      )}

      {/* 2. HOURLY CHAUFFEUR TRIP CONFIRMATION CARD */}
      {isHourly && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-lg space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-[#84CC16] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Hourly Chauffeur Package</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flexible Multi-Stop Booking</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#84CC16] text-[#121212] text-[10px] font-black uppercase tracking-wider">
              ⏱️ Hourly Trip
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Duration */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Duration Package</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">
                {booking.durationHours || 4} Hours Chauffeur
              </span>
            </div>

            {/* Hourly Rate */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Extra Hour Rate</span>
              <span className="text-xs font-black text-[#4D7C0F] block mt-0.5">
                +$15/hr extra
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-start gap-2.5 text-slate-700">
              <MapPin className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5 fill-[#84CC16]/25 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Pickup Location:</span>
                <span className="text-slate-600 font-medium">{booking.pickupLocation || '742 Evergreen Terrace, Beverly Hills'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5 fill-slate-900/20 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Scheduled Pick-up Schedule:</span>
                <span className="text-slate-600 font-medium">{booking.date || 'Today'}, {booking.time || '14:30'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200 flex items-center gap-2 text-xs text-slate-700 font-bold">
            <Sparkles className="w-4 h-4 text-[#84CC16] flex-shrink-0 fill-[#84CC16]/25 stroke-[2]" />
            <span>Unlimited stops allowed within your booked {booking.durationHours || 4} hours period.</span>
          </div>
        </div>
      )}

      {/* 3. OTHER / OUTSTATION / SPECIAL OCCASION TRIP CARD */}
      {isCustomOther && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-lg space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600/25 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Special Trip Details</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Custom Chauffeur Itinerary</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-900 text-purple-200 text-[10px] font-black uppercase tracking-wider">
              {booking.tripCause ? `💼 ${booking.tripCause}` : '🚙 Special Occasion'}
            </span>
          </div>

          {/* Explicit Selected Service Badge Box */}
          <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200/80 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-extrabold text-purple-700 uppercase tracking-wider block">Selected Service Category</span>
              <span className="text-xs font-black text-purple-950 block mt-0.5">
                {booking.tripCause || booking.serviceTitle || 'Custom Special Occasion Trip'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              Selected
            </span>
          </div>

          <div className="space-y-2.5 text-xs pt-0.5">
            <div className="flex items-start gap-2.5 text-slate-700">
              <MapPin className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5 fill-[#84CC16]/25 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Pickup Address:</span>
                <span className="text-slate-600 font-medium">{booking.pickupLocation}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-700">
              <Navigation className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5 fill-slate-900/20 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Destination Address:</span>
                <span className="text-slate-600 font-medium">{booking.destinationLocation}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5 fill-slate-900/20 stroke-[2]" />
              <div>
                <span className="font-bold text-slate-900 block">Scheduled Time & Duration:</span>
                <span className="text-slate-600 font-medium">{booking.date}, {booking.time} ({booking.durationHours} Hours)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Card Preview */}
      {booking.driver && (
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 flex items-center justify-between bg-white shadow-md">
          <div className="flex items-center gap-3.5">
            <img
              src={booking.driver.photo}
              alt={booking.driver.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-base text-slate-900">{booking.driver.name}</h4>
                <ShieldCheck className="w-4 h-4 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ★ {booking.driver.rating} • {booking.driver.yearsExperience} Yrs Exp • RIDINGO Uniformed
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#4D7C0F] font-bold">
                <Clock className="w-3.5 h-3.5 fill-[#4D7C0F]/25 stroke-[2]" /> ETA: 12 Mins to Pickup
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={`tel:${booking.driver.phone}`}
              className="w-10 h-10 rounded-2xl bg-[#121212] text-[#84CC16] flex items-center justify-center shadow-md hover:bg-black transition-transform active:scale-95"
              title="Call Chauffeur"
            >
              <Phone className="w-4 h-4 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" />
            </a>
          </div>
        </div>
      )}

      {/* Vehicle Class Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-[#84CC16] flex items-center justify-center shadow-sm">
            <Car className="w-5 h-5 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Vehicle Class</span>
            <h4 className="font-extrabold text-xs text-slate-900">{booking.vehicle?.name || 'Luxury Sedan'}</h4>
            <span className="text-[11px] text-slate-500 font-medium">
              {booking.vehicle?.sampleModels || 'Mercedes E-Class, BMW 5 Series'} • {booking.vehicle?.capacity || '4 Seats'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
          Automatic
        </span>
      </div>

      {/* Financial Payment Summary Card (30% Advance Deposit Paid + 70% Post-Trip Balance) */}
      <div className="bg-gradient-to-br from-slate-900 via-zinc-900 to-[#121212] rounded-3xl p-5 text-white shadow-xl space-y-3 border border-zinc-800">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#84CC16] fill-[#84CC16]/25 stroke-[2]" /> Payment Summary
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#84CC16] text-[#121212] text-[10px] font-black uppercase">
            30% Advance Paid
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Trip Fare</span>
            <span className="text-xl font-black text-white">${grandTotal.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-[#84CC16] uppercase block">30% Advance Paid</span>
            <span className="text-xl font-black text-[#84CC16]">${advancePaid.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Remaining 70% Balance Due Post-Trip:</span>
          <span className="font-extrabold text-white text-sm font-mono">${remainingBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onTrackDriver}
          className="w-full py-4 rounded-2xl bg-[#121212] hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-black/20 transition-all border border-zinc-800 cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-[#84CC16]" />
          <span>Track Chauffeur on Live Map</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => alert("Trip link copied to clipboard!")}
            className="py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" /> Share Booking
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationView;
