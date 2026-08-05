import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
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
  CreditCard,
  Download,
  MessageCircle,
  X,
  Sparkles,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { Booking } from '../types';
import { RegionCode, formatPrice } from '../data/currencies';

interface BookingConfirmationViewProps {
  booking: Booking;
  onTrackDriver: () => void;
  onClose: () => void;
  currentRegion?: RegionCode;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  booking,
  onTrackDriver,
  onClose,
  currentRegion = 'in',
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const isAirport = booking.serviceType === 'Airport' || booking.serviceId === 'airport-pickup' || Boolean(booking.flightNumber && booking.flightNumber.length > 0);
  const isHourly = booking.serviceType === 'Hourly' || booking.serviceId === 'hourly-driver' || (!isAirport && booking.serviceType !== 'Other');

  const grandTotal = booking.priceTotal || 64.50;
  const advancePaid = Math.round(grandTotal * 0.30 * 100) / 100;
  const remainingBalance = Math.round((grandTotal - advancePaid) * 100) / 100;

  // 1. Screenshot Download Handler using html2canvas
  const handleDownloadScreenshot = async () => {
    if (!ticketRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#121212',
        logging: false,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `RIDINGO-Pass-${booking.bookingNumber || 'RDG-2026'}.png`;
      link.click();
    } catch (err) {
      console.error("Screenshot capture failed:", err);
      alert("Downloading screenshot... If popup is blocked, please take a manual screenshot of the pass!");
    } finally {
      setIsCapturing(false);
    }
  };

