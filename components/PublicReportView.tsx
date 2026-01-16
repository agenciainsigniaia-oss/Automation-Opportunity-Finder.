import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
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
    Sparkles,
    Zap,
    ShieldCheck
} from 'lucide-react';

export const PublicReportView: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quoteFees, setQuoteFees] = useState<{ investment: number, retainer: number } | null>(null);
    const [displayOpportunities, setDisplayOpportunities] = useState<any[]>([]);

    useEffect(() => {
        const fetchPublicReport = async () => {
            try {
                const { data: quote, error: quoteError } = await supabase
                    .from('quotes')
                    .select('*, diagnostics(*)')
                    .eq('public_token', token)
                    .single();

                if (quoteError || !quote) {
                    throw new Error('No se encontró la propuesta o el link ha expirado.');
                }

                setData(quote.diagnostics.analysis_result);
                setQuoteFees({
                    investment: quote.total_investment || 0,
                    retainer: quote.monthly_retainer || 0
                });

                // Use selected items from quote if they exist, otherwise use all from diagnostic
                if (quote.items && Array.isArray(quote.items) && quote.items.length > 0) {
                    setDisplayOpportunities(quote.items);
                } else {
                    setDisplayOpportunities(quote.diagnostics.analysis_result.opportunities);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchPublicReport();
    }, [token]);

    // Recalculate totals based on displayed items
    const visibleTotalMonth = displayOpportunities.reduce((sum, opp) => {
        const value = parseInt(opp.estimatedSavings.replace(/[^0-9]/g, '')) || 0;
        return sum + value;
    }, 0);
    const visibleTotalYear = visibleTotalMonth * 12;

    const finalRoi = quoteFees?.investment && visibleTotalYear
        ? (visibleTotalYear / quoteFees.investment).toFixed(1)
        : data?.roiMultiplier;

    return (
        <div className="min-h-screen bg-background text-text-main p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                {/* Branding Header */}
                <div className="flex items-center justify-between border-b border-surfaceHighlight pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white">A</div>
                        <span className="text-xl font-bold">AutoFinder</span>
                    </div>
                    <div className="hidden sm:block text-right">
                        <p className="text-xs uppercase tracking-widest text-text-muted font-bold">Propuesta de Automatización</p>
                        <p className="text-sm font-medium">Preparado para su empresa</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="animate-pulse">Cargando propuesta personalizada...</p>
                    </div>
                ) : error || !data ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-4">
                            <ShieldCheck size={48} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Enlace no válido</h1>
                        <p className="text-text-muted">{error || 'La propuesta no está disponible.'}</p>
                    </div>
                ) : (
                    <>
                        {/* Value Proposition */}
                        <div className="text-center py-10 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={14} /> Análisis de IA Completado
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                Su Potencial de Ahorro: <span className="text-success">${(visibleTotalYear).toLocaleString()}</span>/año
                            </h1>
                            <p className="text-xl text-text-muted max-w-2xl mx-auto">
                                Hemos identificado oportunidades clave para optimizar sus procesos mediante inteligencia artificial.
                            </p>
                        </div>

                        {/* ROI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-surface p-8 rounded-3xl border border-surfaceHighlight shadow-xl flex flex-col justify-center">
                                <p className="text-text-muted text-sm font-bold uppercase mb-2">ROI a 12 Meses</p>
                                <div className="text-5xl font-black text-primary">{finalRoi}x</div>
                                <div className="mt-6 pt-6 border-t border-surfaceHighlight space-y-3">
                                    <div>
                                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Inversión Inicial</p>
                                        <p className="text-lg font-bold">${quoteFees?.investment.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Ahorro Neto Mensual</p>
                                        <p className="text-lg font-bold text-success">${(visibleTotalMonth - (quoteFees?.retainer || 0)).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-surface p-8 rounded-3xl border border-surfaceHighlight shadow-xl overflow-hidden relative">
                                <h3 className="text-lg font-bold mb-6">Proyección de Optimización de Costos</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.chartData}>
                                            <defs>
                                                <linearGradient id="pubColorAuto" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="manual" stroke="#ef4444" fill="transparent" strokeDasharray="5 5" name="Actual" />
                                            <Area type="monotone" dataKey="automated" stroke="#6366f1" fillOpacity={1} fill="url(#pubColorAuto)" name="Optimizado" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Problem Summary */}
                        <div className="bg-surfaceHighlight/30 p-8 rounded-3xl border border-surfaceHighlight italic relative">
                            <Zap size={24} className="absolute -top-3 -left-3 text-accent bg-background p-1 rounded-full border border-surfaceHighlight" />
                            <p className="text-lg leading-relaxed text-text-main font-medium">
                                "{data.problemSummary}"
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-6 pt-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <CheckCircle className="text-success" /> Hoja de Ruta Sugerida
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayOpportunities.map((opp, idx) => (
                                    <div key={idx} className="bg-surface p-6 rounded-2xl border border-surfaceHighlight hover:border-primary/50 transition-all shadow-sm group">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-lg">{opp.title}</h4>
                                            <span className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary font-black uppercase tracking-widest">{opp.impact} Impacto</span>
                                        </div>
                                        <p className="text-text-muted text-sm leading-relaxed mb-4">{opp.description}</p>
                                        <div className="text-success font-bold text-sm flex items-center gap-2">
                                            <Zap size={14} fill="currentColor" /> Ahorro: {opp.estimatedSavings}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action Footer */}
                        <div className="bg-gradient-to-br from-primary to-accent p-10 rounded-[2.5rem] text-white text-center shadow-2xl shadow-primary/20 mt-12">
                            <h2 className="text-3xl font-black mb-4">¿Listo para empezar?</h2>
                            <p className="mb-8 opacity-90 max-w-lg mx-auto font-medium">
                                Hablemos sobre cómo implementar estas soluciones en su empresa y comenzar a ahorrar este mes.
                            </p>
                            <button className="bg-white text-primary font-black px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-lg">
                                Contactar Consultor
                            </button>
                        </div>
                    </>
                )}

                <footer className="text-center py-10 text-text-muted text-xs font-medium">
                    &copy; 2026 AutoFinder AI. Reservados todos los derechos.
                </footer>
            </div>
        </div>
    );
};
