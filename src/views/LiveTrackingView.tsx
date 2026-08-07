import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageSquare,
  ShieldAlert,
  Star,
  Car,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Navigation,
  MapPin,
  Wifi,
  WifiOff,
  Radio,
  Sparkles,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle,
  Play
} from 'lucide-react';
import type { DriverProfile, Booking } from '../types';
import { FEATURED_DRIVER } from '../data/mockData';
import { LeafletMap } from '../components/LeafletMap';
import type { LatLng } from '../components/LeafletMap';
import { bridgeListen } from '../lib/bridge';
import type { DriverLocationPayload } from '../lib/bridge';
import { startTraccarPolling, isTraccarConfigured } from '../lib/traccar';
import { fetchRoute } from '../lib/routing';
import { RegionCode, formatPrice } from '../data/currencies';

export type TrackingStatus = 'idle' | 'pending' | 'accepted' | 'tracking';

interface LiveTrackingViewProps {
  booking?: Booking | null;
  onOpenDriverProfile: (driver: DriverProfile) => void;
  onCancelRide?: () => void;
  onNavigateToBook?: () => void;
  currentRegion?: RegionCode;
}

// Default coordinates: Cochin International Airport (COK) & Marine Drive, Kochi, Kerala, India
const DEFAULT_PICKUP: LatLng = { lat: 10.1518, lng: 76.3930 };
const DEFAULT_DEST: LatLng = { lat: 9.9657, lng: 76.2421 };

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  booking,
  onOpenDriverProfile,
  onCancelRide,
  onNavigateToBook,
  currentRegion = 'in',
}) => {
  const driver = booking?.driver || FEATURED_DRIVER;

  // Trip Lifecycle State: idle | pending | accepted | tracking
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>(
    booking ? 'accepted' : 'idle'
  );
  const [isSheetMinimized, setIsSheetMinimized] = useState(false);

  const [driverLocation, setDriverLocation] = useState<LatLng | undefined>(undefined);
  const [driverHeading, setDriverHeading] = useState<number | undefined>(45);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [trackingSource, setTrackingSource] = useState<'traccar' | 'bridge' | 'device-gps' | 'simulated'>('simulated');
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const [etaMins, setEtaMins] = useState(11);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | undefined>(undefined);
  const etaTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync state if booking changes
  useEffect(() => {
    if (!booking) {
      setTrackingStatus('idle');
    } else if (trackingStatus === 'idle') {
      setTrackingStatus('accepted');
    }
  }, [booking]);

  // Pickup and destination LatLng (Defaults to Kerala)
  const pickupLatLng: LatLng = (booking as any)?.pickupLatLng || DEFAULT_PICKUP;
  const destLatLng: LatLng = (booking as any)?.destinationLatLng || DEFAULT_DEST;

  // 0. Real Device Geolocation API (Live GPS Tracking in Kerala)
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const heading = pos.coords.heading || 45;

        // If tracking is active, update map position with live real-time device coordinates
        if (trackingStatus === 'tracking') {
          setDriverLocation({ lat, lng });
          setDriverHeading(heading);
          setIsLiveTracking(true);
          setTrackingSource('device-gps');
          setLastSeen(new Date());
        }
      },
      (err) => {
        console.warn('Live GPS notice:', err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trackingStatus]);

  // Fetch OSRM route line
  useEffect(() => {
    fetchRoute(pickupLatLng, destLatLng).then(r => {
      if (r?.geometry) setRouteGeometry(r.geometry);
    });
  }, [pickupLatLng.lat, pickupLatLng.lng, destLatLng.lat, destLatLng.lng]);

  // 1. Traccar Polling (if configured)
  useEffect(() => {
    if (!isTraccarConfigured()) return;
    const cleanup = startTraccarPolling((pos) => {
      setDriverLocation({ lat: pos.lat, lng: pos.lng });
      setDriverHeading(pos.heading);
      setIsLiveTracking(true);
      setTrackingSource('traccar');
      setLastSeen(new Date());
    }, 3000);
    return cleanup;
  }, []);

  // 2. BroadcastChannel bridge listener (real local GPS from Driver App)
  useEffect(() => {
    const cleanup = bridgeListen((msg) => {
      if (msg.sentFrom !== 'driver-app') return;

      if (msg.type === 'DRIVER_LOCATION') {
        const loc = msg.payload as DriverLocationPayload;
        setDriverLocation({ lat: loc.lat, lng: loc.lng });
        if (loc.heading !== undefined) setDriverHeading(loc.heading);
        setIsLiveTracking(true);
        setTrackingSource('bridge');
        setLastSeen(new Date());
      }

      if (msg.type === 'TRIP_STARTED') {
        setIsLiveTracking(true);
        setTrackingStatus('tracking');
        if (etaTimerRef.current) clearInterval(etaTimerRef.current);
        etaTimerRef.current = setInterval(() => {
          setEtaMins(prev => Math.max(0, prev - 1));
        }, 60_000);
      }

      if (msg.type === 'TRIP_COMPLETED') {
        setIsLiveTracking(false);
        if (etaTimerRef.current) clearInterval(etaTimerRef.current);
        setEtaMins(0);
      }
    });
    return () => {
      cleanup();
      if (etaTimerRef.current) clearInterval(etaTimerRef.current);
    };
  }, []);

  // Real-time Demo Vehicle Tracking Motion along Route in Kerala
  useEffect(() => {
    if (trackingStatus !== 'tracking') return;

    let index = 0;
    // Immediately place vehicle at pickup point
    if (routeGeometry && routeGeometry.length > 0) {
      setDriverLocation({ lat: routeGeometry[0][1], lng: routeGeometry[0][0] });
    } else {
      setDriverLocation(pickupLatLng);
    }

    const updateInterval = setInterval(() => {
      if (routeGeometry && routeGeometry.length > 0) {
        index = (index + 1) % routeGeometry.length;
        const point = routeGeometry[index];
        const nextPoint = routeGeometry[(index + 1) % routeGeometry.length];
        const lat = point[1];
        const lng = point[0];

        // Calculate smooth heading angle
        let heading = 45;
        if (nextPoint) {
          const dy = nextPoint[1] - point[1];
          const dx = nextPoint[0] - point[0];
          heading = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
        }

        setDriverLocation({ lat, lng });
        setDriverHeading(heading);
        setLastSeen(new Date());
      } else {
        index++;
        const delta = (index * 0.0004);
        setDriverLocation({
          lat: pickupLatLng.lat - delta,
          lng: pickupLatLng.lng - delta * 0.8,
        });
        setDriverHeading(215);
        setLastSeen(new Date());
      }
    }, 1200);

    return () => clearInterval(updateInterval);
  }, [trackingStatus, routeGeometry, pickupLatLng.lat, pickupLatLng.lng]);

  const mapCenter = driverLocation ?? pickupLatLng;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col overflow-hidden bg-slate-900 animate-fade-in">

      {/* ── GOOGLE MAPS NAVIGATION TURN-BY-TURN GUIDANCE BANNER (Active in Tracking Mode) ── */}
      {trackingStatus === 'tracking' ? (
        <div className="shrink-0 sticky top-0 z-40 w-full px-4 pt-[max(env(safe-area-inset-top),44px)] pb-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-zinc-900 border-b border-emerald-500/30 shadow-2xl text-white pointer-events-auto flex items-center justify-between animate-drop-up">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#fcd502] text-[#121212] flex items-center justify-center font-black text-xl shadow-lg flex-shrink-0 animate-pulse-subtle">
              ⬆
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-[#fcd502] uppercase tracking-widest block truncate">
                In 200m • Head North-East on Grand Ave
              </span>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2 mt-0.5 truncate">
                <span>{etaMins > 0 ? `${etaMins} Mins` : 'Arriving Now'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400 font-mono text-[11px]">48 km/h</span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {booking && (
              <button
                type="button"
                onClick={() => {
                  setIsSOSActive(!isSOSActive);
                  if (!isSOSActive) alert('Emergency SOS broadcasted to RIDINGO Safety Desk!');
                }}
                className={`px-2.5 py-1 rounded-full font-black text-[10px] flex items-center gap-1 shadow-xs transition-all cursor-pointer ${
                  isSOSActive
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-rose-50/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isSOSActive ? 'SOS SENT' : 'SOS'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── SOLID WHITE CAMERA NOTCH & DYNAMIC ISLAND TOP MASK ── */
        <div className="shrink-0 sticky top-0 z-30 w-full px-4 pt-[max(env(safe-area-inset-top),44px)] pb-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs flex items-center justify-between pointer-events-auto">
          
          {/* Dynamic Status Pill */}
          <div className={`px-3 py-1 rounded-full backdrop-blur-md border flex items-center gap-1.5 text-[10px] font-black shadow-2xs ${
            trackingStatus === 'idle'
              ? 'bg-slate-100 border-slate-200 text-slate-700'
              : trackingStatus === 'pending'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}>
            {trackingStatus === 'idle' && (
              <>
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Chauffeur Service Ready</span>
              </>
            )}

            {trackingStatus === 'pending' && (
              <>
                <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />
                <span>Matching Chauffeur...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </>
            )}

            {trackingStatus === 'accepted' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                <span>Chauffeur Confirmed</span>
              </>
            )}
          </div>

          {/* SOS Emergency Button */}
          <div className="flex items-center gap-1.5">
            {booking && (
              <button
                type="button"
                onClick={() => {
                  setIsSOSActive(!isSOSActive);
                  if (!isSOSActive) alert('Emergency SOS broadcasted to RIDINGO Safety Desk!');
                }}
                className={`px-2.5 py-1 rounded-full font-black text-[10px] flex items-center gap-1 shadow-xs transition-all cursor-pointer ${
                  isSOSActive
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isSOSActive ? 'SOS SENT' : 'SOS'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── LEAFLET MAP (Middle Background) ── */}
      <div className="absolute inset-0 z-0">
        <LeafletMap
          center={mapCenter}
          zoom={14}
          className="w-full h-full"
          driverLocation={trackingStatus === 'tracking' ? driverLocation : undefined}
          driverHeading={driverHeading}
          pickup={pickupLatLng}
          destination={destLatLng}
          pickupLabel={booking?.pickupLocation || 'Pickup'}
          destinationLabel={booking?.destinationLocation || 'Destination'}
          routeGeometry={routeGeometry}
          darkMode={true}
          isNavigationMode={trackingStatus === 'tracking'}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          LIFECYCLE STATE 1: NO ACTIVE TRIP / NO REQUEST
          • Zero driver popup
          • Clean luxury status card with "Book a Driver" CTA
         ═══════════════════════════════════════════════════════════════ */}
      {trackingStatus === 'idle' && (
        <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-auto animate-slide-up-bottom">
          <div className="w-full bg-white rounded-t-[32px] rounded-b-none px-5 pt-4 pb-28 sm:pb-32 shadow-[0_-15px_40px_rgba(0,0,0,0.14)] border-t border-slate-200/90 space-y-3.5 text-slate-900">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto -mt-1" />

            <div className="text-center py-2 space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Car className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-black text-slate-900">No Active Chauffeur Trip</h3>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Request an on-demand executive driver or schedule an airport transfer with live tracking.
              </p>
            </div>

            {onNavigateToBook && (
              <button
                type="button"
                onClick={onNavigateToBook}
                className="w-full py-3.5 rounded-2xl bg-[#fcd502] hover:bg-[#fde047] text-[#121212] font-black text-xs shadow-xl shadow-[#fcd502]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Book an Executive Driver</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          LIFECYCLE STATE 2: PENDING / REQUESTED TIME
          • Status: PENDING DRIVER ACCEPTANCE
          • User Trip Details (Pickup, Destination, Requested Time, Vehicle)
          • Searching nearby certified chauffeurs radar
         ═══════════════════════════════════════════════════════════════ */}
      {trackingStatus === 'pending' && booking && (
        <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-auto animate-slide-up-bottom">
          <div className="w-full bg-white rounded-t-[32px] rounded-b-none px-5 pt-4 pb-28 sm:pb-32 shadow-[0_-15px_40px_rgba(0,0,0,0.14)] border-t border-slate-200/90 space-y-3.5 text-slate-900">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto -mt-1 mb-1" />

            {/* Pending Status Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Pending Driver Acceptance
                  </span>
                  <p className="text-xs font-bold text-slate-600">Dispatching to top 1% chauffeurs</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                Matching...
              </span>
            </div>

            {/* Requested Trip Details */}
            <div className="rounded-2xl p-3 bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-200/60 pb-1.5">
                <span className="flex items-center gap-1.5 text-[#a18200]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Requested Time: {booking.date || 'Today'}, {booking.time || '2:30 PM'}</span>
                </span>
                <span className="font-mono text-slate-900 font-extrabold">
                  {formatPrice(booking.priceTotal || 64.50, currentRegion, 2)}
                </span>
              </div>

              <div className="flex items-start gap-2 pt-0.5">
                <div className="w-3 h-3 rounded-full border-2 border-[#fcd502] bg-white flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pickup</span>
                  <span className="font-bold text-slate-900 block truncate">{booking.pickupLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                  <span className="font-bold text-slate-900 block truncate">{booking.destinationLocation}</span>
                </div>
              </div>
            </div>

            {/* Simulation Accept Trigger & Cancel */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {onCancelRide && (
                <button
                  type="button"
                  onClick={onCancelRide}
                  className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel Request
                </button>
              )}

              <button
                type="button"
                onClick={() => setTrackingStatus('accepted')}
                className="py-3 px-3 rounded-xl bg-[#121212] hover:bg-black text-[#fcd502] font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Chauffeur Accepted ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          LIFECYCLE STATE 3: DRIVER ACCEPTED & ASSIGNED
          • Status: CHAUFFEUR ACCEPTED
          • Accepted Driver Details (Photo, Name, Rating, Exp, Vehicle)
          • Call & Message Icons
          • NEW Button: "Start Live GPS Tracking"
         ═══════════════════════════════════════════════════════════════ */}
      {trackingStatus === 'accepted' && booking && (
        <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-auto animate-slide-up-bottom">
          <div className="w-full bg-white rounded-t-[32px] rounded-b-none px-5 pt-4 pb-28 sm:pb-32 shadow-[0_-15px_40px_rgba(0,0,0,0.14)] border-t border-slate-200/90 space-y-3 text-slate-900">
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto -mt-1 mb-1" />

            {/* Accepted Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                  Chauffeur Assigned & Accepted
                </span>
                <p className="text-xs font-bold text-slate-700">Driver is preparing for pickup</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase shadow-2xs">
                ✓ Accepted
              </span>
            </div>

            {/* Accepted Driver Details Card */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div
                onClick={() => onOpenDriverProfile(driver)}
                className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#fcd502] text-[#121212] flex items-center justify-center text-[8px] font-black shadow-xs">✓</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-sm text-slate-900 group-hover:text-[#a18200] transition-colors truncate leading-snug">
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

              {/* Call & Message Icons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`tel:${driver.phone}`}
                  className="w-10 h-10 rounded-xl bg-[#121212] hover:bg-black text-[#fcd502] flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Opening encrypted instant chat with ${driver.name}`)}
                  className="w-10 h-10 rounded-xl bg-white text-slate-800 hover:bg-slate-100 flex items-center justify-center border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  title="Chat Driver"
                >
                  <MessageSquare className="w-4 h-4 text-slate-700 fill-slate-700/20 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* NEW BUTTON: START LIVE GPS TRACKING */}
            <button
              type="button"
              onClick={() => {
                setTrackingStatus('tracking');
                setIsLiveTracking(true);
                setIsSheetMinimized(true); // Smoothly slide down sheet so user sees full map view!
              }}
              className="w-full py-3.5 rounded-2xl bg-[#fcd502] hover:bg-[#fde047] text-[#121212] font-black text-xs shadow-xl shadow-[#fcd502]/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-current stroke-[2.5]" />
              <span>Start Live GPS Tracking</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          LIFECYCLE STATE 4: LIVE TRACKING ACTIVE
          • Smooth downward slide animation when minimized to view map only
          • Re-expandable floating sheet toggle handle
         ═══════════════════════════════════════════════════════════════ */}
      {trackingStatus === 'tracking' && booking && (
        <div className={`absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSheetMinimized ? 'translate-y-[calc(100%-62px)]' : 'translate-y-0'
        }`}>
          <div className="w-full bg-white rounded-t-[32px] rounded-b-none px-5 pt-2 pb-28 sm:pb-32 shadow-[0_-15px_40px_rgba(0,0,0,0.14)] border-t border-slate-200/90 space-y-3 text-slate-900">
            
            {/* Drag Handle & Smooth Sheet Collapse / Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsSheetMinimized(!isSheetMinimized)}
              className="w-full flex flex-col items-center justify-center pt-1 pb-1 cursor-pointer group"
            >
              <div className="w-10 h-1.2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors mb-1" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#a18200] flex items-center gap-1">
                {isSheetMinimized ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#a18200] animate-bounce" />
                    <span>Tap to Expand Driver Details</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>Minimize to Full Map View</span>
                  </>
                )}
              </span>
            </button>

            {/* ETA & Live Status Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#a18200]">
                  Driver En Route
                </span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
                  {etaMins > 0 ? `${etaMins} Mins` : 'Arriving Now'}
                </h3>
                {lastSeen && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    GPS updated {Math.round((Date.now() - lastSeen.getTime()) / 1000)}s ago
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-[#121212] text-[#fcd502] text-[10px] font-black uppercase tracking-wider shadow-xs">
                  {booking ? booking.vehicle.name : 'Executive Sedan'}
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Confirmed Chauffeur</p>
              </div>
            </div>

            {/* Driver Profile */}
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
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#fcd502] text-[#121212] flex items-center justify-center text-[8px] font-black shadow-xs">✓</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-sm text-slate-900 group-hover:text-[#a18200] transition-colors truncate leading-snug">
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

              {/* Direct Call & Instant Chat */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`tel:${driver.phone}`}
                  className="w-9 h-9 rounded-xl bg-[#121212] hover:bg-black text-[#fcd502] flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" />
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Opening encrypted instant chat with ${driver.name}`)}
                  className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  title="Chat Driver"
                >
                  <MessageSquare className="w-4 h-4 text-slate-700 fill-slate-700/20 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Trip Details Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-extrabold text-slate-700">
              <span className="flex items-center gap-1 text-[#a18200]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#fcd502] fill-[#fcd502]/25 stroke-[2]" /> Suit Uniform Attire
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
                  <Navigation className="w-3.5 h-3.5 text-[#fcd502] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location</p>
                    <p className="font-extrabold text-slate-800 truncate">{booking.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Destination</p>
                    <p className="font-extrabold text-slate-800 truncate">{booking.destinationLocation}</p>
                  </div>
                </div>
                {onCancelRide && (
                  <button
                    type="button"
                    onClick={onCancelRide}
                    className="w-full py-2.5 mt-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors cursor-pointer"
                  >
                    Cancel Ride
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};