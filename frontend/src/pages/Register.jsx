import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Landmark, ChevronRight, ChevronLeft, Check, AlertCircle, Copy, CheckCheck } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

const steps = [
  { id: 1, title: 'Personal Details', shortTitle: 'Personal' },
  { id: 2, title: 'Additional Details', shortTitle: 'Additional' },
  { id: 3, title: 'Account Details', shortTitle: 'Account' },
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

  // Credentials modal
  if (credentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-6">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-slate-400 mb-8 text-sm">Save your credentials securely. You will not be able to see the PIN again.</p>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 mb-6 text-left space-y-4">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Card Number</span>
              <span className="text-xl font-mono text-emerald-400 tracking-widest">{credentials.cardNumber}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">PIN</span>
              <span className="text-xl font-mono text-emerald-400 tracking-widest">{credentials.pin}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyCredentials}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-slate-300
                         hover:bg-white/5 transition-all duration-200 cursor-pointer text-sm font-medium"
            >
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl
                         transition-all duration-200 shadow-lg shadow-emerald-500/25 cursor-pointer text-sm"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/20 backdrop-blur-sm rounded-2xl mb-4 border border-emerald-500/30">
            <Landmark className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Open a New Account</h1>
          <p className="text-slate-400 mt-1 text-sm">Complete the form to get your card and PIN</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                ${currentStep > step.id ? 'bg-emerald-500 text-white' : currentStep === step.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${currentStep >= step.id ? 'text-slate-300' : 'text-slate-600'}`}>
                {step.shortTitle}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-px ${currentStep > step.id ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm mb-6" role="alert">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name *" id="name" value={formData.name} onChange={(v) => update('name', v)} placeholder="Enter your name" />
                <InputField label="Father's Name" id="fathersName" value={formData.fathersName} onChange={(v) => update('fathersName', v)} placeholder="Father's name" />
                <InputField label="Date of Birth *" id="dob" type="date" value={formData.dateOfBirth} onChange={(v) => update('dateOfBirth', v)} />
                <InputField label="Email *" id="email" type="email" value={formData.email} onChange={(v) => update('email', v)} placeholder="you@example.com" />
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-300 mb-2">Gender *</span>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                      <input type="radio" name="gender" value={g} checked={formData.gender === g}
                        onChange={(e) => update('gender', e.target.value)}
                        className="w-4 h-4 accent-emerald-500" />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-300 mb-2">Marital Status</span>
                <div className="flex gap-4">
                  {['Single', 'Married', 'Other'].map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                      <input type="radio" name="maritalStatus" value={m} checked={formData.maritalStatus === m}
                        onChange={(e) => update('maritalStatus', e.target.value)}
                        className="w-4 h-4 accent-emerald-500" />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField label="Address" id="address" value={formData.address} onChange={(v) => update('address', v)} placeholder="Street address" />
                </div>
                <InputField label="City" id="city" value={formData.city} onChange={(v) => update('city', v)} placeholder="City" />
                <InputField label="PIN Code" id="pinCodeAddr" value={formData.pinCode} onChange={(v) => update('pinCode', v)} placeholder="6-digit PIN code" maxLength={6} inputMode="numeric" />
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-2">State</label>
                  <select id="state" value={formData.state} onChange={(e) => update('state', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 cursor-pointer">
                    <option value="" className="bg-slate-800">Select State</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Additional Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Religion" id="religion" value={formData.religion} onChange={(v) => update('religion', v)}
                  options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']} />
                <SelectField label="Category" id="category" value={formData.category} onChange={(v) => update('category', v)}
                  options={['General', 'OBC', 'SC', 'ST']} />
                <SelectField label="Annual Income" id="income" value={formData.income} onChange={(v) => update('income', v)}
                  options={['Below 1 Lakh', '1-5 Lakh', '5-10 Lakh', '10-25 Lakh', 'Above 25 Lakh']} />
                <SelectField label="Education" id="education" value={formData.education} onChange={(v) => update('education', v)}
                  options={['Non-Graduate', 'Graduate', 'Post-Graduate', 'Doctorate', 'Others']} />
                <SelectField label="Occupation" id="occupation" value={formData.occupation} onChange={(v) => update('occupation', v)}
                  options={['Salaried', 'Self-Employed', 'Business', 'Student', 'Retired', 'Other']} />
                <InputField label="PAN Number" id="pan" value={formData.pan} onChange={(v) => update('pan', v.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
                <InputField label="Aadhaar Number" id="aadhaar" value={formData.aadhaar} onChange={(v) => update('aadhaar', v.replace(/\D/g, ''))} placeholder="12-digit Aadhaar" maxLength={12} inputMode="numeric" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm text-slate-300">
                <input type="checkbox" checked={formData.seniorCitizen} onChange={(e) => update('seniorCitizen', e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded" />
                Senior Citizen
              </label>
            </div>
          )}

          {/* Step 3: Account Details */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>

              <div>
                <span className="block text-sm font-medium text-slate-300 mb-3">Account Type *</span>
                <div className="grid grid-cols-2 gap-3">
                  {['Saving', 'Current'].map((type) => (
                    <button key={type} type="button" onClick={() => update('accountType', type)}
                      className={`py-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                        ${formData.accountType === type
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'}`}>
                      {type} Account
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-300 mb-3">Services Required</span>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-200">
                    <input type="checkbox" checked={formData.servicesAtm} onChange={(e) => update('servicesAtm', e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded" />
                    <div>
                      <span className="text-sm font-medium text-white">ATM Card</span>
                      <p className="text-xs text-slate-500 mt-0.5">Get a debit card for ATM withdrawals</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-200">
                    <input type="checkbox" checked={formData.servicesMobileBanking} onChange={(e) => update('servicesMobileBanking', e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded" />
                    <div>
                      <span className="text-sm font-medium text-white">Mobile Banking</span>
                      <p className="text-xs text-slate-500 mt-0.5">Access your account from your mobile device</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {currentStep > 1 ? (
              <button onClick={() => { setCurrentStep((p) => p - 1); setError(''); }}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                Back to Login
              </Link>
            )}

            {currentStep < 3 ? (
              <button onClick={() => { setCurrentStep((p) => p + 1); setError(''); }} disabled={!canProceed()}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed
                           text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !canProceed()}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed
                           text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm cursor-pointer
                           shadow-lg shadow-emerald-500/25">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>Create Account <Check className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input */
function InputField({ label, id, value, onChange, type = 'text', placeholder, maxLength, inputMode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength} inputMode={inputMode}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                   transition-all duration-200 text-sm" />
    </div>
  );
}

/* Reusable Select */
function SelectField({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 cursor-pointer">
        <option value="" className="bg-slate-800">Select</option>
        {options.map((o) => <option key={o} value={o} className="bg-slate-800">{o}</option>)}
      </select>
    </div>
  );
}
