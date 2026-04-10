import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CreditCard, Lock, LogIn, AlertCircle, Landmark } from 'lucide-react';

export default function Login() {
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ cardNumber, pin });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-2xl mb-4 border border-emerald-500/30">
            <Landmark className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SecureBank</h1>
          <p className="text-slate-400 mt-2">ATM Simulator — Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6" id="login-form">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm" role="alert" aria-live="assertive">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Card Number */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-300 mb-2">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 16-digit card number"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                             transition-all duration-200 text-lg tracking-widest font-mono"
                  autoComplete="cc-number"
                  required
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-slate-300 mb-2">
                PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                             transition-all duration-200 text-lg tracking-widest font-mono"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading || cardNumber.length !== 16 || pin.length !== 4}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed
                         text-white font-semibold py-3.5 rounded-xl
                         transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30
                         active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">New here?</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Register link */}
          <Link
            to="/register"
            className="block w-full text-center py-3 border border-white/10 rounded-xl text-slate-300
                       hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-sm font-medium"
          >
            Open a New Account
          </Link>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Simulated banking environment for educational purposes only.
        </p>
      </div>
    </main>
  );
}
