import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '../types';
import { useAppContext } from '../AppContext';
import { generateQuoteLink } from '../services/supabaseService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  CheckCircle,
  ArrowLeft,
  Share2,
  Edit3,
  FileAudio
} from 'lucide-react';

interface ReportProps {
  data: AnalysisResult | null;
  onBack?: () => void;
}

export const ReportView: React.FC<ReportProps> = ({ data, onBack }) => {
  const navigate = useNavigate();
  const { currentDiagnosticId } = useAppContext();
  const [shareUrl, setShareUrl] = React.useState<string | null>(null);
  const [copying, setCopying] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedOpportunities, setEditedOpportunities] = React.useState(data.opportunities);
  const [implementationFee, setImplementationFee] = React.useState(data.implementationCost || 1500);
  const [monthlyRetainer, setMonthlyRetainer] = React.useState(data.monthlyRetainer || 300);
  const [selectedIds, setSelectedIds] = React.useState<string[]>(data.opportunities.map(o => o.id)); // Default all selected

  // Sync edits if data changes
  React.useEffect(() => {
    setEditedOpportunities(data.opportunities);
  }, [data.opportunities]);

  // Safe guard if data is missing
  if (!data) return null;

  const handleShare = async () => {
    if (!currentDiagnosticId) {
      alert("No hay un diagnóstico guardado para compartir.");
      return;
    }

    const selectedItems = editedOpportunities.filter(o => selectedIds.includes(o.id));

    // Pass fees and items to be saved in the quote
    const url = await generateQuoteLink(currentDiagnosticId, {
      total_investment: implementationFee,
      monthly_retainer: monthlyRetainer,
      items: selectedItems
    });

    if (url) {
      setShareUrl(url);
      navigator.clipboard.writeText(url);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const handleBack = onBack || (() => navigate('/'));

  return (
    <div className="space-y-8 animate-fade-in text-text-main">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-surfaceHighlight text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Análisis de Oportunidad</h1>
            <p className="text-success font-medium">Ahorro Anual Estimado: ${(data.totalSavingsYear).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 text-sm font-medium ${isEditing
              ? 'bg-accent/10 border-accent text-accent'
              : 'border-surfaceHighlight text-text-muted hover:text-text-main hover:border-text-muted'
              }`}
          >
            <Edit3 size={14} /> {isEditing ? 'Guardar Cambios' : 'Editar'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 md:flex-none bg-primary text-white font-semibold px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-primaryDark transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Share2 size={18} />
            {copying ? '¡Copiado!' : shareUrl ? 'Copiar Link' : 'Generar Link'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart Section */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Proyección de Costos (6 Meses)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#27272a]" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #18181b)', borderColor: 'var(--tooltip-border, #27272a)', borderRadius: '8px', color: 'var(--tooltip-text, #fff)' }}
                  itemStyle={{ color: '#8884d8' }}
                />
                <Area type="monotone" dataKey="manual" stroke="#ef4444" fillOpacity={1} fill="url(#colorManual)" name="Costo Manual" />
                <Area type="monotone" dataKey="automated" stroke="#6366f1" fillOpacity={1} fill="url(#colorAuto)" name="Costo Automatizado" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-6 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 rounded-full bg-red-500"></div> Trayectoria Actual
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 rounded-full bg-primary"></div> Con Automatización
            </div>
          </div>
        </div>

        {/* ROI Stats */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-surfaceHighlight shadow-sm">
            <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">Inversión Sugerida</h3>
            <div className="text-4xl font-bold mb-1 text-primary">${implementationFee.toLocaleString()}</div>
            <p className="text-xs text-text-muted mt-2">Costo único de implementación.</p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-surfaceHighlight shadow-sm">
            <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">Multiplicador ROI</h3>
            <div className="text-4xl font-bold mb-1">
              {implementationFee > 0
                ? (data.totalSavingsYear / implementationFee).toFixed(1)
                : data.roiMultiplier}x
            </div>
            <p className="text-sm text-text-muted">Retorno de inversión en 12 meses.</p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-surfaceHighlight shadow-sm">
            <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">Ahorro Neto Mensual</h3>
            <div className="text-4xl font-bold mb-1 text-success">
              ${(data.totalSavingsMonth - monthlyRetainer).toLocaleString()}
            </div>
            <p className="text-sm text-text-muted">Descontando fee de mantenimiento (${monthlyRetainer}/mes).</p>
          </div>
        </div>

        {/* Commercial Configuration (Consultant only) */}
        {!shareUrl && (
          <div className="lg:col-span-3 bg-surface p-6 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Configuración de Propuesta Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Costo de Implementación (One-time)</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-text-main">$</span>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={implementationFee}
                    onChange={(e) => setImplementationFee(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <input
                    type="number"
                    value={implementationFee}
                    onChange={(e) => setImplementationFee(parseInt(e.target.value) || 0)}
                    className="w-24 bg-surfaceHighlight p-2 rounded-lg font-bold text-center outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Mantenimiento / Retainer Mensual</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-text-main">$</span>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={monthlyRetainer}
                    onChange={(e) => setMonthlyRetainer(parseInt(e.target.value))}
                    className="flex-1 accent-accent"
                  />
                  <input
                    type="number"
                    value={monthlyRetainer}
                    onChange={(e) => setMonthlyRetainer(parseInt(e.target.value) || 0)}
                    className="w-24 bg-surfaceHighlight p-2 rounded-lg font-bold text-center outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problem Summary Section (NEW) */}
        <div className="lg:col-span-3 bg-gradient-to-r from-gray-50 to-white dark:from-surfaceHighlight/50 dark:to-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent hidden sm:block">
              <FileAudio size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <FileAudio size={20} className="sm:hidden text-accent" />
                Resumen del Problema (Texto + Audio)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                "{data.problemSummary}"
              </p>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="lg:col-span-3">
          <h3 className="text-xl font-bold mb-4">Acciones Recomendadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editedOpportunities.map((opp, idx) => (
              <OpportunityCard
                key={idx}
                index={idx}
                id={opp.id}
                title={opp.title}
                desc={opp.description}
                impact={opp.impact}
                savings={opp.estimatedSavings}
                isEditing={isEditing}
                isSelected={selectedIds.includes(opp.id)}
                onSelect={() => {
                  setSelectedIds(prev =>
                    prev.includes(opp.id) ? prev.filter(id => id !== opp.id) : [...prev, opp.id]
                  );
                }}
                onUpdate={(updatedOpp) => {
                  const newOpps = [...editedOpportunities];
                  newOpps[idx] = updatedOpp;
                  setEditedOpportunities(newOpps);
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const OpportunityCard = ({ title, desc, impact, savings, isEditing, onUpdate, index, isSelected, onSelect }: any) => (
  <div className={`p-5 rounded-2xl border transition-all group ${isSelected
    ? 'bg-surfaceHighlight/30 border-primary/50 shadow-lg shadow-primary/5'
    : 'bg-surface/50 border-surfaceHighlight opacity-60 grayscale-[0.5]'
    }`}>
    <div className="flex justify-between items-start mb-2">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate({ title: e.target.value, description: desc, impact, estimatedSavings: savings })}
          className="bg-background border border-surfaceHighlight rounded px-2 py-1 text-sm font-bold w-full mr-2 outline-none focus:border-primary"
        />
      ) : (
        <h4 className={`font-bold transition-colors ${isSelected ? 'text-text-main group-hover:text-primary' : 'text-text-muted'}`}>
          {title}
        </h4>
      )}
      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider shrink-0 ${impact === 'Alto' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' : impact === 'Medio' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-gray-500/20 text-text-muted'}`}>
        Impacto {impact}
      </span>
    </div>

    {isEditing ? (
      <textarea
        value={desc}
        onChange={(e) => onUpdate({ title, description: e.target.value, impact, estimatedSavings: savings })}
        className="bg-background border border-surfaceHighlight rounded px-2 py-1 text-xs text-text-muted w-full mt-2 h-20 outline-none focus:border-primary resize-none"
      />
    ) : (
      <p className={`text-sm mb-4 h-12 line-clamp-3 ${isSelected ? 'text-text-muted' : 'text-text-muted/50'}`}>{desc}</p>
    )}

    <div className="flex items-center justify-between pt-4 mt-2 border-t border-surfaceHighlight">
      <div className={`flex items-center gap-2 text-sm font-bold ${isSelected ? 'text-success' : 'text-text-muted'}`}>
        <CheckCircle size={14} />
        {isEditing ? (
          <input
            type="text"
            value={savings}
            onChange={(e) => onUpdate({ title, description: desc, impact, estimatedSavings: e.target.value })}
            className="bg-background border border-surfaceHighlight rounded px-2 py-1 text-xs w-24 outline-none focus:border-primary"
          />
        ) : savings}
      </div>
      {!isEditing && (
        <button
          onClick={onSelect}
          className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all ${isSelected
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20'
            : 'bg-primary text-white hover:opacity-90'
            }`}
        >
          {isSelected ? 'Quitar' : 'Añadir'}
        </button>
      )}
    </div>
  </div>
);