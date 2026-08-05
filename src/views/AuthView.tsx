import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck, 
  X,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import ridingoLogo from '../assets/ridingo-logo.png';
import { LanguageCode, TRANSLATIONS } from '../data/translations';

interface AuthViewProps {
  onClose: () => void;
  onSuccess: (userData: { name: string; email: string; phone: string }) => void;
  currentLanguage?: LanguageCode;
  initialMode?: 'login' | 'signup';
}

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
];

export const AuthView: React.FC<AuthViewProps> = ({
  onClose,
  onSuccess,
  currentLanguage = 'en-us',
  initialMode = 'login',
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en-us'];
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  
  // Form State
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Step State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [otpResendTimer, setOtpResendTimer] = useState(30);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const constructedName = [firstName, lastName].filter(Boolean).join(' ') || (authMode === 'login' ? 'Alexander Vance' : 'New User');
    onSuccess({
      name: constructedName,
      email: email || 'alexander.vance@executive.com',
      phone: `${selectedCountry.code} ${phoneNumber || '555-0192'}`,
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto animate-fade-in">
      {/* Header Bar — Clean centered logo, no X button */}
      <div className="w-full px-5 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 flex items-center justify-center border-b border-slate-100">
        <img src={ridingoLogo} alt="RIDINGO" className="h-7 w-auto object-contain mx-auto" />
      </div>

      {/* Main Body Content */}
      <div className="flex-1 px-5 py-6 max-w-md mx-auto w-full flex flex-col justify-center space-y-6">
        
        {/* Title & Subtitle */}
        {!isOtpStep ? (
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {authMode === 'login' ? 'Welcome Back 👋' : 'Create Account 🚗'}
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
              {authMode === 'login' 
                ? 'Sign in to access your luxury chauffeur bookings and wallet'
                : 'Join RIDINGO for instant luxury chauffeur services worldwide'}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#84CC16]/15 text-[#4D7C0F] flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Verify Code
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter the 4-digit code sent to{' '}
              <span className="font-bold text-slate-800">
                {method === 'phone' ? `${selectedCountry.code} ${phoneNumber || '555-0192'}` : email || 'user@example.com'}
              </span>
            </p>
          </div>
        )}

        {/* Tab Switcher (Login / Sign Up) */}
        {!isOtpStep && (
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Main Form Area */}
        {!isOtpStep ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            
            {/* Method Toggle: Phone vs Email */}
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {authMode === 'login' ? 'Sign In Method' : 'Register Via'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    method === 'phone' ? 'text-[#4D7C0F]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Phone
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    method === 'email' ? 'text-[#4D7C0F]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
              </div>
            </div>

            {/* Sign Up Fields: First Name (Required) & Last Name (Optional) */}
            {authMode === 'signup' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alexander"
                      className="w-full pl-9 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-xs focus:outline-none focus:ring-2 focus:ring-[#84CC16] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    Last Name <span className="text-slate-400 font-normal text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-xs focus:outline-none focus:ring-2 focus:ring-[#84CC16] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Input Field: Phone or Email */}
            {method === 'phone' ? (
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  {/* Country Selector */}
                  <div className="relative">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const found = COUNTRY_CODES.find(c => c.code === e.target.value);
                        if (found) setSelectedCountry(found);
                      }}
                      className="appearance-none h-full pl-3 pr-7 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#84CC16] cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Phone Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="555 019 2834"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-xs focus:outline-none focus:ring-2 focus:ring-[#84CC16] transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@executive.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-xs focus:outline-none focus:ring-2 focus:ring-[#84CC16] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password Field (for Email method or Signup) */}
            {(method === 'email' || authMode === 'signup') && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button type="button" className="text-[11px] font-bold text-[#4D7C0F] hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#84CC16] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Referral Code (Optional for Sign Up) */}
            {authMode === 'signup' && (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#84CC16]" /> Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. RIDINGO50"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder:text-slate-400 text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#84CC16]"
                />
              </div>
            )}

            {/* Terms Agreement Checkbox */}
            {authMode === 'signup' && (
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#84CC16] focus:ring-[#84CC16]"
                />
                <span className="text-[11px] text-slate-500 font-medium leading-tight">
                  I agree to RIDINGO's{' '}
                  <span className="text-slate-900 font-bold underline">Terms of Service</span> and{' '}
                  <span className="text-slate-900 font-bold underline">Privacy Policy</span>.
                </span>
              </label>
            )}

            {/* Main Action Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={authMode === 'signup' && !agreeTerms}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#121212] hover:bg-black text-[#84CC16] font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>{authMode === 'login' ? 'Continue with OTP' : 'Create Account & Verify'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* 4 Digit OTP Inputs */}
            <div className="flex items-center justify-center gap-3 py-2">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-14 h-14 text-center text-xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#84CC16] focus:bg-white focus:outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Resend & Back options */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="text-slate-700 font-bold hover:underline"
              >
                ← Change Number
              </button>
              <button
                type="button"
                onClick={() => setOtpResendTimer(30)}
                className="text-[#4D7C0F] font-bold hover:underline"
              >
                Resend Code {otpResendTimer > 0 ? `(${otpResendTimer}s)` : ''}
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#121212] hover:bg-black text-[#84CC16] font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Verify & Continue</span>
            </button>
          </form>
        )}

        {/* Divider */}
        {!isOtpStep && (
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest absolute">
              Or Connect With
            </span>
          </div>
        )}

        {/* Social Login Options */}
        {!isOtpStep && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onSuccess({
                  name: 'Alexander Vance',
                  email: 'alexander.vance@gmail.com',
                  phone: '+1 (555) 019-2834'
                });
              }}
              className="py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSuccess({
                  name: 'Alexander Vance',
                  email: 'alexander.vance@icloud.com',
                  phone: '+1 (555) 019-2834'
                });
              }}
              className="py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.82 1.12-1.96.99-3.09-.97.04-2.15.65-2.85 1.47-.63.73-1.18 1.9-.1.03 3.04.99.04 2.16-.62 2.89-1.42"/>
              </svg>
              <span>Apple ID</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Security Badge */}
      <div className="p-4 text-center bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
          <span>256-Bit Encrypted Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};
