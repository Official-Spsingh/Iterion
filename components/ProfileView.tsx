
import React, { useState, useRef } from 'react';
import { User, Project } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Building2, 
  Camera, 
  Check, 
  Edit3, 
  Save, 
  X, 
  Zap,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onUpdate: (userId: string, updates: Partial<User>) => void;
  org: Project;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, org }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.id, formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdate(user.id, { avatar: base64String });
      setIsUploading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Personal Workspace</h2>
          <p className="text-gray-500 mt-1">Manage your identity and preferences across Iterion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8">
            <div className="relative inline-block mb-6 group">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  className={`w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl transition-all ${isUploading ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
                  alt={user.name} 
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Update Profile Picture"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{user.name}</h3>
            <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mt-1">{user.role}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">{org.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Enterprise Track</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold">Security Shield</h4>
            </div>
            <p className="text-sm text-indigo-100 leading-relaxed mb-4">
              Your session is encrypted with hardware-level protocols. Tenant isolation is verified.
            </p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Manage Access Keys
            </button>
          </div>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600" />
                Account Configuration
              </h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Bio
                </button>
              ) : (
                <button 
                  onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email }); }}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="p-8 flex-1">
              {showSuccess && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Profile attributes synchronized successfully.</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Designation</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold`}
                        placeholder="System Engineer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Infrastructure Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="email" 
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold"
                        placeholder="eng@tenant.io"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Updates reflect across the tenant directory
                  </div>
                  {isEditing && (
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button 
                        type="button"
                        onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email }); }}
                        className="flex-1 sm:flex-none px-8 py-3.5 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all border border-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                      >
                        <Save className="w-4 h-4" />
                        Save Profile
                      </button>
                    </div>
                  )}
                </div>
              </form>

              <div className="mt-12 space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Technical Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Real-time Telemetry', status: 'Enabled' },
                    { label: 'AI Strategy Logic', status: 'Predictive' },
                    { label: 'Interface Sync', status: 'Active' },
                    { label: 'Audit Logging', status: 'On' }
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all group">
                      <span className="text-sm font-bold text-gray-700">{pref.label}</span>
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-100">{pref.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
