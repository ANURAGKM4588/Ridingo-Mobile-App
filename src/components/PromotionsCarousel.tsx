import React, { useState } from 'react';
import { Promotion } from '../types';
import { Sparkles, Tag, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface PromotionsCarouselProps {
  promotions: Promotion[];
  onClaimPromotion: (promo: Promotion) => void;
}

export const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({
  promotions,
  onClaimPromotion,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const currentPromo = promotions[currentIndex];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#84CC16]" />
          <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
            Exclusive Offers & Privileges
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Promo Card */}
      <div className="w-full rounded-[32px] overflow-hidden relative min-h-[200px] p-6 text-white shadow-2xl transition-all duration-500 flex flex-col justify-between group">
        {/* Background Image Overlay */}
        <img
          src={currentPromo.imageBg}
          alt={currentPromo.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#84CC16] text-[#121212] text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Tag className="w-3 h-3 fill-current" /> {currentPromo.discountTag}
            </span>
            <span className="text-xs text-slate-300 font-medium">{currentPromo.validUntil}</span>
          </div>

          <h4 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            {currentPromo.title}
          </h4>
          <p className="text-sm text-slate-200 mt-1 max-w-md font-medium">
            {currentPromo.description}
          </p>
        </div>

        <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Promo Code:</span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[#84CC16] font-mono text-xs font-bold border border-white/20">
              {currentPromo.code}
            </span>
          </div>

          <button
            onClick={() => onClaimPromotion(currentPromo)}
            className="px-4 py-2 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#121212] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg hover:shadow-lime-500/20"
          >
            <span>Apply Offer</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {promotions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-[#84CC16]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
