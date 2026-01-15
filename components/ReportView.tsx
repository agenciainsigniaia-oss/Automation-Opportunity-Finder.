import React from 'react';
import { AnalysisResult } from '../types';
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
  onBack: () => void;
}

export const ReportView: React.FC<ReportProps> = ({ data, onBack }) => {
  // Safe guard if data is missing
  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-in text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
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
          <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-300 text-sm hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 flex items-center gap-2">
            <Edit3 size={14} /> Editar
          </button>
          <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primaryDark flex items-center gap-2 shadow-lg shadow-primary/20">
            <Share2 size={16} /> Compartir Propuesta
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Proyección de Costos (6 Meses)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
           <div className="bg-white dark:bg-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight shadow-sm">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Multiplicador ROI</h3>
             <div className="text-4xl font-bold mb-1">{data.roiMultiplier}x</div>
             <p className="text-sm text-gray-500">Retorno de inversión en 12 meses.</p>
           </div>
           
           <div className="bg-white dark:bg-surface p-6 rounded-2xl border border-gray-200 dark:border-surfaceHighlight shadow-sm">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Ahorro Mensual</h3>
             <div className="text-4xl font-bold mb-1">${(data.totalSavingsMonth).toLocaleString()}</div>
             <p className="text-sm text-gray-500">Proyección una vez implementado.</p>
           </div>
        </div>

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
            {data.opportunities.map((opp, idx) => (
              <OpportunityCard 
                key={idx}
                title={opp.title} 
                desc={opp.description}
                impact={opp.impact}
                savings={opp.estimatedSavings}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const OpportunityCard = ({ title, desc, impact, savings }: any) => (
  <div className="bg-gray-50 dark:bg-surfaceHighlight/50 p-5 rounded-xl border border-transparent hover:border-primary/30 transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{title}</h4>
      <span className={`text-xs px-2 py-1 rounded-md ${impact === 'Alto' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' : impact === 'Medio' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}>
        Impacto {impact}
      </span>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">{desc}</p>
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
        <CheckCircle size={14} /> {savings}
      </div>
      <button className="text-xs bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200">
        Agregar
      </button>
    </div>
  </div>
);