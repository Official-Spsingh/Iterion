
import React, { useState } from 'react';
import { User as UserType } from '../types';
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  User as UserIcon, 
  ShieldCheck, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AuthViewProps {
  users: UserType[];
  onLogin: (user: UserType) => void;
  onSignup: (name: string, email: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ users, onLogin, onSignup }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    if (mode === 'login') {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid credentials. Try 'spsingh@gmail.com' for demo.");
        setIsLoading(false);
      }
    } else {
      onSignup(name, email);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-500/20 mb-6">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Iterion</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Agile Delivery System</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>
          
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Secure Login
            </button>
            <button 
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'signup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Join Platform
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Engineer Name" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="email@cloudscale.io" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{mode === 'login' ? 'Enter Workspace' : 'Initialize Account'}</span>}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Secure Cloud Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
