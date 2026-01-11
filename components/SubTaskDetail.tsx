
import React, { useState, useMemo } from 'react';
import { Task, Story, User, Priority } from '../types';
import { 
  ArrowLeft, 
  ChevronRight, 
  Trash2, 
  Save,
  CheckCircle2,
  Circle,
  Zap,
  Briefcase,
  Layers,
  Activity,
  AlignLeft,
  Settings,
  AlertCircle,
  User as UserIcon,
  Bug,
  CheckSquare
} from 'lucide-react';

interface SubTaskDetailProps {
  task: Task;
  story: Story;
  users: User[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onNavigateToStory: (id: string) => void;
  onBack: () => void;
}

const SubTaskDetail: React.FC<SubTaskDetailProps> = ({ task, story, users, onUpdateTask, onDeleteTask, onNavigateToStory, onBack }) => {
  const [formData, setFormData] = useState<Partial<Task>>({ ...task });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdateTask(task.id, formData);
    setIsEditing(false);
  };

  // Scoped users for the current organization
  const orgUsers = useMemo(() => {
    const storyLead = users.find(u => u.id === story.assignedTo);
    return users.filter(u => u.projectId === storyLead?.projectId);
  }, [users, story.assignedTo]);

  const assignee = users.find(u => u.id === task.assignedTo);

  const selectStyle = "w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-5">
        <button onClick={onBack} className="p-3 bg-white hover:bg-gray-50 rounded-[1.25rem] transition-all shadow-sm border border-gray-100 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-indigo-600" />
        </button>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <button 
            onClick={() => onNavigateToStory(story.id)}
            className="flex items-center gap-2 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Story: {story.title.slice(0, 15)}...
          </button>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
            {task.type} Detail
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/30 border border-gray-100 overflow-hidden">
        <div className={`p-10 border-b border-gray-50 flex items-center justify-between text-white ${task.type === 'Bug' ? 'bg-rose-900' : 'bg-slate-900'}`}>
          <div className="flex items-center gap-6">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 ${
              task.status === 'Done' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'
            }`}>
              {task.status}
            </div>
            {isEditing ? (
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-white/20 transition-all"
              >
                <option value="Todo" className="text-gray-900">Todo</option>
                <option value="In Progress" className="text-gray-900">In Progress</option>
                <option value="Done" className="text-gray-900">Done</option>
              </select>
            ) : (
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status Lifecycle</span>
            )}
          </div>
          <div className="flex gap-3">
             <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-white text-indigo-600' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
               {isEditing ? <Save className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
             </button>
             <button onClick={() => window.confirm(`Delete this ${task.type}?`) && onDeleteTask(task.id)} className="p-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
               <Trash2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="p-10 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${task.type === 'Bug' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
                 {task.type === 'Bug' ? <Bug className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${task.type === 'Bug' ? 'text-rose-500' : 'text-indigo-500'}`}>
                Level 4 {task.type}
              </span>
            </div>
            {isEditing ? (
              <input 
                className="text-4xl font-black w-full bg-gray-50 p-6 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 border border-gray-200 transition-all" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            ) : (
              <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight tracking-tight">{task.title}</h2>
            )}
            <div className="flex items-center gap-4 mt-6">
               <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                 <Briefcase className="w-3 h-3" /> Part of Story: {story.title}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-indigo-500" /> Execution Notes
                </h4>
                {isEditing ? (
                  <textarea 
                    className="w-full min-h-[200px] bg-gray-50 p-8 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/10 border border-gray-200 font-medium transition-all" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed text-xl font-medium">{task.description || 'No specialized description provided.'}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 space-y-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">Properties</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Owner</label>
                      {isEditing ? (
                        <div className="relative">
                          <select 
                            value={formData.assignedTo} 
                            onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                            className={selectStyle}
                          >
                            {orgUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                           <img src={assignee?.avatar} className="w-10 h-10 rounded-xl" alt="" />
                           <div>
                             <p className="text-sm font-black text-gray-900">{assignee?.name}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{assignee?.role}</p>
                           </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Priority Track</label>
                      {isEditing ? (
                        <div className="relative">
                          <select 
                            value={formData.priority} 
                            onChange={e => setFormData({...formData, priority: e.target.value as any})}
                            className={selectStyle}
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                        </div>
                      ) : (
                        <div className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border ${
                          task.priority === 'High' || task.priority === 'Urgent' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          {task.priority} Priority
                        </div>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubTaskDetail;
