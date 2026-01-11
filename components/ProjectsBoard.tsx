
import React, { useState, useMemo } from 'react';
import { Epic, Story, User } from '../types';
import { 
  Plus, 
  Tag, 
  X, 
  LayoutList, 
  Clock, 
  LayoutGrid,
  List,
  ChevronRight,
  User as UserIcon,
  AlignLeft,
  AlertCircle,
  Activity,
  Briefcase,
  Layers
} from 'lucide-react';
import { getProjectSummary } from '../services/gemini';

interface ProjectsBoardProps {
  projects: Epic[];
  tasks: Story[];
  users: User[];
  onAddProject: (project: Epic) => void;
  onViewProject: (projectId: string) => void;
  onUpdateStatus: (projectId: string, status: Epic['status']) => void;
  orgId: string;
}

const ProjectsBoard: React.FC<ProjectsBoardProps> = ({ 
  projects, 
  tasks, 
  users,
  onAddProject, 
  onViewProject,
  onUpdateStatus, 
  orgId 
}) => {
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'board' | 'list'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orgUsers = useMemo(() => 
    users.filter(u => u.projectId === orgId),
  [users, orgId]);

  const [newProject, setNewProject] = useState({ 
    name: '', 
    description: '', 
    priority: 'Medium' as Epic['priority'],
    status: 'Planning' as Epic['status'],
    ownerId: ''
  });

  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const handleAISummary = (e: React.MouseEvent, project: Epic) => {
    e.stopPropagation();
    setSummarizing(project.id);
    getProjectSummary(project.name, project.description, tasks.filter(t => t.epicId === project.id)).then(summary => {
      console.log(summary);
      setSummarizing(null);
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    
    const ownerId = newProject.ownerId || orgUsers[0]?.id || '';

    // Fix: team property is now correctly defined in the Epic interface (types.ts)
    const project: Epic = {
      id: `e_${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      priority: newProject.priority,
      storyCount: 0,
      completedStoryCount: 0,
      team: [ownerId],
      ownerId: ownerId,
      projectId: orgId,
      tags: []
    };
    onAddProject(project);
    setIsModalOpen(false);
    setNewProject({ 
      name: '', 
      description: '', 
      priority: 'Medium', 
      status: 'Planning',
      ownerId: ''
    });
  };

  const statuses: Epic['status'][] = ['Planning', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="h-full flex flex-col space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Epic Portfolio</h2>
          <p className="text-gray-500">Manage high-level initiatives and delivery tracks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button 
              onClick={() => setViewType('board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'board' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
          <button 
            onClick={() => {
              setNewProject(prev => ({ ...prev, ownerId: orgUsers[0]?.id || '' }));
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            <span>New Epic</span>
          </button>
        </div>
      </div>

      {viewType === 'board' ? (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {statuses.map(status => (
            <div 
              key={status} 
              onDragOver={(e) => { e.preventDefault(); setDragOverStatus(status); }}
              onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('projectId'); onUpdateStatus(id, status); setDragOverStatus(null); }}
              className={`w-84 flex-shrink-0 flex flex-col rounded-[2rem] p-5 transition-all duration-200 ${
                dragOverStatus === status ? 'bg-indigo-100/50 ring-2 ring-indigo-400 ring-dashed' : 'bg-gray-100/50 shadow-inner'
              }`}
            >
              <div className="flex items-center justify-between mb-5 px-2">
                <h3 className="font-black text-gray-500 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
                  {status}
                  <span className="text-xs bg-white text-indigo-600 px-2.5 py-0.5 rounded-full border border-gray-100 shadow-sm">{projects.filter(p => p.status === status).length}</span>
                </h3>
              </div>

              <div className="space-y-4 flex-1 min-h-[100px]">
                {projects.filter(p => p.status === status).map(project => (
                  <div 
                    key={project.id} 
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('projectId', project.id); }}
                    onClick={() => onViewProject(project.id)}
                    className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 group relative cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        project.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
                      }`}>{project.priority}</span>
                      <button 
                        onClick={(e) => handleAISummary(e, project)}
                        className="p-1.5 rounded-xl hover:bg-indigo-50 text-indigo-400 transition-colors"
                      >
                        {summarizing === project.id ? <Clock className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-5 font-medium">{project.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                        <LayoutList className="w-3.5 h-3.5" />
                        <span>{project.completedStoryCount}/{project.storyCount} STORIES</span>
                      </div>
                      {/* Fix: Access the team property, which is now supported by the Epic type update */}
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map(uId => (
                          <img key={uId} src={users.find(u => u.id === uId)?.avatar} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt="" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Initiative Epic</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Story Completion</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Drill Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(project => (
                <tr 
                  key={project.id} 
                  onClick={() => onViewProject(project.id)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black shadow-sm border border-indigo-100">{project.name.charAt(0)}</div>
                       <div>
                        <p className="font-bold text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-400 font-medium truncate max-w-sm">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      project.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="bg-indigo-600 h-full transition-all duration-700 ease-out" 
                          style={{ width: `${project.storyCount ? (project.completedStoryCount / project.storyCount) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {Math.round(project.storyCount ? (project.completedStoryCount / project.storyCount) * 100 : 0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-indigo-400 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Epic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Provision Epic</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-2">Level 2: Hierarchy: Initiative</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Epic Designation
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Initiative name (e.g. Infrastructure Evolution)"
                    value={newProject.name} 
                    onChange={e => setNewProject(p => ({...p, name: e.target.value}))} 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-900" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    <AlignLeft className="w-3.5 h-3.5 text-indigo-500" /> High-Level Scope
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Describe the broad objectives and business value..."
                    value={newProject.description} 
                    onChange={e => setNewProject(p => ({...p, description: e.target.value}))} 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-gray-900 resize-none shadow-inner" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                      <UserIcon className="w-3.5 h-3.5 text-indigo-500" /> Lead Strategist
                    </label>
                    <select 
                      value={newProject.ownerId}
                      onChange={e => setNewProject(p => ({...p, ownerId: e.target.value}))}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-900 cursor-pointer"
                    >
                      {orgUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-500" /> Priority
                    </label>
                    <select 
                      value={newProject.priority}
                      onChange={e => setNewProject(p => ({...p, priority: e.target.value as any}))}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-900 cursor-pointer"
                    >
                      <option value="Low">Low Track</option>
                      <option value="Medium">Standard Track</option>
                      <option value="High">Critical Track</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <Briefcase className="w-6 h-6" />
                  Initialize Epic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsBoard;
