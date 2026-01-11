
import React, { useState } from 'react';
// Changed Organization to Project
import { User, Project, Role } from '../types';
import { Mail, MessageCircle, MoreVertical, UserPlus, X, ShieldAlert } from 'lucide-react';

interface TeamViewProps {
  users: User[];
  onAddUser?: (user: User) => void;
  // Changed Organization to Project
  org?: Project;
  currentUser: User;
}

const TeamView: React.FC<TeamViewProps> = ({ users, onAddUser, org, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Member' as Role });

  const isSuperAdmin = currentUser.role === 'SuperAdmin';
  const isAdmin = currentUser.role === 'Admin';
  const canAdd = isSuperAdmin || isAdmin;

  const getAssignableroles = (): Role[] => {
    if (isSuperAdmin) return ['SuperAdmin', 'Admin', 'Manager', 'Member'];
    if (isAdmin) return ['Manager', 'Member'];
    return [];
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !onAddUser || !org) return;

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
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Member' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Team Collaborators</h2>
          <p className="text-gray-500">View and connect with your organization members</p>
        </div>
        {canAdd && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Collaborator</span>
          </button>
        )}
      </div>

      {!canAdd && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700 text-sm">
          <ShieldAlert className="w-5 h-5" />
          Only Administrators can add new collaborators to the workspace.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img src={user.avatar} className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm" alt={user.name} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter mb-2 ${
                  user.role === 'SuperAdmin' ? 'bg-indigo-900 text-white' : 
                  user.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-4 truncate">{user.email}</p>
            
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 rounded-xl transition-all text-sm font-semibold">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl transition-all">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleInviteUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" required value={newUser.name} onChange={e => setNewUser(p => ({...p, name: e.target.value}))} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                <input type="email" required value={newUser.email} onChange={e => setNewUser(p => ({...p, email: e.target.value}))} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Role Assignment</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser(p => ({...p, role: e.target.value as Role}))}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {getAssignableroles().map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Add to Team</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
