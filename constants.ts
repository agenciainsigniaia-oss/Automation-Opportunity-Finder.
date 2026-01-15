import { Client, ClientStatus } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Jony Alby',
    email: 'jony@nixtioteam.com',
    companyName: 'Nixtio Team',
    countryCode: 'US',
    industry: 'SaaS',
    status: ClientStatus.ACTIVE_PROPOSAL,
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    lastContact: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@fintech.io',
    companyName: 'FinFlow',
    countryCode: 'SG',
    industry: 'Finance',
    status: ClientStatus.LEAD,
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    lastContact: '1 day ago'
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@buildit.com',
    companyName: 'BuildIt Construction',
    countryCode: 'MX',
    industry: 'Construction',
    status: ClientStatus.CONVERTED,
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    lastContact: '3 days ago'
  }
];

export const AVAILABLE_TOOLS = [
  'HubSpot', 'Salesforce', 'Zapier', 'Make (Integromat)', 
  'Slack', 'Microsoft Teams', 'Notion', 'Airtable', 
  'Quickbooks', 'Xero', 'Shopify', 'WordPress'
];

export const INDUSTRIES = [
  'SaaS / Tech', 'E-commerce', 'Finance', 'Healthcare', 
  'Construction', 'Real Estate', 'Legal', 'Marketing Agency'
];

export const PAIN_POINTS_SUGGESTIONS = [
  'Data Entry Errors', 'Slow Lead Response', 'Invoicing Delays', 
  'Customer Support Overload', 'Reporting Manual Work', 'Inventory Sync Issues'
];