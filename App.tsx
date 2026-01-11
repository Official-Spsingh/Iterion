
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  ChevronDown, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Activity, 
  X,
  Globe,
  Zap,
  Filter,
  LogOut,
  UserCircle,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { PROJECTS, MOCK_USERS, INITIAL_EPICS, INITIAL_STORIES, MOCK_SPRINTS } from './constants';
import { User, Epic, Project, Story, StoryStatus, Priority, Task, Sprint } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import EpicPortfolio from './components/EpicPortfolio';
import ProjectDetail from './components/ProjectDetail';
import TaskDetail from './components/TaskDetail';
import SubTaskDetail from './components/SubTaskDetail';
import DiscoveryView from './components/DiscoveryView';
import AdminPanel from './components/AdminPanel';
import ChatAssistant from './components/ChatAssistant';
import TeamView from './components/TeamView';
import ProfileView from './components/ProfileView';
import OrgSettingsView from './components/OrgSettingsView';
import SuperAdminView from './components/SuperAdminView';
import AuthView from './components/AuthView';

type ViewTab = 'dashboard' | 'kanban' | 'epics' | 'team' | 'admin' | 'chat' | 'profile' | 'settings' | 'superadmin' | 'epic-detail' | 'story-detail' | 'task-detail' | 'discovery';

interface BoardFilters {
  assignee: string;
  priority: string;
  epic: string;
  status: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'update' | 'alert' | 'message';
  read: boolean;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>(PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project>(allProjects[0]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [sprints, setSprints] = useState<Sprint[]>(MOCK_SPRINTS);
  const [epics, setEpics] = useState<Epic[]>(INITIAL_EPICS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Sprint 28 Deployment', description: 'Multi-region cluster config updated by Sarah Chen.', time: '2m ago', type: 'update', read: false },
    { id: '2', title: 'High Priority Bug', description: 'New critical defect reported in Auth Module.', time: '1h ago', type: 'alert', read: false },
    { id: '3', title: 'Strategy Briefing', description: 'Iterion AI generated new sprint recommendations.', time: '3h ago', type: 'message', read: true },
  ]);

  const [filters, setFilters] = useState<BoardFilters>({
    assignee: '',
    priority: '',
    epic: '',
    status: ''
  });

  const isSuperAdmin = currentUser?.role === 'SuperAdmin';

  // Apply project branding globally
  useEffect(() => {
    const styleId = 'project-branding-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    const branding = currentProject.branding || { primaryColor: '#6366f1', fontFamily: 'Inter' };
    const color = branding.primaryColor;
    
    styleEl.innerHTML = `
      :root {
        --project-primary: ${color};
      }
      .bg-indigo-600 { background-color: var(--project-primary) !important; }
      .text-indigo-600 { color: var(--project-primary) !important; }
      .border-indigo-600 { border-color: var(--project-primary) !important; }
      .ring-indigo-600 { --tw-ring-color: var(--project-primary) !important; }
      .hover\\:bg-indigo-700:hover { filter: brightness(0.9); }
      .shadow-indigo-100 { --tw-shadow-color: ${color}20 !important; }
      .bg-indigo-50 { background-color: ${color}10 !important; }
      .text-indigo-400 { color: ${color}90 !important; }
    `;
    
    document.body.style.fontFamily = `'${branding.fontFamily}', 'Inter', sans-serif`;
  }, [currentProject]);

  // Handle outside clicks for popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsProfilePopoverOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const projectEpics = useMemo(() => 
    epics.filter(e => e.projectId === currentProject.id), 
  [epics, currentProject]);

  const projectUsers = useMemo(() => 
    users.filter(u => u.projectId === currentProject.id),
  [users, currentProject]);

  const projectStories = useMemo(() => 
    stories.filter(s => {
      const parentEpic = epics.find(e => e.id === s.epicId);
      return parentEpic?.projectId === currentProject.id;
    }),
  [stories, epics, currentProject]);

