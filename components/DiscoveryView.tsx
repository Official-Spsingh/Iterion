
import React, { useState, useMemo } from 'react';
import { Epic, Story, Task, User, ItemType, Priority, Sprint } from '../types';
import { 
  Search, 
  Briefcase, 
  Zap, 
  CheckSquare, 
  Bug, 
  ChevronRight, 
  RotateCcw,
  Layers,
  Calendar,
  Activity
} from 'lucide-react';

interface DiscoveryViewProps {
  epics: Epic[];
  stories: Story[];
  tasks: Task[];
  users: User[];
  sprints: Sprint[];
  onNavigate: (type: 'epic' | 'story' | 'task', id: string) => void;
}

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ epics, stories, tasks, users, sprints, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ItemType | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [filterAssignee, setFilterAssignee] = useState<string>('All');
  const [filterSprint, setFilterSprint] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Unified items list
  const allItems = useMemo(() => {
    const list: any[] = [];
    epics.forEach(e => list.push({ ...e, type: 'Epic' as ItemType, name: e.name }));
    stories.forEach(s => list.push({ ...s, type: 'Story' as ItemType, name: s.title }));
    tasks.forEach(t => list.push({ ...t, type: t.type as ItemType, name: t.title }));
    return list;
  }, [epics, stories, tasks]);

  // Extract unique statuses across all items for the filter
  const allStatuses = useMemo(() => {
    const statuses = new Set<string>();
    allItems.forEach(item => {
      if (item.status) statuses.add(item.status);
    });
    return Array.from(statuses).sort();
  }, [allItems]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || item.type === filterType;
      const matchesPriority = filterPriority === 'All' || item.priority === filterPriority;
      const matchesAssignee = filterAssignee === 'All' || (item.ownerId === filterAssignee || item.assignedTo === filterAssignee);
      const matchesSprint = filterSprint === 'All' || item.sprintId === filterSprint;
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      
      return matchesSearch && matchesType && matchesPriority && matchesAssignee && matchesSprint && matchesStatus;
    });
  }, [allItems, search, filterType, filterPriority, filterAssignee, filterSprint, filterStatus]);

  const getTypeIcon = (type: ItemType) => {
    switch(type) {
      case 'Epic': return <Briefcase className="w-4 h-4 text-indigo-500" />;
      case 'Story': return <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'Task': return <CheckSquare className="w-4 h-4 text-sky-500" />;
      case 'Bug': return <Bug className="w-4 h-4 text-rose-500" />;
      default: return <Layers className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleItemClick = (type: ItemType, id: string) => {
    // App.tsx handles 'epic', 'story', and 'task'
    // Tasks and Bugs both use the 'task' detail view
    if (type === 'Epic') onNavigate('epic', id);
    else if (type === 'Story') onNavigate('story', id);
    else if (type === 'Task' || type === 'Bug') onNavigate('task', id);
  };

  const resetFilters = () => {
    setSearch('');
    setFilterType('All');
    setFilterPriority('All');
    setFilterAssignee('All');
    setFilterSprint('All');
    setFilterStatus('All');
  };

  const commonSelectStyle = "px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm text-gray-700";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Global Discovery</h2>
          <p className="text-gray-500 text-sm font-medium">Cross-initiative visibility across the platform hierarchy.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search across all deliverables..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className={commonSelectStyle}>
              <option value="All">All Types</option>
              <option value="Epic">Epics</option>
              <option value="Story">Stories</option>
              <option value="Task">Tasks</option>
              <option value="Bug">Bugs</option>
            </select>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={commonSelectStyle}>
              <option value="All">All Statuses</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)} className={commonSelectStyle}>
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            <select value={filterSprint} onChange={e => setFilterSprint(e.target.value)} className={commonSelectStyle}>
              <option value="All">All Sprints</option>
              <option value="">Backlog (None)</option>
              {sprints.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className={commonSelectStyle}>
              <option value="All">All Owners</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>

            <button onClick={resetFilters} className="p-3.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl transition-all shadow-sm flex items-center gap-2" title="Reset Filters">
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Item Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Designation</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sprint</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Priority</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Owner</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length > 0 ? filteredItems.map((item, idx) => {
                const sprint = sprints.find(s => s.id === item.sprintId);
                return (
                  <tr key={`${item.type}-${item.id}-${idx}`} onClick={() => handleItemClick(item.type, item.id)} className="hover:bg-indigo-50/30 cursor-pointer transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.type === 'Bug' ? 'bg-rose-50 border-rose-100' : 'bg-gray-50 border-gray-100'}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-xs">{item.name}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {sprint ? (
                        <div className="flex items-center gap-2 text-indigo-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{sprint.name}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Backlog</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.priority === 'High' || item.priority === 'Urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-sky-50 text-sky-600 border-sky-100'}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <img src={users.find(u => u.id === (item.ownerId || item.assignedTo))?.avatar} className="w-7 h-7 rounded-full border border-gray-100 shadow-sm" alt="" />
                         <span className="text-xs font-bold text-gray-600">{users.find(u => u.id === (item.ownerId || item.assignedTo))?.name.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-600 transition-colors ml-auto" />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center text-gray-400 font-bold">No strategic items found in current delivery landscape.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryView;
