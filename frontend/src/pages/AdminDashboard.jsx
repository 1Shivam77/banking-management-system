import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  Users, Activity, Lock, Unlock, CreditCard, LogOut, Loader2, ShieldAlert, Shield, ShieldOff
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [toggling2fa, setToggling2fa] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ROLE_ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsData, usersData, twoFaData] = await Promise.all([
        api.getSystemMetrics(),
        api.getAllUsers(),
        api.get2faStatus()
      ]);
      setMetrics(metricsData);
      setUsers(usersData);
      setTwoFaEnabled(twoFaData.enabled);
    } catch (err) {
      showToast('Failed to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleFreezeToggle = async (userId) => {
    try {
      const res = await api.freezeAccount(userId);
      showToast(res.message);
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: res.isActive } : u));
    } catch (err) {
      showToast(err.message || 'Failed to update account status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-danger/10 rounded-xl flex items-center justify-center border border-danger/20">
              <ShieldAlert className="w-[18px] h-[18px] text-danger" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Admin Portal</h1>
              <p className="text-[11px] text-slate-500 leading-tight">System Management</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs hover:text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.1] transition-all">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-navy-900/60 border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><Users className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 mb-1">Total Users</p><p className="text-2xl font-bold text-white font-mono">{metrics?.totalUsers || 0}</p></div>
          </div>
          <div className="bg-navy-900/60 border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><CreditCard className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 mb-1">Total Accounts</p><p className="text-2xl font-bold text-white font-mono">{metrics?.totalAccounts || 0}</p></div>
          </div>
          <div className="bg-navy-900/60 border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 mb-1">Total Transactions</p><p className="text-2xl font-bold text-white font-mono">{metrics?.totalTransactions || 0}</p></div>
          </div>
        </div>

        {/* 2FA Control Panel */}
        <div className="bg-navy-900/60 border border-white/[0.06] rounded-2xl p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${
                twoFaEnabled 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {twoFaEnabled ? <Shield className="w-6 h-6" /> : <ShieldOff className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {twoFaEnabled 
                    ? 'Users must verify OTP after entering card credentials.' 
                    : '2FA is disabled — users log in with card + PIN only.'}
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                setToggling2fa(true);
                try {
                  const res = await api.toggle2fa(!twoFaEnabled);
                  setTwoFaEnabled(res.enabled);
                  showToast(res.message);
                } catch (err) {
                  showToast(err.message || 'Failed to toggle 2FA', 'error');
                } finally {
                  setToggling2fa(false);
                }
              }}
              disabled={toggling2fa}
              className={`relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
                twoFaEnabled ? 'bg-emerald-500' : 'bg-slate-600'
              } ${toggling2fa ? 'opacity-60 cursor-not-allowed' : ''}`}
              role="switch"
              aria-checked={twoFaEnabled}
              aria-label="Toggle two-factor authentication"
            >
              <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                twoFaEnabled ? 'translate-x-[22px]' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-navy-900/60 border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.06]">
            <h2 className="text-base font-semibold text-white">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-navy-950/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-medium border ${u.role === 'ROLE_ADMIN' ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-info/10 border-info/20 text-info'}`}>
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isActive ? (
                        <span className="flex items-center gap-1.5 text-success text-xs font-medium"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Active</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-danger text-xs font-medium"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Frozen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => handleFreezeToggle(u.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            u.isActive 
                              ? 'bg-danger/10 text-danger hover:bg-danger/20' 
                              : 'bg-success/10 text-success hover:bg-success/20'
                          }`}
                        >
                          {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          {u.isActive ? 'Freeze' : 'Unfreeze'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center text-slate-500">No users found</div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
