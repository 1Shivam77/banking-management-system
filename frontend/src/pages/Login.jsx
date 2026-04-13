import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Landmark, CreditCard, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.adminLogin({ email, password: adminPassword });
      login(data);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ cardNumber, pin });
      if (data.requiresOtp) {
        setShowOtp(true);
      } else {
        login(data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.verifyOtp({ cardNumber, otp });
      login(data);
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin'); // Redirect admin later
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-navy-950 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-navy-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-2xl mb-5 border border-gold/20">
            <Landmark className="w-7 h-7 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">SecureBank</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Sign in to your banking account</p>
        </div>

        {/* Form Toggle Card */}
        <div className="bg-navy-900/80 border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-xl">
          
          {/* Toggle Switch */}
          {!showOtp && (
            <div className="flex p-1 bg-navy-950 rounded-xl mb-8 border border-white/[0.05]">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  !isAdminMode ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isAdminMode ? 'bg-navy-800 text-gold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Administrator
              </button>
            </div>
          )}

          {!showOtp ? (
          <form onSubmit={isAdminMode ? handleAdminSubmit : handleSubmit} className="space-y-5" id="login-form" noValidate>
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-danger/8 border border-danger/20 text-red-300 px-4 py-3 rounded-xl text-sm" role="alert" aria-live="assertive">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!isAdminMode ? (
              <>
                {/* Card Number */}
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
                    <input
                      id="card-number"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 16-digit card number"
                      maxLength={16}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40
                                 transition-all duration-200 text-base tracking-widest font-mono"
                    />
                  </div>
                </div>

                {/* PIN */}
                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-slate-300 mb-2">PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
                    <input
                      id="pin"
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit PIN"
                      maxLength={4}
                      inputMode="numeric"
                      autoComplete="current-password"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40
                                 transition-all duration-200 text-base tracking-[0.35em] font-mono"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || cardNumber.length !== 16 || pin.length !== 4}
                  className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-light disabled:bg-navy-700 disabled:text-slate-500
                             text-navy-950 font-semibold py-3 rounded-xl transition-all duration-200 text-sm
                             shadow-lg shadow-gold/15 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {loading
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : <><ArrowRight className="w-4 h-4" /> Sign In</>}
                </button>
              </>
            ) : (
              <>
                {/* Admin Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">@</div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@securebank.com"
                      autoComplete="email"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40
                                 transition-all duration-200 text-base"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
                    <input
                      id="admin-password"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40
                                 transition-all duration-200 text-base"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email || !adminPassword}
                  className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-light disabled:bg-navy-700 disabled:text-slate-500
                             text-navy-950 font-semibold py-3 rounded-xl transition-all duration-200 text-sm
                             shadow-lg shadow-gold/15 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {loading
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : <><ArrowRight className="w-4 h-4" /> Admin Access</>}
                </button>
              </>
            )}
          </form>
          ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-5" id="otp-form" noValidate>
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-danger/8 border border-danger/20 text-red-300 px-4 py-3 rounded-xl text-sm" role="alert" aria-live="assertive">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <p className="text-sm text-slate-400 text-center mb-4">Please enter the 6-digit OTP sent to your registered contact.</p>

            {/* OTP */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">One-Time Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  inputMode="numeric"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40
                             transition-all duration-200 text-base tracking-[0.35em] font-mono text-center"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-light disabled:bg-navy-700 disabled:text-slate-500
                         text-navy-950 font-semibold py-3 rounded-xl transition-all duration-200 text-sm
                         shadow-lg shadow-gold/15 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><ArrowRight className="w-4 h-4" /> Verify OTP</>}
            </button>
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="w-full mt-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Back to logic
            </button>
          </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">New here?</span>
            <div className="flex-1 h-px bg-white/[0.06]"></div>
          </div>

          {/* Register link */}
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/[0.08] text-sm font-medium text-slate-300
                       hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-white transition-all duration-200"
          >
            Open a New Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Simulated banking environment for educational purposes only.
        </p>
      </div>
    </main>
  );
}
