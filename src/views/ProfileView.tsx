import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  ShieldAlert, 
  CreditCard, 
  Headphones, 
  Globe, 
  LogOut, 
  ChevronRight, 
  Plus, 
  ShieldCheck,
  CheckCircle2,
  Star
} from 'lucide-react';

import { LanguageCode, TRANSLATIONS } from '../data/translations';
import { RegionCode, CURRENCIES } from '../data/currencies';

interface ProfileViewProps {
  onOpenVehicleModal?: () => void;
  onOpenWallet: () => void;
  onOpenSupport?: () => void;
  onOpenLanguage?: () => void;
  currentLanguage?: LanguageCode;
  currentRegion?: RegionCode;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenWallet,
  onOpenSupport,
  onOpenLanguage,
  currentLanguage = 'en-us',
  currentRegion = 'in',
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en-us'];
  const [savedLocations] = useState([
    { id: 1, label: 'Home', address: '742 Evergreen Terrace, Beverly Hills, CA', icon: '🏠' },
    { id: 2, label: 'Work Office', address: '100 Wilshire Blvd, Santa Monica, CA', icon: '🏢' },
    { id: 3, label: 'Private Hangar', address: 'Van Nuys Airport Hangar 4B', icon: '✈️' },
  ]);

  const [emergencyContacts] = useState([
    { name: 'Sarah Jenkins (Spouse)', phone: '+1 (555) 234-5678', relation: 'Family' },
    { name: 'RIDINGO 24/7 Safety Desk', phone: '+1 (800) 743-4646', relation: 'Support' },
  ]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 animate-fade-in pb-4">
      {/* Premium Profile Header Card */}
      <div className="rounded-[32px] p-5 text-slate-900 bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/90 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#84CC16]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Johnathan Sterling"
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">Johnathan Sterling</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">johnathan.sterling@executive.com</p>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">+1 (555) 019-2834</p>
          </div>
        </div>

        {/* Quick User Stats Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/50">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Rides</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">24</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/50">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Rating</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.98
            </span>
          </div>
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200/50">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Member Since</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">2024</span>
          </div>
        </div>
      </div>

      {/* Saved Locations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#84CC16]" />
            <h3 className="text-sm font-black text-[#0F172A] tracking-tight">{t.savedAddresses}</h3>
          </div>
          <button 
            type="button"
            onClick={() => alert("Add new address modal coming soon")}
            className="text-[11px] font-extrabold text-[#4D7C0F] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Address
          </button>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
          {savedLocations.map((loc) => (
            <div key={loc.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-none">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="text-base flex-shrink-0">{loc.icon}</span>
                <div className="min-w-0">
                  <span className="font-extrabold text-xs text-slate-900 block leading-snug">{loc.label}</span>
                  <span className="text-[11px] text-slate-500 font-medium truncate block">{loc.address}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts & SOS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-black text-[#0F172A] tracking-tight">{t.emergencyContacts}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2 text-xs">
          {emergencyContacts.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div>
                <span className="font-bold text-slate-900 block">{c.name}</span>
                <span className="text-[10px] font-bold text-slate-400">{c.relation}</span>
              </div>
              <span className="font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">{c.phone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings & Preferences */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs space-y-1 text-xs font-bold">
        <button
          type="button"
          onClick={onOpenWallet}
          className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime-100 text-[#4D7C0F] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="font-extrabold">{t.paymentMethodsWallet}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onOpenSupport}
          className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="font-extrabold">{t.customerSupport}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onOpenLanguage}
          className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-extrabold">{t.languageRegion}</span>
          </div>
          <span className="text-[11px] font-extrabold text-[#4D7C0F]">
            {currentLanguage === 'ml-in' ? 'മലയാളം' : currentLanguage === 'hi-in' ? 'ഹിन्दी' : currentLanguage === 'es-es' ? 'Español' : currentLanguage === 'fr-fr' ? 'Français' : currentLanguage === 'de-de' ? 'Deutsch' : currentLanguage === 'ar-sa' ? 'العربية' : currentLanguage === 'pt-br' ? 'Português' : 'English'} • {CURRENCIES[currentRegion]?.currencySymbol || '$'} ({CURRENCIES[currentRegion]?.currencyCode || 'USD'})
          </span>
        </button>

        <button
          type="button"
          onClick={() => alert("Logged out safely.")}
          className="w-full p-3 rounded-xl hover:bg-rose-50 flex items-center justify-between text-rose-600 transition-colors mt-1 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-black">{t.logout}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
