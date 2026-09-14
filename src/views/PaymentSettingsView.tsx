import React, { useState } from 'react';
import { 
  ChevronLeft, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  DollarSign,
  X,
  Lock
} from 'lucide-react';

interface PaymentSettingsViewProps {
  onBack: () => void;
}

export const PaymentSettingsView: React.FC<PaymentSettingsViewProps> = ({ onBack }) => {
  const [defaultMethod, setDefaultMethod] = useState<string>('apple-pay');
  const [showAddCardForm, setShowAddCardForm] = useState<boolean>(false);
  const [autoDeduct, setAutoDeduct] = useState<boolean>(true);
  const [emailReceipts, setEmailReceipts] = useState<boolean>(true);
  const [requirePin, setRequirePin] = useState<boolean>(false);

  // Saved Cards
  const [savedCards, setSavedCards] = useState([
    { id: 'visa-4921', name: 'Visa Platinum', number: '•••• •••• •••• 4921', expiry: '08/28', cardholder: 'Johnathan Sterling' },
    { id: 'mc-8810', name: 'Mastercard World Elite', number: '•••• •••• •••• 8810', expiry: '12/27', cardholder: 'Johnathan Sterling' },
  ]);

  // Saved UPI & Wallets
  const [upiId, setUpiId] = useState('johnathan@okaxis');

  // Form State for New Card
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [_cvv, setCvv] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardholder) return;
    const last4 = cardNumber.slice(-4) || '9999';
    const newCard = {
      id: `card-${Date.now()}`,
      name: 'Credit Card',
      number: `•••• •••• •••• ${last4}`,
      expiry: expiry || '12/28',
      cardholder: cardholder,
    };
    setSavedCards([...savedCards, newCard]);
    setShowAddCardForm(false);
    setCardholder('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    alert(`Successfully added new card ending in ${last4}!`);
  };

  const handleDeleteCard = (id: string) => {
    if (savedCards.length <= 1) {
      alert("Please keep at least one card on file for ride reservations.");
      return;
    }
    setSavedCards(savedCards.filter(c => c.id !== id));
    if (defaultMethod === id) {
      setDefaultMethod('apple-pay');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0F19] text-white animate-fade-in overflow-hidden">
      {/* Fixed Centered Header */}
      <div className="bg-[#0B0F19]/95 backdrop-blur-md pt-[max(env(safe-area-inset-top,54px),54px)] pb-3 px-4 border-b border-white/10 flex items-center justify-between shadow-xs flex-shrink-0 z-30">
        <div className="w-12 flex items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#131926] border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#192233] transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <h2 className="font-extrabold text-sm text-white tracking-tight text-center flex-1 truncate px-2">
          Payment Settings
        </h2>
        <div className="w-12 flex items-center justify-end">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-[#fcd502] hover:underline cursor-pointer whitespace-nowrap active:scale-95"
          >
            Done
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-8">
        {/* Primary / Default Booking Payment Selection */}
        <div className="space-y-2">
          <div className="px-1">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Default Payment Method</h3>
            <p className="text-[11px] text-slate-500 font-medium">Selected method will be charged automatically for ride bookings</p>
          </div>

          <div className="bg-[#131926] rounded-2xl p-2.5 border border-white/10 shadow-xs space-y-1.5">
            {[
              { id: 'apple-pay', title: 'Apple Pay', desc: 'Touch ID / Face ID Instant Pay', icon: Smartphone, iconBg: 'bg-white/10 text-white' },
              { id: 'gpay', title: 'Google Pay', desc: 'Direct One-Tap Wallet', icon: Smartphone, iconBg: 'bg-blue-600/30 text-blue-400 border border-blue-500/30' },
              { id: 'upi', title: 'UPI AutoPay / VPA', desc: upiId, icon: Sparkles, iconBg: 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30' },
              { id: 'visa-4921', title: 'Visa •••• 4921', desc: 'Primary Credit Card', icon: CreditCard, iconBg: 'bg-[#192233] text-[#fcd502] border border-white/10' },
              { id: 'cash', title: 'Pay Cash to Driver', desc: 'Direct cash payment at trip completion', icon: DollarSign, iconBg: 'bg-amber-600/30 text-amber-400 border border-amber-500/30' },
            ].map((pm) => {
              const isSelected = defaultMethod === pm.id;
              const IconComponent = pm.icon;
              return (
                <div
                  key={pm.id}
                  onClick={() => setDefaultMethod(pm.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#192233] text-white border-[#fcd502] shadow-md'
                      : 'bg-[#0B0F19] text-slate-300 border-white/10 hover:bg-[#192233]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${pm.iconBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-xs block truncate leading-snug text-white">{pm.title}</span>
                      <span className={`text-[10px] font-medium block truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {pm.desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#fcd502] text-slate-950 flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manage Credit & Debit Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Saved Cards</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCardForm(!showAddCardForm)}
              className="text-[11px] font-black text-[#fcd502] hover:underline flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Card
            </button>
          </div>

          {/* Inline Add Card Form */}
          {showAddCardForm && (
            <form onSubmit={handleAddCard} className="bg-[#131926] text-white rounded-2xl p-4 space-y-3 border border-white/15 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black text-[#fcd502] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Add Credit / Debit Card
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCardForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  placeholder="Name on card"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcd502]"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4000 1234 5678 9010"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcd502]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcd502]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">CVV</label>
                  <input
                    type="password"
                    value={_cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcd502]"
                    required
                  />
                </div>
              </div>

              <div className="pt-1 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardForm(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#192233] text-slate-300 text-xs font-bold hover:bg-[#232f45] border border-white/10 cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#fcd502] text-slate-950 text-xs font-black hover:bg-amber-400 cursor-pointer active:scale-95"
                >
                  Save Card
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#131926] rounded-2xl p-3 border border-white/10 shadow-xs space-y-2">
            {savedCards.map((card) => (
              <div key={card.id} className="p-3 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#192233] text-[#fcd502] border border-white/10 flex items-center justify-center font-black text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white block leading-snug">{card.number}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">Exp {card.expiry} • {card.cardholder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer active:scale-95"
                    title="Remove Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UPI & Digital Wallet Config */}
        <div className="space-y-2">
          <div className="px-1">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">UPI & Digital Wallets</h3>
          </div>

          <div className="bg-[#131926] rounded-2xl p-3.5 border border-white/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-white block">UPI Virtual ID</span>
                  <span className="text-[11px] text-slate-400 font-mono">{upiId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newUpi = prompt("Enter your new UPI ID (e.g., username@upi):", upiId);
                  if (newUpi) setUpiId(newUpi);
                }}
                className="text-[11px] font-extrabold text-[#fcd502] hover:underline cursor-pointer active:scale-95"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Payment Preferences & Security */}
        <div className="space-y-2">
          <div className="px-1">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Preferences & Invoicing</h3>
          </div>

          <div className="bg-[#131926] rounded-2xl border border-white/10 shadow-xs p-3 space-y-3 text-xs">
            {/* Auto Top-up toggle */}
            <div className="p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white block">Auto Wallet Reload</span>
                <span className="text-[10px] text-slate-400 font-medium">Add $50 when wallet falls below $20</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoDeduct(!autoDeduct)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${autoDeduct ? 'bg-[#fcd502]' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full transition-transform ${autoDeduct ? 'bg-slate-950 translate-x-5' : 'bg-white'}`} />
              </button>
            </div>

            {/* Instant Email Receipts toggle */}
            <div className="p-3 rounded-xl flex items-center justify-between border-t border-white/10">
              <div>
                <span className="font-extrabold text-white block">Instant Email Receipts</span>
                <span className="text-[10px] text-slate-400 font-medium">Send PDF invoices automatically after trips</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailReceipts(!emailReceipts)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${emailReceipts ? 'bg-[#fcd502]' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full transition-transform ${emailReceipts ? 'bg-slate-950 translate-x-5' : 'bg-white'}`} />
              </button>
            </div>

            {/* Require Security Auth toggle */}
            <div className="p-3 rounded-xl flex items-center justify-between border-t border-white/10">
              <div>
                <span className="font-extrabold text-white block">Require Authentication</span>
                <span className="text-[10px] text-slate-400 font-medium">Prompt Face ID / PIN for payments over $100</span>
              </div>
              <button
                type="button"
                onClick={() => setRequirePin(!requirePin)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${requirePin ? 'bg-[#fcd502]' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full transition-transform ${requirePin ? 'bg-slate-950 translate-x-5' : 'bg-white'}`} />
              </button>
            </div>
          </div>

          {/* Security Footer Note */}
          <div className="p-3 rounded-2xl bg-[#131926] border border-white/10 flex items-center gap-2.5 text-[10px] text-slate-400 font-semibold">
            <Lock className="w-4 h-4 text-[#fcd502] flex-shrink-0" />
            <span>Your financial details are encrypted with 256-bit SSL security and PCI-DSS Compliance.</span>
          </div>
        </div>
      </div>

      {/* FIXED Bottom Action Bar - Elevated above iOS Home Indicator Line */}
      <div className="bg-[#0B0F19]/95 backdrop-blur-md border-t border-white/10 p-3.5 px-4 pb-[max(env(safe-area-inset-bottom,0px)+0.85rem,1.25rem)] flex-shrink-0 shadow-lg z-30">
        <button
          type="button"
          onClick={onBack}
          className="w-full h-13 py-3.5 rounded-2xl bg-[#fcd502] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#fcd502]/20 transition-transform active:scale-[0.98] cursor-pointer"
        >
          <span>Save Payment Settings</span>
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
