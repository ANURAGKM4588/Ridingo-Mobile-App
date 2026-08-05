import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft,
  X,
  RefreshCw,
  Clock
} from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { RegionCode, formatPrice } from '../data/currencies';

interface WalletViewProps {
  onBack?: () => void;
  currentRegion?: RegionCode;
}

export const WalletView: React.FC<WalletViewProps> = ({ onBack, currentRegion = 'us' }) => {
  const [balance, setBalance] = useState<number>(340.50);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(100);
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(true);

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBalance(prev => Math.round((prev + topUpAmount) * 100) / 100);
    setShowTopUpModal(false);
    alert(`Successfully added ${formatPrice(topUpAmount, currentRegion, 2)} to your RIDINGO Wallet!`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAFAFA] animate-fade-in overflow-hidden -mx-4 -mt-3.5">
      {/* FIXED Sticky Top Section (Header + Wallet Balance Card Fixed on Frame!) */}
      <div className="bg-white border-b border-slate-200 p-4 space-y-3.5 shadow-xs flex-shrink-0 z-30">
        {/* Header Bar */}
        {onBack ? (
          <div className="flex items-center justify-between">
            <div className="w-12 flex items-center justify-start">
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight text-center flex-1 truncate px-2">
              Payment & Wallet Settings
            </h2>
            <div className="w-12" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Wallet & Payments</h2>
              <p className="text-[11px] text-slate-500 font-medium">RIDINGO Reserve Pass balance & transaction activity</p>
            </div>
          </div>
        )}

        {/* FIXED RIDINGO Wallet Reserve Pass Card */}
        <div className="rounded-[32px] p-5 text-white bg-gradient-to-br from-[#121212] via-zinc-900 to-black shadow-xl border border-zinc-800 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#84CC16]/20 rounded-full blur-3xl group-hover:bg-[#84CC16]/30 transition-all duration-700 pointer-events-none" />

          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#84CC16] text-[#121212] flex items-center justify-center font-black text-xs">
                  R
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">RIDINGO Reserve Pass</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#84CC16] text-[10px] font-mono font-bold border border-white/10 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#84CC16]" /> VIP PASS
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Available Balance</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
                {formatPrice(balance, currentRegion, 2)}
              </h2>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="flex-1 py-3 rounded-2xl bg-[#84CC16] hover:bg-[#A3E635] text-[#121212] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Top Up Balance
              </button>

              <button
                type="button"
                onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                className={`px-3.5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                  autoPayEnabled
                    ? 'bg-white/15 text-white border-white/20'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoPayEnabled ? 'text-[#84CC16]' : 'text-slate-400'}`} />
                <span>Auto-Pay: {autoPayEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Scrollable Section (Only Recent Transactions Scroll) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none pb-28 bg-[#FAFAFA]">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" /> Recent Transactions
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filtered by date</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-900'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" /> : <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-xs text-slate-900 truncate">{tx.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{tx.date} • {tx.method}</p>
                </div>
              </div>

              <span className={`font-black text-xs ml-2 flex-shrink-0 font-mono ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {tx.type === 'credit' ? '+' : '-'}{formatPrice(tx.amount, currentRegion, 2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[32px] p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-black text-slate-900">Reload Wallet Balance</h3>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Top Up Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                        topUpAmount === amt
                          ? 'bg-slate-900 text-[#84CC16] border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatPrice(amt, currentRegion)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 font-black text-sm text-slate-900 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#84CC16] hover:bg-lime-400 text-[#121212] font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
              >
                Confirm Reload ({formatPrice(topUpAmount, currentRegion, 2)})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
