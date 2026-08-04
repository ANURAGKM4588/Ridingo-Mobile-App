import React from 'react';
import { Bell } from 'lucide-react';

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
    <header className="shrink-0 sticky top-0 z-50 w-full px-4 pt-3 pb-2.5 bg-[#FAFAFA] border-b border-slate-200/80 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* RIDINGO Brand Logo */}
        <div className="flex items-center">
          <img
            src="/logo/ridingo-logo.png"
            alt="RIDINGO"
            className="h-10 max-h-11 w-auto object-contain transition-transform hover:scale-105"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-800 fill-slate-800/25 stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#84CC16] text-[#121212] text-[9px] font-black flex items-center justify-center border border-white shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-xl overflow-hidden border border-white shadow-sm hover:ring-2 hover:ring-[#84CC16] transition-all flex-shrink-0"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="John's Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
