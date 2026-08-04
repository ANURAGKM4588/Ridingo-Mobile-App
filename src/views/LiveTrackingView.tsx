import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Star, 
  Car, 
  Clock, 
  CheckCircle2,
  ChevronDown,
  Navigation,
  MapPin
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
    <div className="relative w-full h-[620px] max-h-[75vh] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 animate-fade-in">
      {/* Interactive Vector Map Overlay */}
      <div className="absolute inset-0 z-0">
        <iframe
          title="Live Chauffeur Tracking Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13221.144815417646!2d-118.41164998782352!3d34.06965022067711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
          className="w-full h-full border-0 pointer-events-auto"
          style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(125%) saturate(120%)' }}
          loading="lazy"
        />

        {/* Live Animated Driver Pulse Marker on Map */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-[#84CC16] opacity-75"></span>
            <div className="w-10 h-10 rounded-2xl bg-[#121212] text-[#84CC16] flex items-center justify-center border-2 border-white shadow-2xl">
              <Car className="w-5 h-5 text-[#84CC16]" />
            </div>
          </div>
          <div className="mt-1.5 px-3 py-1 rounded-full bg-[#121212]/90 text-white text-[10px] font-black backdrop-blur-md shadow-lg border border-white/20 whitespace-nowrap flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse" />
            <span>{driver.name.split(' ')[0]} • En Route</span>
          </div>
        </div>
      </div>

      {/* Top Floating Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-md flex items-center gap-1.5 text-[10px] font-extrabold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse"></span>
          <span>Live Tracking Active</span>
        </div>

        {/* Emergency SOS Button */}
        <button
          type="button"
          onClick={() => {
            setIsSOSActive(!isSOSActive);
            if (!isSOSActive) alert("Emergency SOS broadcasted to RIDINGO Safety Team!");
          }}
          className={`px-3 py-1.5 rounded-full font-black text-[10px] flex items-center gap-1 shadow-md transition-all cursor-pointer ${
            isSOSActive
              ? 'bg-rose-600 text-white animate-bounce'
              : 'bg-white/90 text-rose-600 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isSOSActive ? 'SOS BROADCASTED' : 'SOS'}</span>
        </button>
      </div>

      {/* Bottom Minimal & User-Friendly Floating Card */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-auto">
        <div className="bg-white rounded-[28px] p-4 shadow-2xl border border-slate-200/90 space-y-3">
          {/* Arrival Status & ETA */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4D7C0F]">Estimated Arrival</span>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4.5 h-4.5 text-[#84CC16]" /> {etaMins} Mins
              </h3>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-[#121212] text-[#84CC16] text-[10px] font-black uppercase tracking-wider shadow-sm">
                {booking ? booking.vehicle.name : 'Executive Sedan'}
              </span>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Confirmed Chauffeur</p>
            </div>
          </div>

          {/* Chauffeur Profile Card */}
          <div className="flex items-center justify-between gap-3">
            <div
              onClick={() => onOpenDriverProfile(driver)}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#84CC16] text-[#121212] flex items-center justify-center text-[8px] font-black shadow-sm">
                  ✓
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#4D7C0F] transition-colors truncate leading-snug">
                  {driver.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold mt-0.5 whitespace-nowrap truncate">
                  <span className="flex items-center gap-0.5 text-amber-500 font-black flex-shrink-0">
                    <Star className="w-3 h-3 fill-current" /> {driver.rating}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="truncate">{driver.yearsExperience} Yrs Exp</span>
                </div>
              </div>
            </div>

            {/* Non-Overlapping Compact Call & Chat Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a
                href={`tel:${driver.phone}`}
                className="w-9 h-9 rounded-xl bg-[#121212] hover:bg-black text-[#84CC16] flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => alert(`Opening encrypted instant chat with ${driver.name}`)}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Chat Driver"
              >
                <MessageSquare className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Minimal Collapsible Trip Details Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-extrabold text-slate-700">
            <span className="flex items-center gap-1 text-[#4D7C0F]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16]" /> Suit Uniform Driver
            </span>

            <button
              type="button"
              onClick={() => setShowDetailsSheet(!showDetailsSheet)}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>{showDetailsSheet ? 'Hide Details' : 'Trip Details'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetailsSheet ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Route Details */}
          {showDetailsSheet && (
            <div className="pt-2 space-y-2 text-xs text-slate-600 animate-fade-in border-t border-slate-100">
              <div className="flex items-start gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#84CC16] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location</p>
                  <p className="font-extrabold text-slate-800 truncate">{booking?.pickupLocation || '742 Evergreen Terrace, Beverly Hills'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Destination</p>
                  <p className="font-extrabold text-slate-800 truncate">{booking?.destinationLocation || 'LAX Airport Executive Terminal'}</p>
                </div>
              </div>

              {onCancelRide && (
                <button
                  type="button"
                  onClick={onCancelRide}
                  className="w-full py-2 mt-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors cursor-pointer"
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