  const projectTasks = useMemo(() => 
    tasks.filter(t => projectStories.some(s => s.id === t.storyId)),
  [tasks, projectStories]);

  const filteredStories = useMemo(() => 
    projectStories.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAssignee = !filters.assignee || s.assignedTo === filters.assignee;
      const matchesPriority = !filters.priority || s.priority === filters.priority;
      const matchesEpic = !filters.epic || s.epicId === filters.epic;
      const matchesStatus = !filters.status || s.status === filters.status;
      
      return matchesSearch && matchesAssignee && matchesPriority && matchesEpic && matchesStatus;
    }),
  [projectStories, searchQuery, filters]);

  const [newStoryForm, setNewStoryForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    epicId: '',
    sprintId: '',
    priority: 'Medium' as Priority,
    status: 'Todo' as StoryStatus,
    points: 3
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const userProject = allProjects.find(p => p.id === user.projectId) || allProjects[0];
    setCurrentProject(userProject);
    setIsAuthenticated(true);
    if (user.role === 'SuperAdmin') setActiveTab('superadmin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsProfilePopoverOpen(false);
    setActiveTab('dashboard');
  };

  const handleSignup = (name: string, email: string) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      role: 'Member',
      avatar: `https://picsum.photos/seed/${email}/100/100`,
      projectId: allProjects[0].id
    };
    setUsers(prev => [...prev, newUser]);
    handleLogin(newUser);
  };

  const handleProjectSwitch = (p: Project) => {
    setCurrentProject(p);
    setActiveTab('dashboard');
    setSearchQuery('');
    setFilters({ assignee: '', priority: '', epic: '', status: '' });
  };

  const addEpic = (e: Epic) => setEpics(prev => [...prev, e]);
  
  const addStory = (s: Story) => {
    setStories(prev => [...prev, s]);
    setEpics(prev => prev.map(e => 
      e.id === s.epicId ? { ...e, storyCount: e.storyCount + 1 } : e
    ));
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        if (updates.status && updates.status !== s.status) {
          let diff = 0;
          if (s.status === 'Closed' && updates.status !== 'Closed') diff = -1;
          else if (s.status !== 'Closed' && updates.status === 'Closed') diff = 1;
          setEpics(prevEpics => prevEpics.map(e => 
            e.id === s.epicId ? { ...e, completedStoryCount: e.completedStoryCount + diff } : e
          ));
        }
        return updated;
      }
      return s;
    }));
  };

  const addTask = (t: Task) => setTasks(prev => [...prev, t]);
  const updateTask = (id: string, updates: Partial<Task>) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const handleQuickAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    const story: Story = {
      id: `s_${Date.now()}`,
      ...newStoryForm,
      assignedTo: newStoryForm.assignedTo || projectUsers[0]?.id || '',
      sprintId: newStoryForm.sprintId || undefined
    };
    addStory(story);
    setIsNewStoryModalOpen(false);
  };

  const handleUpdateOrg = (updates: Partial<Project>) => {
    setAllProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, ...updates } : p));
    setCurrentProject(prev => ({ ...prev, ...updates }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isAuthenticated) return <AuthView users={users} onLogin={handleLogin} onSignup={handleSignup} />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser!} org={currentProject} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-50 relative">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button disabled={!isSuperAdmin} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isSuperAdmin ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}`}>
                <span className="text-xl">{currentProject.logo}</span>
                <span className="font-semibold text-gray-800">{currentProject.name}</span>
                {isSuperAdmin && <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {isSuperAdmin && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                  {allProjects.map(p => (
                    <button key={p.id} onClick={() => handleProjectSwitch(p)} className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3 ${currentProject.id === p.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                      <span>{p.logo}</span><span>{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-6 w-[1px] bg-gray-200"></div>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search Workspace..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none text-sm outline-none w-48 md:w-64" />
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationPopoverOpen(!isNotificationPopoverOpen)}
                className={`p-2 rounded-full transition-all relative ${isNotificationPopoverOpen ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationPopoverOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-0 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-[60]">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h4 className="text-sm font-black text-gray-900">Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors relative cursor-pointer ${!n.read ? 'bg-indigo-50/20' : ''}`}>
                        {!n.read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                          n.type === 'alert' ? 'bg-rose-100 text-rose-600' : 
                          n.type === 'update' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {n.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : 
                           n.type === 'update' ? <CheckCircle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-black text-gray-900">{n.title}</p>
                            <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{n.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{n.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-50">
                    <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">View Activity History</button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={popoverRef}>
              <button 
                onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)} 
                className={`flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl transition-all ${isProfilePopoverOpen ? 'bg-indigo-50 shadow-sm' : 'hover:bg-gray-100'}`}
              >
                <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black">{currentUser?.name}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{currentUser?.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfilePopoverOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Popover */}
              {isProfilePopoverOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-[60]">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-sm font-black text-gray-900">{currentUser?.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{currentUser?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { setActiveTab('profile'); setIsProfilePopoverOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                    >
                      <UserCircle className="w-4 h-4" /> View Profile
                    </button>
                    <button 
                      onClick={() => { setActiveTab('settings'); setIsProfilePopoverOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                    >
                      <SettingsIcon className="w-4 h-4" /> Workspace Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' && <Dashboard projects={projectEpics} stories={stories} sprints={sprints} org={currentProject} />}
          {activeTab === 'discovery' && (
            <DiscoveryView 
              epics={projectEpics}
              stories={projectStories}
              tasks={projectTasks}
              users={projectUsers}
              sprints={sprints}
              onNavigate={(tab, id) => {
                if (tab === 'epic') { setSelectedEpicId(id); setActiveTab('epic-detail'); }
                if (tab === 'story') { setSelectedStoryId(id); setActiveTab('story-detail'); }
                if (tab === 'task') { setSelectedTaskId(id); setActiveTab('task-detail'); }
              }}
            />
          )}
          {activeTab === 'kanban' && (
            <KanbanBoard 
              stories={filteredStories}
              epics={projectEpics}
              users={users}
              sprints={sprints}
              onUpdateStory={updateStory}
              onViewStory={(id) => { setSelectedStoryId(id); setActiveTab('story-detail'); }}
              onAddStory={() => setIsNewStoryModalOpen(true)}
              filters={filters}
              setFilters={setFilters}
              projectUsers={projectUsers}
            />
          )}
          {activeTab === 'epics' && (
            <EpicPortfolio 
              epics={projectEpics}
              onViewEpic={(id) => { setSelectedEpicId(id); setActiveTab('epic-detail'); }}
              onAddEpic={addEpic}
              users={projectUsers}
            />
          )}
          {activeTab === 'epic-detail' && selectedEpicId && (
            <ProjectDetail 
              project={epics.find(e => e.id === selectedEpicId)!}
              tasks={stories.filter(s => s.epicId === selectedEpicId)}
              users={users}
              sprints={sprints}
              onUpdateProject={(id, updates) => setEpics(prev => prev.map(e => e.id === id ? {...e, ...updates} : e))}
              onAddTask={addStory}
              onViewTask={(id) => { setSelectedStoryId(id); setActiveTab('story-detail'); }}
              onBack={() => setActiveTab('epics')}
            />
          )}
          {activeTab === 'story-detail' && selectedStoryId && (
            <TaskDetail 
              task={stories.find(s => s.id === selectedStoryId)!}
              project={epics.find(e => e.id === stories.find(s => s.id === selectedStoryId)!.epicId)!}
              users={users}
              sprints={sprints}
              tasks={tasks.filter(t => t.storyId === selectedStoryId)}
              onUpdateTask={updateStory}
              onDeleteTask={(id) => { setStories(prev => prev.filter(s => s.id !== id)); setActiveTab('kanban'); }}
              onAddTask={addTask}
              onViewSubTask={(id) => { setSelectedTaskId(id); setActiveTab('task-detail'); }}
              onNavigateToEpic={(id) => { setSelectedEpicId(id); setActiveTab('epic-detail'); }}
              onBack={() => setActiveTab('kanban')}
            />
          )}
          {activeTab === 'task-detail' && selectedTaskId && (
            <SubTaskDetail 
              task={tasks.find(t => t.id === selectedTaskId)!}
              story={stories.find(s => s.id === tasks.find(t => t.id === selectedTaskId)!.storyId)!}
              users={users}
              onUpdateTask={updateTask}
              onDeleteTask={(id) => { deleteTask(id); setActiveTab('story-detail'); }}
              onNavigateToStory={(id) => { setSelectedStoryId(id); setActiveTab('story-detail'); }}
              onBack={() => setActiveTab('story-detail')}
            />
          )}
          {activeTab === 'team' && <TeamView users={projectUsers} org={currentProject} currentUser={currentUser!} />}
          {activeTab === 'profile' && <ProfileView user={currentUser!} onUpdate={(id, u) => setUsers(prev => prev.map(usr => usr.id === id ? {...usr, ...u} : usr))} org={currentProject} />}
          {activeTab === 'settings' && <OrgSettingsView org={currentProject} onUpdateOrg={handleUpdateOrg} />}
          {activeTab === 'chat' && <ChatAssistant org={currentProject} projects={allProjects} />}
          {activeTab === 'admin' && <AdminPanel org={currentProject} users={projectUsers} onAddUser={(u) => setUsers(prev => [...prev, u])} onUpdateUser={(id, u) => setUsers(prev => prev.map(usr => usr.id === id ? {...usr, ...u} : usr))} onDeleteUser={(id) => setUsers(prev => prev.filter(usr => usr.id !== id))} currentUser={currentUser!} />}
          {activeTab === 'superadmin' && isSuperAdmin && (
            <SuperAdminView 
              organizations={allProjects} 
              allUsers={users}
              onAddOrg={(o) => setAllProjects(prev => [...prev, o])}
              onDeleteOrg={(id) => setAllProjects(prev => prev.filter(p => p.id !== id))}
              onSwitchOrg={handleProjectSwitch}
              onAddUser={(u) => setUsers(prev => [...prev, u])}
              onUpdateUser={(id, u) => setUsers(prev => prev.map(usr => usr.id === id ? {...usr, ...u} : usr))}
            />
          )}
        </main>
      </div>

      {/* Global Story Creation Modal */}
      {isNewStoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black">Quick Define Story</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Cross-Epic Requirement Provisioning</p>
              </div>
              <button onClick={() => setIsNewStoryModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleQuickAddStory} className="p-10 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 px-1">Story Title</label>
                <input required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.title} onChange={e => setNewStoryForm({...newStoryForm, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 px-1">Epic</label>
                  <select required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.epicId} onChange={e => setNewStoryForm({...newStoryForm, epicId: e.target.value})}>
                    <option value="">Select Epic...</option>
                    {projectEpics.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 px-1">Sprint</label>
                  <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.sprintId} onChange={e => setNewStoryForm({...newStoryForm, sprintId: e.target.value})}>
                    <option value="">Backlog (None)</option>
                    {sprints.map(s => <option key={s.id} value={s.id}>{s.name} ({s.status})</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 px-1">Assignee</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.assignedTo} onChange={e => setNewStoryForm({...newStoryForm, assignedTo: e.target.value})}>
                    {projectUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 px-1">Priority</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.priority} onChange={e => setNewStoryForm({...newStoryForm, priority: e.target.value as Priority})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 px-1">Status</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.status} onChange={e => setNewStoryForm({...newStoryForm, status: e.target.value as StoryStatus})}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready for Testing">Ready for Testing</option>
                    <option value="Under Testing">Under Testing</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 px-1">SP Points</label>
                  <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" value={newStoryForm.points} onChange={e => setNewStoryForm({...newStoryForm, points: parseInt(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest mt-6 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Initialize Requirement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
