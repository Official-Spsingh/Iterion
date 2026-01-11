
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area,
  Line
} from 'recharts';
import { Epic, Project, Story, Sprint } from '../types';
import { TrendingUp, CheckCircle2, AlertCircle, Zap, Activity, Target } from 'lucide-react';

interface DashboardProps {
  projects: Epic[];
  stories: Story[];
  sprints: Sprint[];
  org: Project;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ projects, stories, sprints, org }) => {
  // Calculate real metrics from the Epics and Stories
  const metrics = useMemo(() => {
    const activeOrgStories = stories.filter(s => projects.some(p => p.id === s.epicId));
    const totalPoints = activeOrgStories.reduce((acc, s) => acc + s.points, 0);
    const completedPoints = activeOrgStories
      .filter(s => s.status === 'Closed')
      .reduce((acc, s) => acc + s.points, 0);
    
    const avgProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    const urgentItems = projects.filter(p => p.priority === 'Urgent' && p.status !== 'Completed').length;

    return {
      activeEpics: projects.length,
      completionRate: `${avgProgress}%`,
      deliveredPoints: completedPoints,
      atRisk: urgentItems
    };
  }, [projects, stories]);

  // Dynamic Velocity Data - calculated from actual story points in each sprint
  const velocityTrend = useMemo(() => {
    return sprints
      .filter(s => s.status !== 'Future')
      .map(s => {
        const sprintStories = stories.filter(st => st.sprintId === s.id);
        const delivered = sprintStories
          .filter(st => st.status === 'Closed')
          .reduce((acc, st) => acc + st.points, 0);
        
        return {
          sprint: s.name,
          delivered: delivered,
          target: s.capacity
        };
      });
  }, [sprints, stories]);

  const stats = [
    { label: 'Active Epics', value: metrics.activeEpics, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Global Velocity', value: metrics.completionRate, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Delivered Points', value: metrics.deliveredPoints, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Critical Blockers', value: metrics.atRisk, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    projects.forEach(p => {
      counts[p.priority] = (counts[p.priority] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [projects]);

  const deliveryData = useMemo(() => {
    return projects.map(p => ({
      name: p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name,
      completed: p.completedStoryCount,
      total: p.storyCount,
      remaining: Math.max(0, p.storyCount - p.completedStoryCount)
    })).slice(0, 6);
  }, [projects]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Project Insights</h2>
          <p className="text-gray-500 mt-1 font-medium italic">Performance overview for <span className="font-bold text-indigo-600 not-italic">{org.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all border-b-4 hover:border-b-indigo-500 group">
            <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Calculated Sprint Velocity (SP)</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Points Done</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Planned Capacity</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area type="monotone" dataKey="delivered" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorDelivered)" />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-rose-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900">Portfolio Mix</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{value} Priority</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900">Delivery Status by Epic</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" name="Done" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} stackId="a" />
                <Bar dataKey="remaining" name="Backlog" fill="#f1f5f9" radius={[0, 4, 4, 0]} barSize={12} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center border border-white/5">
          <Zap className="absolute -right-16 -bottom-16 w-80 h-80 text-indigo-500/10 rotate-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                  <Zap className="w-7 h-7 fill-white" />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Iterion Intelligence</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time Analytics Report</p>
               </div>
            </div>
            <h3 className="text-3xl font-black mb-6 leading-tight tracking-tight">Strategy Forecast</h3>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed opacity-90 max-w-md font-medium">
              Based on the last sprint cycle, your team is maintaining a steady output. {metrics.atRisk > 0 ? `Attention: ${metrics.atRisk} urgent items require immediate review to avoid milestone slippage.` : "All critical paths are currently within standard delivery variance."}
            </p>
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95">Optimize Workflows</button>
              <button className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 border border-white/10">Strategic Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
