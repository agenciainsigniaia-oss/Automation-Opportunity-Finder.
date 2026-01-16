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
    lastContact: 'Hace 2 horas',
    urgency: 'high'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@fintech.io',
    companyName: 'FinFlow',
    countryCode: 'SG',
    industry: 'Finanzas',
    status: ClientStatus.LEAD,
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    lastContact: 'Hace 1 día',
    urgency: 'medium'
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@buildit.com',
    companyName: 'Constructora BuildIt',
    countryCode: 'MX',
    industry: 'Construcción',
    status: ClientStatus.CONVERTED,
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    lastContact: 'Hace 3 días',
    urgency: 'low'
  }
];

export const AVAILABLE_TOOLS = [
  'GHL', 'n8n', 'Make', 'Airtable',
  'Whatsapp', 'Zapier', 'Wordpress'
];

export const INDUSTRIES = [
  'SaaS / Tech', 'E-commerce', 'Finanzas', 'Salud',
  'Construcción', 'Inmobiliaria', 'Legal', 'Agencia de Marketing'
];

export const PAIN_POINTS_SUGGESTIONS = [
  'Errores de Entrada de Datos', 'Respuesta Lenta a Leads', 'Retrasos en Facturación',
  'Sobrecarga de Soporte', 'Reportes Manuales', 'Problemas de Sync de Inventario'
];