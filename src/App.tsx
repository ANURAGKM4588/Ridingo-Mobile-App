import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { TabType, ServiceItem, VehicleOption, Booking, DriverProfile } from './types';
import { MOCK_SERVICES, MOCK_VEHICLES, MOCK_BOOKINGS, MOCK_NOTIFICATIONS } from './data/mockData';

// Layout & Components
import { HeaderBar } from './components/HeaderBar';
import { FloatingNav } from './components/FloatingNav';

// Views
import { HomeView } from './views/HomeView';
import { BookingsView } from './views/BookingsView';
import { LiveTrackingView } from './views/LiveTrackingView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';

// Modals & Sub-screens
import { BookingFlowModal } from './views/BookingFlowModal';
import { BookingConfirmationView } from './views/BookingConfirmationView';
import { BookingReviewScreen } from './views/BookingReviewScreen';
import { InvoicePaymentScreen } from './views/InvoicePaymentScreen';
import { NotificationsView } from './views/NotificationsView';
import { DriverProfileModal } from './views/DriverProfileModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(MOCK_VEHICLES[0]);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(MOCK_BOOKINGS[0]); // active trip for live tracking
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // View / Modal Flags
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState<boolean>(false);
  const [selectedServiceForFlow, setSelectedServiceForFlow] = useState<ServiceItem | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  
  // Booking Review & Invoice Screen State
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [bookingDraft, setBookingDraft] = useState<any>(null);

  // Driver Profile Modal State
  const [driverModalProfile, setDriverModalProfile] = useState<DriverProfile | null>(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState<boolean>(false);

  // Device Frame View State (Mobile Frame vs Expanded View)
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Handlers
  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceForFlow(service);
    setIsBookingFlowOpen(true);
  };

  const handleStartBooking = (params: any) => {
    setBookingDraft(params);
    setIsReviewOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    setActiveBooking(newBooking);
    setConfirmedBooking(newBooking);
    setIsBookingFlowOpen(false);
    setIsReviewOpen(false);
    setIsInvoiceOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleOpenDriverProfile = (driver: DriverProfile) => {
    setDriverModalProfile(driver);
    setIsDriverModalOpen(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-[#0F172A] flex items-center justify-center p-2 sm:p-6 selection:bg-[#84CC16] overflow-x-hidden">
      {/* Mobile Device Frame Container - Strict 390px x 812px iPhone 16 Pro dimensions */}
      <div
        className={`transition-all duration-300 relative flex flex-col ${
          isMobileFrame
            ? 'w-[390px] min-w-[390px] max-w-[390px] h-[812px] shrink-0 rounded-[48px] border-[10px] border-zinc-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-[#FAFAFA] overflow-hidden my-auto ring-1 ring-white/20'
            : 'w-full max-w-2xl h-[840px] max-h-[96vh] rounded-[36px] bg-[#FAFAFA] shadow-2xl overflow-hidden'
        }`}
      >
        {/* Dynamic Island / Notch when in Mobile Frame Mode */}
        {isMobileFrame && (
          <div className="w-full flex justify-center pt-2.5 pb-1 bg-[#FAFAFA] z-40 select-none shrink-0">
            <div className="w-24 h-4.5 rounded-full bg-black flex items-center justify-between px-2.5 text-white text-[9px] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
              <span className="font-mono text-[8px] text-slate-400">RIDINGO iOS</span>
            </div>
          </div>
        )}

        {/* Global Header Bar - Rendered only on Home Page */}
        {activeTab === 'home' && !isReviewOpen && !isInvoiceOpen && !isConfirmationOpen && !isNotificationsOpen && (
          <HeaderBar
            unreadNotificationsCount={unreadCount}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            isMobileFrame={isMobileFrame}
            onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}

        {/* Main Content Area based on Active Tab or Views */}
        <main className="flex-1 overflow-y-auto px-3.5 pt-3 pb-24 scrollbar-none relative">
          {/* Notifications View Overlay */}
          {isNotificationsOpen ? (
            <div className="w-full bg-[#FAFAFA] min-h-full pb-20 animate-fade-in space-y-4">
              {/* Solid Sticky Header */}
              <div className="sticky -top-3 z-30 bg-white -mx-3.5 -mt-3 pt-3 pb-3 px-4 border-b border-slate-200 flex items-center justify-between shadow-sm">
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Notifications</h2>
                  <p className="text-[10px] text-slate-500 font-bold">Driver & Booking Updates</p>
                </div>
                <div className="w-8" />
              </div>

              <NotificationsView
                notifications={notifications}
                onMarkAllRead={() => {
                  setNotifications(notifications.map((n) => ({ ...n, read: true })));
                }}
              />
            </div>
          ) : isReviewOpen && bookingDraft ? (
            <BookingReviewScreen
              draft={bookingDraft}
              onBack={() => setIsReviewOpen(false)}
              onConfirm={() => {
                setIsReviewOpen(false);
                setIsInvoiceOpen(true);
              }}
            />
          ) : isInvoiceOpen && bookingDraft ? (
            <InvoicePaymentScreen
              bookingDraft={bookingDraft}
              onBack={() => {
                setIsInvoiceOpen(false);
                setIsReviewOpen(true);
              }}
              onConfirmPayment={(finalBooking) => {
                setIsInvoiceOpen(false);
                handleBookingConfirmed(finalBooking);
              }}
              onCloseToBookings={(pendingBooking) => {
                setIsInvoiceOpen(false);
                setBookings([pendingBooking, ...bookings]);
                setActiveBooking(pendingBooking);
                setActiveTab('bookings');
              }}
            />
          ) : isConfirmationOpen && confirmedBooking ? (
            <BookingConfirmationView
              booking={confirmedBooking}
              onTrackDriver={() => {
                setIsConfirmationOpen(false);
                setActiveTab('activity');
              }}
              onClose={() => setIsConfirmationOpen(false)}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView
                  onSelectService={handleSelectService}
                  onSelectVehicle={setSelectedVehicle}
                  selectedVehicle={selectedVehicle}
                  onStartBooking={handleStartBooking}
                  onOpenDriverProfile={handleOpenDriverProfile}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingsView
                  bookings={bookings}
                  onRepeatBooking={(b) => {
                    setSelectedVehicle(b.vehicle);
                    setIsBookingFlowOpen(true);
                  }}
                  onOpenDriverProfile={handleOpenDriverProfile}
                />
              )}

              {activeTab === 'activity' && (
                <LiveTrackingView
                  booking={activeBooking}
                  onOpenDriverProfile={handleOpenDriverProfile}
                  onCancelRide={() => {
                    if (confirm("Are you sure you want to cancel this chauffeur booking?")) {
                      setActiveBooking(null);
                      alert("Booking cancelled.");
                    }
                  }}
                />
              )}

              {activeTab === 'wallet' && <WalletView />}

              {activeTab === 'profile' && (
                <ProfileView
                  onOpenVehicleModal={() => setIsBookingFlowOpen(true)}
                  onOpenWallet={() => setActiveTab('wallet')}
                />
              )}
            </>
          )}
        </main>

        {/* Floating Bottom Navigation */}
        <FloatingNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 8-Step Interactive Booking Flow Wizard Modal */}
        <BookingFlowModal
          isOpen={isBookingFlowOpen}
          onClose={() => setIsBookingFlowOpen(false)}
          initialService={selectedServiceForFlow}
          initialVehicle={selectedVehicle}
          onBookingConfirmed={handleBookingConfirmed}
        />

        {/* Driver Profile Modal */}
        <DriverProfileModal
          driver={driverModalProfile}
          isOpen={isDriverModalOpen}
          onClose={() => setIsDriverModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
