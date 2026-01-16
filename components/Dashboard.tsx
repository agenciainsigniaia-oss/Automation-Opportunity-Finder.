import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientStatus } from '../types';
import { getRecentDiagnostics } from '../services/supabaseService';
import { useAppContext } from '../AppContext';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Search,
  MoreHorizontal,
  Calendar
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setAnalysisResult, setCurrentDiagnosticId } = useAppContext();
  const [recentDiagnostics, setRecentDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecentDiagnostics();
      setRecentDiagnostics(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPotential = recentDiagnostics.reduce((sum, d) => sum + (d.analysis_result?.totalSavingsYear || 0), 0);
  const activeCount = recentDiagnostics.length;

  const handleViewReport = (diagnostic: any) => {
    setAnalysisResult(diagnostic.analysis_result);
    setCurrentDiagnosticId(diagnostic.id);
    navigate('/report');
  };

  return (
    <div className="space-y-8 animate-fade-in text-text-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Hola, Consultor</h1>
          <p className="text-text-muted mt-1">Aquí está el resumen de tu pipeline hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="bg-surface border border-gray-200 dark:border-none rounded-full py-2 pl-10 pr-4 text-sm text-text-main focus:ring-2 focus:ring-primary outline-none w-64"
            />
          </div>
          <button
            onClick={() => navigate('/wizard')}
            className="bg-primary text-white font-semibold px-4 py-2 rounded-full hover:bg-primaryDark transition-colors flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
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
          value={`$${(totalPotential / 1000).toFixed(1)}k`}
          change="+100%"
          trend="up"
          description="Ahorro anual identificado"
          icon={<TrendingUp className="text-success" />}
        />
        <KpiCard
          title="Diagnósticos Totales"
          value={activeCount.toString()}
          change={`+${recentDiagnostics.filter(d => new Date(d.created_at).toDateString() === new Date().toDateString()).length}`}
          trend="up"
          description="Reportes generados"
          icon={<Users className="text-primary" />}
        />
        <KpiCard
          title="Seguimientos"
          value={recentDiagnostics.filter(d => d.clients?.status === 'lead').length.toString()}
          change="Hoy"
          trend="down"
          description="Prospectos sin cerrar"
          icon={<AlertTriangle className="text-accent" />}
        />
      </div>

      {/* Recent Activity / Clients */}
      <div className="bg-surface rounded-2xl p-6 border border-gray-200 dark:border-surfaceHighlight shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Diagnósticos Recientes</h2>
          <button className="text-sm text-primary hover:text-primaryDark">Ver todo</button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-10 text-center animate-pulse text-text-muted">Cargando datos...</div>
          ) : recentDiagnostics.length === 0 ? (
            <div className="py-10 text-center text-text-muted bg-surfaceHighlight/20 rounded-xl border border-dashed border-text-muted/20">
              Todavía no tienes diagnósticos. ¡Haz tu primero!
            </div>
          ) : (
            recentDiagnostics.map((diagnostic) => (
              <DiagnosticRow
                key={diagnostic.id}
                diagnostic={diagnostic}
                onClick={() => handleViewReport(diagnostic)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<any> = ({ title, value, change, trend, icon, description }) => (
  <div className="bg-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-surfaceHighlight rounded-xl">{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'}`}>
        {change}
      </span>
    </div>
    <div className="relative z-10">
      <h3 className="text-text-muted text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-text-main mt-1">{value}</p>
      <p className="text-[10px] text-text-muted mt-2">{description}</p>
    </div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl group-hover:from-primary/20 transition-all duration-500" />
  </div>
);

const DiagnosticRow: React.FC<{ diagnostic: any; onClick: () => void }> = ({ diagnostic, onClick }) => {
  const client = diagnostic.clients;
  const savings = diagnostic.analysis_result?.totalSavingsYear?.toLocaleString();
  const date = new Date(diagnostic.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-surfaceHighlight transition-colors group cursor-pointer border border-transparent hover:border-primary/20"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary">
          {client?.company_name?.[0] || 'C'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-text-main">{client?.company_name || 'Sin Empresa'}</h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surfaceHighlight text-text-muted uppercase font-black tracking-tight border border-text-muted/10">
              {client?.industry}
            </span>
          </div>
          <p className="text-sm text-text-muted flex items-center gap-1.5 mt-0.5">
            <Users size={12} /> {client?.name || 'Consultor'} • {client?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-1.5 text-success font-black text-sm">
            <TrendingUp size={14} /> ${savings} <span className="text-[9px] opacity-60">/año</span>
          </div>
          <p className="text-[10px] text-text-muted flex items-center justify-end gap-1 mt-1">
            <Calendar size={10} /> {date}
          </p>
        </div>
        <button className="p-2 text-text-muted hover:text-text-main rounded-full hover:bg-surfaceHighlight">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
};