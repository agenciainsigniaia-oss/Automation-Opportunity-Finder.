import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Send,
    Sparkles,
    Clock,
    CheckCircle,
    XCircle,
    Link2,
    RefreshCw,
    ChevronRight
} from 'lucide-react';
import {
    getQuotesWithClients,
    getEmailHistory,
    generateEmailDraft,
    sendQuoteEmail,
    saveEmailRecord,
    updateEmailStatus,
    EmailPayload
} from '../services/emailService';

export const QuotesManager: React.FC = () => {
    const navigate = useNavigate();

    // Quote/Client Selection
    const [quotes, setQuotes] = useState<any[]>([]);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
    const [selectedQuote, setSelectedQuote] = useState<any>(null);

    // Email Composer
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // History
    const [emailHistory, setEmailHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadQuotes();
        loadHistory();
    }, []);

    const loadQuotes = async () => {
        const data = await getQuotesWithClients();
        setQuotes(data);
    };

    const loadHistory = async () => {
        setLoadingHistory(true);
        const data = await getEmailHistory();
        setEmailHistory(data);
        setLoadingHistory(false);
    };

    // When quote selection changes
    useEffect(() => {
        if (selectedQuoteId) {
            const quote = quotes.find(q => q.id === selectedQuoteId);
            setSelectedQuote(quote);
        } else {
            setSelectedQuote(null);
        }
    }, [selectedQuoteId, quotes]);

    const getClientFromQuote = (quote: any) => {
        return quote?.diagnostics?.clients || null;
    };

    const getShareLink = (quote: any) => {
        return `${window.location.origin}/share/${quote?.public_token}`;
    };

    const handleGenerateWithAI = async () => {
        if (!selectedQuote) return;

        const client = getClientFromQuote(selectedQuote);
        const analysisResult = selectedQuote?.diagnostics?.analysis_result;

        setIsGenerating(true);
        const draft = await generateEmailDraft({
            clientName: client?.name || 'Cliente',
            companyName: client?.company_name || 'Empresa',
            savingsYear: analysisResult?.totalSavingsYear || 0,
            opportunities: selectedQuote?.items || analysisResult?.opportunities || [],
            shareLink: getShareLink(selectedQuote)
        });

        setSubject(draft.subject);
        setBody(draft.body);
        setIsGenerating(false);
    };

    const handleInsertLink = () => {
        if (!selectedQuote) return;
        const link = getShareLink(selectedQuote);
        setBody(prev => prev + `\n\n📎 Ver propuesta: ${link}`);
    };

    const handleSendEmail = async () => {
        if (!selectedQuote || !subject.trim() || !body.trim()) {
            alert('Por favor completa el asunto y el cuerpo del correo.');
            return;
        }

        const client = getClientFromQuote(selectedQuote);
        const analysisResult = selectedQuote?.diagnostics?.analysis_result;

        if (!client?.email) {
            alert('El cliente no tiene correo registrado.');
            return;
        }

        setIsSending(true);

        try {
            // 1. Send via n8n first (Valindando)
            const payload: EmailPayload = {
                email: client.email,
                subject: subject,
                body: body
            };

            const result = await sendQuoteEmail(payload);

            if (!result.success) {
                throw new Error(result.error || 'n8n no devolvió una respuesta exitosa');
            }

            // 2. ONLY if n8n confirms, save the record to history
            await saveEmailRecord({
                quote_id: selectedQuoteId,
                client_id: client.id,
                subject,
                body,
                recipient_email: client.email,
                status: 'sent'
            });

            // 3. Success: Reset form and refresh
            setSubject('');
            setBody('');
            setSelectedQuoteId('');
            loadHistory();

        } catch (error: any) {
            console.error('Send Error:', error);
            alert(`Error en el proceso: ${error.message}`);

            // Optional: Save as failed if we have a partial record? 
            // In this logic, it won't appear on the right if it fails.
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-text-main">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Gestor de Cotizaciones</h1>
                    <p className="text-text-muted mt-1">Envía propuestas personalizadas a tus clientes</p>
                </div>
                <button
                    onClick={loadHistory}
                    className="p-2 rounded-full hover:bg-surfaceHighlight text-text-muted hover:text-text-main transition-colors"
                    title="Actualizar historial"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left: Email Composer */}
                <div className="bg-surface rounded-2xl border border-surfaceHighlight p-6 space-y-5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Mail size={20} className="text-primary" />
                        Componer Correo
                    </h2>

                    {/* Quote Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Seleccionar Cotización</label>
                        <select
                            value={selectedQuoteId}
                            onChange={(e) => setSelectedQuoteId(e.target.value)}
                            className="w-full bg-surfaceHighlight border border-transparent rounded-xl px-4 py-3 text-text-main outline-none focus:border-primary"
                        >
                            <option value="">-- Elige una cotización --</option>
                            {quotes.map(q => {
                                const client = getClientFromQuote(q);
                                return (
                                    <option key={q.id} value={q.id}>
                                        {client?.company_name || 'Sin empresa'} — {client?.email || 'Sin email'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Client Info Display */}
                    {selectedQuote && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                            <p className="font-bold text-primary">{getClientFromQuote(selectedQuote)?.company_name}</p>
                            <p className="text-text-muted">{getClientFromQuote(selectedQuote)?.name} • {getClientFromQuote(selectedQuote)?.email}</p>
                            <p className="text-success font-bold mt-2">
                                Ahorro: ${selectedQuote?.diagnostics?.analysis_result?.totalSavingsYear?.toLocaleString()}/año
                            </p>
                        </div>
                    )}

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Asunto</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Propuesta de automatización..."
                            className="w-full bg-surfaceHighlight border border-transparent rounded-xl px-4 py-3 text-text-main outline-none focus:border-primary"
                        />
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Cuerpo del Correo</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            rows={8}
                            className="w-full bg-surfaceHighlight border border-transparent rounded-xl px-4 py-3 text-text-main outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleGenerateWithAI}
                            disabled={!selectedQuote || isGenerating}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
                            {isGenerating ? 'Generando...' : 'Escribir con IA'}
                        </button>

                        <button
                            onClick={handleInsertLink}
                            disabled={!selectedQuote}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surfaceHighlight text-text-muted font-semibold hover:bg-surfaceHighlight/80 transition-colors disabled:opacity-50"
                        >
                            <Link2 size={16} />
                            Insertar Link
                        </button>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSendEmail}
                        disabled={!selectedQuote || !subject || !body || isSending}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        <Send size={18} />
                        {isSending ? 'Enviando...' : 'Enviar Correo'}
                    </button>
                </div>

                {/* Right: Email History */}
                <div className="bg-surface rounded-2xl border border-surfaceHighlight p-6 space-y-5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Clock size={20} className="text-accent" />
                        Historial de Correos
                    </h2>

                    {loadingHistory ? (
                        <div className="py-10 text-center animate-pulse text-text-muted">
                            Cargando historial...
                        </div>
                    ) : emailHistory.length === 0 ? (
                        <div className="py-10 text-center text-text-muted bg-surfaceHighlight/20 rounded-xl border border-dashed border-text-muted/20">
                            No has enviado correos aún.
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {emailHistory.map((email) => (
                                <EmailHistoryCard key={email.id} email={email} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const EmailHistoryCard: React.FC<{ email: any }> = ({ email }) => {
    const client = email.quotes?.diagnostics?.clients;
    const date = new Date(email.sent_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="p-4 bg-surfaceHighlight/30 rounded-xl border border-surfaceHighlight hover:border-primary/20 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-main truncate">{email.subject}</h4>
                    <p className="text-xs text-text-muted truncate">
                        {client?.company_name} • {email.recipient_email}
                    </p>
                </div>
                <StatusBadge status={email.status} />
            </div>
            <p className="text-sm text-text-muted line-clamp-2 mb-2">{email.body}</p>
            <div className="flex items-center justify-between text-[10px] text-text-muted">
                <span>{date}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config = {
        sent: { icon: CheckCircle, color: 'text-success bg-success/15 border-success/30', label: 'Enviado' },
        pending: { icon: Clock, color: 'text-accent bg-accent/15 border-accent/30', label: 'Pendiente' },
        failed: { icon: XCircle, color: 'text-red-500 bg-red-500/15 border-red-500/30', label: 'Fallido' }
    }[status] || { icon: Clock, color: 'text-text-muted bg-surfaceHighlight border-transparent', label: status };

    const Icon = config.icon;

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${config.color}`}>
            <Icon size={12} className={status === 'sent' ? 'text-success' : ''} />
            {config.label}
        </span>
    );
};
