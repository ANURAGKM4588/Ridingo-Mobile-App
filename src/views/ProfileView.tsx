import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  Car, 
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
  Sparkles
} from 'lucide-react';

interface ProfileViewProps {
  onOpenVehicleModal: () => void;
  onOpenWallet: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenVehicleModal,
  onOpenWallet,
}) => {
  const [savedVehicles, setSavedVehicles] = useState([
    { name: 'BMW 330i M Sport', plate: 'CA • 7XYZ89', type: 'Sedan' },
    { name: 'Tesla Model Y Dual Motor', plate: 'CA • 8EV202', type: 'EV' },
  ]);

  const [savedLocations, setSavedLocations] = useState([
    { label: 'Home', address: '742 Evergreen Terrace, Beverly Hills, CA' },
    { label: 'Work Office', address: '100 Wilshire Blvd, Santa Monica, CA' },
    { label: 'Private Hangar', address: 'Van Nuys Airport Hangar 4B' },
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Sarah Jenkins (Spouse)', phone: '+1 (555) 234-5678' },
    { name: 'RIDINGO 24/7 VIP Line', phone: '+1 (800) 743-4646' },
  ]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in pb-28">
      {/* Profile Card Header */}
      <div className="glass-card rounded-[36px] p-6 text-slate-900 bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/80 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Johnathan Sterling"
              className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-100"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#121212] text-[#84CC16] flex items-center justify-center shadow-md border-2 border-white">
              <Crown className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Johnathan Sterling</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">johnathan.sterling@executive.com</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#84CC16] text-[#121212] text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" /> VIP Chauffeur Club Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Vehicles Section ("My Vehicles") */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#84CC16]" />
            <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Saved Personal Vehicles</h3>
          </div>
          <button
            onClick={onOpenVehicleModal}
            className="text-xs font-bold text-[#4D7C0F] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Car
          </button>
        </div>

        <div className="space-y-2">
          {savedVehicles.map((v, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-[#84CC16] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#121212] text-[#84CC16] flex items-center justify-center font-extrabold text-sm">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{v.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{v.plate} • {v.type}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">Primary</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Locations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#84CC16]" />
            <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Saved Locations</h3>
          </div>
          <button className="text-xs font-bold text-[#4D7C0F] hover:underline">+ Add Address</button>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
          {savedLocations.map((loc, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">{loc.label}</span>
                <span className="text-[11px] text-slate-500 font-medium">{loc.address}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Emergency Contacts & SOS</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs">
          {emergencyContacts.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-800">{c.name}</span>
              <span className="font-mono text-slate-500">{c.phone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support & Settings List */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1 text-sm font-extrabold">
        <button
          onClick={onOpenWallet}
          className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#84CC16]" />
            <span>Payment Methods & Wallet</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert("Connecting to 24/7 Priority VIP Concierge Team...")}
          className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-blue-500" />
            <span>24/7 VIP Concierge Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert("Language: English (US)")}
          className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-purple-500" />
            <span>App Language & Region</span>
          </div>
          <span className="text-xs font-bold text-slate-400">English</span>
        </button>

        <button
          onClick={() => alert("Logged out safely.")}
          className="w-full p-3 rounded-2xl hover:bg-rose-50 flex items-center justify-between text-rose-600 transition-colors mt-2"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span>Log Out of RIDINGO</span>
          </div>
        </button>
      </div>
    </div>
  );
};
