import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  ChevronLeft,
  X,
  RefreshCw,
  Clock
} from 'lucide-react';
import { RegionCode, formatPrice } from '../data/currencies';
import { WalletTransaction } from '../types';

interface WalletViewProps {
  onBack?: () => void;
  currentRegion?: RegionCode;
}

export const WalletView: React.FC<WalletViewProps> = ({ onBack, currentRegion = 'us' }) => {
  const [balance, setBalance] = useState<number>(0.00);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(100);
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(true);

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBalance(prev => Math.round((prev + topUpAmount) * 100) / 100);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      title: 'Wallet Reload',
      date: 'Just now',
      amount: topUpAmount,
      type: 'credit',
      status: 'completed',
      method: 'Direct Reload',
    };
    setTransactions(prev => [newTx, ...prev]);
    setShowTopUpModal(false);
    alert(`Successfully added ${formatPrice(topUpAmount, currentRegion, 2)} to your RIDINGO Wallet!`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0F19] text-white animate-fade-in overflow-hidden">

      {/* ─── FIXED ZONE 1: Page Header ─── */}
      <div className="bg-[#0B0F19]/95 backdrop-blur-md border-b border-white/10 shadow-xs flex-shrink-0 z-30 animate-drop-up stagger-1 pt-[max(env(safe-area-inset-top,54px),54px)]">
        {onBack ? (
          <div className="py-3.5 px-4 flex items-center justify-between">
            <div className="w-10 flex items-center justify-start">
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-white/20 transition-colors cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-extrabold text-sm text-white tracking-tight text-center flex-1 truncate px-2">
              Payment &amp; Wallet Settings
            </h2>
            <div className="w-10" />
          </div>
        ) : (
          <div className="py-3.5 px-4 flex flex-col items-start justify-center text-left">
            <h2 className="text-xl font-black text-white tracking-tight">Wallet &amp; Payments</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">RIDINGO Reserve Pass balance &amp; transactions</p>
          </div>
        )}
      </div>

      {/* ─── FIXED ZONE 2: Wallet Reserve Card ─── */}
      <div className="bg-[#0B0F19] border-b border-white/10 px-4 pb-4 pt-3 flex-shrink-0 z-20 animate-drop-up stagger-2">
        <div className="rounded-[28px] p-5 text-white bg-gradient-to-br from-[#121212] via-zinc-900 to-black shadow-xl border border-white/10 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#fcd502]/20 rounded-full blur-3xl group-hover:bg-[#fcd502]/30 transition-all duration-700 pointer-events-none" />

          <div className="relative z-10 space-y-3.5">
            {/* Card Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#fcd502] text-slate-950 flex items-center justify-center font-black text-xs">
                  R
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">RIDINGO Reserve Pass</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#fcd502] text-[10px] font-mono font-bold border border-white/10 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#fcd502]" /> VIP PASS
              </span>
            </div>

            {/* Balance */}
            <div className="text-center">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Available Balance</span>
              <h2 className="text-3xl font-black tracking-tight text-white mt-0.5">
                {formatPrice(balance, currentRegion, 2)}
              </h2>
            </div>

            {/* Action Buttons – centered */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="flex-1 py-3 rounded-2xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Top Up
              </button>

              <button
                type="button"
                onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border cursor-pointer active:scale-95 ${
                  autoPayEnabled
                    ? 'bg-white/15 text-white border-white/20'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoPayEnabled ? 'text-[#fcd502]' : 'text-slate-400'}`} />
                <span>Auto-Pay: {autoPayEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FIXED ZONE 3: "Recent Transactions" label strip ─── */}
      <div className="bg-[#0B0F19] border-b border-white/10 px-4 py-2.5 flex items-center justify-between flex-shrink-0 z-10 animate-drop-up stagger-3">
        <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#fcd502]" /> Recent Transactions
        </h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {transactions.length} records
        </span>
      </div>

      {/* ─── SCROLL ZONE: Only the transaction list scrolls ─── */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-36 bg-[#0B0F19]">
        {transactions.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-[#131926] rounded-3xl p-6 border border-white/10 shadow-xs m-4">
            <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-extrabold text-sm text-white">No Payment History</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your wallet transactions, ride receipts, and top-up payments will appear here.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {transactions.map((tx, idx) => (
              <div
                key={tx.id}
                className={`bg-[#131926] rounded-2xl px-4 py-3 border border-white/10 shadow-sm flex items-center justify-between animate-drop-up stagger-${Math.min(idx + 3, 6)}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'credit' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-slate-300'
                  }`}>
                    {tx.type === 'credit'
                      ? <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                      : <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    }
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-xs text-white truncate leading-snug">{tx.title}</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{tx.date}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{tx.method}</p>
                  </div>
                </div>

                <span className={`font-black text-sm ml-3 flex-shrink-0 tabular-nums ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'credit' ? '+' : '−'}{formatPrice(tx.amount, currentRegion, 2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Top Up Modal ─── */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#131926] text-white w-full max-w-sm rounded-[32px] p-5 space-y-4 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">Reload Wallet Balance</h3>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-3 rounded-xl font-black text-xs transition-all border flex items-center justify-center cursor-pointer active:scale-95 ${
                        topUpAmount === amt
                          ? 'bg-[#fcd502] text-slate-950 border-[#fcd502] shadow-sm'
                          : 'bg-[#192233] text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {formatPrice(amt, currentRegion)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-white/10 bg-[#192233] font-black text-sm text-white focus:outline-none focus:border-[#fcd502] text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#fcd502] hover:bg-[#fcd502]/90 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer text-center"
              >
                Confirm Reload · {formatPrice(topUpAmount, currentRegion, 2)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
