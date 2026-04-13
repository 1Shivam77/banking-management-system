import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from '../components/Toast';
import {
  Landmark, LogOut, Wallet, ArrowDownToLine, ArrowUpFromLine,
  Receipt, KeyRound, IndianRupee, TrendingUp, TrendingDown, Clock,
  Eye, EyeOff, X, Loader2, CreditCard, Shield, Send, PieChart as PieChartIcon, Download
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

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
    { id: 'deposit', icon: ArrowDownToLine, label: 'Deposit', desc: 'Add funds' },
    { id: 'withdraw', icon: ArrowUpFromLine, label: 'Withdraw', desc: 'Quick or custom' },
    { id: 'transfer', icon: Send, label: 'Transfer', desc: 'Send money' },
    { id: 'statement', icon: Receipt, label: 'Statement', desc: 'Recent activity' },
    { id: 'analytics', icon: PieChartIcon, label: 'Analytics', desc: 'Detailed view' },
    { id: 'pinchange', icon: KeyRound, label: 'Change PIN', desc: 'Security' },
  ];

  return (
    <div className="min-h-screen bg-navy-950">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
              <Landmark className="w-[18px] h-[18px] text-gold" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">SecureBank</h1>
              <p className="text-[11px] text-slate-500 leading-tight">Welcome, {user?.name || 'User'}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04]
                       border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-800 to-navy-700 rounded-2xl p-5 sm:p-7 mb-6 border border-white/[0.06]">
          <div className="absolute top-0 right-0 w-52 h-52 bg-gold/[0.04] rounded-full -translate-y-1/3 translate-x-1/3" aria-hidden="true"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Available Balance</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
                    {showBalance
                      ? `₹${balance !== null ? Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}`
                      : '₹ ••••••'}
                  </span>
                  <button onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition-colors duration-150"
                    aria-label="Toggle balance visibility">
                    {showBalance ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 text-success" />
                <span className="text-[11px] text-slate-400 font-medium">Secured</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> •••• {user?.cardNumber?.slice(-4)}
              </span>
              <span>{accountInfo?.accountType || 'Savings'} Account</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
              className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
                bg-navy-900/60 hover:bg-navy-900
                ${activePanel === item.id
                  ? 'border-gold/30 bg-gold/[0.04]'
                  : 'border-white/[0.06] hover:border-white/[0.1]'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                ${activePanel === item.id
                  ? 'bg-gold/15 text-gold'
                  : 'bg-white/[0.04] text-slate-400 group-hover:text-slate-200'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className={`text-sm font-medium block ${activePanel === item.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:block">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Panel */}
        {activePanel && (
          <div className="bg-navy-900/60 border border-white/[0.06] rounded-2xl p-5 sm:p-7 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">
                {menuItems.find((m) => m.id === activePanel)?.label}
              </h2>
              <button onClick={() => setActivePanel(null)}
                className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-150" aria-label="Close panel">
                <X className="w-4 h-4 text-slate-400" />
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
            {activePanel === 'transfer' && (
              <TransferPanel onSuccess={(msg) => { showToast(msg); fetchBalance(); setActivePanel(null); }}
                             onError={(msg) => showToast(msg, 'error')} />
            )}
            {activePanel === 'statement' && <StatementPanel />}
            {activePanel === 'analytics' && <AnalyticsPanel />}
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
      await api.deposit(Number(amount));
      onSuccess(`₹${Number(amount).toLocaleString('en-IN')} deposited successfully`);
    } catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-sm">
      <label htmlFor="deposit-amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
      <div className="relative mb-4">
        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
        <input id="deposit-amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base font-mono" />
      </div>
      <button onClick={handleDeposit} disabled={loading || !amount || Number(amount) <= 0}
        className="w-full flex items-center justify-center gap-2 bg-success/90 hover:bg-success disabled:bg-navy-700 disabled:text-slate-500
                   text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm disabled:cursor-not-allowed">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" />
          : <><ArrowDownToLine className="w-4 h-4" /> Deposit</>}
      </button>
    </div>
  );
}

/* ============ Withdraw (with Quick Amounts) ============ */
function WithdrawPanel({ onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (val) => {
    const withdrawAmount = val || Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0) return;
    setLoading(true);
    try {
      await api.withdraw(withdrawAmount);
      onSuccess(`₹${withdrawAmount.toLocaleString('en-IN')} withdrawn successfully`);
    } catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* Quick amounts */}
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-3">Quick Amount</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {QUICK_AMOUNTS.map((amt) => (
          <button key={amt} onClick={() => handleWithdraw(amt)} disabled={loading}
            className="py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm font-medium text-slate-300
                       hover:bg-gold/[0.08] hover:border-gold/30 hover:text-gold
                       transition-all duration-150 disabled:opacity-50">
            ₹{amt.toLocaleString('en-IN')}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/[0.06]"></div>
        <span className="text-[11px] text-slate-500">or enter custom amount</span>
        <div className="flex-1 h-px bg-white/[0.06]"></div>
      </div>

      {/* Custom */}
      <div className="max-w-sm">
        <label htmlFor="withdraw-amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
        <div className="relative mb-4">
          <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
          <input id="withdraw-amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base font-mono" />
        </div>
        <button onClick={() => handleWithdraw()} disabled={loading || !amount || Number(amount) <= 0}
          className="w-full flex items-center justify-center gap-2 bg-info/90 hover:bg-info disabled:bg-navy-700 disabled:text-slate-500
                     text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm disabled:cursor-not-allowed">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" />
            : <><ArrowUpFromLine className="w-4 h-4" /> Withdraw</>}
        </button>
      </div>
    </div>
  );
}

/* ============ Mini Statement ============ */
function StatementPanel({ onError }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.getStatement()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadStatement();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SecureBank_Statement.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (onError) onError('Statement download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (!data || data.transactions?.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-10 h-10 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-navy-950/40 border border-white/[0.04] rounded-xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Account Holder</p>
          <p className="text-sm font-semibold text-white">{data.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="sm:text-right">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Current Balance</p>
            <p className="text-sm font-semibold text-gold font-mono">₹{Number(data.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/[0.06]"></div>
          <button 
            onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all disabled:opacity-50">
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            PDF
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-2">
        {data.transactions.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 sm:gap-4 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all duration-150">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
              ${(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {tx.type === 'DEPOSIT' ? 'Deposit' : tx.type === 'FAST_CASH' ? 'Fast Cash' : tx.type === 'TRANSFER_IN' ? 'Transfer In' : tx.type === 'TRANSFER_OUT' ? 'Transfer Out' : 'Withdrawal'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <Clock className="w-3 h-3" />
                {new Date(tx.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
            <span className={`text-sm font-bold tabular-nums font-mono ${(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? 'text-success' : 'text-danger'}`}>
              {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
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
          placeholder="••••" autoComplete="current-password"
          className="w-full px-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base tracking-[0.5em] font-mono text-center" />
      </div>
      <div>
        <label htmlFor="new-pin" className="block text-sm font-medium text-slate-300 mb-2">New PIN</label>
        <input id="new-pin" type="password" maxLength={4} inputMode="numeric" value={newPin}
          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••" autoComplete="new-password"
          className="w-full px-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base tracking-[0.5em] font-mono text-center" />
      </div>
      <div>
        <label htmlFor="confirm-pin" className="block text-sm font-medium text-slate-300 mb-2">Confirm New PIN</label>
        <input id="confirm-pin" type="password" maxLength={4} inputMode="numeric" value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••" autoComplete="new-password"
          className="w-full px-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base tracking-[0.5em] font-mono text-center" />
      </div>
      <button onClick={handleChange}
        disabled={loading || oldPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4}
        className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:bg-navy-700 disabled:text-slate-500
                   text-navy-950 font-semibold py-3 rounded-xl transition-all duration-200 text-sm
                   shadow-lg shadow-gold/15 disabled:shadow-none disabled:cursor-not-allowed mt-1">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" />
          : <><KeyRound className="w-4 h-4" /> Change PIN</>}
      </button>
    </div>
  );
}

/* ============ Transfer ============ */
function TransferPanel({ onSuccess, onError }) {
  const [targetCardNumber, setTargetCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!amount || Number(amount) <= 0 || targetCardNumber.length !== 16) return;
    setLoading(true);
    try {
      await api.transfer({ targetCardNumber, amount: Number(amount) });
      onSuccess(`₹${Number(amount).toLocaleString('en-IN')} transferred successfully`);
    } catch (err) { onError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-sm space-y-4">
      <div>
        <label htmlFor="target-card" className="block text-sm font-medium text-slate-300 mb-2">Recipient Card Number</label>
        <div className="relative">
          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
          <input id="target-card" type="text" maxLength={16} inputMode="numeric" value={targetCardNumber}
            onChange={(e) => setTargetCardNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="16-digit card number"
            className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base tracking-widest font-mono" />
        </div>
      </div>
      <div>
        <label htmlFor="transfer-amount" className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
        <div className="relative">
          <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
          <input id="transfer-amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-base font-mono" />
        </div>
      </div>
      <button onClick={handleTransfer} disabled={loading || !amount || Number(amount) <= 0 || targetCardNumber.length !== 16}
        className="w-full flex items-center justify-center gap-2 bg-indigo-500/90 hover:bg-indigo-500 disabled:bg-navy-700 disabled:text-slate-500
                   text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm disabled:cursor-not-allowed">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" />
          : <><Send className="w-4 h-4" /> Transfer Funds</>}
      </button>
    </div>
  );
}

/* ============ Analytics ============ */
function AnalyticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const pieData = [
    { name: 'Deposits', value: data.totalDeposits, color: '#10b981' },
    { name: 'Withdrawals', value: data.totalWithdrawals, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // For visual appeal, map recent activity to a bar chart
  const barData = [...data.recentActivity].reverse().map((tx, idx) => ({
    name: idx, // Just use index for X-axis to show trend
    deposit: (tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? tx.amount : 0,
    withdrawal: (tx.type !== 'DEPOSIT' && tx.type !== 'TRANSFER_IN') ? tx.amount : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-navy-950/40 border border-white/[0.04] rounded-xl p-4">
          <h3 className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-4">Cash Flow (All Time)</h3>
          {pieData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip wrapperClassName="bg-navy-900 border border-white/[0.1] rounded-lg shadow-xl text-white text-xs"
                           contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                           itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-500">No data</div>
          )}
        </div>

        <div className="bg-navy-950/40 border border-white/[0.04] rounded-xl p-4">
          <h3 className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-4">Recent Activity Trend</h3>
          {barData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                           wrapperClassName="bg-navy-900 border border-white/[0.1] rounded-lg shadow-xl text-white text-xs"
                           contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                           itemStyle={{ color: '#fff' }} />
                  <Bar dataKey="deposit" name="Deposit" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="withdrawal" name="Withdrawal" fill="#ef4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-500">No activity yet</div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-navy-950/40 border border-white/[0.04] rounded-xl p-4 text-center">
             <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total Inflow</p>
             <p className="text-xl font-bold text-success font-mono mt-1">₹{Number(data.totalDeposits || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-navy-950/40 border border-white/[0.04] rounded-xl p-4 text-center">
             <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total Outflow</p>
             <p className="text-xl font-bold text-danger font-mono mt-1">₹{Number(data.totalWithdrawals || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
