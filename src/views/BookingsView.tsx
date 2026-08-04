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
  ShieldCheck
} from 'lucide-react';
import { Booking } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
  onRepeatBooking: (booking: Booking) => void;
  onOpenDriverProfile: (driver: any) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onRepeatBooking,
  onOpenDriverProfile,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filtered = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return b.status === 'upcoming' || b.status === 'in-progress';
    return b.status === activeFilter;
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-fade-in pb-20">
      {/* Title & Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Booking History</h2>
          <p className="text-xs text-slate-500 font-medium">All professional driver assignments for your vehicles</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-slate-200/70 space-x-1">
        {[
          { id: 'all', label: 'All Trips' },
          { id: 'upcoming', label: 'Upcoming / Live' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeFilter === tab.id
                ? 'bg-white text-[#0F172A] shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline List of Large Cards */}
      <div className="space-y-4 relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-slate-200 z-0 hidden sm:block" />

        {filtered.map((b) => (
          <div
            key={b.id}
            className="glass-card rounded-[32px] p-5 space-y-4 border border-slate-200/80 bg-white shadow-md relative z-10 hover:shadow-xl transition-all"
          >
            {/* Minimal & Eye-Catching Single-Line Top Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono text-[11px] font-black text-slate-500 truncate">#{b.bookingNumber}</span>
                <span className="text-slate-300 text-[10px]">•</span>
                <span className="text-[11px] font-extrabold text-slate-700 whitespace-nowrap">{b.date}</span>
              </div>

              {/* Single-Line Eye-Catching Status Badge */}
              {b.status === 'completed' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-200 whitespace-nowrap flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                </span>
              )}
              {b.status === 'pending_approval' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/30 whitespace-nowrap flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> Pending Approval
                </span>
              )}
              {(b.status === 'upcoming' || b.status === 'in-progress') && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#84CC16]/20 text-[#4D7C0F] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-[#84CC16]/40 whitespace-nowrap flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse"></span> Driver Assigned
                </span>
              )}
              {b.status === 'cancelled' && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-rose-200 whitespace-nowrap flex-shrink-0">
                  <XCircle className="w-3 h-3 text-rose-500" /> Cancelled
                </span>
              )}
            </div>

            {/* Service & Route */}
            <div className="space-y-2">
              <h3 className="font-black text-base text-slate-900">{b.serviceTitle}</h3>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{b.pickupLocation}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{b.destinationLocation}</span>
                </div>
              </div>
            </div>

            {/* Driver & Vehicle */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#84CC16]" />
                <span className="font-bold text-slate-800">{b.vehicle.name} ({b.vehicle.capacity})</span>
              </div>

              {b.driver && (
                <button
                  onClick={() => onOpenDriverProfile(b.driver)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img src={b.driver.photo} alt={b.driver.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-bold text-slate-900 underline">{b.driver.name}</span>
                </button>
              )}
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-base font-black text-slate-900">${b.priceTotal.toFixed(2)}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Downloading official TAX PDF invoice for #${b.bookingNumber}`)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={() => onRepeatBooking(b)}
                  className="px-3.5 py-2 rounded-xl bg-[#121212] hover:bg-black text-[#84CC16] font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
