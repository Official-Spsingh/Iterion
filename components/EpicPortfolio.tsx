
import React, { useState } from 'react';
import { Epic, User, EpicStatus, Priority } from '../types';
import { 
  Plus, 
  Briefcase, 
  ChevronRight, 
  Layers,
  Search,
  Zap,
  AlignLeft,
  User as UserIcon,
  AlertCircle,
  X,
  Settings
} from 'lucide-react';

interface EpicPortfolioProps {
  epics: Epic[];
  onViewEpic: (id: string) => void;
  onAddEpic: (epic: Epic) => void;
  users: User[];
}

const EpicPortfolio: React.FC<EpicPortfolioProps> = ({ epics, onViewEpic, onAddEpic, users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEpic, setNewEpic] = useState({ 
    name: '', 
    description: '', 
    priority: 'Medium' as Priority, 
    status: 'Planning' as EpicStatus,
    ownerId: '' 
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerId = newEpic.ownerId || users[0].id;
    // Fix: Added missing team property to the new Epic object
    const epic: Epic = {
      id: `e_${Date.now()}`,
      name: newEpic.name,
      description: newEpic.description,
      priority: newEpic.priority,
      status: newEpic.status,
      storyCount: 0,
      completedStoryCount: 0,
      ownerId: ownerId,
      projectId: users[0].projectId,
      team: [ownerId]
    };
    onAddEpic(epic);
    setIsModalOpen(false);
    setNewEpic({ name: '', description: '', priority: 'Medium', status: 'Planning', ownerId: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Epic Portfolio</h2>
          <p className="text-gray-500 font-medium">Tracking strategic initiatives across the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> Initiate Epic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {epics.map(epic => (
          <div 
            key={epic.id} 
            onClick={() => onViewEpic(epic.id)}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                epic.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-sky-50 text-sky-600 border-sky-100'
              }`}>{epic.priority} Priority</span>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase border border-indigo-100">{epic.status}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{epic.name}</h3>
            <p className="text-sm text-gray-400 font-medium line-clamp-2 mb-8">{epic.description}</p>
            
            <div className="space-y-4 pt-4 border-t border-gray-50">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>{epic.storyCount} STORIES</span>
                <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-600 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Initiate Epic</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-2">Level 2: High-Level Initiative</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X className="w-7 h-7" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-10 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Epic Name</label>
                <input required type="text" value={newEpic.name} onChange={e => setNewEpic(p => ({...p, name: e.target.value}))} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Executive Summary</label>
                <textarea rows={3} required value={newEpic.description} onChange={e => setNewEpic(p => ({...p, description: e.target.value}))} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Lead</label>
                  <select value={newEpic.ownerId} onChange={e => setNewEpic(p => ({...p, ownerId: e.target.value}))} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Priority</label>
                  <select value={newEpic.priority} onChange={e => setNewEpic(p => ({...p, priority: e.target.value as Priority}))} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Initial Status</label>
                <select value={newEpic.status} onChange={e => setNewEpic(p => ({...p, status: e.target.value as EpicStatus}))} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest mt-4">Commit Initiative</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpicPortfolio;
