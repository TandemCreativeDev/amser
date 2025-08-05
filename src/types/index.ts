export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    defaultView: "timer" | "dashboard";
    timeFormat: "12h" | "24h";
    weekStart: "monday" | "sunday";
  };
}

export interface Organisation {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  settings: {
    timeFormat: "12h" | "24h";
    currency: string;
    weekStart: "monday" | "sunday";
    categories: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganisationMember {
  _id: string;
  organisationId: string;
  userId: string;
  role: "admin" | "member";
  joinedAt: Date;
}

export interface Client {
  _id: string;
  name: string;
  colour: string;
  isPersonal: boolean;
  organisationId?: string;
  userId: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  name: string;
  clientId: string;
  category?: string;
  colour: string;
  defaultRate: number;
  isPersonal: boolean;
  organisationId?: string;
  userId: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntry {
  _id: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  projectId: string;
  clientId: string;
  appliedRate: number;
  isPersonal: boolean;
  organisationId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RateRule {
  _id: string;
  name: string;
  projectId: string;
  baseRate: number;
  conditions: {
    weeklyHoursThreshold: number;
    newRate: number;
  }[];
  isActive: boolean;
  userId: string;
  organisationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerState {
  isRunning: boolean;
  startTime?: Date;
  description: string;
  projectId?: string;
  clientId?: string;
  elapsedSeconds: number;
}

export type ViewMode = "personal" | "organisation";

export interface UserSession extends User {
  organisations: (Organisation & { role: "admin" | "member" })[];
  currentOrganisation?: Organisation;
  viewMode: ViewMode;
}

// Populated types for frontend use
export interface ProjectWithClient extends Project {
  clientId: Client;
}

export interface TimeEntryWithDetails extends TimeEntry {
  projectId: Project;
  clientId: Client;
}
