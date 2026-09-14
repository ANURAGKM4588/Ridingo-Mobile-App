import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Wallet,
  DollarSign,
  Receipt,
  Check,
  Sparkles,
  Lock,
  Tag,
  ArrowRight,
  Info,
  QrCode,
  Clock,
  X,
  Radio,
  CheckCircle2,
  UserCheck,
  Send,
  Building2,
  Smartphone,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { Booking } from '../types';
import { RegionCode, formatPrice } from '../data/currencies';
import { bridgeSend, bridgeListen } from '../lib/bridge';
import type { BookingRequestPayload } from '../lib/bridge';
import { supabase } from '../lib/supabase';

interface InvoicePaymentScreenProps {
  bookingDraft: any;
  onBack: () => void;
  onConfirmPayment: (finalBooking: Booking) => void;
  onCloseToBookings?: (pendingBooking: Booking) => void;
  currentRegion?: RegionCode;
}

export const InvoicePaymentScreen: React.FC<InvoicePaymentScreenProps> = ({
  bookingDraft,
  onBack,
  onConfirmPayment,
  onCloseToBookings,
  currentRegion = 'in',
}) => {
  // Payment method selection
  const [selectedPayment, setSelectedPayment] = useState<'apple_pay' | 'gpay' | 'card' | 'wallet' | 'upi' | 'cash'>('apple_pay');

  // Promo code & tipping state
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountMsg, setDiscountMsg] = useState<string>('');
  const [selectedTip, setSelectedTip] = useState<number>(0);

  // Razorpay Gateway Modal State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState<boolean>(false);
  const [razorpayMethod, setRazorpayMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [razorpayStep, setRazorpayStep] = useState<'select' | 'processing' | 'success'>('select');

  // Driver Request Dispatching State
  const [isDriverDispatching, setIsDriverDispatching] = useState<boolean>(false);
  const [dispatchStep, setDispatchStep] = useState<number>(1);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Price calculations
  const duration = bookingDraft?.durationHours || 4;
  const hourlyRate = bookingDraft?.serviceType === 'Airport' ? 25 : 15;
  const baseFare = duration * hourlyRate;
  const safetyInsurance = 3.50;
  const serviceFee = 4.50;
  const subtotal = baseFare + safetyInsurance + serviceFee;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, subtotal + tax + selectedTip - appliedDiscount);

  // Strict 30% Advance + 70% Post-Trip Balance calculations
  const advanceAmount = Math.round(grandTotal * 0.30 * 100) / 100;
  const remainingBalance = Math.round((grandTotal - advanceAmount) * 100) / 100;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'RIDE10' || code === 'VIP10' || code === 'FIRST50') {
      setAppliedDiscount(10);
      setDiscountMsg('Promo applied! $10.00 discount added.');
    } else if (code.length > 0) {
      setDiscountMsg('Invalid code. Use RIDE10 or VIP10');
    }
  };

  // 1. Direct Pay & Dispatch Trigger
  const handleOpenRazorpay = () => {
    startDriverDispatchSequence();
  };

  // 2. Execute Razorpay Payment
  const handleExecuteRazorpayPayment = () => {
    setRazorpayStep('processing');

    setTimeout(() => {
      setRazorpayStep('success');

      setTimeout(() => {
        setIsRazorpayOpen(false);
        startDriverDispatchSequence();
      }, 1000);
    }, 1500);
  };

  // 3. Driver Dispatch Sequence to Driver App
  const startDriverDispatchSequence = async () => {
    const newBooking: Booking = {
      id: `bk-${Math.floor(100 + Math.random() * 900)}`,
      bookingNumber: `RDG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: bookingDraft?.serviceType === 'Airport' ? 'airport-pickup' : 'hourly-driver',
      serviceTitle: bookingDraft?.serviceType === 'Airport'
        ? `Airport Transfer (${bookingDraft?.airlineName || 'LAX'})`
        : `Hourly Chauffeur (${duration} Hours)`,
      pickupLocation: bookingDraft?.pickup || '742 Evergreen Terrace, Beverly Hills',
      destinationLocation: bookingDraft?.destination || 'LAX International Airport',
      date: `${bookingDraft?.date || 'Today'}, ${bookingDraft?.time || '14:30'}`,
      time: bookingDraft?.time || '14:30',
      durationHours: duration,
      vehicle: bookingDraft?.vehicle || {
        id: 'v1',
        name: 'Luxury Sedan',
        category: 'Premium',
        capacity: '4 Seats',
        transmission: 'Automatic',
        badge: 'Most Popular',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
        sampleModels: 'Mercedes E-Class, BMW 5 Series',
        tagline: 'Chauffeur driven executive comfort'
      },
      driver: {
        id: 'drv-101',
        name: 'Marcus Vance',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        rating: 4.98,
        totalTrips: 1420,
        yearsExperience: 8,
        languages: ['English', 'German'],
        verifiedBadge: true,
        backgroundChecked: true,
        uniformAvailable: true,
        certifications: ['Defensive Driving', 'First Aid'],
        phone: '+1 (555) 382-9102',
        bio: 'Executive chauffeur specialized in luxury sedans & airport transfers.',
        carHandledTypes: ['Sedan', 'SUV', 'EV'],
        reviewsCount: 342
      },
      status: 'pending_approval',
      priceTotal: grandTotal,
      priceBreakdown: {
        baseFare: baseFare,
        safetyInsurance: safetyInsurance,
        serviceFee: serviceFee,
        discount: appliedDiscount
      },
      paymentMethod: `Razorpay - ${selectedPayment.toUpperCase()} (30% Advance)`,
      createdDate: new Date().toISOString().split('T')[0],
      serviceType: bookingDraft?.serviceType || 'Hourly',
      flightNumber: bookingDraft?.flightNumber,
      airlineName: bookingDraft?.airlineName,
      tripCause: bookingDraft?.tripCause,
      driverPreferences: {
        language: 'English',
        uniformRequired: true,
        nonSmokingRequired: true,
        seniorDriverOnly: false,
        femaleDriverPreferred: false
      }
    };

    setCreatedBooking(newBooking);
    setIsDriverDispatching(true);
    setDispatchStep(1);

    // 1. Broadcast to Driver App via Local BroadcastChannel / LocalStorage
    const requestPayload: BookingRequestPayload = {
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingNumber: newBooking.bookingNumber,
      customerName: 'Alexander Vance',
      customerRating: 4.98,
      pickup: newBooking.pickupLocation,
      destination: newBooking.destinationLocation,
      serviceType: newBooking.serviceTitle,
      duration: `${duration} Hours`,
      totalFare: grandTotal,
      driverPayout: Math.round(grandTotal * 0.80 * 100) / 100,
      paymentMethod: selectedPayment.toUpperCase(),
      flightNumber: newBooking.flightNumber,
      airlineName: newBooking.airlineName,
      vehicleName: newBooking.vehicle?.name,
      timestamp: Date.now(),
    };
    bridgeSend('BOOKING_REQUEST', requestPayload, 'user-app');

    // 2. Insert into Supabase 'rides' table for real-time remote Driver App delivery
    try {
      const { data: rideRow, error } = await supabase.from('rides').insert({
        booking_number: newBooking.bookingNumber,
        customer_name: 'Alexander Vance',
        customer_phone: '+1 (555) 019-2834',
        pickup: newBooking.pickupLocation,
        destination: newBooking.destinationLocation,
        service_type: newBooking.serviceTitle,
        duration: `${duration} Hours`,
        fare: grandTotal,
        status: 'pending',
      }).select().single();

      if (error) {
        console.warn('[Supabase Realtime Ride Dispatch note]:', error.message);
      } else {
        console.log('[Supabase Realtime Ride Dispatched]:', rideRow);
      }
    } catch (err) {
      console.warn('[Supabase Realtime Dispatch Exception]:', err);
    }

    setTimeout(() => {
      setDispatchStep(2);
    }, 2000);
  };

  // Listen for driver response from Driver App (Both Supabase Realtime & BroadcastChannel)
  useEffect(() => {
    if (!isDriverDispatching || !createdBooking) return;

    // A. Local BroadcastChannel Bridge
    const cleanupBridge = bridgeListen((msg) => {
      if (msg.sentFrom !== 'driver-app') return;
      if (msg.type === 'BOOKING_ACCEPTED' && isDriverDispatching) {
        setDispatchStep(3);
        setTimeout(() => {
          setIsDriverDispatching(false);
          const acceptedPayload = msg.payload as any;
          const assignedDriver = {
            id: 'drv-accepted-01',
            name: acceptedPayload?.driverName || 'Marcus Vance',
            phone: acceptedPayload?.driverPhone || '+1 (555) 019-2834',
            rating: acceptedPayload?.driverRating || 4.98,
            reviewsCount: 168,
            yearsExperience: 7,
            totalTrips: 1420,
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            languages: ['English', 'Hindi', 'Malayalam'],
            carHandledTypes: ['Mercedes S-Class', 'BMW 7 Series'],
            verifiedBadge: true,
            backgroundChecked: true,
            uniformAvailable: true,
            bio: 'Elite chauffeur trained in luxury executive protocol.',
            certifications: ['Defensive Driving Elite', 'VIP Chauffeur Certified']
          };
          onConfirmPayment({ ...createdBooking, status: 'upcoming', driver: assignedDriver });
        }, 1000);
      }
      if (msg.type === 'BOOKING_DECLINED' && isDriverDispatching) {
        setDispatchStep(1); // back to searching
      }
    });

    // B. Supabase Cloud Realtime Channel (For Separate Driver App across phones/devices)
    const supabaseChannel = supabase
      .channel(`dispatch-${createdBooking.bookingNumber}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `booking_number=eq.${createdBooking.bookingNumber}`,
        },
        (payload) => {
          const updatedRide = payload.new as any;
          console.log('[Supabase Realtime Ride Update]:', updatedRide);

          if (updatedRide.status === 'accepted') {
            setDispatchStep(3);
            setTimeout(() => {
              setIsDriverDispatching(false);
              const assignedDriver = {
                id: updatedRide.id || 'drv-live-01',
                name: updatedRide.driver_name || 'Marcus Vance',
                phone: updatedRide.driver_phone || '+1 (555) 019-2834',
                rating: 4.98,
                reviewsCount: 168,
                yearsExperience: 7,
                totalTrips: 1420,
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
                languages: ['English', 'Hindi', 'Malayalam'],
                carHandledTypes: ['Mercedes S-Class', 'BMW 7 Series'],
                verifiedBadge: true,
                backgroundChecked: true,
                uniformAvailable: true,
                bio: 'Elite chauffeur trained in luxury executive protocol.',
                certifications: ['Defensive Driving Elite', 'VIP Chauffeur Certified']
              };
              onConfirmPayment({ ...createdBooking, status: 'upcoming', driver: assignedDriver });
            }, 1000);
          } else if (updatedRide.status === 'cancelled') {
            setIsDriverDispatching(false);
            onBack();
          }
        }
      )
      .subscribe();

    return () => {
      cleanupBridge();
      supabase.removeChannel(supabaseChannel);
    };
  }, [isDriverDispatching, createdBooking, onConfirmPayment, onBack]);

  // 4. Cancel Request Action
  const handleCancelTripRequest = async () => {
    if (confirm("Are you sure you want to cancel this trip request? Your 30% advance deposit will be immediately refunded.")) {
      if (createdBooking) {
        bridgeSend('BOOKING_CANCELLED', { requestId: createdBooking.bookingNumber }, 'user-app');
        try {
          await supabase
            .from('rides')
            .update({ status: 'cancelled' })
            .eq('booking_number', createdBooking.bookingNumber);
        } catch (err) {
          console.warn('[Supabase cancel note]:', err);
        }
      }
      setIsDriverDispatching(false);
      alert(`Trip request #${createdBooking?.bookingNumber || ''} cancelled. $${advanceAmount.toFixed(2)} advance deposit refunded.`);
      onBack();
    }
  };

  // 5. Close Request Window & view status in Bookings page
  const handleCloseToBookings = () => {
    setIsDriverDispatching(false);
    if (createdBooking) {
      if (onCloseToBookings) {
        onCloseToBookings(createdBooking);
      } else {
        onConfirmPayment(createdBooking);
      }
    }
  };

  // 6. Simulate Driver Accepting Request
  const handleAcceptByDriver = () => {
    setDispatchStep(3); // Driver accepted!
    setTimeout(() => {
      setIsDriverDispatching(false);
      if (createdBooking) {
        onConfirmPayment({
          ...createdBooking,
          status: 'upcoming'
        });
      }
    }, 1000);
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
        <div className="text-center flex-1 truncate px-2">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Advance Payment</h2>
          <p className="text-[10px] text-slate-400 font-bold">Step 3 of 3 • 256-bit SSL Secured</p>
        </div>
        <div className="w-12" />
      </div>

      {/* Middle Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-[#0B0F19]">
        {/* 1. PROMINENT 30% ADVANCE SUMMARY CARD */}
        <div className="bg-gradient-to-br from-[#121212] via-zinc-900 to-black rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#fcd502] text-slate-950 text-[10px] font-black uppercase tracking-wider">
              30% Advance Lock
            </span>
            <span className="text-xs font-mono text-slate-400">Total Trip: ${grandTotal.toFixed(2)}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Payable Deposit Now:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-[#fcd502]">${advanceAmount.toFixed(2)}</span>
              <span className="text-xs text-slate-300 font-bold">(30% Deposit)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="w-4 h-4 text-[#fcd502]" />
              <span>Balance Due After Trip:</span>
            </div>
            <span className="font-extrabold text-white text-sm">${remainingBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* 2. ITEMIZED FARE BREAKDOWN */}
        <div className="bg-[#131926] rounded-3xl p-5 border border-white/10 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#fcd502]" />
              <div>
                <h3 className="font-extrabold text-xs text-white">Fare & Deposit Details</h3>
                <span className="text-[10px] font-mono text-slate-400">REF: RDG-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-white">${grandTotal.toFixed(2)}</span>
          </div>

          <div className="space-y-2 text-xs pt-0.5">
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Chauffeur Base ({duration} hrs @ ${hourlyRate}/hr)</span>
              <span className="font-bold text-slate-200">${baseFare.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-400 font-medium">
              <span>Vehicle Protection Cover</span>
              <span className="font-bold text-slate-200">${safetyInsurance.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-400 font-medium">
              <span>Platform Service Fee</span>
              <span className="font-bold text-slate-200">${serviceFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-400 font-medium">
              <span>Taxes (8%)</span>
              <span className="font-bold text-slate-200">${tax.toFixed(2)}</span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/30">
                <span>Promo Discount (RIDE10)</span>
                <span>-${appliedDiscount.toFixed(2)}</span>
              </div>
            )}

            {selectedTip > 0 && (
              <div className="flex justify-between text-white font-bold">
                <span>Driver Tip</span>
                <span>+${selectedTip.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Payment Split Highlight Box */}
          <div className="pt-3 border-t border-white/10 bg-[#192233] -mx-5 -mb-5 p-4 rounded-b-3xl space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-white">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#fcd502]" /> Pay Now (30% Deposit)
              </span>
              <span className="text-[#fcd502] text-sm">${advanceAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> Pay After Trip (70% Balance)
              </span>
              <span>${remainingBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 3. PROMO CODE COUPON INPUT */}
        <div className="bg-[#131926] rounded-3xl p-4 border border-white/10 shadow-sm space-y-2">
          <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#fcd502]" /> Have a Promo Code?
          </label>
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Try RIDE10 or VIP10"
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#192233] border border-white/10 text-xs font-bold text-white uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#fcd502]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-black text-xs shadow-md transition-colors cursor-pointer active:scale-95"
            >
              Apply
            </button>
          </form>
          {discountMsg && (
            <p className={`text-[11px] font-bold ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {discountMsg}
            </p>
          )}
        </div>

      </div>

      {/* FIXED Bottom Action Bar */}
      <div className="bg-[#0B0F19] border-t border-white/10 p-3.5 px-4 pb-[max(env(safe-area-inset-bottom,0px)+0.85rem,1.25rem)] flex-shrink-0 shadow-lg z-30">
        <button
          type="button"
          onClick={handleOpenRazorpay}
          className="w-full h-13 py-3.5 rounded-2xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Pay {formatPrice(advanceAmount, currentRegion, 2)} Deposit Now</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* REALISTIC RAZORPAY PAYMENT GATEWAY OVERLAY MODAL */}
      {/* ======================================================== */}
      {isRazorpayOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="bg-[#131926] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-white/10 space-y-0 text-white animate-slide-up">
            {/* Razorpay Brand Header */}
            <div className="bg-[#0C2340] px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500 text-white font-black flex items-center justify-center text-xs tracking-tighter">
                  R
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    Razorpay <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-600/60 font-mono text-blue-200">SECURE</span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium">Merchant: RIDINGO Chauffeur Services</p>
                </div>
              </div>
              <button
                onClick={() => setIsRazorpayOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Banner */}
            <div className="bg-[#0B0F19] px-5 py-3 text-white flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">30% Advance Deposit</span>
                <span className="text-xl font-black text-[#fcd502]">${advanceAmount.toFixed(2)}</span>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-medium">
                <span>Total Fare: ${grandTotal.toFixed(2)}</span>
                <span className="block text-slate-300 font-bold">Balance ${remainingBalance.toFixed(2)} post-trip</span>
              </div>
            </div>

            {/* Razorpay Body Options */}
            {razorpayStep === 'select' && (
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                    Choose Payment Option
                  </label>

                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setRazorpayMethod('upi')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer active:scale-95 ${razorpayMethod === 'upi' ? 'border-[#fcd502] bg-[#192233] ring-1 ring-[#fcd502]' : 'border-white/10 bg-[#192233]/40'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <QrCode className="w-4 h-4 text-[#fcd502]" />
                      <span className="text-xs font-extrabold text-white">UPI / QR (GPay, PhonePe, Paytm)</span>
                    </div>
                    {razorpayMethod === 'upi' && <Check className="w-4 h-4 text-[#fcd502]" />}
                  </button>

                  {/* Cards */}
                  <button
                    type="button"
                    onClick={() => setRazorpayMethod('card')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer active:scale-95 ${razorpayMethod === 'card' ? 'border-[#fcd502] bg-[#192233] ring-1 ring-[#fcd502]' : 'border-white/10 bg-[#192233]/40'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-extrabold text-white">Card (Visa, Mastercard, RuPay, Amex)</span>
                    </div>
                    {razorpayMethod === 'card' && <Check className="w-4 h-4 text-[#fcd502]" />}
                  </button>

                  {/* Netbanking */}
                  <button
                    type="button"
                    onClick={() => setRazorpayMethod('netbanking')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer active:scale-95 ${razorpayMethod === 'netbanking' ? 'border-[#fcd502] bg-[#192233] ring-1 ring-[#fcd502]' : 'border-white/10 bg-[#192233]/40'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-slate-300" />
                      <span className="text-xs font-extrabold text-white">Net Banking (HDFC, ICICI, SBI)</span>
                    </div>
                    {razorpayMethod === 'netbanking' && <Check className="w-4 h-4 text-[#fcd502]" />}
                  </button>
                </div>

                {/* Razorpay Execute Button */}
                <button
                  type="button"
                  onClick={handleExecuteRazorpayPayment}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ${advanceAmount.toFixed(2)} via Razorpay</span>
                </button>
              </div>
            )}

            {/* Razorpay Processing State */}
            {razorpayStep === 'processing' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">Authorizing Razorpay Payment...</h4>
                  <p className="text-xs text-slate-400 mt-1">Connecting to bank 256-bit SSL Gateway...</p>
                </div>
              </div>
            )}

            {/* Razorpay Success State */}
            {razorpayStep === 'success' && (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="font-black text-white text-base">Payment Authorized via Razorpay!</h4>
                <p className="text-xs text-slate-400">30% Advance Deposit (${advanceAmount.toFixed(2)}) Received.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REAL-TIME DRIVER MATCHING & APPROVAL WAITING DISPATCH MODAL */}
      {/* ======================================================== */}
      {isDriverDispatching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#131926] text-white w-full max-w-sm rounded-[32px] p-6 text-center space-y-4 shadow-2xl border border-white/10 relative">
            {/* Top Close Icon Button */}
            <button
              type="button"
              onClick={handleCloseToBookings}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Close and View in Bookings"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animated Radar Pulse */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fcd502] opacity-75"></span>
              <div className="relative w-16 h-16 rounded-full bg-[#192233] text-[#fcd502] flex items-center justify-center shadow-xl border-2 border-white/20">
                <UserCheck className="w-8 h-8 text-[#fcd502]" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider inline-block border border-amber-500/30">
                ⏳ Pending Driver Approval
              </span>
              <h3 className="text-base font-black text-white mt-2">
                {dispatchStep === 1 && 'Sending Request to Nearby Drivers...'}
                {dispatchStep === 2 && 'Marcus Vance Reviewing Request on Driver App...'}
                {dispatchStep === 3 && 'Chauffeur Marcus Vance ACCEPTED! 🎉'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Drivers take a moment to review trip details. You can track approval status in Bookings.
              </p>
            </div>

            {/* Step Progress Indicators */}
            <div className="space-y-2 text-xs text-left bg-[#192233] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-[#fcd502]" />
                <span>1. 30% Advance Deposit Paid</span>
              </div>
              <div className={`flex items-center gap-2 font-bold ${dispatchStep >= 2 ? 'text-blue-400' : 'text-slate-500'}`}>
                <Send className="w-4 h-4 text-blue-400" />
                <span>2. Request Sent to Driver App</span>
              </div>
              <div className={`flex items-center gap-2 font-bold ${dispatchStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <UserCheck className="w-4 h-4 text-[#fcd502]" />
                <span>3. Driver Approval Status</span>
              </div>
            </div>

            {/* Action Buttons: Cancel Trip vs Close to Bookings */}
            <div className="space-y-2 pt-1">
              {dispatchStep < 3 && (
                <button
                  type="button"
                  onClick={handleAcceptByDriver}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Driver Acceptance</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCancelTripRequest}
                  className="py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Trip</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseToBookings}
                  className="py-2.5 rounded-xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Bookings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
