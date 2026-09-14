import React from 'react';
import { Bell } from 'lucide-react';
import ridingoLogo from '../assets/ridingo-logo.png';

interface HeaderBarProps {
  userName?: string;
  currentCity?: string;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  userName = 'Alexander Vance',
  currentCity = 'Beverly Hills, CA',
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfile
}) => {
  return (
    <header className="shrink-0 sticky top-0 z-50 w-full px-4 sm:px-5 pt-[max(env(safe-area-inset-top),44px)] pb-3 bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/10 shadow-2xs">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* RIDINGO Brand Logo */}
        <div className="flex items-center">
          <img
            src={ridingoLogo}
            alt="RIDINGO"
            className="h-8 sm:h-9 max-h-10 w-auto object-contain transition-transform hover:scale-105 drop-shadow-[0_0_12px_rgba(252,213,2,0.15)]"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-white/10 text-slate-200 hover:bg-white/15 active:scale-95 transition-all cursor-pointer shadow-2xs border border-white/5"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-200 fill-slate-200/20 stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fcd502] text-[#121212] text-[9px] font-black flex items-center justify-center border border-[#0B0F19] shadow-sm animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Avatar - Perfect Circle */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#fcd502]/40 shadow-sm hover:ring-2 hover:ring-[#fcd502] active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
