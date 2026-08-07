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
  QrCode,
  Sparkles,
  Printer
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
  const billReceiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const grandTotal = booking.priceTotal || 64.50;
  const baseRate = Math.round((grandTotal * 0.78) * 100) / 100;
  const platformFee = Math.round((grandTotal * 0.04) * 100) / 100;
  const cgstTax = Math.round(((grandTotal - baseRate - platformFee) / 2) * 100) / 100;
  const sgstTax = Math.round((grandTotal - baseRate - platformFee - cgstTax) * 100) / 100;
  const advancePaid = Math.round((grandTotal * 0.30) * 100) / 100;
  const remainingPaid = Math.round((grandTotal - advancePaid) * 100) / 100;

  const invoiceNo = `RDG-INV-${booking.bookingNumber?.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = booking.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const invoiceTime = booking.time || '14:30';

  // Download ONLY the pure receipt bill card (No app buttons or modal backdrop)
  const handleDownloadOnlyBill = async () => {
    if (!billReceiptRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#fcd502', '#121212', '#00E676', '#3B82F6']
      });

      const canvas = await html2canvas(billReceiptRef.current, {
        scale: 3, // Ultra-sharp 3x retina resolution for print & save
        backgroundColor: '#FFFFFF',
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `RIDINGO-Tax-Bill-${invoiceNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Invoice download error:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md my-auto py-2">
        {/* ═══════════════════════════════════════════════════════════════
            PURE BILL RECEIPT CARD (Only this card is downloaded)
           ═══════════════════════════════════════════════════════════════ */}
        <div 
          ref={billReceiptRef}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-scale-up"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {/* Bill Top Header with Official Luxury Branding */}
          <div className="bg-[#121212] text-white p-5 pt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcd502]/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#fcd502] text-[#121212] flex items-center justify-center font-black text-xl shadow-md">
                  R
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight leading-none text-white">RIDINGO</h3>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Official Tax Invoice & Receipt</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> Settled
                </span>
                <p className="text-[10px] font-mono font-bold text-slate-300 mt-1">{invoiceNo}</p>
              </div>
            </div>

            {/* Bill Meta Row */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Billed To</span>
                <span className="font-extrabold text-white text-xs block truncate mt-0.5">Alexander Vance</span>
                <span className="text-[9px] font-mono text-slate-400 block">SAC: 996601 • Chauffeur</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Date & Time</span>
                <span className="font-extrabold text-white text-xs block mt-0.5">{invoiceDate}</span>
                <span className="text-[9px] font-mono text-slate-400 block">{invoiceTime} • Completed</span>
              </div>
            </div>
          </div>

          {/* Perforated Jagged Receipt Divider */}
          <div className="relative h-4 bg-slate-100 flex items-center justify-between px-3 border-y border-dashed border-slate-300">
            <div className="w-3 h-3 rounded-full bg-black/80 -ml-4.5" />
            <div className="w-full border-t border-dashed border-slate-400 mx-2" />
            <div className="w-3 h-3 rounded-full bg-black/80 -mr-4.5" />
          </div>

          {/* Bill Body Details */}
          <div className="p-5 space-y-4 bg-white text-xs">
            {/* Route & Vehicle Card */}
            <div className="rounded-2xl p-3 bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#fcd502] bg-white flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pickup Station</span>
                  <span className="font-bold text-slate-900 block truncate">{booking.pickupLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-900 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Destination Drop</span>
                  <span className="font-bold text-slate-900 block truncate">{booking.destinationLocation}</span>
                </div>
              </div>

              {/* Vehicle & Chauffeur Info */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Car className="w-3.5 h-3.5 text-[#a18200]" />
                  <span>{booking.vehicle?.name || 'Executive Sedan'}</span>
                </div>
                {booking.driver && (
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.driver.name} (Badge #4829)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200">
                <span>Description</span>
                <span>Amount</span>
              </div>
              
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-700 font-medium">Chauffeur Luxury Drive ({booking.durationHours || 4}h)</span>
                <span className="font-bold text-slate-900 font-mono">{formatPrice(baseRate, currentRegion, 2)}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-700 font-medium">Platform & Comprehensive Insurance</span>
                <span className="font-bold text-slate-900 font-mono">{formatPrice(platformFee, currentRegion, 2)}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500 font-medium">CGST (9.0%)</span>
                <span className="font-bold text-slate-700 font-mono">{formatPrice(cgstTax, currentRegion, 2)}</span>
              </div>

              <div className="flex items-center justify-between py-0.5 border-b border-slate-100 pb-1.5">
                <span className="text-slate-500 font-medium">SGST (9.0%)</span>
                <span className="font-bold text-slate-700 font-mono">{formatPrice(sgstTax, currentRegion, 2)}</span>
              </div>

              {/* Total Paid Row */}
              <div className="flex items-center justify-between py-1 pt-1.5">
                <span className="text-xs font-black text-slate-900">Total Invoice Amount</span>
                <span className="text-base font-black text-slate-900 font-mono">{formatPrice(grandTotal, currentRegion, 2)}</span>
              </div>

              {/* 30% / 70% Paid Breakdown Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/80">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-emerald-700">30% Advance Deposit</span>
                  <span className="font-black text-emerald-900 font-mono mt-0.5 block">{formatPrice(advancePaid, currentRegion, 2)} (Paid)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">70% Final Settlement</span>
                  <span className="font-black text-slate-900 font-mono mt-0.5 block">{formatPrice(remainingPaid, currentRegion, 2)} (Paid)</span>
                </div>
              </div>
            </div>

            {/* Verification Seal & Security QR Footer */}
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-[#fcd502] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[11px] block text-white">Razorpay / UPI Verified Payment</span>
                  <span className="text-[9px] text-slate-400 font-mono block">TXN: 9842109841294 • Auth #8921</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-6 h-6 text-slate-900" />
              </div>
            </div>

            {/* Receipt Watermark Legal Note */}
            <p className="text-[8px] text-center text-slate-400 font-medium leading-tight">
              This is a digitally verified official tax invoice issued by RIDINGO Chauffeur Services Pvt Ltd. No signature required.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            APP UI ACTION BUTTONS (Floating OUTSIDE the bill receipt card)
           ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-xs border border-slate-200 shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadOnlyBill}
            disabled={isDownloading}
            className="py-3 px-4 rounded-2xl bg-[#fcd502] hover:bg-[#fde047] text-[#121212] font-black text-xs shadow-xl shadow-[#fcd502]/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isDownloading ? 'Saving Bill...' : 'Download Bill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
