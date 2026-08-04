import React, { useState } from 'react';
import { ChevronLeft, Bell, X } from 'lucide-react';
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
    <div className="h-screen w-full bg-[#FAFAFA] text-[#0F172A] flex justify-center selection:bg-[#84CC16] overflow-hidden">
      {/* Clean Full-Screen Web App Container with Fixed Top Header */}
      <div className="w-full max-w-md h-screen max-h-screen bg-[#FAFAFA] flex flex-col relative shadow-xl border-x border-slate-200/60 overflow-hidden">
        {/* Global Header Bar - Rendered on Home Page */}
        {activeTab === 'home' && !isReviewOpen && !isInvoiceOpen && !isConfirmationOpen && (
          <HeaderBar
            userName="Alexander Vance"
            unreadNotificationsCount={unreadCount}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}

        {/* Main Content Area based on Active Tab or Views */}
        <main className="flex-1 overflow-y-auto px-3.5 pt-3 pb-24 scrollbar-none relative">
          {isReviewOpen && bookingDraft ? (
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

        {/* Right-Slide Notification Drawer Panel */}
        {isNotificationsOpen && (
          <div className="absolute inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
            {/* Dark Backdrop overlay click to dismiss */}
            <div
              className="absolute inset-0"
              onClick={() => setIsNotificationsOpen(false)}
            />

            {/* Right Slide Panel Container */}
            <div className="relative w-[340px] max-w-full h-full bg-[#FAFAFA] shadow-2xl flex flex-col z-10 animate-slide-left border-l border-slate-200/80">
              {/* Minimal Single-Line Drawer Top Header with Downward Safe Padding */}
              <div className="px-4 pt-7 pb-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Notifications</h3>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#84CC16] text-[#121212] text-[10px] font-black">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                  className="text-[11px] font-extrabold text-[#4D7C0F] hover:underline whitespace-nowrap cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              {/* Scrollable Notification List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 scrollbar-none relative">
                <NotificationsView
                  notifications={notifications}
                  hideHeader={true}
                  onMarkAllRead={() => {
                    setNotifications(notifications.map((n) => ({ ...n, read: true })));
                  }}
                />
              </div>

              {/* Thumb-Friendly Bottom Round Transparent Close Icon Button */}
              <div className="p-3 bg-transparent flex justify-center pb-5">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-11 h-11 rounded-full bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-md border border-slate-300/80 text-slate-800 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg"
                  aria-label="Close Notifications"
                >
                  <X className="w-5 h-5 text-slate-900 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
