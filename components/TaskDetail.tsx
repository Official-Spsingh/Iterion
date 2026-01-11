
import React, { useState, useMemo } from 'react';
import { Story, Epic, User, Task, StoryStatus, Priority, Sprint } from '../types';
import { 
  ArrowLeft, 
  ChevronRight, 
  Trash2, 
  Save,
  Plus,
  Zap,
  Activity,
  X,
  AlignLeft,
  Settings,
  Bug,
  CheckSquare,
  Briefcase,
  Calendar
} from 'lucide-react';

interface TaskDetailProps {
  task: Story;
  project: Epic;
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Story>) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: Task) => void;
  onViewSubTask: (id: string) => void;
  onNavigateToEpic: (id: string) => void;
  onBack: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, project, users, sprints, tasks, onUpdateTask, onDeleteTask, onAddTask, onViewSubTask, onNavigateToEpic, onBack }) => {
  const [formData, setFormData] = useState<Partial<Story>>({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const projectUsers = useMemo(() => 
    users.filter(u => u.projectId === project.projectId),
  [users, project.projectId]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium' as Priority,
    status: 'Todo' as 'Todo' | 'In Progress' | 'Done',
    type: 'Task' as 'Task' | 'Bug'
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const t: Task = {
      id: `t_${Date.now()}`,
      storyId: task.id,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo || projectUsers[0]?.id || '',
      status: newTask.status,
      priority: newTask.priority,
      type: newTask.type,
      sprintId: task.sprintId // Sub-tasks inherit sprint from story
    };
    onAddTask(t);
    setIsTaskModalOpen(false);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', status: 'Todo', type: 'Task' });
  };

  const handleSaveStory = () => {
    onUpdateTask(task.id, formData);
    setIsEditing(false);
  };

  const currentAssignee = users.find(u => u.id === task.assignedTo);
  const currentSprint = sprints.find(s => s.id === task.sprintId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-5">
        <button onClick={onBack} className="p-3 bg-white hover:bg-gray-50 rounded-[1.25rem] transition-all shadow-sm border border-gray-100 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-indigo-600" />
        </button>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <button 
            onClick={() => onNavigateToEpic(project.id)}
            className="flex items-center gap-2 hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Epic: {project.name.slice(0, 15)}...
          </button>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
            User Story Detail
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/30 border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-6">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
              task.status === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}>
              {task.status}
            </div>
            {isEditing ? (
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StoryStatus })}
                className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready for Testing">Ready for Testing</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Closed">Closed</option>
              </select>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Requirement Status</span>
            )}
          </div>
          <div className="flex gap-3">
             <button onClick={() => isEditing ? handleSaveStory() : setIsEditing(true)} className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
               {isEditing ? <Save className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
             </button>
             <button onClick={() => window.confirm('Delete story?') && onDeleteTask(task.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl">
               <Trash2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="p-10 space-y-12">
          <div>
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Requirement Detail</h4>
               </div>
               {currentSprint && !isEditing && (
                 <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{currentSprint.name}</span>
                 </div>
               )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <input className="text-4xl font-black w-full bg-gray-50 p-4 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 px-1">Active Sprint</label>
                      <select 
                        value={formData.sprintId}
                        onChange={e => setFormData({...formData, sprintId: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                      >
                        <option value="">Backlog (No Sprint)</option>
                        {sprints.map(s => <option key={s.id} value={s.id}>{s.name} ({s.status})</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 px-1">Estimation (SP)</label>
                      <select 
                        value={formData.points}
                        onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                      >
                        {[1, 2, 3, 5, 8, 13, 21].map(v => <option key={v} value={v}>{v} SP</option>)}
                      </select>
                   </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight tracking-tight">{task.title}</h2>
                <div className="flex items-center gap-4 mt-4">
                   <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <img src={currentAssignee?.avatar} className="w-6 h-6 rounded-lg" alt="" />
                      <span className="text-[11px] font-black text-gray-700">{currentAssignee?.name}</span>
                   </div>
                   <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100">{task.points} STORY POINTS</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-indigo-500" /> Scope & Acceptance Criteria
            </h4>
            {isEditing ? (
              <textarea className="w-full min-h-[150px] bg-gray-50 p-6 border border-gray-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/10" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            ) : (
              <p className="text-gray-600 leading-relaxed text-xl font-medium">{task.description}</p>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" /> Level 4 Execution Nodes
              </h4>
              <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase">
                <Plus className="w-4 h-4" /> Add Node
              </button>
            </div>

            <div className="space-y-4">
              {tasks.length > 0 ? tasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => onViewSubTask(t.id)}
                  className={`p-6 bg-gray-50 rounded-[2rem] border ${t.type === 'Bug' ? 'border-rose-100 hover:border-rose-300' : 'border-gray-100 hover:border-indigo-300'} flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${t.type === 'Bug' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
                        {t.type === 'Bug' ? <Bug className="w-5 h-5" /> : <CheckSquare className="w-5 h-5" />}
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <p className={`font-bold text-gray-900 group-hover:text-indigo-600 transition-colors ${t.status === 'Done' ? 'line-through text-gray-400' : ''}`}>{t.title}</p>
                       </div>
                       <p className="text-[9px] font-black text-gray-400 uppercase">{t.status} • {t.priority} • {t.type}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={users.find(u => u.id === t.assignedTo)?.avatar} className="w-7 h-7 rounded-full" alt="" />
                    <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-400 text-sm italic py-10">No execution nodes defined for this provision.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task/Bug Creation Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={`p-3 rounded-2xl ${newTask.type === 'Bug' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {newTask.type === 'Bug' ? <Bug className="w-6 h-6" /> : <CheckSquare className="w-6 h-6" />}
                 </div>
                 <h3 className="text-2xl font-black">Provision {newTask.type}</h3>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddTask} className="p-10 space-y-6">
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setNewTask(p => ({...p, type: 'Task'}))}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newTask.type === 'Task' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Technical Task
                </button>
                <button 
                  type="button"
                  onClick={() => setNewTask(p => ({...p, type: 'Bug'}))}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newTask.type === 'Bug' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  System Defect
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase block mb-1 px-1">Designation</label>
                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase block mb-1 px-1">Context / Reproduction</label>
                <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 outline-none" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 px-1">Assignee</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                    {projectUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 px-1">Priority</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={`w-full py-4 text-white rounded-xl font-black uppercase tracking-widest shadow-xl transition-all ${newTask.type === 'Bug' ? 'bg-rose-500 shadow-rose-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
                Add {newTask.type}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
