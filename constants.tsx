
import { Project, User, Epic, Story, Sprint } from './types';

export const PROJECTS: Project[] = [
  { id: 'p_1', name: 'CloudScale Solutions', domain: 'cloudscale.io', logo: '☁️' },
  { id: 'p_2', name: 'DataOps Core', domain: 'dataops.tech', logo: '📊' },
];

export const MOCK_SPRINTS: Sprint[] = [
  { id: 'sp_24', name: 'Sprint 24', startDate: '2024-01-01', endDate: '2024-01-14', status: 'Completed', capacity: 25 },
  { id: 'sp_25', name: 'Sprint 25', startDate: '2024-01-15', endDate: '2024-01-28', status: 'Completed', capacity: 25 },
  { id: 'sp_26', name: 'Sprint 26', startDate: '2024-01-29', endDate: '2024-02-11', status: 'Completed', capacity: 30 },
  { id: 'sp_27', name: 'Sprint 27', startDate: '2024-02-12', endDate: '2024-02-25', status: 'Completed', capacity: 30 },
  { id: 'sp_28', name: 'Sprint 28', startDate: '2024-02-26', endDate: '2024-03-10', status: 'Active', capacity: 35 },
  { id: 'sp_29', name: 'Sprint 29', startDate: '2024-03-11', endDate: '2024-03-24', status: 'Future', capacity: 35 },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Shubham Pratap Singh', email: 'spsingh@gmail.com', role: 'SuperAdmin', avatar: 'https://picsum.photos/seed/spsingh/100/100', projectId: 'p_1' },
  { id: 'u2', name: 'Marcus Miller', email: 'marcus@cloudscale.io', role: 'Admin', avatar: 'https://picsum.photos/seed/marcus/100/100', projectId: 'p_1' },
  { id: 'u3', name: 'Elena Rodriguez', email: 'elena@dataops.tech', role: 'Admin', avatar: 'https://picsum.photos/seed/elena/100/100', projectId: 'p_2' },
  { id: 'u4', name: 'David Kim', email: 'david@cloudscale.io', role: 'Member', avatar: 'https://picsum.photos/seed/david/100/100', projectId: 'p_1' },
];

export const INITIAL_EPICS: Epic[] = [
  { 
    id: 'e1', 
    name: 'Kubernetes Multi-Region Cluster', 
    description: 'Scaling our core infrastructure to support global low-latency requests across 12 regions.', 
    status: 'In Progress', 
    priority: 'Urgent', 
    ownerId: 'u1',
    projectId: 'p_1',
    storyCount: 5,
    completedStoryCount: 4,
    team: ['u1', 'u2', 'u4']
  },
];

export const INITIAL_STORIES: Story[] = [
  // Past completed stories for chart data
  { id: 's_old_1', epicId: 'e1', title: 'Legacy Cluster Audit', description: '', assignedTo: 'u1', status: 'Closed', priority: 'Medium', points: 8, sprintId: 'sp_24' },
  { id: 's_old_2', epicId: 'e1', title: 'Auth Service Migration', description: '', assignedTo: 'u2', status: 'Closed', priority: 'High', points: 13, sprintId: 'sp_24' },
  { id: 's_old_3', epicId: 'e1', title: 'Region Latency Tests', description: '', assignedTo: 'u4', status: 'Closed', priority: 'Low', points: 5, sprintId: 'sp_25' },
  { id: 's_old_4', epicId: 'e1', title: 'VPC Peering Setup', description: '', assignedTo: 'u4', status: 'Closed', priority: 'High', points: 13, sprintId: 'sp_25' },
  { id: 's_old_5', epicId: 'e1', title: 'Node Pool Tuning', description: '', assignedTo: 'u1', status: 'Closed', priority: 'Medium', points: 21, sprintId: 'sp_26' },
  { id: 's_old_6', epicId: 'e1', title: 'DNS Optimization', description: '', assignedTo: 'u2', status: 'Closed', priority: 'Urgent', points: 8, sprintId: 'sp_27' },
  { id: 's_old_7', epicId: 'e1', title: 'Resource Quota Hardening', description: '', assignedTo: 'u4', status: 'Closed', priority: 'Medium', points: 13, sprintId: 'sp_27' },
  // Active story
  { 
    id: 's1', 
    epicId: 'e1', 
    title: 'Terraform Module Refactoring', 
    description: 'As a DevOps engineer, I need modular Terraform templates to ensure consistent regional deployment.',
    assignedTo: 'u4', 
    status: 'In Progress',
    priority: 'High',
    points: 5,
    sprintId: 'sp_28'
  },
];
