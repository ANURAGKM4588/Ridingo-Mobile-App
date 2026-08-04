import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Star, 
  Car, 
  Clock, 
  CheckCircle2,
  ChevronUp
} from 'lucide-react';
import type { DriverProfile, Booking } from '../types';
import { FEATURED_DRIVER } from '../data/mockData';

interface LiveTrackingViewProps {
  booking?: Booking | null;
  onOpenDriverProfile: (driver: DriverProfile) => void;
  onCancelRide?: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  booking,
  onOpenDriverProfile,
  onCancelRide,
}) => {
  const driver = booking?.driver || FEATURED_DRIVER;
  const [_driverLocation, setDriverLocation] = useState({ lat: 34.0736, lng: -118.4004 });
  const [etaMins] = useState(11);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);

  // Simulated live movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0004,
        lng: prev.lng + (Math.random() - 0.5) * 0.0004,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[620px] max-h-[72vh] rounded-[32px] overflow-hidden shadow-2xl border border-white/80 bg-slate-900">
      {/* Vector/Canvas Map Simulation */}
      <div className="absolute inset-0 z-0">
        <iframe
          title="Live Chauffeur Tracking Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13221.144815417646!2d-118.41164998782352!3d34.06965022067711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
          className="w-full h-full filter contrast-125 saturate-150 grayscale-[0.2]"
          loading="lazy"
        />

        {/* Live Animated Driver Pulse Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-[#84CC16] opacity-75"></span>
            <div className="w-9 h-9 rounded-full bg-[#121212] text-[#84CC16] flex items-center justify-center border-2 border-white shadow-2xl">
              <Car className="w-4 h-4 text-[#84CC16]" />
            </div>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-full bg-[#121212]/90 text-white text-[9px] font-black backdrop-blur-md shadow-lg border border-white/20 whitespace-nowrap">
            Marcus • In Transit
          </div>
        </div>
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <div className="glass-floating rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-extrabold text-slate-900 shadow-lg backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse"></span>
          <span>Live GPS Active</span>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={() => {
            setIsSOSActive(!isSOSActive);
            if (!isSOSActive) alert("Emergency SOS broadcasted to RIDINGO Safety Team!");
          }}
          className={`px-3 py-1.5 rounded-xl font-black text-[10px] flex items-center gap-1 shadow-lg transition-all ${
            isSOSActive
              ? 'bg-rose-600 text-white animate-bounce'
              : 'bg-white/90 text-rose-600 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isSOSActive ? 'SOS ACTIVE' : 'EMERGENCY SOS'}</span>
        </button>
      </div>

      {/* Bottom Floating Driver Card */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-auto">
        <div className="glass-floating rounded-[28px] p-4 shadow-2xl border border-white/90 space-y-3 backdrop-blur-2xl bg-white/95">
          {/* Top ETA & Status row */}
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#4D7C0F]">Chauffeur Arrival</span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-[#84CC16]" /> {etaMins} Mins Away
              </h3>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-[#121212] text-white text-[10px] font-extrabold">
                {booking ? booking.vehicle.name : 'Personal Sedan'}
              </span>
            </div>
          </div>

          {/* Driver Info Row - Single Line Specs */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => onOpenDriverProfile(driver)}
              className="flex items-center gap-3 cursor-pointer group min-w-0"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-white shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#84CC16] text-[#121212] flex items-center justify-center text-[9px] font-black shadow-sm">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-slate-900 group-hover:text-[#4D7C0F] transition-colors truncate">
                    {driver.name}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold whitespace-nowrap">
                    Master
                  </span>
                </div>
                {/* Single line stats */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-extrabold mt-0.5 whitespace-nowrap">
                  <span className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {driver.rating}
                  </span>
                  <span>•</span>
                  <span>{driver.yearsExperience} Yrs Exp</span>
                  <span>•</span>
                  <span>{driver.totalTrips} Trips</span>
                </div>
              </div>
            </div>

            {/* Quick Action Phone / Chat */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={`tel:${driver.phone}`}
                className="w-9 h-9 rounded-xl bg-[#121212] text-[#84CC16] hover:bg-black flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => alert(`Opening encrypted instant chat with ${driver.name}`)}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 flex items-center justify-center shadow-sm transition-transform active:scale-95"
                title="Chat Driver"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info details drawer toggle */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-extrabold text-slate-700">
            <span className="flex items-center gap-1 text-[#4D7C0F]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Full Suit Uniform Requested
            </span>
            <button
              onClick={() => setShowDetailsSheet(!showDetailsSheet)}
              className="flex items-center gap-1 text-slate-900 hover:text-black"
            >
              <span>{showDetailsSheet ? 'Hide' : 'Details'}</span>
              <ChevronUp className={`w-3.5 h-3.5 transition-transform ${showDetailsSheet ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Spec Sheet */}
          {showDetailsSheet && (
            <div className="pt-2 space-y-1.5 text-xs text-slate-600 animate-fade-in border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Location:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{booking?.pickupLocation || '742 Evergreen Terrace'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{booking?.destinationLocation || 'Financial District'}</span>
              </div>

              {onCancelRide && (
                <button
                  onClick={onCancelRide}
                  className="w-full py-1.5 mt-1 rounded-xl bg-rose-50 text-rose-600 font-extrabold text-xs hover:bg-rose-100 transition-colors"
                >
                  Cancel Ride
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
