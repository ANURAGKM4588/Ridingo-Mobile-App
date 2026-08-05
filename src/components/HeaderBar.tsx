import React from 'react';
import { Bell } from 'lucide-react';
import ridingoLogoWhite from '../assets/ridingo-logo-white.png';

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
    <header className="shrink-0 sticky top-0 z-50 w-full px-4 sm:px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 bg-[#121212] border-b border-slate-800/80 shadow-md">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* White RIDINGO Brand Logo */}
        <div className="flex items-center">
          <img
            src={ridingoLogoWhite}
            alt="RIDINGO"
            className="h-8 sm:h-9 max-h-10 w-auto object-contain transition-transform hover:scale-105"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-slate-800/90 text-white hover:bg-slate-700 active:scale-95 transition-all cursor-pointer shadow-xs border border-slate-700/60"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-white fill-white/20 stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#84CC16] text-[#121212] text-[9px] font-black flex items-center justify-center border border-slate-900 shadow-sm animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#84CC16] shadow-sm hover:ring-2 hover:ring-[#84CC16] active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
