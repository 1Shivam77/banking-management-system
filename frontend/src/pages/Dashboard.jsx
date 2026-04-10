import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from '../components/Toast';
import {
  Landmark, LogOut, Wallet, ArrowDownToLine, ArrowUpFromLine, Zap,
  Receipt, KeyRound, IndianRupee, TrendingUp, TrendingDown, Clock,
  Eye, EyeOff, ChevronRight, X
} from 'lucide-react';

const FAST_CASH_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await api.getBalance();
      setBalance(data.balance);
      setAccountInfo(data);
    } catch {
      showToast('Failed to fetch balance', 'error');
    }
  }, []);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const menuItems = [
    { id: 'deposit', icon: ArrowDownToLine, label: 'Deposit', color: 'emerald' },
    { id: 'withdraw', icon: ArrowUpFromLine, label: 'Withdraw', color: 'blue' },
    { id: 'fastcash', icon: Zap, label: 'Fast Cash', color: 'amber' },
    { id: 'statement', icon: Receipt, label: 'Mini Statement', color: 'purple' },
    { id: 'pinchange', icon: KeyRound, label: 'Change PIN', color: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">SecureBank ATM</h1>
              <p className="text-xs text-slate-500">Welcome, {user?.name || 'User'}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl shadow-emerald-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Available Balance</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {showBalance
                      ? `₹${balance !== null ? Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}`
                      : '₹ ••••••'}
                  </span>
                  <button onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer" aria-label="Toggle balance visibility">
                    {showBalance ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
              <Wallet className="w-12 h-12 text-white/20" />
            </div>
            <div className="flex items-center gap-6 text-xs text-emerald-100/80">
              <span>Card: •••• {user?.cardNumber?.slice(-4)}</span>
              <span>{accountInfo?.accountType || 'Savings'} Account</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActivePanel(item.id)}
              className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 cursor-pointer
                bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg
                ${activePanel === item.id ? 'ring-2 ring-emerald-500/50 bg-white/10 border-white/20' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                ${item.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25' :
                  item.color === 'blue' ? 'bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25' :
                  item.color === 'amber' ? 'bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25' :
                  item.color === 'purple' ? 'bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25' :
                  'bg-rose-500/15 text-rose-400 group-hover:bg-rose-500/25'}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Active Panel */}
        {activePanel && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {menuItems.find((m) => m.id === activePanel)?.label}
              </h2>
              <button onClick={() => setActivePanel(null)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" aria-label="Close panel">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {activePanel === 'deposit' && (
              <DepositPanel onSuccess={(msg) => { showToast(msg); fetchBalance(); setActivePanel(null); }}
                            onError={(msg) => showToast(msg, 'error')} />
            )}
            {activePanel === 'withdraw' && (
              <WithdrawPanel onSuccess={(msg) => { showToast(msg); fetchBalance(); setActivePanel(null); }}
                             onError={(msg) => showToast(msg, 'error')} />
            )}
            {activePanel === 'fastcash' && (
              <FastCashPanel onSuccess={(msg) => { showToast(msg); fetchBalance(); setActivePanel(null); }}
                             onError={(msg) => showToast(msg, 'error')} />
            )}
            {activePanel === 'statement' && <StatementPanel />}
            {activePanel === 'pinchange' && (
              <PinChangePanel onSuccess={(msg) => { showToast(msg); setActivePanel(null); }}
                              onError={(msg) => showToast(msg, 'error')} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ============ Deposit ============ */
function DepositPanel({ onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    try {
      const res = await api.deposit(Number(amount));
      onSuccess(`₹${Number(amount).toLocaleString('en-IN')} deposited successfully`);
    } catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-sm">
      <label htmlFor="deposit-amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
      <div className="relative mb-4">
        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input id="deposit-amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 text-lg font-mono" />
      </div>
      <button onClick={handleDeposit} disabled={loading || !amount || Number(amount) <= 0}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed
                   text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 cursor-pointer">
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          : <><ArrowDownToLine className="w-5 h-5" /> Deposit</>}
      </button>
    </div>
  );
}

/* ============ Withdraw ============ */
function WithdrawPanel({ onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    try {
      await api.withdraw(Number(amount));
      onSuccess(`₹${Number(amount).toLocaleString('en-IN')} withdrawn successfully`);
    } catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-sm">
      <label htmlFor="withdraw-amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
      <div className="relative mb-4">
        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input id="withdraw-amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 text-lg font-mono" />
      </div>
      <button onClick={handleWithdraw} disabled={loading || !amount || Number(amount) <= 0}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-600 disabled:cursor-not-allowed
                   text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer">
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          : <><ArrowUpFromLine className="w-5 h-5" /> Withdraw</>}
      </button>
    </div>
  );
}

/* ============ Fast Cash ============ */
function FastCashPanel({ onSuccess, onError }) {
  const [loading, setLoading] = useState(null);

  const handleFastCash = async (amount) => {
    setLoading(amount);
    try {
      await api.fastCash(amount);
      onSuccess(`₹${amount.toLocaleString('en-IN')} withdrawn via Fast Cash`);
    } catch (err) { onError(err.message); }
    finally { setLoading(null); }
  };

  return (
    <div>
      <p className="text-sm text-slate-400 mb-4">Select a quick withdrawal amount:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FAST_CASH_AMOUNTS.map((amount) => (
          <button key={amount} onClick={() => handleFastCash(amount)} disabled={loading !== null}
            className="relative py-4 px-4 rounded-xl border border-white/10 bg-white/5
                       hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400
                       text-white font-semibold text-lg transition-all duration-200 cursor-pointer disabled:opacity-50">
            {loading === amount
              ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-400 border-t-transparent mx-auto"></div>
              : `₹${amount.toLocaleString('en-IN')}`}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ Mini Statement ============ */
function StatementPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStatement()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data || data.transactions?.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Statement Header */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Account Holder</p>
          <p className="text-sm font-semibold text-white">{data.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Current Balance</p>
          <p className="text-sm font-semibold text-emerald-400">₹{Number(data.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {data.transactions.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 transition-all duration-150">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
              {tx.type === 'DEPOSIT' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{tx.type === 'DEPOSIT' ? 'Deposit' : tx.type === 'FAST_CASH' ? 'Fast Cash' : 'Withdrawal'}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <Clock className="w-3 h-3" />
                {new Date(tx.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
            <span className={`text-sm font-bold tabular-nums ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-red-400'}`}>
              {tx.type === 'DEPOSIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ PIN Change ============ */
function PinChangePanel({ onSuccess, onError }) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (newPin !== confirmPin) { onError('New PIN and confirmation do not match'); return; }
    setLoading(true);
    try {
      await api.changePin({ oldPin, newPin, confirmPin });
      onSuccess('PIN changed successfully');
    } catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-sm space-y-4">
      <div>
        <label htmlFor="old-pin" className="block text-sm font-medium text-slate-300 mb-2">Current PIN</label>
        <input id="old-pin" type="password" maxLength={4} inputMode="numeric" value={oldPin}
          onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all duration-200 text-lg tracking-[0.5em] font-mono text-center"
          autoComplete="current-password" />
      </div>
      <div>
        <label htmlFor="new-pin" className="block text-sm font-medium text-slate-300 mb-2">New PIN</label>
        <input id="new-pin" type="password" maxLength={4} inputMode="numeric" value={newPin}
          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all duration-200 text-lg tracking-[0.5em] font-mono text-center"
          autoComplete="new-password" />
      </div>
      <div>
        <label htmlFor="confirm-pin" className="block text-sm font-medium text-slate-300 mb-2">Confirm New PIN</label>
        <input id="confirm-pin" type="password" maxLength={4} inputMode="numeric" value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all duration-200 text-lg tracking-[0.5em] font-mono text-center"
          autoComplete="new-password" />
      </div>
      <button onClick={handleChange}
        disabled={loading || oldPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4}
        className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-400 disabled:bg-slate-600 disabled:cursor-not-allowed
                   text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 cursor-pointer mt-2">
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          : <><KeyRound className="w-5 h-5" /> Change PIN</>}
      </button>
    </div>
  );
}
