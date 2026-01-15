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
  clientName: string;
  industry: string;
  tools: string[];
  painPoints: string[];
  customTools?: string[];
  audioBase64?: string; // Raw base64 audio data
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  effort: 'Bajo' | 'Medio' | 'Alto';
  impact: 'Bajo' | 'Medio' | 'Alto';
  estimatedSavings: string; // Formatted string e.g. "$1,200/mes"
}

export interface AnalysisResult {
  problemSummary: string; // New field for the AI summary
  opportunities: Opportunity[];
  totalSavingsMonth: number;
  totalSavingsYear: number;
  roiMultiplier: number;
  implementationCost: number;
  chartData: { month: string; manual: number; automated: number }[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  REPORT = 'REPORT',
  SETTINGS = 'SETTINGS'
}