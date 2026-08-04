import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Share2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Navigation,
  ChevronLeft,
  Car
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#84CC16', '#A3E635', '#121212', '#00E676'],
      });
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 animate-fade-in">
      {/* Top Header with Solid Filled Background */}
      <div className="sticky -top-3 z-30 bg-white -mx-3.5 -mt-3 pt-3 pb-3 px-4 border-b border-slate-200 flex items-center justify-between shadow-sm">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Booking Confirmed</h2>
          <p className="text-[10px] text-slate-500 font-bold">Chauffeur Assigned</p>
        </div>
        <div className="w-8" />
      </div>
      {/* Header card with success badge */}
      <div className="glass-card rounded-[36px] p-6 text-center space-y-3 bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/80 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-[#84CC16]/20 text-[#4D7C0F] mx-auto flex items-center justify-center shadow-inner mb-2 border border-[#84CC16]/30">
          <CheckCircle2 className="w-10 h-10 text-[#84CC16]" />
        </div>

        <span className="px-3 py-1 rounded-full bg-[#84CC16] text-[#121212] text-xs font-black uppercase tracking-wider inline-block">
          ✓ Request Accepted in Driver App
        </span>

        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Your Chauffeur is En Route
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
          Professional verified driver assigned for your <strong className="text-slate-800">{booking.vehicle.name}</strong>.
        </p>

        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Booking ID:</span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 font-mono font-extrabold text-xs text-slate-900 border border-slate-200">
            #{booking.bookingNumber}
          </span>
        </div>
      </div>

      {/* Driver Card Preview */}
      {booking.driver && (
        <div className="glass-card rounded-3xl p-5 border border-slate-200 flex items-center justify-between bg-white shadow-md">
          <div className="flex items-center gap-3.5">
            <img
              src={booking.driver.photo}
              alt={booking.driver.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-base text-slate-900">{booking.driver.name}</h4>
                <ShieldCheck className="w-4 h-4 text-[#84CC16] fill-current" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ★ {booking.driver.rating} • {booking.driver.yearsExperience} Yrs Exp • RIDINGO Uniformed
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#4D7C0F] font-bold">
                <Clock className="w-3.5 h-3.5" /> ETA: 12 Mins to Pickup
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={`tel:${booking.driver.phone}`}
              className="w-10 h-10 rounded-2xl bg-[#121212] text-[#84CC16] flex items-center justify-center shadow-md hover:bg-black"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Trip Details Summary */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-3 text-xs">
        <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Trip & Vehicle Details
        </h4>
        <div className="flex items-start gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Pickup:</span>
            <span>{booking.pickupLocation}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-slate-600">
          <Navigation className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Destination:</span>
            <span>{booking.destinationLocation}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-slate-600">
          <Car className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">My Vehicle Class:</span>
            <span>{booking.vehicle.name} ({booking.vehicle.sampleModels})</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onTrackDriver}
          className="w-full py-4 rounded-2xl bg-[#121212] hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-black/20 transition-all border border-zinc-800"
        >
          <Navigation className="w-4 h-4 text-[#84CC16]" />
          <span>Track Chauffeur on Live Map</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => alert("Trip link copied to clipboard!")}
            className="py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4 text-slate-500" /> Share Booking
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
