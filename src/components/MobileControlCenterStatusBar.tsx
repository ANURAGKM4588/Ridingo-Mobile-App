import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface MobileControlCenterStatusBarProps {
  theme?: 'light' | 'dark' | 'transparent';
}

export const MobileControlCenterStatusBar: React.FC<MobileControlCenterStatusBarProps> = ({
  theme = 'light',
}) => {
  const [timeString, setTimeString] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';
  const isTransparent = theme === 'transparent';

  return (
    <div
      className={`w-full shrink-0 px-4 pt-[max(env(safe-area-inset-top,0px),4px)] pb-1 sticky top-0 z-50 flex items-center justify-between font-sans select-none transition-colors duration-200 ${
        isTransparent
          ? 'bg-transparent text-slate-900'
          : isDark
          ? 'bg-slate-950 text-white'
          : 'bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800/80'
      }`}
    >
      {/* Left: Mobile Clock */}
      <div className="w-16 flex items-center justify-start">
        <span className="font-black text-[12px] tracking-tight text-white drop-shadow-xs">
          {timeString}
        </span>
      </div>

      {/* Center: Dynamic Island Camera Pill Notch (Sleek Seamless Black Capsule - No White Gap) */}
      <div className="flex-1 flex justify-center items-center py-0.5">
        <div className="h-6 px-3 rounded-full bg-black/90 text-white flex items-center justify-between gap-2 shadow-lg border border-slate-800/90 transition-all duration-300 hover:scale-105">
          {/* Camera Lens & Sensor Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-500/90 shadow-[0_0_4px_#3b82f6]" />
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {/* Brand Badge */}
          <span className="text-[9px] font-black tracking-widest text-[#fcd502] uppercase font-mono">
            RIDINGO
          </span>
        </div>
      </div>

      {/* Right: Mobile Control Center Status Indicators */}
      <div className="w-16 flex items-center justify-end gap-1.5 text-white/90">
        <span className="text-[10px] font-black tracking-tighter">5G</span>
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="w-4.5 h-2.5 rounded-[4px] border border-white/80 p-0.5 flex items-center">
          <div className="h-full w-full bg-emerald-400 rounded-[1px]" />
        </div>
      </div>
    </div>
  );
};
;
