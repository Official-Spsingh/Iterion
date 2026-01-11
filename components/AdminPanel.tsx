
import React, { useState } from 'react';
// Changed Organization to Project
import { Project, User, Role } from '../types';
import { Shield, Edit3, Trash2, UserPlus, Filter, X, Lock } from 'lucide-react';

interface AdminPanelProps {
  // Changed Organization to Project
  org: Project;
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ org, users, onAddUser, onUpdateUser, onDeleteUser, currentUser }) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Member' as Role });
  const [filterQuery, setFilterQuery] = useState('');

  const isSuperAdmin = currentUser.role === 'SuperAdmin';
  const isAdmin = currentUser.role === 'Admin';

  // HELPER: Can the current user edit the target user?
  const canModifyUser = (targetUser: User) => {
    if (isSuperAdmin) return true; // SuperAdmin can edit everyone
    if (isAdmin) {
      // Admins can only edit Managers and Members
      return targetUser.role === 'Manager' || targetUser.role === 'Member';
    }
    return false; // Managers/Members can't edit anyone
  };

  // HELPER: What roles can the current user assign?
  const getAssignableroles = (): Role[] => {
    if (isSuperAdmin) return ['SuperAdmin', 'Admin', 'Manager', 'Member'];
    if (isAdmin) return ['Manager', 'Member'];
    return [];
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: User = {
      id: `u_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: `https://picsum.photos/seed/${newUser.email}/100/100`,
      // Changed organizationId to projectId
      projectId: org.id
    };

    onAddUser(user);
    setIsInviteModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Member' });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role
    });
    setEditingUser(null);
  };

  const handleDeleteClick = (user: User) => {
    if (!canModifyUser(user)) return;
    if (window.confirm(`Are you sure you want to remove ${user.name} from the organization?`)) {
      onDeleteUser(user.id);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Administrator Console</h2>
          <p className="text-gray-500">Manage users, roles, and security for {org.name}</p>
        </div>
        {(isAdmin || isSuperAdmin) && (
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <UserPlus className="w-5 h-5" />
            <span>Invite User</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">User Directory</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Access</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const isEditable = canModifyUser(user);
                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-100" alt="" />
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'SuperAdmin' ? 'bg-indigo-900 text-white' :
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isEditable ? (
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Full Control</span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Read Only
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditable && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(user)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleInviteUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" required value={newUser.name} onChange={e => setNewUser(p => ({...p, name: e.target.value}))} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                <input type="email" required value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Role</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser(p => ({...p, role: e.target.value as Role}))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {getAssignableroles().map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg">Send Invitation</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit Member</h3>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" value={editingUser.name} onChange={e => setEditingUser(p => p ? {...p, name: e.target.value} : null)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Role</label>
                <select 
                  value={editingUser.role}
                  onChange={e => setEditingUser(p => p ? {...p, role: e.target.value as Role} : null)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {getAssignableroles().map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
