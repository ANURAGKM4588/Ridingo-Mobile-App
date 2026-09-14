import React from 'react';
import { X, ShieldCheck, Star, Award, CheckCircle2, Phone, Globe, Car, ThumbsUp } from 'lucide-react';
import { DriverProfile } from '../types';

interface DriverProfileModalProps {
  driver: DriverProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({
  driver,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131926] text-white w-full max-w-lg rounded-t-[36px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-auto max-h-[88vh] animate-slide-up-bottom pb-[max(env(safe-area-inset-bottom,20px),20px)] sm:pb-6">
        {/* Header banner */}
        <div className="relative h-32 bg-gradient-to-r from-slate-950 via-[#0B0F19] to-[#131926] p-6 text-white flex items-start justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#fcd502] text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
              RIDINGO Certified Chauffeur
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar overlapping header */}
        <div className="px-6 relative -mt-14 mb-4 flex items-end justify-between">
          <div className="relative">
            <img
              src={driver.photo}
              alt={driver.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-[#131926] shadow-xl bg-[#192233]"
            />
            {driver.verifiedBadge && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#fcd502] text-slate-950 flex items-center justify-center shadow-md border-2 border-[#131926]">
                <ShieldCheck className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[#fcd502] text-lg font-black">
              <Star className="w-5 h-5 fill-current" />
              <span>{driver.rating}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">({driver.reviewsCount} Reviews)</span>
          </div>
        </div>

        {/* Driver Details Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{driver.name}</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">{driver.bio}</p>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-2 bg-[#0B0F19] rounded-2xl p-3 border border-white/10 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Experience</span>
              <span className="text-base font-extrabold text-white block">{driver.yearsExperience} Years</span>
            </div>
            <div className="border-x border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400">Completed</span>
              <span className="text-base font-extrabold text-[#fcd502] block">{driver.totalTrips}+ Rides</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
              <span className="text-xs font-black text-[#fcd502] block mt-1">Verified VIP</span>
            </div>
          </div>

          {/* Languages spoken */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#fcd502]" /> Languages Spoken
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {driver.languages.map((lang, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-[#0B0F19] text-slate-200 text-xs font-bold border border-white/10">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Handled Vehicle Types */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-[#fcd502]" /> Trained Vehicle Classes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {driver.carHandledTypes.map((type, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-[#0B0F19] text-white text-xs font-bold border border-white/10">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#fcd502]" /> Certifications & Badges
            </h4>
            <div className="space-y-1.5">
              {driver.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Contact Action */}
        <div className="p-5 bg-[#0B0F19] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <ThumbsUp className="w-4 h-4 text-[#fcd502]" /> 99.4% Positive Feedback
          </div>
          <a
            href={`tel:${driver.phone}`}
            className="px-6 py-3 rounded-2xl bg-[#fcd502] hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#fcd502]/20 transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-slate-950" />
            <span>Call Driver</span>
          </a>
        </div>
      </div>
    </div>
  );
};