  // 2. Direct WhatsApp Share Handler
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚗 *RIDINGO Chauffeur Booking Pass*\n\n` +
      `📌 *Booking Ref:* #${booking.bookingNumber}\n` +
      `✅ *Status:* Confirmed & Chauffeur Dispatched\n` +
      `🚘 *Vehicle:* ${booking.vehicle?.name || 'Executive Sedan'}\n` +
      `👨‍✈️ *Chauffeur:* ${booking.driver?.name || 'Michael Vance'} (★ ${booking.driver?.rating || '4.95'})\n` +
      `📍 *Pickup:* ${booking.pickupLocation}\n` +
      `🏁 *Destination:* ${booking.destinationLocation}\n` +
      `📅 *Schedule:* ${booking.date}, ${booking.time}\n` +
      `💳 *30% Advance Deposit Paid:* ${formatPrice(advancePaid, currentRegion, 2)}\n` +
      `🪙 *70% Balance Due Post-Trip:* ${formatPrice(remainingBalance, currentRegion, 2)}\n\n` +
      `📲 *Track Chauffeur:* https://ridingo.app/track/${booking.bookingNumber}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // 3. Native Share / Clipboard Copy Handler
  const handleNativeShare = async () => {
    const shareText = `RIDINGO Chauffeur Pass #${booking.bookingNumber}\nPickup: ${booking.pickupLocation}\nDestination: ${booking.destinationLocation}\nTime: ${booking.date}, ${booking.time}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RIDINGO Booking #${booking.bookingNumber}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or fallback
      }
    }
    
    await navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAFAFA] animate-fade-in overflow-hidden">
      {/* Fixed Centered Header */}
      <div className="bg-white py-3 px-4 border-b border-slate-200 flex items-center justify-between shadow-xs flex-shrink-0 z-30">
        <div className="w-12 flex items-center justify-start">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center flex-1 truncate px-2">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Booking Confirmed</h2>
          <p className="text-[10px] text-slate-500 font-bold">Chauffeur Assigned & En Route</p>
        </div>
        <div className="w-12" />
      </div>

      {/* Middle Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {/* Celebration Card */}
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

        {/* Assigned Driver Profile Card */}
        {booking.driver && (
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Your Assigned Chauffeur</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Background Checked
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={booking.driver.photo}
                  alt={booking.driver.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-md bg-slate-100"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    {booking.driver.name}
                    <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <span>★ {booking.driver.rating} ({booking.driver.reviewsCount} rides)</span>
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold mt-1">
                    {booking.driver.yearsExperience || 8}+ Years Luxury Chauffeur
                  </span>
                </div>
              </div>

              <a
                href={`tel:${booking.driver.phone || '+18005550199'}`}
                className="w-10 h-10 rounded-2xl bg-slate-950 text-[#84CC16] flex items-center justify-center shadow-md hover:bg-black transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}

        {/* Route Details Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {isAirport ? 'Flight & Pickup Details' : isHourly ? 'Chauffeur Itinerary' : 'Trip Route'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
              {booking.date}
            </span>
          </div>

          <div className="space-y-3 relative">
            <div className="absolute left-[15px] top-[18px] bottom-[18px] w-[1.5px] border-l-2 border-dashed border-slate-200 z-0" />
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-lime-50 text-[#84CC16] flex items-center justify-center flex-shrink-0 shadow-xs">
                <MapPin className="w-4 h-4 fill-[#84CC16]/20" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Pickup Address</span>
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">{booking.pickupLocation}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-[#84CC16] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination Location</span>
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">{booking.destinationLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Vehicle Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200">
              <Car className="w-6 h-6 text-[#84CC16]" />
            </div>
            <div>
              <h4 className="font-black text-xs text-slate-900">{booking.vehicle?.name || 'Executive Sedan'}</h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {booking.vehicle?.sampleModels || 'Mercedes E-Class, BMW 5 Series'} • {booking.vehicle?.capacity || '4 Seats'}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
            Automatic
          </span>
        </div>

        {/* Financial Payment Summary Card */}
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
              <span className="text-xl font-black text-white">{formatPrice(grandTotal, currentRegion, 2)}</span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#84CC16] uppercase block">30% Advance Paid</span>
              <span className="text-xl font-black text-[#84CC16]">{formatPrice(advancePaid, currentRegion, 2)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Remaining 70% Balance Due Post-Trip:</span>
            <span className="font-extrabold text-white text-sm font-mono">{formatPrice(remainingBalance, currentRegion, 2)}</span>
          </div>
        </div>
      </div>

      {/* FIXED Bottom Action Bar - Always Fixed in Frame */}
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex-shrink-0 shadow-lg z-30 space-y-2">
        <button
          type="button"
          onClick={onTrackDriver}
          className="w-full py-3.5 rounded-2xl bg-[#121212] hover:bg-black text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-black/20 transition-all border border-zinc-800 cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-[#84CC16]" />
          <span>Track Chauffeur on Live Map</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#4D7C0F]" /> Share Booking
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RICH BOOKING PASS & SCREENSHOT SHARE MODAL */}
      {/* ========================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#121212] w-full max-w-sm rounded-[36px] overflow-hidden shadow-2xl border border-zinc-800 text-white flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#84CC16]" />
                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">Share Booking Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Share Body with Ticket Card */}
            <div className="p-4 overflow-y-auto space-y-4 scrollbar-none flex-1">
              {/* TICKET PASS CONTAINER (Targeted by html2canvas for screenshot download) */}
              <div
                ref={ticketRef}
                className="bg-gradient-to-br from-slate-900 via-zinc-900 to-[#181818] rounded-[28px] p-5 border border-zinc-700/80 shadow-2xl space-y-3.5 text-white relative overflow-hidden"
              >
                {/* Decorative Top Banner */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#84CC16] text-[#121212] flex items-center justify-center font-black text-xs shadow-md">
                      R
                    </div>
                    <div>
                      <h4 className="font-black text-xs tracking-wider text-white uppercase">RIDINGO</h4>
                      <span className="text-[9px] text-[#84CC16] font-bold block leading-none">Chauffeur Pass</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#84CC16] text-[#121212] text-[9px] font-black uppercase tracking-wider">
                    CONFIRMED
                  </span>
                </div>

                {/* Booking Ref Number & Service */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Booking ID</span>
                    <span className="text-base font-mono font-black text-[#84CC16]">#{booking.bookingNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Service Type</span>
                    <span className="text-xs font-bold text-white">{booking.serviceTitle || booking.serviceType}</span>
                  </div>
                </div>

                {/* Chauffeur info row */}
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={booking.driver?.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop'}
                      alt="Chauffeur"
                      className="w-10 h-10 rounded-xl object-cover border border-[#84CC16]/40"
                    />
                    <div>
                      <span className="text-xs font-black text-white flex items-center gap-1">
                        {booking.driver?.name || 'Michael Vance'}
                        <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                      </span>
                      <span className="text-[9px] text-slate-300 font-medium block">
                        ★ {booking.driver?.rating || '4.95'} • {booking.vehicle?.name || 'Executive Sedan'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#84CC16] bg-[#84CC16]/10 px-2 py-1 rounded-lg border border-[#84CC16]/30">
                    Assigned
                  </span>
                </div>

                {/* Route detail */}
                <div className="space-y-2 text-xs pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#84CC16] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">From</span>
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">{booking.pickupLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#84CC16] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">To</span>
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">{booking.destinationLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule & Price Row */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Schedule Time</span>
                    <span className="text-xs font-bold text-white">{booking.date}, {booking.time}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-[#84CC16] font-bold uppercase block">30% Deposit Paid</span>
                    <span className="text-sm font-black text-[#84CC16]">{formatPrice(advancePaid, currentRegion, 2)}</span>
                  </div>
                </div>

                {/* QR Code Verification Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-6 h-6 text-[#84CC16]" />
                    <span>Scan code for driver arrival verification</span>
                  </div>
                  <span className="font-mono text-slate-500">RIDINGO SECURE PASS</span>
                </div>
              </div>

              {/* Action Sharing Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Download Screenshot / Image Pass */}
                <button
                  type="button"
                  onClick={handleDownloadScreenshot}
                  disabled={isCapturing}
                  className="w-full py-3.5 rounded-2xl bg-[#84CC16] hover:bg-lime-400 text-[#121212] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{isCapturing ? 'Generating Image Pass...' : 'Download Screenshot Pass'}</span>
                </button>

                {/* 2. Share via WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Share via WhatsApp</span>
                </button>

                {/* 3. Copy Details / Native Share */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#84CC16]" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{isCopied ? 'Trip Details Copied!' : 'Copy Trip Details / Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
