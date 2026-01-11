
import React, { useState } from 'react';
// Changed Organization to Project
import { Project } from '../types';
import { 
  Building2, 
  Globe, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  Trash2, 
  Download, 
  Users, 
  Zap,
  Palette,
  Eye,
  Lock,
  Smartphone,
  ShieldCheck,
  Key,
  CreditCard,
  History,
  TrendingUp,
  FileText,
  // Added Clock icon to fix reference error
  Clock
} from 'lucide-react';

interface OrgSettingsViewProps {
  // Changed Organization to Project
  org: Project;
  onUpdateOrg: (updates: Partial<Project>) => void;
}

type SettingsSection = 'general' | 'branding' | 'security' | 'billing';

const OrgSettingsView: React.FC<OrgSettingsViewProps> = ({ org, onUpdateOrg }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [formData, setFormData] = useState({ 
    name: org.name, 
    domain: org.domain, 
    logo: org.logo 
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock policy states
  const [policies, setPolicies] = useState({
    guestAccess: false,
    publicDirectory: true,
    aiReasoning: 'high',
    dataRetention: '365',
    mfaRequired: true,
    ssoEnabled: false,
    sessionTimeout: '24'
  });

  const [branding, setBranding] = useState({
    primaryColor: org.branding?.primaryColor || '#6366f1',
    darkMode: org.branding?.darkMode ?? true,
    fontFamily: org.branding?.fontFamily || 'Inter'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      onUpdateOrg(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  const handleApplyBranding = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      onUpdateOrg({ branding });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  const handlePolicyToggle = (key: keyof typeof policies) => {
    setPolicies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Workspace Config</h2>
        <p className="text-gray-500 mt-1 font-medium italic">Configure global identity, security, and financial operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 space-y-1">
            {[
              { id: 'general', label: 'General Info', icon: Building2 },
              { id: 'branding', label: 'Branding & UI', icon: Palette },
              { id: 'security', label: 'Security & Auth', icon: Lock },
              { id: 'billing', label: 'Billing & Plans', icon: Zap }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                  activeSection === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-white' : ''}`} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
            <h4 className="font-black text-xs uppercase tracking-widest text-indigo-400 mb-2">Service Status</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              You are on the <strong>Enterprise Elite</strong> plan. 99.9% uptime guaranteed via global SLI tracking.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Section */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-600" /> Identity Core</h3>
                  {showSuccess && (
                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                      <CheckCircle2 className="w-4 h-4" /> Sync Complete
                    </div>
                  )}
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Workspace Designation</label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Infrastructure Domain</label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                          type="text" 
                          value={formData.domain}
                          onChange={e => setFormData(prev => ({...prev, domain: e.target.value}))}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Workspace Symbol</label>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl border border-gray-100 shadow-inner">
                        {formData.logo}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input 
                          type="text" 
                          value={formData.logo}
                          maxLength={2}
                          onChange={e => setFormData(prev => ({...prev, logo: e.target.value}))}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                          placeholder="Emoji"
                        />
                        <p className="text-[9px] text-gray-400 font-bold px-1 italic">Visible across tenant navigation and billing statements.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                      Sync Changes
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-rose-50 rounded-[2rem] border border-rose-100 p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-100 rounded-2xl">
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight leading-none">Danger Operations</h3>
                    <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest mt-1">Irreversible infrastructure actions</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-rose-200 rounded-2xl text-rose-700 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Export Data
                  </button>
                  <button className="flex items-center justify-center gap-3 px-6 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                    <Trash2 className="w-4 h-4" /> Purge Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Branding Section */}
          {activeSection === 'branding' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Palette className="w-5 h-5 text-indigo-600" /> Visual Identity</h3>
                {showSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="w-4 h-4" /> Sync Complete
                  </div>
                )}
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Primary Theme Color</label>
                    <div className="flex flex-wrap gap-3">
                      {['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#0f172a'].map(color => (
                        <button 
                          key={color} 
                          onClick={() => setBranding({...branding, primaryColor: color})}
                          className={`w-10 h-10 rounded-xl transition-all ${branding.primaryColor === color ? 'ring-4 ring-indigo-100 scale-110 shadow-lg' : 'hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Interface Mode</label>
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                      <button onClick={() => setBranding({...branding, darkMode: false})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!branding.darkMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Standard</button>
                      <button onClick={() => setBranding({...branding, darkMode: true})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${branding.darkMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Enterprise Dark</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Global Typography</label>
                  <select 
                    value={branding.fontFamily}
                    onChange={e => setBranding({...branding, fontFamily: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none"
                  >
                    <option value="Inter">Inter (System Default)</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Mono">Space Mono</option>
                  </select>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Preview Engine</h4>
                  <div className="p-10 bg-gray-900 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20" style={{ backgroundColor: branding.primaryColor }}></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg shadow-lg" style={{ backgroundColor: branding.primaryColor }}></div>
                        <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[65%]" style={{ backgroundColor: branding.primaryColor }}></div>
                      </div>
                      <button 
                        onClick={handleApplyBranding}
                        disabled={isSaving}
                        className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50" 
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        {isSaving ? 'Processing...' : 'Apply Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Lock className="w-5 h-5 text-indigo-600" /> Authentication Policies</h3>
                </div>
                <div className="p-8 space-y-6">
                  {[
                    { id: 'mfaRequired', label: 'Enforce MFA', desc: 'Force all users to use hardware or app-based 2FA.', icon: Smartphone },
                    { id: 'ssoEnabled', label: 'Enterprise SSO (SAML)', desc: 'Connect to Okta, Azure AD, or Google Workspace.', icon: Key },
                  ].map(policy => (
                    <div key={policy.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-indigo-100 transition-all group">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100"><policy.icon className="w-6 h-6" /></div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{policy.label}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-tight">{policy.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePolicyToggle(policy.id as any)}
                        className={`w-14 h-8 rounded-full transition-all relative ${policies[policy.id as keyof typeof policies] ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${policies[policy.id as keyof typeof policies] ? 'left-8' : 'left-1.5'}`}></div>
                      </button>
                    </div>
                  ))}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block px-1">Global Session Expiration</label>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                      <select 
                        value={policies.sessionTimeout}
                        onChange={e => setPolicies({...policies, sessionTimeout: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 outline-none"
                      >
                        <option value="1">1 Hour</option>
                        <option value="8">8 Hours (Standard Shift)</option>
                        <option value="24">24 Hours (Full Cycle)</option>
                        <option value="168">7 Days (Continuous Track)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-[2rem] border border-indigo-100 p-8 flex gap-6 items-start">
                 <div className="w-16 h-16 shrink-0 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                    <ShieldCheck className="w-8 h-8" />
                 </div>
                 <div>
                    <h4 className="font-black text-indigo-900 text-lg">Cybersecurity Audit</h4>
                    <p className="text-indigo-600/70 text-sm font-medium mt-1 leading-relaxed">
                      Your current security posture is rated as <strong>High</strong>. Compliance standards (SOC2, ISO27001) are active and verified.
                    </p>
                    <button className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">View Audit Logs</button>
                 </div>
              </div>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === 'billing' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Subscription</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-2">Enterprise Elite</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">Workspace Nodes</span>
                      <span className="text-gray-900">128 / 5,000</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 w-[15%]"></div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all">Upgrade Plan</button>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Compute Usage</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-2">85.4%</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                     <History className="w-3.5 h-3.5" /> Stable across sprints
                  </div>
                  <button className="w-full py-4 bg-gray-50 text-gray-600 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">Telemetry Details</button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" /> Invoice History</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/30 border-b border-gray-100">
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statement ID</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cycle Date</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { id: 'INV-2024-003', date: 'Mar 1, 2024', amount: '$1,250.00' },
                          { id: 'INV-2024-002', date: 'Feb 1, 2024', amount: '$1,250.00' },
                          { id: 'INV-2024-001', date: 'Jan 1, 2024', amount: '$1,250.00' },
                        ].map(inv => (
                          <tr key={inv.id} className="hover:bg-gray-50/50 transition-all">
                             <td className="px-8 py-5 text-xs font-black text-gray-900">{inv.id}</td>
                             <td className="px-8 py-5 text-xs font-bold text-gray-500">{inv.date}</td>
                             <td className="px-8 py-5 text-xs font-black text-indigo-600">{inv.amount}</td>
                             <td className="px-8 py-5 text-right">
                               <button className="p-2 hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 rounded-lg transition-all"><Download className="w-4 h-4" /></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgSettingsView;
