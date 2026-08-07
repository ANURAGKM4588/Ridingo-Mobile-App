import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  MapPin, 
  Car, 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { Booking } from '../types';
import { RegionCode, formatPrice } from '../data/currencies';

interface InvoiceBillModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  currentRegion?: RegionCode;
}

export const InvoiceBillModal: React.FC<InvoiceBillModalProps> = ({
  booking,
  isOpen,
  onClose,
  currentRegion = 'in',
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const grandTotal = booking.priceTotal || 64.50;
  const baseRate = Math.round((grandTotal * 0.78) * 100) / 100;
  const platformFee = Math.round((grandTotal * 0.05) * 100) / 100;
  const gstTax = Math.round((grandTotal - baseRate - platformFee) * 100) / 100;
  const advancePaid = Math.round((grandTotal * 0.30) * 100) / 100;
  const remainingPaid = Math.round((grandTotal - advancePaid) * 100) / 100;

  const invoiceNo = `INV-${booking.bookingNumber?.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = booking.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Download Bill as High-Resolution Image / PDF
  const handleDownload = async () => {
    if (!billRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fcd502', '#121212', '#00E676', '#3B82F6']
      });

      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `RIDINGO-Tax-Invoice-${invoiceNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Invoice download failed:', err);
      // Fallback: browser print
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const text = `🧾 RIDINGO TAX INVOICE\nInvoice: ${invoiceNo}\nDate: ${invoiceDate}\nPickup: ${booking.pickupLocation}\nDestination: ${booking.destinationLocation}\nTotal Amount Paid: ${formatPrice(grandTotal, currentRegion, 2)}\nStatus: FULLY PAID & SETTLED ✓`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md my-auto bg-transparent">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-2 sm:-right-3 z-30 w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-black border border-slate-700 flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* ── Bill UI Style Receipt Container ── */}
        <div 
          ref={billRef}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-scale-up relative"
        >
          {/* Top Perforated Receipt Header */}
          <div className="bg-[#121212] text-white p-5 pt-6 relative overflow-hidden">
            {/* Background luxury gradient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#fcd502]/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#fcd502] text-[#121212] flex items-center justify-center font-black text-lg shadow-md">
                  R
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight leading-none text-white">RIDINGO</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Executive Chauffeur Service</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> Paid
                </span>
                <p className="text-[11px] font-mono font-bold text-slate-400 mt-1">{invoiceNo}</p>
              </div>
            </div>

            {/* Bill Meta Row */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Billed To</span>
                <span className="font-extrabold text-white text-xs block truncate mt-0.5">Alexander Vance</span>
                <span className="text-[10px] text-slate-400 block">GSTIN: 27AABCR1234F1Z5</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date & Time</span>
                <span className="font-extrabold text-white text-xs block mt-0.5">{invoiceDate}</span>
                <span className="text-[10px] text-slate-400 block">{booking.time || '14:30'} • Completed</span>
              </div>
            </div>
          </div>

          {/* Perforated Jagged Divider Line Effect */}
          <div className="relative h-4 bg-slate-100 flex items-center justify-between px-3 border-y border-dashed border-slate-300">
            <div className="w-3 h-3 rounded-full bg-black/75 -ml-4.5" />
            <div className="w-full border-t border-dashed border-slate-400 mx-2" />
            <div className="w-3 h-3 rounded-full bg-black/75 -mr-4.5" />
          </div>

          {/* Bill Body */}
          <div className="p-5 space-y-4 bg-white text-xs">
            {/* Route & Trip Details */}
            <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#fcd502] bg-white flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pickup</span>
                  <span className="font-bold text-slate-900 block truncate">{booking.pickupLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-slate-900 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                  <span className="font-bold text-slate-900 block truncate">{booking.destinationLocation}</span>
                </div>
              </div>

              {/* Vehicle & Driver Line */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Car className="w-3.5 h-3.5 text-[#a18200]" />
                  <span>{booking.vehicle?.name || 'Executive Sedan'}</span>
                </div>
                {booking.driver && (
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.driver.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Itemized Payment Table */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Payment Breakdown</h4>
              
              <div className="space-y-1.5 border-b border-slate-200 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Chauffeur Base Fare ({booking.durationHours || 4}h)</span>
                  <span className="font-bold text-slate-900 font-mono">{formatPrice(baseRate, currentRegion, 2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Safety Coverage & Service Fee</span>
                  <span className="font-bold text-slate-900 font-mono">{formatPrice(platformFee, currentRegion, 2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">GST / Taxes (18% Included)</span>
                  <span className="font-bold text-slate-900 font-mono">{formatPrice(gstTax, currentRegion, 2)}</span>
                </div>
              </div>

              {/* Total Paid Row */}
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-black text-slate-900">Total Invoice Amount</span>
                <span className="text-base font-black text-slate-900 font-mono">{formatPrice(grandTotal, currentRegion, 2)}</span>
              </div>

              {/* Paid Breakdown Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/80">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-700">30% Advance Deposit</span>
                  <span className="font-black text-emerald-900 font-mono mt-0.5 block">{formatPrice(advancePaid, currentRegion, 2)} (Paid)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">70% Final Settlement</span>
                  <span className="font-black text-slate-900 font-mono mt-0.5 block">{formatPrice(remainingPaid, currentRegion, 2)} (Settled)</span>
                </div>
              </div>
            </div>

            {/* Payment Method Verification Badge */}
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-[#fcd502] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-white">Razorpay / UPI Verified</span>
                  <span className="text-[10px] text-slate-400 font-mono block">TXN: 9842109841294</span>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* ── Action Buttons: Download and Cancel/Close ── */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs border border-slate-200 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="py-3 px-4 rounded-2xl bg-[#fcd502] hover:bg-[#fde047] text-[#121212] font-black text-xs shadow-lg shadow-[#fcd502]/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isDownloading ? 'Saving Bill...' : 'Download Bill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
