import React from 'react';
import { Home, Calendar, Activity, Wallet, User } from 'lucide-react';
import type { TabType } from '../types';

interface FloatingNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'bookings' as TabType, label: 'Bookings', icon: Calendar },
    { id: 'activity' as TabType, label: 'Tracking', icon: Activity },
    { id: 'wallet' as TabType, label: 'Wallet', icon: Wallet },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-3 pointer-events-auto">
      <nav className="glass-floating rounded-full p-2.5 flex items-center justify-between shadow-2xl border border-white/90 backdrop-blur-2xl bg-white/95 ring-1 ring-slate-900/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#121212] text-white shadow-lg shadow-black/20 font-extrabold flex-1'
                  : 'text-slate-500 hover:text-slate-900 font-bold hover:bg-slate-100/60'
              }`}
              aria-label={tab.label}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-[#84CC16]' : ''}`} />
              
              {isActive && (
                <span className="text-xs font-extrabold tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
              )}

              {/* Active neon dot indicator */}
              {isActive && (
                <span className="absolute -top-1 right-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#84CC16] shadow-[0_0_8px_#84CC16]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
