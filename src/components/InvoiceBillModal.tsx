import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
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
  const printableReceiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const grandTotal = booking.priceTotal || 64.50;
  const baseRate = Math.round((grandTotal * 0.78) * 100) / 100;
  const platformFee = Math.round((grandTotal * 0.04) * 100) / 100;
  const cgstTax = Math.round(((grandTotal - baseRate - platformFee) / 2) * 100) / 100;
  const sgstTax = Math.round((grandTotal - baseRate - platformFee - cgstTax) * 100) / 100;
  const advancePaid = Math.round((grandTotal * 0.30) * 100) / 100;
  const remainingPaid = Math.round((grandTotal - advancePaid) * 100) / 100;

  const invoiceNo = `RDG-INV-${booking.bookingNumber?.replace(/[^0-9]/g, '') || '20268831'}`;
  const invoiceDate = booking.date || 'Today, 2:30 PM';
  const invoiceTime = booking.time || '2:30 PM';

  // Download ONLY the clean, pure printable receipt (No UI buttons, No circles, No backdrop)
  const handleDownloadCleanBill = async () => {
    if (!printableReceiptRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // Temporarily ensure element is rendered with solid clean background
      const canvas = await html2canvas(printableReceiptRef.current, {
        scale: 2.5,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 420,
      });

      const link = document.createElement('a');
      link.download = `RIDINGO-Tax-Invoice-${invoiceNo}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Invoice download error:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md my-auto flex flex-col items-center">
        
        {/* ═══════════════════════════════════════════════════════════════
            PURE CLEAN INVOICE BILL (Only this card is downloaded)
            • Zero stray circles
            • Zero close buttons inside
            • Crisp professional executive styling
           ═══════════════════════════════════════════════════════════════ */}
        <div 
          ref={printableReceiptRef}
          className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-scale-up"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
        >
          {/* Header Section */}
          <div className="bg-white p-5 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#fcd502] flex items-center justify-center font-black text-xl shadow-xs">
                  R
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 leading-none">RIDINGO</h3>
                  <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Executive Chauffeur Service</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> Paid
                </span>
                <p className="text-[10px] font-mono font-bold text-slate-600 mt-1">{invoiceNo}</p>
              </div>
            </div>

            {/* Billed To Meta */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Billed To</span>
                <span className="font-extrabold text-slate-900 text-xs block truncate mt-0.5">Alexander Vance</span>
                <span className="text-[9px] font-mono text-slate-500 block">GSTIN: 27AABCR1234F1Z5</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Date & Time</span>
                <span className="font-extrabold text-slate-900 text-xs block mt-0.5">{invoiceDate}</span>
                <span className="text-[9px] font-mono text-slate-500 block">{invoiceTime} • Completed</span>
              </div>
            </div>
          </div>

          {/* Clean Dashed Receipt Separator Line */}
          <div className="w-full border-t border-dashed border-slate-300" />

          {/* Bill Body Details */}
          <div className="p-5 space-y-4 bg-white text-xs">
            {/* Route & Trip Card */}
            <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-3 h-3 rounded-full border-2 border-[#fcd502] bg-white flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pickup</span>
                  <span className="font-bold text-slate-900 block truncate leading-tight">{booking.pickupLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3 h-3 text-slate-900 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                  <span className="font-bold text-slate-900 block truncate leading-tight">{booking.destinationLocation}</span>
                </div>
              </div>

              {/* Vehicle & Chauffeur */}
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
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200">
                <span>Payment Breakdown</span>
                <span>Amount</span>
              </div>
              
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-600 font-medium">Chauffeur Base Fare ({booking.durationHours || 4}h)</span>
                <span className="font-bold text-slate-900 font-mono">{formatPrice(baseRate, currentRegion, 2)}</span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-600 font-medium">Safety Coverage & Service Fee</span>
                <span className="font-bold text-slate-900 font-mono">{formatPrice(platformFee, currentRegion, 2)}</span>
              </div>

              <div className="flex items-center justify-between py-0.5 border-b border-slate-100 pb-1.5">
                <span className="text-slate-500 font-medium">GST / Taxes (18% Included)</span>
                <span className="font-bold text-slate-700 font-mono">{formatPrice(cgstTax + sgstTax, currentRegion, 2)}</span>
              </div>

              {/* Total Row */}
              <div className="flex items-center justify-between py-1 pt-1.5">
                <span className="text-xs font-black text-slate-900">Total Invoice Amount</span>
                <span className="text-base font-black text-slate-900 font-mono">{formatPrice(grandTotal, currentRegion, 2)}</span>
              </div>

              {/* Advance & Settlement Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-emerald-700">30% Advance Deposit</span>
                  <span className="font-black text-emerald-900 font-mono mt-0.5 block">{formatPrice(advancePaid, currentRegion, 2)} (Paid)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">70% Final Settlement</span>
                  <span className="font-black text-slate-900 font-mono mt-0.5 block">{formatPrice(remainingPaid, currentRegion, 2)} (Settled)</span>
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-[11px] block text-slate-900">Razorpay / UPI Verified</span>
                  <span className="text-[9px] text-slate-500 font-mono block">TXN: 9842109841294</span>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Official Legal Footer */}
            <p className="text-[8px] text-center text-slate-400 font-medium leading-tight pt-1">
              RIDINGO Chauffeur Services Pvt Ltd • SAC Code: 996601 • Computer-generated tax invoice.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SEPARATE ACTION BUTTONS (Floating OUTSIDE the bill receipt)
            • These buttons are NOT inside printableReceiptRef
            • They will NEVER be present in the downloaded image/PDF
           ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs border border-slate-200 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCleanBill}
            disabled={isDownloading}
            className="py-3 px-4 rounded-xl bg-[#fcd502] hover:bg-[#fde047] text-[#121212] font-black text-xs shadow-lg shadow-[#fcd502]/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isDownloading ? 'Downloading...' : 'Download Bill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
