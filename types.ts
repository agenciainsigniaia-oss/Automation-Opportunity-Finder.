export enum ClientStatus {
  LEAD = 'lead',
  ACTIVE_PROPOSAL = 'active_proposal',
  CONVERTED = 'converted',
  LOST = 'lost'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  companyName: string;
  countryCode: string; // ISO2
  industry: string;
  status: ClientStatus;
  avatarUrl?: string;
  lastContact?: string;
}

export interface DiagnosticData {
  tools: string[];
  painPoints: string[];
  manualHoursPerWeek: number;
  hourlyRate: number;
  voiceNoteUrl?: string;
  voiceTranscript?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  estimatedSavings: number; // Monthly
}

export interface AnalysisResult {
  opportunities: Opportunity[];
  totalSavingsMonth: number;
  totalSavingsYear: number;
  roiMultiplier: number;
  implementationCost: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  REPORT = 'REPORT'
}