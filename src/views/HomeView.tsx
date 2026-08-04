import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { ServiceItem, VehicleOption } from '../types';
import { MOCK_VEHICLES, PROMOTIONS, FEATURED_DRIVER } from '../data/mockData';
import { QuickBookingWidget } from '../components/QuickBookingWidget';
import { VehicleSelectorCard } from '../components/VehicleSelectorCard';
import { PromotionsCarousel } from '../components/PromotionsCarousel';
import { BrandReviews } from '../components/BrandReviews';
import { WhyChooseUs } from '../components/WhyChooseUs';

interface HomeViewProps {
  onSelectService: (service: ServiceItem) => void;
  onSelectVehicle: (vehicle: VehicleOption) => void;
  selectedVehicle: VehicleOption;
  onStartBooking: (params: any) => void;
  onOpenDriverProfile: (driver: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectVehicle,
  selectedVehicle,
  onStartBooking,
  onOpenDriverProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full space-y-5 animate-fade-in pb-24">
      {/* Greeting & Search Header */}
      <div className="space-y-3 pt-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4D7C0F] block">
            On-Demand Chauffeur Service
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight truncate mt-0.5">
            Good Morning, John 👋
          </h1>
        </div>

        {/* Clean Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#84CC16]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What service do you need today?"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-[#84CC16] transition-all text-xs"
          />
        </div>
      </div>

      {/* Quick Booking Floating Widget */}
      <QuickBookingWidget
        onStartBooking={onStartBooking}
        vehicles={MOCK_VEHICLES}
        selectedVehicle={selectedVehicle}
        onOpenVehicleModal={() => {}}
      />

      {/* My Vehicle Horizontal Selector */}
      <VehicleSelectorCard
        vehicles={MOCK_VEHICLES}
        selectedVehicleId={selectedVehicle.id}
        onSelectVehicle={onSelectVehicle}
      />



      {/* Spotlight Master Chauffeur */}
      <div className="glass-card rounded-3xl p-4 border border-slate-200 bg-gradient-to-r from-slate-900 via-zinc-900 to-[#121212] text-white shadow-xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#84CC16] text-[#121212] text-[10px] font-black uppercase tracking-wider">
            Spotlight Chauffeur
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" /> {FEATURED_DRIVER.rating} (384)
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={FEATURED_DRIVER.photo}
            alt={FEATURED_DRIVER.name}
            className="w-14 h-14 rounded-2xl object-cover border border-[#84CC16] shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-sm text-white truncate">{FEATURED_DRIVER.name}</h4>
            <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
              {FEATURED_DRIVER.yearsExperience} Yrs Exp • Uniformed • Certified
            </p>
            <button
              onClick={() => onOpenDriverProfile(FEATURED_DRIVER)}
              className="mt-1.5 text-[11px] text-[#84CC16] font-bold hover:underline flex items-center gap-1"
            >
              View Chauffeur Profile →
            </button>
          </div>
        </div>
      </div>

      {/* Promotions Carousel */}
      <PromotionsCarousel
        promotions={PROMOTIONS}
        onClaimPromotion={(promo) => {
          alert(`Applied promo code ${promo.code} to your next booking!`);
        }}
      />

      {/* Brand Customer Reviews */}
      <BrandReviews />

      {/* Why Choose RIDINGO */}
      <WhyChooseUs />
    </div>
  );
};
