import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Car, 
  Clock, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { Booking } from '../types';
import { RegionCode, formatPrice } from '../data/currencies';
import { InvoiceBillModal } from '../components/InvoiceBillModal';

interface BookingsViewProps {
  bookings: Booking[];
  onRepeatBooking: (booking: Booking) => void;
  onOpenDriverProfile: (driver: any) => void;
  currentRegion?: RegionCode;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onRepeatBooking,
  onOpenDriverProfile,
  currentRegion = 'in',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const filtered = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return b.status === 'upcoming' || b.status === 'in-progress' || b.status === 'pending_approval';
    return b.status === activeFilter;
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0F19] text-white animate-fade-in overflow-hidden">
      {/* FIXED Sticky Header & Category Filter Bar */}
      <div className="bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/10 shadow-xs flex-shrink-0 z-30 animate-drop-up stagger-1 pt-[max(env(safe-area-inset-top,54px),54px)]">
        {/* Title Header – left aligned */}
        <div className="py-3.5 px-4 flex items-center justify-between">
          <div className="flex-1 text-left">
            <h2 className="text-xl font-black text-white tracking-tight">Booking History</h2>
            <p className="text-[11px] text-slate-400 font-medium">All professional driver assignments for your trips</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/10 font-mono font-bold text-xs text-slate-300 border border-white/10 shadow-xs flex-shrink-0">
            {filtered.length} {filtered.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>

        {/* Category Filter Tabs (Fixed right under Header) */}
        <div className="px-4 pb-3">
          <div className="flex p-1 rounded-2xl bg-[#131926] border border-white/10 space-x-1">
            {[
              { id: 'all', label: 'All Trips' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 ${
                  activeFilter === tab.id
                    ? 'bg-[#fcd502] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Scrollable Section (Only the Booking History List Scrolls) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none pb-36 bg-[#0B0F19]">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-[#131926] rounded-3xl p-6 border border-white/10 shadow-xs animate-drop-up stagger-2">
            <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-white">No {activeFilter} bookings found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your booked luxury chauffeur rides will appear here.
            </p>
          </div>
        ) : (
          filtered.map((b, idx) => (
            <div
              key={b.id}
              className={`rounded-[32px] p-5 space-y-4 border border-white/10 bg-[#131926] shadow-md hover:border-white/20 transition-all animate-drop-up stagger-${Math.min(idx + 2, 6)}`}
            >
              {/* Top Status Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-[11px] font-black text-slate-400 truncate">#{b.bookingNumber}</span>
                  <span className="text-slate-600 text-[10px]">•</span>
                  <span className="text-[11px] font-extrabold text-slate-300 whitespace-nowrap">{b.date}</span>
                </div>

                {/* Status Badges */}
                {b.status === 'completed' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                  </span>
                )}
                {b.status === 'pending_approval' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/30 whitespace-nowrap flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span> Pending Approval
                  </span>
                )}
                {(b.status === 'upcoming' || b.status === 'in-progress') && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fcd502]/20 text-[#fcd502] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-[#fcd502]/40 whitespace-nowrap flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fcd502] animate-pulse"></span> Driver Assigned
                  </span>
                )}
                {b.status === 'cancelled' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-rose-500/30 whitespace-nowrap flex-shrink-0">
                    <XCircle className="w-3 h-3 text-rose-400" /> Cancelled
                  </span>
                )}
              </div>

              {/* Service & Route */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-base text-white">{b.serviceTitle}</h3>
                  {b.serviceType === 'Airport' ? (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#fcd502] border border-white/10 text-[9px] font-black uppercase whitespace-nowrap">
                      ✈️ Airport
                    </span>
                  ) : b.serviceType === 'Hourly' ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#fcd502]/20 text-[#fcd502] border border-[#fcd502]/30 text-[9px] font-black uppercase whitespace-nowrap">
                      ⏱️ Hourly
                    </span>
                  ) : b.tripCause ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-black uppercase whitespace-nowrap">
                      💼 {b.tripCause}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 bg-[#192233] p-3 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#fcd502] fill-[#fcd502]/25 stroke-[2] flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-200">{b.pickupLocation}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 fill-slate-400/20 stroke-[2] flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-200">{b.destinationLocation}</span>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
                  <span className="font-bold text-slate-300">{b.vehicle.name} ({b.vehicle.capacity})</span>
                </div>

                {b.driver && (
                  <button
                    type="button"
                    onClick={() => onOpenDriverProfile(b.driver)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer active:scale-95"
                  >
                    <img src={b.driver.photo} alt={b.driver.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                    <span className="font-bold text-[#fcd502] underline">{b.driver.name}</span>
                  </button>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-base font-black text-white">{formatPrice(b.priceTotal, currentRegion, 2)}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInvoiceBooking(b);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1 border border-white/10 transition-colors cursor-pointer active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRepeatBooking(b)}
                    className="px-3.5 py-2 rounded-xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-colors cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Repeat</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Bill UI Style Invoice Modal with Download & Cancel Buttons ── */}
      <InvoiceBillModal
        booking={selectedInvoiceBooking}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceBooking(null);
        }}
        currentRegion={currentRegion}
      />
    </div>
  );
};
