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
  Trash2,
  ChevronLeft,
  X,
  RefreshCw
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
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(100);
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(true);
  const [defaultMethod, setDefaultMethod] = useState<string>('apple-pay');

  // Saved Cards / Payment methods state
  const [savedCards, setSavedCards] = useState([
    { id: 'apple-pay', name: 'Apple Pay', sub: 'Instant & Secure', icon: Smartphone, type: 'wallet' },
    { id: 'visa-4921', name: 'Visa •••• 4921', sub: 'Exp 08/28 • Chase Bank', icon: CreditCard, type: 'card' },
    { id: 'mc-8810', name: 'Mastercard •••• 8810', sub: 'Exp 12/27 • Citibank', icon: CreditCard, type: 'card' },
    { id: 'upi-instant', name: 'UPI / GPay / PhonePe', sub: 'ridingo@okaxis', icon: Sparkles, type: 'upi' },
  ]);

  // Add Card form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [_cardCvv, setCardCvv] = useState('');

  const handleTopUp = () => {
    setBalance((prev) => prev + topUpAmount);
    setShowTopUpModal(false);
    alert(`Successfully added $${topUpAmount}.00 to your RIDINGO Wallet!`);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName) return;
    const last4 = cardNumber.slice(-4) || '1234';
    const newCard = {
      id: `card-${Date.now()}`,
      name: `Card •••• ${last4}`,
      sub: `Exp ${cardExpiry || '12/28'} • ${cardName}`,
      icon: CreditCard,
      type: 'card',
    };
    setSavedCards([...savedCards, newCard]);
    setShowAddCardModal(false);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    alert(`Saved new card ending in ${last4}!`);
  };

  const handleSetDefault = (id: string) => {
    setDefaultMethod(id);
  };

  const handleDeleteCard = (id: string) => {
    if (savedCards.length <= 1) {
      alert("You must keep at least one payment method.");
      return;
    }
    setSavedCards(savedCards.filter(c => c.id !== id));
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 animate-fade-in pb-4">
      {/* Top Header with Back button if opened as settings */}
      {onBack && (
        <div className="sticky -top-3 z-30 bg-white -mx-3.5 -mt-3 pt-3 pb-3 px-4 border-b border-slate-200 flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Payment & Wallet Settings</h2>
          <div className="w-8" />
        </div>
      )}

      {!onBack && (
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Wallet & Payments</h2>
            <p className="text-xs text-slate-500 font-medium">Manage RIDINGO Reserve balance and payment methods</p>
          </div>
        </div>
      )}

      {/* RIDINGO Wallet Card */}
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

      {/* Saved Payment Methods Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Saved Payment Methods</h3>
          <button
            type="button"
            onClick={() => setShowAddCardModal(true)}
            className="text-[11px] font-extrabold text-[#4D7C0F] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-2">
          {savedCards.map((card) => {
            const IconComp = card.icon;
            const isSel = card.id === defaultMethod;
            return (
              <div
                key={card.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSel
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSel ? 'bg-[#84CC16] text-[#121212]' : 'bg-white text-slate-700 shadow-xs border border-slate-200'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs truncate leading-snug">{card.name}</h4>
                      {isSel && (
                        <span className="px-2 py-0.2 rounded-full bg-[#84CC16] text-[#121212] text-[9px] font-black uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] truncate ${isSel ? 'text-slate-300' : 'text-slate-500'}`}>{card.sub}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {!isSel && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(card.id)}
                      className="text-[10px] font-bold text-[#4D7C0F] hover:underline px-2 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                  {card.type === 'card' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      className={`p-1.5 rounded-lg hover:bg-rose-100 hover:text-rose-600 cursor-pointer transition-colors ${
                        isSel ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coupons & Discounts */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-gradient-to-r from-emerald-500/10 via-white to-white space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-xs">Promotions & Vouchers</h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase">
            2 Active
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-black text-slate-900 block">AIRPORT20</span>
            <span className="text-slate-500 text-[10px]">20% off Airport pickup driver</span>
          </div>
          <button
            type="button"
            onClick={() => alert("Copied code AIRPORT20!")}
            className="px-2.5 py-1 rounded-lg bg-[#121212] text-[#84CC16] text-[10px] font-black cursor-pointer hover:bg-black"
          >
            Apply Code
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Recent Transactions</h3>
          <span className="text-[10px] text-slate-400 font-bold">Filtered by date</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-900'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-xs text-slate-900 truncate">{tx.title}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{tx.date} • {tx.method}</p>
                </div>
              </div>

              <span className={`font-black text-xs ml-2 flex-shrink-0 ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {tx.type === 'credit' ? '+' : '-'}{formatPrice(tx.amount, currentRegion, 2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[32px] p-5 space-y-4 shadow-2xl border border-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-black text-slate-900">Reload Wallet Balance</h3>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">Select top-up amount using instant reload:</p>

            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-3 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                    topUpAmount === amt ? 'bg-[#121212] text-[#84CC16] border-zinc-800' : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleTopUp}
                className="w-full py-3.5 rounded-2xl bg-[#84CC16] text-[#121212] font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#A3E635] transition-all cursor-pointer"
              >
                Pay ${topUpAmount}.00 Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[32px] p-5 space-y-4 shadow-2xl border border-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#84CC16]" />
                <h3 className="text-base font-black text-slate-900">Add New Card</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Johnathan Sterling"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#84CC16]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 •••• •••• 8901"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#84CC16]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#84CC16]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">CVV Code</label>
                  <input
                    type="password"
                    value={_cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#84CC16]"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#121212] text-[#84CC16] font-black text-xs shadow-md hover:bg-black cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
