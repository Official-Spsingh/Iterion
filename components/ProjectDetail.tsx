
import React, { useState, useMemo } from 'react';
import { Epic, Story, User, StoryStatus, Priority, Sprint } from '../types';
import { 
  ArrowLeft, 
  LayoutList, 
  Plus, 
  Save, 
  ChevronRight,
  Circle,
  CheckCircle2,
  Activity,
  X,
  Briefcase,
  Settings,
  Layers,
  AlignLeft,
  Calendar
} from 'lucide-react';

interface ProjectDetailProps {
  project: Epic;
  tasks: Story[];
  users: User[];
  sprints: Sprint[];
  onUpdateProject: (id: string, updates: Partial<Epic>) => void;
  onAddTask: (task: Story) => void;
  onViewTask: (id: string) => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, tasks, users, sprints, onUpdateProject, onAddTask, onViewTask, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Epic>>({ ...project });
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const projectUsers = useMemo(() => 
    users.filter(u => u.projectId === project.projectId),
  [users, project.projectId]);

  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    assignedTo: '',
    sprintId: '',
    priority: 'Medium' as Priority,
    status: 'Todo' as StoryStatus,
    points: 3
  });

  const handleSaveEpic = () => {
    onUpdateProject(project.id, formData);
    setIsEditing(false);
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.title.trim()) return;
    
    const story: Story = {
      id: `s_${Date.now()}`,
      epicId: project.id,
      title: newStory.title,
      description: newStory.description,
      assignedTo: newStory.assignedTo || project.ownerId || projectUsers[0]?.id || '',
      status: newStory.status,
      priority: newStory.priority,
      points: newStory.points,
      sprintId: newStory.sprintId || undefined
    };
    onAddTask(story);
    setIsStoryModalOpen(false);
    setNewStory({
      title: '',
      description: '',
      assignedTo: '',
      sprintId: '',
      priority: 'Medium',
      status: 'Todo',
      points: 3
    });
  };

  const progressPercent = project.storyCount ? Math.round((project.completedStoryCount / project.storyCount) * 100) : 0;
  const owner = users.find(u => u.id === project.ownerId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-5">
        <button onClick={onBack} className="p-3 bg-white hover:bg-gray-50 rounded-[1.25rem] transition-all shadow-sm border border-gray-100 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-indigo-600" />
        </button>
        <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-gray-400">
          <button 
            onClick={onBack} 
            className="hover:text-indigo-600 transition-colors bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100"
          >
            Portfolio
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
            {project.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    <Activity className="w-3 h-3" /> EPIC Container
                  </div>
                </div>
                {isEditing ? (
                  <input 
                    className="text-4xl font-black w-full bg-gray-50 border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-2"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{project.name}</h1>
                )}
                <div className="flex items-center gap-4 mt-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    project.priority === 'High' || project.priority === 'Urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                  }`}>
                    {project.priority} Strategic Priority
                  </span>
                </div>
              </div>
              <button 
                onClick={() => isEditing ? handleSaveEpic() : setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-indigo-500" /> Executive Summary
              </h3>
              {isEditing ? (
                <textarea 
                  className="w-full min-h-[150px] bg-gray-50 border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-500/10 rounded-[1.5rem] p-6 text-gray-700 font-medium"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-xl font-medium">{project.description}</p>
              )}
            </div>

            <div className="mt-16 space-y-8 relative z-10">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <LayoutList className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">User Story Backlog</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Groomed Requirements</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsStoryModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  <Plus className="w-5 h-5" /> Define Story
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {tasks.length > 0 ? tasks.map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => onViewTask(story.id)}
                    className="flex items-center gap-6 p-7 bg-white border border-gray-100 rounded-[2rem] transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:border-indigo-200"
                  >
                    <div className="shrink-0">
                      {story.status === 'Closed' ? (
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center border border-gray-100">
                          <Circle className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className={`font-black text-lg ${story.status === 'Closed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {story.title}
                        </p>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[9px] font-black uppercase tracking-widest">
                          {story.points} SP
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{story.status}</p>
                         {story.sprintId && (
                           <span className="flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                             <Calendar className="w-3 h-3" />
                             {sprints.find(s => s.id === story.sprintId)?.name}
                           </span>
                         )}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-4">
                      <img src={users.find(u => u.id === story.assignedTo)?.avatar} className="w-8 h-8 rounded-full border border-gray-100" alt="" />
                      <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                )) : (
                  <div className="p-16 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">No stories groomed for this Epic yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">Epic Metadata</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">Strategic Lead</span>
                {isEditing ? (
                  <select 
                    value={formData.ownerId}
                    onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                  >
                    {projectUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img src={owner?.avatar} className="w-12 h-12 rounded-xl shadow-sm" alt="" />
                    <div>
                      <span className="text-sm font-black text-gray-900">{owner?.name || 'Unassigned'}</span>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{owner?.role}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-gray-400 uppercase block tracking-widest">Lifecycle Status</span>
                {isEditing ? (
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border border-indigo-100">
                    <Activity className="w-4 h-4" /> {project.status}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-50">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  <span>Momentum</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Creation Modal */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Define User Story</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-2">Level 3: Functional Requirement</p>
              </div>
              <button onClick={() => setIsStoryModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleCreateStory} className="p-10 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Title</label>
                <input required type="text" value={newStory.title} onChange={e => setNewStory(p => ({...p, title: e.target.value}))} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 shadow-inner" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Assigned Sprint</label>
                <select 
                  value={newStory.sprintId} 
                  onChange={e => setNewStory(p => ({...p, sprintId: e.target.value}))} 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none"
                >
                  <option value="">Backlog (No Sprint)</option>
                  {sprints.map(s => <option key={s.id} value={s.id}>{s.name} ({s.status})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Assignee</label>
                  <select 
                    value={newStory.assignedTo} 
                    onChange={e => setNewStory(p => ({...p, assignedTo: e.target.value}))} 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none"
                  >
                    {projectUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1">Estimation (SP)</label>
                  <select 
                    value={newStory.points} 
                    onChange={e => setNewStory(p => ({...p, points: parseInt(e.target.value)}))} 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-900 outline-none"
                  >
                    {[1, 2, 3, 5, 8, 13, 21].map(v => <option key={v} value={v}>{v} SP</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest">Groom Story</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
