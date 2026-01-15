import React from 'react';
import { Client, ClientStatus, ViewState } from '../types';
import { MOCK_CLIENTS } from '../constants';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Search,
  MoreHorizontal
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in text-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Hola, Consultor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Aquí está el resumen de tu pipeline hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar clientes..." 
              className="bg-white dark:bg-surfaceHighlight border border-gray-200 dark:border-none rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none w-64"
            />
          </div>
          <button 
            onClick={() => onNavigate(ViewState.WIZARD)}
            className="bg-gray-900 dark:bg-white text-white dark:text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-black/10 dark:shadow-white/10"
          >
            <TrendingUp size={16} />
            Scan Rápido
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard 
          title="Ingreso Potencial" 
          value="$124.5k" 
          change="+12%" 
          trend="up"
          icon={<TrendingUp className="text-success" />}
        />
        <KpiCard 
          title="Diagnósticos Activos" 
          value="8" 
          change="+2" 
          trend="up"
          icon={<Users className="text-primary" />}
        />
        <KpiCard 
          title="Seguimientos Urgentes" 
          value="3" 
          change="Alto Riesgo" 
          trend="down"
          icon={<AlertTriangle className="text-accent" />}
        />
      </div>

      {/* Recent Activity / Clients */}
      <div className="bg-white dark:bg-surface rounded-2xl p-6 border border-gray-200 dark:border-surfaceHighlight shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Oportunidades Recientes</h2>
          <button className="text-sm text-primary hover:text-primaryDark">Ver todo</button>
        </div>
        
        <div className="space-y-4">
          {MOCK_CLIENTS.map((client) => (
            <ClientRow key={client.id} client={client} />
          ))}
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<any> = ({ title, value, change, trend, icon }) => (
  <div className="bg-white dark:bg-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-100 dark:bg-surfaceHighlight rounded-xl">{icon}</div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-success/20 text-success' : 'bg-red-500/20 text-red-500'}`}>
        {change}
      </span>
    </div>
    <div className="relative z-10">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
    {/* Decorative gradient blob */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl group-hover:from-primary/20 transition-all duration-500" />
  </div>
);

const ClientRow: React.FC<{ client: Client }> = ({ client }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-surfaceHighlight transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <img src={client.avatarUrl} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white">{client.companyName}</h4>
        <p className="text-sm text-gray-500">{client.name} • {client.industry}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right hidden sm:block">
        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
          client.status === ClientStatus.ACTIVE_PROPOSAL ? 'border-primary/50 text-primary bg-primary/10' :
          client.status === ClientStatus.CONVERTED ? 'border-success/50 text-success bg-success/10' :
          'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {client.status === ClientStatus.ACTIVE_PROPOSAL ? 'PROPUESTA ACTIVA' :
           client.status === ClientStatus.CONVERTED ? 'CONVERTIDO' : 
           client.status === ClientStatus.LEAD ? 'PROSPECTO' : 'PERDIDO'}
        </span>
        <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">{client.lastContact}</p>
      </div>
      <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <MoreHorizontal size={18} />
      </button>
    </div>
  </div>
);