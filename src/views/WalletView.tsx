import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Tag, 
  Smartphone, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../data/mockData';

export const WalletView: React.FC = () => {
  const [balance, setBalance] = useState<number>(340.50);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(100);

  const handleTopUp = () => {
    setBalance((prev) => prev + topUpAmount);
    setShowTopUpModal(false);
    alert(`Successfully added $${topUpAmount}.00 to your RIDINGO Wallet via Apple Pay!`);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fade-in pb-24">
      {/* Revolut / Apple Wallet Inspired Card */}
      <div className="rounded-[36px] p-6 text-white bg-gradient-to-br from-[#121212] via-zinc-900 to-black shadow-2xl border border-zinc-800 relative overflow-hidden group">
        {/* Subtle Lime glow in background */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#84CC16]/20 rounded-full blur-3xl group-hover:bg-[#84CC16]/30 transition-all duration-700 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#84CC16] text-[#121212] flex items-center justify-center font-extrabold text-sm">
                R
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">RIDINGO Reserve Pass</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#84CC16] text-xs font-mono font-bold border border-white/10">
              VIP MEMBER
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium">Available Balance</span>
            <h2 className="text-4xl font-black tracking-tight text-white mt-0.5">
              ${balance.toFixed(2)}
            </h2>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setShowTopUpModal(true)}
              className="flex-1 py-3 rounded-2xl bg-[#84CC16] hover:bg-[#A3E635] text-[#121212] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Top Up Balance
            </button>
            <button
              onClick={() => alert("Auto-Pay configured: Wallet recharges when below $50.")}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10"
            >
              <CreditCard className="w-4 h-4 text-[#84CC16]" /> Auto-Pay
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Saved Payment Methods</h3>
          <button className="text-xs font-bold text-[#4D7C0F] hover:underline">+ Add Card</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#84CC16] transition-all">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">Apple Pay</span>
              <Smartphone className="w-4 h-4 text-[#84CC16]" />
            </div>
            <span className="text-[11px] text-[#4D7C0F] font-bold">Default Payment</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#84CC16] transition-all">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">Google Pay</span>
              <Smartphone className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Linked & Ready</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#84CC16] transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">Instant UPI</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Zero Fee</span>
          </div>
        </div>
      </div>

      {/* Coupons & Rewards */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200 bg-gradient-to-r from-emerald-500/10 via-white to-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-sm">Active Coupons & Vouchers</h4>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
            2 Available
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-slate-900 block">AIRPORT20</span>
              <span className="text-slate-500 text-[11px]">20% off Airport pickup driver</span>
            </div>
            <button
              onClick={() => alert("Copied AIRPORT20 to clipboard!")}
              className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-800 hover:bg-[#84CC16] hover:text-black transition-colors"
            >
              Use
            </button>
          </div>
        </div>
      </div>

      {/* Recent Wallet Transactions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Recent Transactions</h3>
          <span className="text-xs text-slate-400 font-medium">Filtered by date</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-md space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-900'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">{tx.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{tx.date} • {tx.method}</p>
                </div>
              </div>

              <span className={`font-extrabold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[32px] p-6 space-y-4 shadow-2xl border border-white">
            <h3 className="text-xl font-black text-slate-900">Add Money to Wallet</h3>
            <p className="text-xs text-slate-500 font-medium">Select top-up amount using Apple Pay instant reload:</p>

            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all ${
                    topUpAmount === amt ? 'bg-[#121212] text-white border-[#84CC16]' : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleTopUp}
                className="w-full py-3.5 rounded-2xl bg-[#84CC16] text-[#121212] font-black text-sm shadow-lg hover:bg-[#A3E635] transition-all"
              >
                Pay ${topUpAmount}.00 via Apple Pay
              </button>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
