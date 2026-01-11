
export type Role = 'SuperAdmin' | 'Admin' | 'Manager' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  projectId: string; // The Organization (Tenant) ID
}

export interface Project { // The Tenant / Organization level
  id: string;
  name: string;
  domain: string;
  logo: string;
  branding?: {
    primaryColor: string;
    darkMode: boolean;
    fontFamily: string;
  };
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Future' | 'Active' | 'Completed';
  capacity: number;
}

export type EpicStatus = 'Planning' | 'In Progress' | 'Review' | 'Completed';
export type StoryStatus = 'Todo' | 'In Progress' | 'Ready for Testing' | 'Under Testing' | 'Closed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ItemType = 'Epic' | 'Story' | 'Task' | 'Bug';

export interface Epic {
  id: string;
  name: string;
  description: string;
  status: EpicStatus;
  priority: Priority;
  ownerId: string;
  projectId: string; // Tenant ID
  tags?: string[];
  storyCount: number;
  completedStoryCount: number;
  team: string[];
  sprintId?: string; // Optional: Epic can start in a sprint
}

export interface Story {
  id: string;
  epicId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: StoryStatus;
  priority: Priority;
  points: number;
  sprintId?: string; // Linked sprint
}

export interface Task {
  id: string;
  storyId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: Priority;
  type: 'Task' | 'Bug';
  sprintId?: string; // Inherited or direct sprint assignment
}
