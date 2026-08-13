import React from 'react';
import { Home, Calendar, Activity, Wallet, User } from 'lucide-react';
import type { TabType } from '../types';
import { LanguageCode, TRANSLATIONS } from '../data/translations';

interface FloatingNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentLanguage?: LanguageCode;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ 
  activeTab, 
  onTabChange,
  currentLanguage = 'en-us',
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en-us'];

  const tabs = [
    { id: 'home' as TabType, label: t.tabHome || 'Home', icon: Home },
    { id: 'bookings' as TabType, label: t.tabBookings || 'Bookings', icon: Calendar },
    { id: 'activity' as TabType, label: t.tabTracking || 'Activity', icon: Activity },
    { id: 'wallet' as TabType, label: t.tabWallet || 'Wallet', icon: Wallet },
    { id: 'profile' as TabType, label: t.tabProfile || 'Account', icon: User },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 p-2.5 px-3 pb-[max(env(safe-area-inset-bottom,0px)+0.75rem,1rem)] flex-shrink-0 flex items-center justify-around z-40 shadow-lg text-slate-700 w-full shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer flex-1 ${
              isActive 
                ? 'text-slate-950 font-black' 
                : 'text-slate-400 hover:text-slate-700 font-bold'
            }`}
            aria-label={tab.label}
          >
            <div className={`relative flex items-center justify-center ${isActive ? 'scale-105' : ''} transition-transform`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 stroke-[2]'}`} />
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#fcd502]" />
              )}
            </div>
            <span className={`text-[10px] tracking-tight text-center ${isActive ? 'font-black text-slate-950' : 'font-extrabold text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

