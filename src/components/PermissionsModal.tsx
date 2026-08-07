import React from 'react';
import { MapPin, Camera, PhoneCall, ShieldCheck, X } from 'lucide-react';
import { PermissionType } from '../lib/permissions';

interface PermissionsModalProps {
  type: PermissionType | null;
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  type,
  isOpen,
  onAllow,
  onDeny,
}) => {
  if (!isOpen || !type) return null;

  const content = {
    location: {
      icon: MapPin,
      title: 'Allow RIDINGO to access your Location?',
      subtitle: 'Required for Live Chauffeur Tracking in Kerala',
      description:
        'RIDINGO needs your GPS location to display real-time driver telemetry, calculate precise ETA in Kerala, and pinpoint your pickup location at Cochin COK Airport & Ernakulam.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    camera: {
      icon: Camera,
      title: 'Allow RIDINGO to access your Camera?',
      subtitle: 'Required for Profile Photo & Document Verification',
      description:
        'RIDINGO requires camera access to snap your profile picture and scan identity verification documents securely.',
      color: 'bg-[#fcd502]/15 text-[#121212] border-[#fcd502]/30',
    },
    phone: {
      icon: PhoneCall,
      title: 'Allow RIDINGO to make Phone Calls?',
      subtitle: 'Required for Direct Chauffeur Communication',
      description:
        'Allows you to directly dial your assigned certified chauffeur for pickup coordination and safety assistance.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
  }[type];

  const IconComponent = content.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 animate-slide-up-bottom text-slate-900">
        
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className={`w-14 h-14 rounded-2xl ${content.color} border flex items-center justify-center shadow-sm`}>
            <IconComponent className="w-7 h-7 stroke-[2.2]" />
          </div>
          <button
            type="button"
            onClick={onDeny}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900 leading-snug">{content.title}</h3>
          <p className="text-[11px] font-bold text-[#a18200] uppercase tracking-wider">{content.subtitle}</p>
          <p className="text-xs text-slate-500 font-medium pt-1.5 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Security Assurance Badge */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-extrabold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Encrypted permission. Your data is never shared.</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onDeny}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Not Now
          </button>
          <button
            type="button"
            onClick={onAllow}
            className="py-3 px-4 rounded-2xl bg-[#fcd502] hover:bg-[#fde047] text-[#121212] font-black text-xs shadow-lg shadow-[#fcd502]/25 transition-all cursor-pointer"
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
};
