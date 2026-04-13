import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Landmark, ChevronRight, ChevronLeft, Check, AlertCircle, Copy, CheckCheck, Loader2 } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

const steps = [
  { id: 1, title: 'Personal' },
  { id: 2, title: 'Additional' },
  { id: 3, title: 'Account' },
];

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '', fathersName: '', dateOfBirth: '', gender: '', email: '',
    maritalStatus: '', address: '', city: '', pinCode: '', state: '',
    religion: '', category: '', income: '', education: '', occupation: '',
    pan: '', aadhaar: '', seniorCitizen: false,
    accountType: 'Saving', servicesAtm: true, servicesMobileBanking: false,
  });

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    if (currentStep === 1) return formData.name && formData.dateOfBirth && formData.gender && formData.email;
    if (currentStep === 2) return true;
    if (currentStep === 3) return formData.accountType;
    return false;
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await api.register(formData);
      setCredentials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Card Number: ${credentials.cardNumber}\nPIN: ${credentials.pin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---- Credentials Success View ---- */
  if (credentials) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-navy-950 px-4 sm:px-6">
        <div className="w-full max-w-md bg-navy-900/80 border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-xl text-center animate-[fadeIn_0.3s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-5 border border-success/20">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Account Created</h2>
          <p className="text-slate-400 mb-7 text-sm leading-relaxed">Save your credentials securely. You will not be able to see the PIN again.</p>

          <div className="bg-navy-950/60 border border-white/[0.06] rounded-xl p-5 mb-6 text-left space-y-4">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium block mb-1">Card Number</span>
              <span className="text-lg font-mono text-gold tracking-widest">{credentials.cardNumber}</span>
            </div>
            <div className="h-px bg-white/[0.06]"></div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium block mb-1">PIN</span>
              <span className="text-lg font-mono text-gold tracking-widest">{credentials.pin}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={copyCredentials}
              className="flex items-center justify-center gap-2 py-3 border border-white/[0.08] rounded-xl text-slate-300
                         hover:bg-white/[0.04] transition-all duration-200 text-sm font-medium">
              {copied ? <CheckCheck className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={() => navigate('/login')}
              className="bg-gold hover:bg-gold-light text-navy-950 font-semibold py-3 rounded-xl
                         transition-all duration-200 shadow-lg shadow-gold/15 text-sm">
              Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ---- Registration Form ---- */
  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-950 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/10 rounded-2xl mb-4 border border-gold/20">
            <Landmark className="w-6 h-6 text-gold" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Open a New Account</h1>
          <p className="text-slate-400 mt-1 text-sm">Complete the form to get your card and PIN</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-200
                  ${currentStep > step.id ? 'bg-gold text-navy-950' : currentStep === step.id ? 'bg-gold/15 text-gold border border-gold/40' : 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'}`}
                  aria-current={currentStep === step.id ? 'step' : undefined}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${currentStep >= step.id ? 'text-slate-300' : 'text-slate-600'}`}>
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-14 h-px transition-colors duration-200 ${currentStep > step.id ? 'bg-gold' : 'bg-white/[0.08]'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-navy-900/80 border border-white/[0.06] rounded-2xl p-5 sm:p-8 shadow-xl">
          {error && (
            <div className="flex items-start gap-3 bg-danger/8 border border-danger/20 text-red-300 px-4 py-3 rounded-xl text-sm mb-5" role="alert" aria-live="assertive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <h2 className="text-base font-semibold text-white">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name *" id="name" value={formData.name} onChange={(v) => update('name', v)} placeholder="Enter your name" />
                <InputField label="Father's Name" id="fathersName" value={formData.fathersName} onChange={(v) => update('fathersName', v)} placeholder="Father's name" />
                <InputField label="Date of Birth *" id="dob" type="date" value={formData.dateOfBirth} onChange={(v) => update('dateOfBirth', v)} />
                <InputField label="Email *" id="email" type="email" value={formData.email} onChange={(v) => update('email', v)} placeholder="you@example.com" />
              </div>
              <RadioGroup label="Gender *" name="gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={(v) => update('gender', v)} />
              <RadioGroup label="Marital Status" name="maritalStatus" options={['Single', 'Married', 'Other']} value={formData.maritalStatus} onChange={(v) => update('maritalStatus', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Address" id="address" value={formData.address} onChange={(v) => update('address', v)} placeholder="Street address" />
                </div>
                <InputField label="City" id="city" value={formData.city} onChange={(v) => update('city', v)} placeholder="City" />
                <InputField label="PIN Code" id="pinCodeAddr" value={formData.pinCode} onChange={(v) => update('pinCode', v)} placeholder="6-digit PIN" maxLength={6} inputMode="numeric" />
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-2">State</label>
                  <select id="state" value={formData.state} onChange={(e) => update('state', e.target.value)}
                    className="w-full px-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white
                               focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200">
                    <option value="" className="bg-navy-900">Select State</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s} className="bg-navy-900">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <h2 className="text-base font-semibold text-white">Additional Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Religion" id="religion" value={formData.religion} onChange={(v) => update('religion', v)} options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']} />
                <SelectField label="Category" id="category" value={formData.category} onChange={(v) => update('category', v)} options={['General', 'OBC', 'SC', 'ST']} />
                <SelectField label="Annual Income" id="income" value={formData.income} onChange={(v) => update('income', v)} options={['Below 1 Lakh', '1-5 Lakh', '5-10 Lakh', '10-25 Lakh', 'Above 25 Lakh']} />
                <SelectField label="Education" id="education" value={formData.education} onChange={(v) => update('education', v)} options={['Non-Graduate', 'Graduate', 'Post-Graduate', 'Doctorate', 'Others']} />
                <SelectField label="Occupation" id="occupation" value={formData.occupation} onChange={(v) => update('occupation', v)} options={['Salaried', 'Self-Employed', 'Business', 'Student', 'Retired', 'Other']} />
                <InputField label="PAN Number" id="pan" value={formData.pan} onChange={(v) => update('pan', v.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
                <InputField label="Aadhaar Number" id="aadhaar" value={formData.aadhaar} onChange={(v) => update('aadhaar', v.replace(/\D/g, ''))} placeholder="12-digit Aadhaar" maxLength={12} inputMode="numeric" />
              </div>
              <label className="flex items-center gap-3 mt-1 text-sm text-slate-300">
                <input type="checkbox" checked={formData.seniorCitizen} onChange={(e) => update('seniorCitizen', e.target.checked)}
                  className="w-4 h-4 accent-gold rounded" />
                Senior Citizen
              </label>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <h2 className="text-base font-semibold text-white">Account Details</h2>
              <div>
                <span className="block text-sm font-medium text-slate-300 mb-3">Account Type *</span>
                <div className="grid grid-cols-2 gap-3">
                  {['Saving', 'Current'].map((type) => (
                    <button key={type} type="button" onClick={() => update('accountType', type)}
                      className={`py-4 rounded-xl border text-sm font-semibold transition-all duration-200
                        ${formData.accountType === type
                          ? 'bg-gold/10 border-gold/40 text-gold'
                          : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.06] hover:border-white/[0.12]'}`}>
                      {type} Account
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-300 mb-3">Services Required</span>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all duration-200">
                    <input type="checkbox" checked={formData.servicesAtm} onChange={(e) => update('servicesAtm', e.target.checked)}
                      className="w-4 h-4 accent-gold rounded" />
                    <div>
                      <span className="text-sm font-medium text-white">ATM Card</span>
                      <p className="text-xs text-slate-500 mt-0.5">Get a debit card for ATM withdrawals</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all duration-200">
                    <input type="checkbox" checked={formData.servicesMobileBanking} onChange={(e) => update('servicesMobileBanking', e.target.checked)}
                      className="w-4 h-4 accent-gold rounded" />
                    <div>
                      <span className="text-sm font-medium text-white">Mobile Banking</span>
                      <p className="text-xs text-slate-500 mt-0.5">Access your account from your mobile</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/[0.06]">
            {currentStep > 1 ? (
              <button onClick={() => { setCurrentStep((p) => p - 1); setError(''); }}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                Back to Login
              </Link>
            )}

            {currentStep < 3 ? (
              <button onClick={() => { setCurrentStep((p) => p + 1); setError(''); }} disabled={!canProceed()}
                className="flex items-center gap-1.5 bg-gold hover:bg-gold-light disabled:bg-navy-700 disabled:text-slate-500
                           text-navy-950 font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm disabled:cursor-not-allowed">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !canProceed()}
                className="flex items-center gap-2 bg-gold hover:bg-gold-light disabled:bg-navy-700 disabled:text-slate-500
                           text-navy-950 font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm
                           shadow-lg shadow-gold/15 disabled:shadow-none disabled:cursor-not-allowed">
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><Check className="w-4 h-4" /> Create Account</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---- Reusable Input ---- */
function InputField({ label, id, value, onChange, type = 'text', placeholder, maxLength, inputMode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength} inputMode={inputMode}
        className="w-full px-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all duration-200 text-sm" />
    </div>
  );
}

/* ---- Reusable Select ---- */
function SelectField({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-navy-800/60 border border-white/[0.08] rounded-xl text-white
                   focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all duration-200 text-sm">
        <option value="" className="bg-navy-900">Select</option>
        {options.map((o) => <option key={o} value={o} className="bg-navy-900">{o}</option>)}
      </select>
    </div>
  );
}

/* ---- Reusable RadioGroup ---- */
function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div>
      <span className="block text-sm font-medium text-slate-300 mb-2">{label}</span>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-slate-300">
            <input type="radio" name={name} value={opt} checked={value === opt}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 accent-gold" />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
