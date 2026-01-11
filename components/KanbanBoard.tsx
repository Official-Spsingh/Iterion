
import React, { useState, useMemo } from 'react';
import { Story, Epic, User, StoryStatus, Priority, Sprint } from '../types';
import { 
  Plus, 
  ChevronRight,
  Zap,
  Briefcase,
  Filter,
  User as UserIcon,
  Flag,
  Activity,
  RotateCcw,
  Calendar
} from 'lucide-react';

interface KanbanBoardProps {
  stories: Story[];
  epics: Epic[];
  users: User[];
  sprints: Sprint[];
  onUpdateStory: (id: string, updates: Partial<Story>) => void;
  onViewStory: (id: string) => void;
  onAddStory: () => void;
  filters: {
    assignee: string;
    priority: string;
    epic: string;
    status: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    assignee: string;
    priority: string;
    epic: string;
    status: string;
  }>>;
  projectUsers: User[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  stories, 
  epics, 
  users,
  sprints,
  onUpdateStory, 
  onViewStory,
  onAddStory,
  filters,
  setFilters,
  projectUsers
}) => {
  const [dragOverStatus, setDragOverStatus] = useState<StoryStatus | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints.find(s => s.status === 'Active')?.id || '');

  const statuses: StoryStatus[] = ['Todo', 'In Progress', 'Ready for Testing', 'Under Testing', 'Closed'];

  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      const matchesSprint = !selectedSprintId || s.sprintId === selectedSprintId;
      return matchesSprint;
    });
  }, [stories, selectedSprintId]);

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Medium': return 'bg-sky-50 text-sky-600 border-sky-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const hasActiveFilters = Object.values(filters).some(f => f !== '');

  const resetFilters = () => {
    setFilters({
      assignee: '',
      priority: '',
      epic: '',
      status: ''
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sprint Board</h2>
            <p className="text-gray-500 text-sm font-medium">Tracking delivery of user stories through the lifecycle.</p>
          </div>
          <div className="h-10 w-[1px] bg-gray-200 hidden lg:block"></div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <select 
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="bg-transparent border-none text-sm font-black text-gray-900 outline-none cursor-pointer"
            >
              <option value="">Full Backlog (All Sprints)</option>
              {sprints.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
              ))}
            </select>
          </div>
        </div>
        <button 
          onClick={onAddStory}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 self-start lg:self-center"
        >
          <Plus className="w-5 h-5" /> Groom New Story
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest pr-2 border-r border-gray-100">
          <Filter className="w-4 h-4" /> Refine View
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-2.5">
            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <select 
            value={filters.assignee}
            onChange={(e) => setFilters(f => ({ ...f, assignee: e.target.value }))}
            className={`pl-9 pr-4 py-2 rounded-xl text-[11px] font-bold border outline-none transition-all appearance-none cursor-pointer ${
              filters.assignee ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-600'
            }`}
          >
            <option value="">All Assignees</option>
            {projectUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-2.5">
            <Flag className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <select 
            value={filters.priority}
            onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
            className={`pl-9 pr-4 py-2 rounded-xl text-[11px] font-bold border outline-none transition-all appearance-none cursor-pointer ${
              filters.priority ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-600'
            }`}
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-2.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <select 
            value={filters.epic}
            onChange={(e) => setFilters(f => ({ ...f, epic: e.target.value }))}
            className={`pl-9 pr-4 py-2 rounded-xl text-[11px] font-bold border outline-none transition-all appearance-none cursor-pointer ${
              filters.epic ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-600'
            }`}
          >
            <option value="">All Epics</option>
            {epics.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[11px] font-bold transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset View
          </button>
        )}
      </div>

      <div className="flex-1 flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
        {statuses.map(status => (
          <div 
            key={status} 
            onDragOver={(e) => { e.preventDefault(); setDragOverStatus(status); }}
            onDrop={(e) => { 
              e.preventDefault(); 
              const id = e.dataTransfer.getData('storyId'); 
              onUpdateStory(id, { status }); 
              setDragOverStatus(null); 
            }}
            className={`w-72 flex-shrink-0 flex flex-col rounded-[2.2rem] p-4 transition-all duration-300 ${
              dragOverStatus === status ? 'bg-indigo-100/50 ring-2 ring-indigo-400 ring-dashed' : 'bg-gray-100/50 shadow-inner'
            }`}
          >
            <div className="flex items-center justify-between mb-4 px-3">
              <h3 className="font-black text-gray-400 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
                {status}
                <span className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded-lg border border-gray-100">
                  {filteredStories.filter(s => s.status === status).length}
                </span>
              </h3>
            </div>

            <div className="space-y-4 flex-1 min-h-[200px]">
              {filteredStories.filter(s => s.status === status).map(story => {
                const parentEpic = epics.find(e => e.id === story.epicId);
                const assignee = users.find(u => u.id === story.assignedTo);
                return (
                  <div 
                    key={story.id} 
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('storyId', story.id); }}
                    onClick={() => onViewStory(story.id)}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group relative cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(story.priority)}`}>
                          {story.priority}
                        </span>
                        {parentEpic && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-indigo-100">
                            <Briefcase className="w-2.5 h-2.5" />
                            {parentEpic.name.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-gray-400">{story.points} SP</span>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{story.title}</h4>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <img src={assignee?.avatar} className="w-6 h-6 rounded-full border border-gray-100" alt="" />
                        <span className="text-[10px] font-bold text-gray-400">{assignee?.name.split(' ')[0]}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
