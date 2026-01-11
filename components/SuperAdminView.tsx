
import React, { useState } from 'react';
// Changed Organization to Project
import { Project, User, Role } from '../types';
import { 
  Globe, 
  Plus, 
  Search, 
  Trash2, 
  ExternalLink, 
  Activity, 
  Users, 
  ChevronRight,
  ShieldCheck,
  X,
  PlusCircle,
  Shield,
  UserCheck,
  ShieldAlert,
  ArrowDown,
  UserPlus,
  Building,
  Edit3,
  // Fix: Added missing Save icon import
  Save
} from 'lucide-react';

interface SuperAdminViewProps {
  // Changed Organization to Project
  organizations: Project[];
  onAddOrg: (org: Project) => void;
  onDeleteOrg: (id: string) => void;
  onSwitchOrg: (org: Project) => void;
  allUsers: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onAddUser: (user: User) => void;
}

const SuperAdminView: React.FC<SuperAdminViewProps> = ({ 
  organizations, 
  onAddOrg, 
  onDeleteOrg, 
  onSwitchOrg, 
  allUsers, 
  onUpdateUser,
  onAddUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orgs' | 'users'>('orgs');
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newOrg, setNewOrg] = useState({ name: '', domain: '', logo: '🏢' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Member' as Role, orgId: organizations[0]?.id || '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.domain) return;
    // Changed Organization to Project
    const org: Project = {
      id: `org_${Date.now()}`,
      name: newOrg.name,
      domain: newOrg.domain,
      logo: newOrg.logo
    };
    onAddOrg(org);
    setIsOrgModalOpen(false);
    setNewOrg({ name: '', domain: '', logo: '🏢' });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.orgId) return;
    const user: User = {
      id: `u_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: `https://picsum.photos/seed/${newUser.email}/100/100`,
      // Changed organizationId to projectId
      projectId: newUser.orgId
    };
    onAddUser(user);
    setIsUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Member', orgId: organizations[0]?.id || '' });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      projectId: editingUser.projectId
    });
    setEditingUser(null);
  };

  const setRole = (userId: string, role: Role) => {
    if (role === 'SuperAdmin') {
      if (!window.confirm("CRITICAL: This grants platform-wide control. Proceed?")) return;
    }
    onUpdateUser(userId, { role });
  };

  const filteredOrgs = organizations.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Operations</h2>
          <p className="text-gray-500 mt-1">Infrastructure Control & Access Management</p>
        </div>
        <div className="flex gap-2 bg-indigo-900/10 p-1 rounded-xl">
          <button onClick={() => {setActiveSubTab('orgs'); setSearchQuery('');}} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'orgs' ? 'bg-indigo-900 text-white shadow-sm' : 'text-indigo-900 hover:bg-white/50'}`}>Tenants</button>
          <button onClick={() => {setActiveSubTab('users'); setSearchQuery('');}} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'users' ? 'bg-indigo-900 text-white shadow-sm' : 'text-indigo-900 hover:bg-white/50'}`}>Access Control</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeSubTab === 'orgs' ? "Search tenants..." : "Search users..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            {activeSubTab === 'users' && (
              <button 
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Provision User</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              SuperAdmin Authorized
            </div>
          </div>
        </div>

        {activeSubTab === 'orgs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {filteredOrgs.map((org) => (
              <div key={org.id} className="group bg-gray-50/50 hover:bg-white rounded-2xl border border-gray-100 p-6 transition-all hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => window.confirm('Delete tenant?') && onDeleteOrg(org.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">{org.logo}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{org.name}</h4>
                    <p className="text-xs text-gray-500">{org.domain}</p>
                  </div>
                </div>
                <button onClick={() => onSwitchOrg(org)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm">
                  <ExternalLink className="w-3.5 h-3.5" /> Jump into Tenant
                </button>
              </div>
            ))}
            <button onClick={() => setIsOrgModalOpen(true)} className="group rounded-2xl border-2 border-dashed border-gray-200 p-6 transition-all hover:border-indigo-300 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-indigo-600">
              <Plus className="w-6 h-6" /><span className="text-sm font-bold">Add New Tenant</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Platform User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Escalation Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  // Changed organizationId to projectId
                  const userOrg = organizations.find(o => o.id === user.projectId);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-9 h-9 rounded-full" alt="" />
                          <div><p className="font-bold text-sm text-gray-900">{user.name}</p><p className="text-[10px] text-gray-500">{user.email}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'SuperAdmin' ? 'bg-indigo-900 text-white' : user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4"><span className="text-xs font-medium text-gray-600">{userOrg?.name || 'Isolated'}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(user)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Platform User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {user.role !== 'SuperAdmin' && (
                            <button onClick={() => setRole(user.id, 'SuperAdmin')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 border border-indigo-100"><ShieldAlert className="w-3.5 h-3.5" /> Make Super</button>
                          )}
                          {user.role !== 'Admin' && (
                            <button onClick={() => setRole(user.id, 'Admin')} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold hover:bg-purple-100 border border-purple-100"><UserCheck className="w-3.5 h-3.5" /> Make Admin</button>
                          )}
                          {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
                            <button onClick={() => setRole(user.id, 'Member')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold hover:bg-red-50 hover:text-red-500 transition-colors"><ArrowDown className="w-3.5 h-3.5" /> Demote</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision Tenant Modal */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-indigo-900 text-white">
              <div><h3 className="text-xl font-bold">Provision Tenant</h3><p className="text-indigo-200 text-[10px] uppercase tracking-wider">SuperAdmin Action</p></div>
              <button onClick={() => setIsOrgModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrg} className="p-8 space-y-5">
              <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Org Name</label><input type="text" required value={newOrg.name} onChange={e => setNewOrg(p => ({...p, name: e.target.value}))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Domain</label><input type="text" required value={newOrg.domain} onChange={e => setNewOrg(p => ({...p, domain: e.target.value}))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" /></div>
              <button type="submit" className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold shadow-xl">Commit Infrastructure</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Global User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-indigo-900 text-white">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-400" />
                  Edit Platform User
                </h3>
                <p className="text-indigo-300/60 text-[10px] uppercase tracking-[0.2em] mt-1">Platform-Wide Access Management</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    required 
                    value={editingUser.name} 
                    onChange={e => setEditingUser(p => p ? ({...p, name: e.target.value}) : null)} 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Email</label>
                <input 
                  type="email" 
                  required 
                  value={editingUser.email} 
                  onChange={e => setEditingUser(p => p ? ({...p, email: e.target.value}) : null)} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Role</label>
                  <select 
                    value={editingUser.role} 
                    onChange={e => setEditingUser(p => p ? ({...p, role: e.target.value as Role}) : null)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Tenant</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                    <select 
                      value={editingUser.projectId} 
                      onChange={e => setEditingUser(p => p ? ({...p, projectId: e.target.value}) : null)}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-sm"
                    >
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-950 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Update User Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provision Global User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-indigo-950 text-white">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  Provision Platform User
                </h3>
                <p className="text-indigo-300/60 text-[10px] uppercase tracking-[0.2em] mt-1">Cross-Tenant Identity Creation</p>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    required 
                    value={newUser.name} 
                    onChange={e => setNewUser(p => ({...p, name: e.target.value}))} 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="Wanda Maximoff"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Email</label>
                <input 
                  type="email" 
                  required 
                  value={newUser.email} 
                  onChange={e => setNewUser(p => ({...p, email: e.target.value}))} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="wanda@avengers.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Role</label>
                  <select 
                    value={newUser.role} 
                    onChange={e => setNewUser(p => ({...p, role: e.target.value as Role}))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                  >
                    <option value="Member">Member</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Target Tenant</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                    <select 
                      value={newUser.orgId} 
                      onChange={e => setNewUser(p => ({...p, orgId: e.target.value}))}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-sm"
                    >
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-950 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Initialize Global User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminView;
