
import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  ShieldCheck, 
  Zap,
  Settings,
  Briefcase,
  LayoutGrid,
  SearchCode,
  ListFilter,
  Activity
} from 'lucide-react';
import { User, Project } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: User;
  org: Project;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, org }) => {
  const isSuperAdmin = user.role === 'SuperAdmin';
  const isAdminOrSuper = user.role === 'Admin' || isSuperAdmin;

  const menuItems = [
    { id: 'dashboard', label: 'Project Insights', icon: LayoutDashboard },
    { id: 'discovery', label: 'Discovery', icon: ListFilter },
    { id: 'kanban', label: 'Sprint Board', icon: LayoutGrid },
    { id: 'epics', label: 'Epic Portfolio', icon: Briefcase },
    { id: 'team', label: 'Team Matrix', icon: Users },
    { id: 'chat', label: 'Iterion AI', icon: Zap },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden lg:flex flex-shrink-0">
      <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-br from-gray-900 to-indigo-600 bg-clip-text text-transparent tracking-tighter">Iterion</h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Agile OS</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Workspace Root</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {isAdminOrSuper && (
          <nav className="mt-10 space-y-1.5">
            <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Governance</p>
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'admin' ? 'text-white' : 'text-gray-400'}`} />
              <span className="font-bold text-sm tracking-tight">Admin Hub</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <Settings className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'settings' ? 'text-white' : 'text-gray-400'}`} />
              <span className="font-bold text-sm tracking-tight">Workspace Config</span>
            </button>
          </nav>
        )}

        {isSuperAdmin && (
          <nav className="mt-10 space-y-1.5">
            <p className="px-3 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Platform Core</p>
            <button
              onClick={() => setActiveTab('superadmin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeTab === 'superadmin' ? 'bg-slate-900 text-white shadow-xl' : 'text-gray-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'superadmin' ? 'text-white' : 'text-indigo-400'}`} />
              <span className="font-black text-sm tracking-tight">Iterion Admin</span>
            </button>
          </nav>
        )}
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" />
            <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Active Node</p>
          </div>
          <p className="text-sm font-black mb-4 leading-tight">Infrastructure Stable</p>
          <button className="w-full bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-xl transition-all border border-white/10 backdrop-blur-sm">
            Platform Status
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
