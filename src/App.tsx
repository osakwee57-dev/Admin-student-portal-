
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { School, Shield, User, Lock, Key, CheckCircle2, ChevronRight, GraduationCap, Building2, ArrowRight, Activity, Globe, LayoutDashboard, Search, FileText, Upload, X, Mail, MessageSquare, Phone, MapPin, Calendar, Trash2, Megaphone, PlusCircle } from 'lucide-react';

export default function App() {
  const [schools, setSchools] = useState<any[]>([]);
  const [view, setView] = useState<'REGISTRATION' | 'LIST' | 'LOGIN' | 'DASHBOARD'>('REGISTRATION');
  const [successData, setSuccessData] = useState<any>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools');
      const data = await res.json();
      setSchools(data);
    } catch (e) {
      console.error('Failed to fetch schools', e);
    }
  };

  useEffect(() => {
    fetchSchools();
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
      setCurrentAdmin(JSON.parse(savedAdmin));
      setView('DASHBOARD');
    }
  }, []);

  const handleRegistrationSuccess = (data: any) => {
    setSuccessData(data);
    fetchSchools();
  };

  const handleLoginSuccess = (admin: any) => {
    setCurrentAdmin(admin);
    localStorage.setItem('currentAdmin', JSON.stringify(admin));
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('currentAdmin');
    setView('LOGIN');
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans flex flex-col overflow-x-hidden transition-colors duration-500">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            {view === 'DASHBOARD' ? currentAdmin?.school_name : 'Admin Console'} 
            <span className="text-brand-primary/50 font-medium ml-1">v4.12</span>
          </span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
          {view !== 'DASHBOARD' ? (
            <>
              <button 
                onClick={() => { setView('REGISTRATION'); setSuccessData(null); }}
                className={`py-5 transition-all outline-none ${view === 'REGISTRATION' && !successData ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-slate-800 border-b-2 border-transparent'}`}
              >
                Institution Registry
              </button>
              <button 
                onClick={() => { setView('LIST'); setSuccessData(null); }}
                className={`py-5 transition-all outline-none ${view === 'LIST' && !successData ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-slate-800 border-b-2 border-transparent'}`}
              >
                School List
              </button>
              <button 
                onClick={() => { setView('LOGIN'); setSuccessData(null); }}
                className={`py-5 transition-all outline-none ${view === 'LOGIN' && !successData ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-slate-800 border-b-2 border-transparent'}`}
              >
                Admin Login
              </button>
            </>
          ) : (
            <>
              <span className="text-slate-800 font-bold">Dashboard</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-colors">Logout</button>
            </>
          )}
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden cursor-pointer hover:border-brand-primary transition-colors">
            <User size={16} />
          </div>
        </div>
      </nav>

      <main className={`flex-1 flex flex-col ${view !== 'DASHBOARD' ? 'items-center justify-center p-8 md:p-12' : ''}`}>
        {view === 'DASHBOARD' ? (
          <div className="flex-1 w-full bg-white flex flex-col">
             <AdminDashboard admin={currentAdmin} />
          </div>
        ) : (
          <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-300/40 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
            {/* Sidebar Information Pane - Conditional content */}
            <div className="md:w-5/12 bg-brand-sidebar p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-brand-primary/20 text-brand-accent rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 border border-brand-primary/30">
                  Security Layer v2.4
                </div>
                
                <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
                  {view === 'LOGIN' ? 'Access Portal' : 'Institutional Profile Setup'}
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs">
                  {view === 'LOGIN' 
                    ? 'Secure access to your institutional dashboard via your unique school code and credentials.'
                    : 'Registering a new school initializes the dedicated database instance and generates the unique student access keys.'}
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${view === 'REGISTRATION' || successData ? 'bg-brand-primary' : 'bg-slate-700'}`}>
                      {successData ? <CheckCircle2 size={12} /> : '1'}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Configure Identity</h3>
                      <p className="text-xs text-slate-500">Define school names and admin credentials.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${successData ? 'bg-brand-primary' : 'bg-slate-700'}`}>2</div>
                    <div>
                      <h3 className="text-sm font-semibold">System Verification</h3>
                      <p className="text-xs text-slate-500">Authorized administrative override required.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-500 flex justify-between border-t border-slate-800 pt-8 relative z-10">
                <span className="flex items-center gap-1.5"><Shield size={10} /> AES-256 ENCRYPTION</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={10} /> ISO 27001 COMPLIANT</span>
              </div>
            </div>

            {/* Form / Content Pane */}
            <div className="md:w-7/12 p-10 md:p-14 flex flex-col min-h-full">
              <AnimatePresence mode="wait">
                {successData ? (
                  <div key="success-wrapper" className="h-full">
                    <SuccessView 
                      data={successData} 
                      onClose={() => { setSuccessData(null); setView('LIST'); }} 
                    />
                  </div>
                ) : view === 'REGISTRATION' ? (
                  <div key="register-wrapper" className="h-full">
                    <RegistrationForm 
                      onSuccess={handleRegistrationSuccess} 
                      onCancel={() => setView('LIST')} 
                    />
                  </div>
                ) : view === 'LOGIN' ? (
                  <div key="login-wrapper" className="h-full">
                    <AdminLoginForm 
                      onSuccess={handleLoginSuccess}
                      onGoToRegister={() => setView('REGISTRATION')}
                    />
                  </div>
                ) : (
                  <div key="list-wrapper" className="h-full">
                    <SchoolsView 
                      schools={schools} 
                      onAdd={() => setView('REGISTRATION')} 
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>


      {/* Status Bar Footer */}
      <footer className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Server Cluster: {process.env.APP_URL ? 'CLOUD-RUN-EUROPE' : 'LOCAL-INSTANCE'}
          </span>
          <span className="flex items-center gap-1.5">
            <Activity size={10} />
            Latency: 24ms
          </span>
          <span className="flex items-center gap-1.5">
            <Globe size={10} />
            System Status: Operational
          </span>
        </div>
        <div>
          &copy; 2026 SchoolHub Network • v4.12.0-stable • Institutional Governance Systems
        </div>
      </footer>
    </div>
  );
}

function RegistrationForm({ onSuccess, onCancel }: { onSuccess: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    schoolName: '',
    adminUsername: '',
    adminPassword: '',
    systemPasscode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Registration Details</h2>
        <p className="text-sm text-slate-500">Enter the required administrative information below.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Institution Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
              <Building2 size={16} />
            </div>
            <input 
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="e.g. Springfield Academy of Arts"
              value={formData.schoolName}
              onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Admin Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                <User size={16} />
              </div>
              <input 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="master_admin"
                value={formData.adminUsername}
                onChange={e => setFormData({ ...formData, adminUsername: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Admin Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                <Lock size={16} />
              </div>
              <input 
                required
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="••••••••"
                value={formData.adminPassword}
                onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 ring-1 ring-red-200/50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={14} /> Security Verification
            </label>
            <span className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full tracking-tighter">REQUIRED</span>
          </div>
          <input 
            required
            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-mono tracking-[0.2em] text-red-900 placeholder:tracking-normal placeholder:text-red-200"
            placeholder="Enter PASS to verify"
            value={formData.systemPasscode}
            onChange={e => setFormData({ ...formData, systemPasscode: e.target.value })}
          />
          <p className="mt-2.5 text-[10px] text-red-500/80 leading-relaxed italic font-medium">Standard security barrier provided to designated system controllers.</p>
        </div>

        {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

        <div className="pt-4 flex gap-3">
           <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing Registry...' : (
              <>
                Register & Generate Code
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function SuccessView({ data, onClose }: { data: any, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center py-4"
    >
      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 mb-6">
        <CheckCircle2 size={32} />
      </div>
      
      <div className="mb-10 space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Provisioning Successful</h2>
        <p className="text-sm text-slate-400">Database instance <span className="text-brand-primary font-bold">{data.schoolName}</span> is now active.</p>
      </div>

      <div className="w-full bg-slate-50 border border-slate-100 p-8 rounded-3xl mb-10 group transition-all hover:bg-white hover:shadow-2xl hover:shadow-brand-primary/5 hover:border-brand-primary/20">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block group-hover:text-brand-primary">Student Access Token</span>
        <div className="text-7xl font-bold tracking-tighter text-slate-900 font-mono">
          {data.schoolCode}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 py-2 px-4 bg-white rounded-full text-[10px] font-bold text-slate-500 shadow-sm inline-flex border border-slate-100">
           <Globe size={12} className="text-brand-primary" /> LIVE ON SYSTEM MESH
        </div>
      </div>

      <button 
        onClick={onClose}
        className="w-full py-5 bg-brand-sidebar text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
      >
        Complete & Move to Dashboard
      </button>
    </motion.div>
  );
}

function AdminLoginForm({ onSuccess, onGoToRegister }: { onSuccess: (admin: any) => void, onGoToRegister: () => void }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    schoolCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Initiating admin login for:', formData.username, 'at', formData.schoolCode);
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('Login successful');
        onSuccess(data.admin);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
        console.error('Login failed with status:', res.status, errorData);
        setError(errorData.error || `Login failed (${res.status})`);
      }
    } catch (e: any) {
      console.error('Fetch exception during login:', e);
      setError(`Connection error: ${e.message || 'Please check your internet and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-xl shadow-slate-300">A</div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Login</h2>
        <p className="text-sm text-slate-500">Enter your credentials to manage your school.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Username</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
              <User size={16} />
            </div>
            <input 
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="Username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
              <Lock size={16} />
            </div>
            <input 
              required
              type="password"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">6-Digit School Code</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
              <Key size={16} />
            </div>
            <input 
              required
              maxLength={6}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm tracking-[0.5em] placeholder:tracking-normal font-mono placeholder:text-slate-400"
              placeholder="000000"
              value={formData.schoolCode}
              onChange={e => setFormData({ ...formData, schoolCode: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-sidebar hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? 'Verifying...' : 'Access Dashboard'}
        </button>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-400 font-medium">
            Need to register a new school?{' '}
            <button 
              type="button"
              onClick={onGoToRegister}
              className="text-brand-primary hover:underline font-bold"
            >
              Click here
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
}

function AdminDashboard({ admin }: { admin: any }) {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'FEES' | 'RESULTS' | 'MESSAGES'>('STUDENTS');
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/students?schoolCode=${admin.school_code}`);
        const data = await res.json();
        setStudents(data);
      } catch (e) {
        console.error('Error fetching students', e);
      }
    };
    fetchStudents();
  }, [admin.school_code]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.surname} ${s.first_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'All' || s.student_class === classFilter;
    return matchesSearch && matchesClass;
  });

  const [feeSearchQuery, setFeeSearchQuery] = useState('');
  const feeFilteredStudents = feeSearchQuery.length > 0 
    ? students.filter(s => s.surname.toLowerCase().includes(feeSearchQuery.toLowerCase()))
    : [];

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const handleOpenFeeModal = (student: any) => {
    setSelectedStudent(student);
    setIsFeeModalOpen(true);
  };

  const handleOpenProfileModal = (student: any) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="flex flex-1 h-full">
      {/* Internal Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-8 flex flex-col gap-2 shrink-0 h-full">
        <div className="mb-8">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Institutional Core</div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
            <h4 className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">School Name</h4>
            <div className="text-sm font-bold truncate">{admin.school_name}</div>
          </div>
          
          {/* System Code Box Match */}
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 ring-1 ring-white/5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System Code</div>
            <div className="text-2xl font-mono font-bold text-white tracking-widest">{admin.school_code}</div>
          </div>
        </div>

        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Operations</div>
        
        <NavButton 
          active={activeTab === 'STUDENTS'} 
          onClick={() => setActiveTab('STUDENTS')}
          icon={<User size={16} />}
          label="Student Registry"
        />
        <NavButton 
          active={activeTab === 'FEES'} 
          onClick={() => setActiveTab('FEES')}
          icon={<Key size={16} />}
          label="Fee Disbursement"
        />
        <NavButton 
          active={activeTab === 'RESULTS'} 
          onClick={() => setActiveTab('RESULTS')}
          icon={<Activity size={16} />}
          label="Academic Analytics"
        />
        <NavButton 
          active={activeTab === 'MESSAGES'} 
          onClick={() => setActiveTab('MESSAGES')}
          icon={<MessageSquare size={16} />}
          label="Communications"
        />
        
        <div className="mt-auto pt-8 border-t border-white/5">
          <button 
            onClick={() => {
              localStorage.removeItem('currentAdmin');
              window.location.reload();
            }}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <ArrowRight size={16} className="rotate-180" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col shadow-inner">
        <AnimatePresence mode="wait">
          {activeTab === 'STUDENTS' && (
            <motion.div 
              key="students"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full p-12"
            >
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Institution Directory</h2>
                  <p className="text-slate-500">Reviewing {students.length} valid student profile records.</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                      <Search size={16} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Filter directory..."
                      className="w-64 pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer hover:border-slate-300 transition-colors"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                  >
                    <option value="All">All Tiers (Classes)</option>
                    {['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <th className="py-6 pl-10 border-b border-slate-100">Full Name (Surname First)</th>
                      <th className="py-6 border-b border-slate-100 text-center">Class Tier</th>
                      <th className="py-6 border-b border-slate-100 text-center">Identity Gender</th>
                      <th className="py-6 pr-10 border-b border-slate-100 text-right">Operational Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(student => (
                      <tr 
                        key={student.id} 
                        className="group hover:bg-slate-50/50 transition-all"
                      >
                        <td className="py-5 pl-10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all font-bold">
                              {student.surname[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{student.surname}, {student.first_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">UID: {student.id.substring(0,8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{student.student_class}</span>
                        </td>
                        <td className="py-5 text-center text-slate-500 text-sm">
                          {student.gender}
                        </td>
                        <td className="py-5 pr-10 text-right">
                          <button 
                            onClick={() => handleOpenProfileModal(student)}
                            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-white hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="italic text-sm">Zero records match this operational filter.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'FEES' && (
            <motion.div 
              key="fees"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full p-12"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Assign Institutional Fees</h2>
                <p className="text-slate-500">To generate a new fee disbursement record, please search for and select a specific student profile.</p>
              </div>
              
              <div className="mb-8 max-w-md relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Search student by surname..."
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-sm outline-none shadow-sm"
                  value={feeSearchQuery}
                  onChange={(e) => setFeeSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <th className="py-6 pl-10 border-b border-slate-100">Surname</th>
                      <th className="py-6 border-b border-slate-100">First Name</th>
                      <th className="py-6 border-b border-slate-100 text-center">Class</th>
                      <th className="py-6 pr-10 border-b border-slate-100 text-center">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {feeFilteredStudents.map(student => (
                      <tr 
                        key={student.id} 
                        onClick={() => handleOpenFeeModal(student)}
                        className="group hover:bg-slate-50 cursor-pointer transition-all"
                      >
                        <td className="py-5 pl-10 font-bold text-slate-800">{student.surname}</td>
                        <td className="py-5 text-slate-600">{student.first_name}</td>
                        <td className="py-5 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{student.student_class}</span>
                        </td>
                        <td className="py-5 pr-10 text-center text-slate-400 text-sm">
                          {student.gender}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {feeFilteredStudents.length === 0 && feeSearchQuery.length > 0 && (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                     <p className="italic text-sm">No students found matching "{feeSearchQuery}"</p>
                   </div>
                )}
                {feeSearchQuery.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                    <User size={48} className="mb-4 opacity-20" />
                    <p className="italic text-sm">Initiate a search to select a student for disbursement.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'RESULTS' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full p-12"
            >
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Academic Result Management</h2>
                  <p className="text-slate-500">Search for a student to upload their terminal result PDF.</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                      <Search size={16} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search results directory..."
                      className="w-64 pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm outline-none shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                  >
                    <option value="All">All Classes</option>
                    {['JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <th className="py-6 pl-10 border-b border-slate-100">Student Name</th>
                      <th className="py-6 border-b border-slate-100 text-center">Class</th>
                      <th className="py-6 pr-10 border-b border-slate-100 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="py-5 pl-10">
                          <div className="font-bold text-slate-800">{student.surname}, {student.first_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">UID: {student.id.substring(0,8)}</div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{student.student_class}</span>
                        </td>
                        <td className="py-5 pr-10 text-right">
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsResultModalOpen(true);
                            }}
                            className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/90 transition-all shadow-sm"
                          >
                            Push Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'MESSAGES' && (
            <MessagingSection schoolCode={admin.school_code} adminId={admin.id} students={students} />
          )}
        </AnimatePresence>
      </div>

      {isProfileModalOpen && (
        <StudentProfileModal 
          student={selectedStudent} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      )}

      {isFeeModalOpen && (
        <FeeModal 
          student={selectedStudent} 
          schoolCode={admin.school_code}
          onClose={() => setIsFeeModalOpen(false)} 
        />
      )}

      {isResultModalOpen && (
        <ResultUploadModal 
          student={selectedStudent}
          schoolCode={admin.school_code}
          onClose={() => setIsResultModalOpen(false)}
        />
      )}
    </div>
  );
}

function NavButton({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
        active 
          ? 'bg-brand-primary text-white shadow-xl shadow-indigo-500/20' 
          : 'text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}


function StudentProfileModal({ student, onClose }: { student: any, onClose: () => void }) {
  const [fees, setFees] = useState<any[]>([]);
  const [expandedFee, setExpandedFee] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFees();
  }, [student.id]);

  const loadFees = async () => {
    try {
      const res = await fetch(`/api/students/${student.id}/fees`);
      const data = await res.json();
      setFees(data);
    } catch (e) {
      console.error("Error loading fees", e);
    }
  };

  const handleApproveFee = async (feeId: string) => {
    if (!confirm("Confirm payment settlement for this record?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/fees/${feeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      });
      if (res.ok) {
        loadFees();
      }
    } catch (e) {
      alert("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 max-h-[90vh]"
      >
        <div className="p-10 border-b border-slate-100 flex justify-between items-start shrink-0">
          <div className="flex flex-col items-center flex-1">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-4xl mb-4 border-4 border-white shadow-lg">
              {student.first_name[0]}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight text-center">{student.surname}, {student.first_name}</h2>
            <p className="text-[10px] font-mono text-slate-400 mt-2 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">System UID: {student.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-12 space-y-12">
            {/* Core Info Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-brand-primary rounded-full" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Institutional Data</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <InfoBlock label="Surname" value={student.surname} />
                <InfoBlock label="First Name" value={student.first_name} />
                <InfoBlock label="Other Name" value={student.other_name || 'N/A'} className="col-span-2" />
                
                <InfoBlock label="Gender" value={student.gender} />
                <InfoBlock label="Date of Birth" value={new Date(student.dob).toLocaleDateString()} />
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class Tier</label>
                  <div className="pt-1">
                    <span className="px-4 py-1.5 bg-brand-primary text-white rounded-full text-xs font-bold border border-brand-primary/20 shadow-lg shadow-indigo-100">{student.student_class}</span>
                  </div>
                </div>
                <InfoBlock label="Guardian Phone" value={student.parent_phone || 'N/A'} icon={<Phone size={10} />} />
                
                <InfoBlock label="Email Address" value={student.email_address || 'N/A'} icon={<Mail size={10} />} className="col-span-2" />
                <InfoBlock label="Home Address" value={student.home_address || 'No address provided.'} icon={<MapPin size={10} />} className="col-span-2" />
              </div>
            </div>

            {/* Financial History Section */}
            <div className="space-y-8 pb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Financial Disbursement History</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">({fees.length} Records)</span>
              </div>

              <div className="space-y-4">
                {fees.map(fee => (
                  <div key={fee.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:border-slate-200 transition-all">
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setExpandedFee(expandedFee === fee.id ? null : fee.id)}>
                        <div className={`p-3 rounded-xl ${fee.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                          {fee.pdf_url ? <Upload size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {fee.description}
                            <ChevronRight size={14} className={`text-slate-300 transition-transform ${expandedFee === fee.id ? 'rotate-90' : ''}`} />
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                            {new Date(fee.created_at).toLocaleDateString()} • {fee.pdf_url ? 'Leaflet Dispatch' : 'Digital Breakdown'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        {fee.status === 'paid' ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold ring-1 ring-emerald-100">
                            <CheckCircle2 size={12} /> Cleared
                          </div>
                        ) : (
                          <button 
                            disabled={loading}
                            onClick={() => handleApproveFee(fee.id)}
                            className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/90 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedFee === fee.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-slate-50/50 border-t border-slate-50 overflow-hidden"
                        >
                          <div className="p-6 pt-2 space-y-4">
                            {fee.pdf_url ? (
                              <div className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                    <FileText size={14} />
                                  </div>
                                  <span className="text-xs font-bold text-slate-600">Attachment: Terminal Leaflet.pdf</span>
                                </div>
                                <a 
                                  href={fee.pdf_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:border-brand-primary hover:text-brand-primary transition-all"
                                >
                                  Open Document
                                </a>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Itemized Breakdown</div>
                                {fee.items && Array.isArray(fee.items) ? (
                                  <div className="space-y-2">
                                    {fee.items.map((item: any, i: number) => (
                                      <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white transition-colors">
                                        <span className="text-slate-600 font-medium">{item.item}</span>
                                        <span className="font-mono font-bold text-slate-800">₦{Number(item.price).toLocaleString()}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200 font-bold">
                                      <span className="text-slate-800">Total Valuation</span>
                                      <span className="text-brand-primary text-lg">
                                        ₦{fee.items.reduce((acc: number, curr: any) => acc + Number(curr.price || 0), 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-400 italic">No breakdown available for this record.</p>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {fees.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-slate-50 rounded-2xl text-center space-y-3">
                    <div className="text-slate-200 flex justify-center">
                      <Lock size={32} />
                    </div>
                    <p className="text-sm text-slate-400 italic">No financial records found for this student.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-white border-t border-slate-100 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function InfoBlock({ label, value, icon, className = "" }: { label: string, value: string, icon?: React.ReactNode, className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="text-base font-bold text-slate-800">{value}</div>
    </div>
  );
}


function FeeModal({ student, schoolCode, onClose }: { student: any, schoolCode: string, onClose: () => void }) {
  const [view, setView] = useState<'PROFILE' | 'GENERATOR' | 'UPLOADING'>('PROFILE');
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([{ name: '', price: '' }]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addItem = () => setItems([...items, { name: '', price: '' }]);
  
  const calculateTotal = () => items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handleDigitalSubmit = async () => {
    if (!title || items.some(i => !i.name || !i.price)) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          description: title,
          items: items.map(i => ({ item: i.name, price: i.price })),
          schoolCode: schoolCode
        })
      });

      if (res.ok) {
        alert("Fee assigned successfully!");
        onClose();
      }
    } catch (e) {
      alert("Error sending fee");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setView('UPLOADING');
    
    try {
      // 1. Upload the PDF
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch(`/api/fees/upload?schoolCode=${schoolCode}`, {
        method: 'POST',
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 2. Create the fee record
      const feeRes = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          description: `PDF Fee Detail: ${file.name}`,
          pdfUrl: uploadData.publicUrl,
          schoolCode: schoolCode
        })
      });

      if (feeRes.ok) {
        alert("PDF Fee Leaflet sent successfully!");
        onClose();
      } else {
        throw new Error('Failed to create fee record');
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setView('PROFILE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-white/20"
      >
        {/* Header with Student Brief */}
        <div className="p-12 border-b border-slate-100 flex justify-between items-start">
          <div className="flex gap-6">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{student.surname}, {student.first_name}</h3>
              <div className="flex gap-4 mt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
                  <Shield size={10} className="text-brand-primary" /> Class {student.student_class}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
                  <Activity size={10} className="text-emerald-500" /> {student.gender}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-12 pb-8 flex-1 overflow-y-auto custom-scrollbar">
          {view === 'PROFILE' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parent Contact</div>
                  <div className="text-sm font-bold text-slate-800">{student.parent_phone || 'Not available'}</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Date</div>
                  <div className="text-sm font-bold text-slate-800">{new Date(student.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-500 font-medium tracking-tight">Select an institutional action to proceed:</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setView('GENERATOR')}
                    className="flex flex-col items-center p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-brand-primary hover:bg-brand-primary/5 transition-all group text-center"
                  >
                    <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className="font-bold text-slate-800 block text-sm">Digital Receipt</span>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Manual Entry</span>
                  </button>

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-center"
                  >
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <span className="font-bold text-slate-800 block text-sm">Upload PDF</span>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Leaflet Dispatch</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handlePdfUpload}
                  />
                </div>
              </div>
            </div>
          )}

          {view === 'GENERATOR' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Digital Fee Generator</h4>
                <button onClick={() => setView('PROFILE')} className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest">Go Back</button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Receipt Purpose / Title</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all text-sm font-medium"
                  placeholder="e.g. 1st Term Tuition Fees"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Disbursement Items</label>
                  <button 
                    onClick={addItem}
                    className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest"
                  >
                    + Add New Row
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <input 
                        className="flex-[2] px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium placeholder:text-slate-300"
                        placeholder="Description"
                        value={item.name}
                        onChange={e => {
                          const newItems = [...items];
                          newItems[idx].name = e.target.value;
                          setItems(newItems);
                        }}
                      />
                      <input 
                        type="number"
                        className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold placeholder:text-slate-300 font-mono"
                        placeholder="₦ 0.00"
                        value={item.price}
                        onChange={e => {
                          const newItems = [...items];
                          newItems[idx].price = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'UPLOADING' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
              <div>
                <h3 className="text-xl font-bold text-slate-800">Processing Leaflet...</h3>
                <p className="text-sm text-slate-500">Securely syncing PDF with institutional storage.</p>
              </div>
            </div>
          )}
        </div>

        {view === 'GENERATOR' && (
          <div className="p-12 bg-slate-50 flex items-center justify-between border-t border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Valuation</div>
              <div className="text-4xl font-bold text-slate-800 tracking-tighter">₦{calculateTotal().toLocaleString()}</div>
            </div>
            <button 
              onClick={handleDigitalSubmit}
              disabled={loading}
              className="px-10 py-5 bg-brand-sidebar text-white rounded-2xl font-bold text-sm shadow-2xl shadow-indigo-200 hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Disbursing...' : 'Confirm & Disburse'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SchoolsView({ schools, onAdd }: { schools: any[], onAdd: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Institution Registry</h2>
          <p className="text-sm text-slate-500">Active database instances in current cluster.</p>
        </div>
        <button 
          onClick={onAdd}
          className="text-xs font-bold text-brand-primary bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
        >
          <Building2 size={12} /> Add New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {schools.length > 0 ? (
          schools.map((school) => (
            <motion.div 
              layout
              key={school.id}
              className="group bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:border-brand-primary/30 hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 text-slate-400 group-hover:text-brand-primary rounded-xl flex items-center justify-center transition-colors">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{school.school_name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Admin: {school.admin_username}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Access Code</div>
                  <div className="text-xl font-bold text-brand-primary tracking-tighter tabular-nums">{school.school_code}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-200 group-hover:text-brand-primary group-hover:bg-indigo-50 transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <School size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800">Registry Empty</h3>
              <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">No institutions have been provisioned in this cluster yet.</p>
            </div>
            <button 
              onClick={onAdd}
              className="py-3 px-6 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-brand-primary/90 transition-all"
            >
              Start First Registration
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MessagingSection({ schoolCode, adminId, students }: { schoolCode: string, adminId: string, students: any[] }) {
  const [msgType, setMsgType] = useState<'general' | 'specific'>('general');
  const [content, setContent] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [schoolCode]);

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/messages?schoolCode=${schoolCode}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    if (!content.trim()) return alert("Message content required");
    if (msgType === 'specific' && !selectedStudent) return alert("Please select a student");

    console.log("Dispatching Message:", {
      schoolCode,
      adminId,
      msgType,
      studentId: selectedStudent?.id
    });

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolCode,
          content,
          type: msgType,
          studentId: selectedStudent?.id,
          adminId
        })
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Message dispatched successfully!");
        setContent('');
        setSelectedStudent(null);
        setStudentSearch('');
        loadMessages();
      } else {
        console.error("Server Error Response:", responseData);
        alert(`Database Error: ${responseData.error}\n\nThis usually means the Admin ID (${adminId}) is not recognized by the messages table. Check your Supabase foreign keys.`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error sending message. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this communication record?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Message deleted successfully.");
        loadMessages();
      } else {
        const errorData = await res.json();
        alert("Failed to delete: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error deleting message. Check console for details.");
    }
  };

  const filteredStudentsForMsg = studentSearch.length > 0 
    ? students.filter(s => `${s.surname} ${s.first_name}`.toLowerCase().includes(studentSearch.toLowerCase()))
    : [];

  return (
    <motion.div 
      key="messaging"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-12 overflow-y-auto custom-scrollbar"
    >
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">School Communications</h2>
        <p className="text-slate-500">Dispatch announcements or secure private signals to individual students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl w-fit">
            <button 
              onClick={() => { setMsgType('general'); setSelectedStudent(null); }}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${msgType === 'general' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              General Announcement
            </button>
            <button 
              onClick={() => setMsgType('specific')}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${msgType === 'specific' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Private Message
            </button>
          </div>

          <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            {msgType === 'specific' && (
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipient Search</label>
                {selectedStudent ? (
                  <div className="flex items-center justify-between p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedStudent.surname[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{selectedStudent.surname}, {selectedStudent.first_name}</span>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Search size={14} />
                    </div>
                    <input 
                      type="text"
                      className="w-full pl-10 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm mb-2"
                      placeholder="Search for a student..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                    />
                    {filteredStudentsForMsg.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredStudentsForMsg.map(s => (
                          <div 
                            key={s.id} 
                            onClick={() => setSelectedStudent(s)}
                            className="p-3 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 flex items-center justify-between"
                          >
                            <span>{s.surname}, {s.first_name}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{s.student_class}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Payload</label>
              <textarea 
                className="w-full h-40 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-sm resize-none"
                placeholder={msgType === 'general' ? "Type announcement for all students..." : "Secure private message..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              onClick={handleSend}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${msgType === 'general' ? 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'}`}
            >
              {msgType === 'general' ? <Megaphone size={18} /> : <Shield size={18} />}
              {loading ? 'Dispatching...' : msgType === 'general' ? 'Broadcast to School' : 'Send to Student'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Communication History</h3>
            <span className="text-[10px] font-bold text-slate-400 lowercase tracking-widest">({messages.length} total)</span>
          </div>

          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-4 items-start group">
                <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.type === 'general' ? 'bg-emerald-500' : 'bg-brand-primary'}`}></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {msg.type === 'general' ? <Globe size={12} className="text-emerald-500" /> : <Shield size={12} className="text-brand-primary" />}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {msg.type === 'general' ? 'Global Broadcast' : 'Private Message'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{msg.content}</p>
                  <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>REF: {msg.id.substring(0,8)}</span>
                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(msg.id)} 
                  className="mt-6 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all flex item-center justify-center shadow-sm"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem]">
                <MessageSquare size={32} className="mx-auto text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm italic">No dispatched communications recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ResultUploadModal({ student, schoolCode, onClose }: { student: any, schoolCode: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch(`/api/results/upload?schoolCode=${schoolCode}&studentId=${student.id}`, {
        method: 'POST',
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const dbRes = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          pdfUrl: uploadData.publicUrl,
          schoolCode: schoolCode
        })
      });

      if (dbRes.ok) {
        alert("Terminal Result Published!");
        onClose();
      } else {
        throw new Error('Database record creation failed');
      }
    } catch (error: any) {
      alert(`Upload Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-12 text-center space-y-8"
      >
        <div className="flex justify-between items-start">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
            <Upload size={32} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-800">Publish Academic Result</h3>
          <p className="text-sm text-slate-500">Targeting Profile: <span className="font-bold text-slate-700">{student.surname}, {student.first_name}</span></p>
        </div>

        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50 space-y-4 group hover:border-brand-primary transition-all cursor-pointer" onClick={() => !loading && fileInputRef.current?.click()}>
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-brand-primary transition-colors">
               <FileText size={24} />
             </div>
             <div>
               <p className="text-sm font-bold text-slate-800">{loading ? 'Uploading File...' : 'Select Terminal PDF'}</p>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Maximum 5mb leaf size</p>
             </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf" 
            onChange={handleUpload}
          />
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-brand-primary/90 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Processing Cloud Storage...' : 'Push Result to Portal'}
        </button>

        <button onClick={onClose} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Cancel Operation</button>
      </motion.div>
    </div>
  );
}
