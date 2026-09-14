import React from 'react';
import { 
  Bell, 
  Car, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
import { NotificationItem } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Car,
  CheckCircle2,
  Sparkles,
  ShieldCheck
};

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  hideHeader?: boolean;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  hideHeader = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-3 animate-fade-in pt-[max(env(safe-area-inset-top,54px),54px)] pb-10 px-4">
      {!hideHeader && (
        <div className="flex items-center justify-between px-1">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">Notifications</h2>
            <p className="text-xs text-slate-400 font-medium">Driver updates, dispatch alerts &amp; exclusive perks</p>
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-[#fcd502] hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0 ml-3 active:scale-95"
          >
            <Check className="w-3.5 h-3.5" /> Mark all
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-[#131926] rounded-3xl p-6 border border-white/10 shadow-xs animate-drop-up">
          <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="font-extrabold text-sm text-white">No notifications yet</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You're completely caught up! New dispatch alerts and ride updates will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => {
            const Icon = iconMap[item.icon] || Bell;

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-4.5 border transition-all flex items-start gap-3.5 ${
                  item.read
                    ? 'bg-[#131926] border-white/10 text-slate-300 opacity-80'
                    : 'bg-[#131926] border-[#fcd502] text-white shadow-md ring-1 ring-[#fcd502]/30'
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  item.type === 'driver' ? 'bg-[#192233] text-[#fcd502]' :
                  item.type === 'booking' ? 'bg-emerald-500/15 text-emerald-400' :
                  item.type === 'offer' ? 'bg-amber-500/15 text-[#fcd502]' :
                  'bg-blue-500/15 text-blue-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium ml-2 flex-shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fcd502] flex-shrink-0 mt-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
