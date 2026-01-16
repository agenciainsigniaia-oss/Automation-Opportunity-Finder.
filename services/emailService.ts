import { supabase } from '../lib/supabaseClient';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export interface EmailPayload {
    email: string;
    subject: string;
    body: string;
}

export interface EmailRecord {
    quote_id: string;
    client_id: string;
    subject: string;
    body: string;
    recipient_email: string;
    status: 'pending' | 'sent' | 'failed';
}

// Send email via n8n webhook
export const sendQuoteEmail = async (payload: EmailPayload): Promise<{ success: boolean; emailId?: string; error?: string }> => {
    try {
        if (!N8N_WEBHOOK_URL) {
            throw new Error('VITE_N8N_WEBHOOK_URL no está configurado');
        }

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Webhook Error (${response.status}): ${errorText || response.statusText}`);
        }

        // Try to parse JSON
        try {
            const data = await response.json();
            // If n8n returns an error field, treat as failure
            if (data.error || (data.success === false)) {
                return { success: false, error: data.error || 'n8n devolvió un estado de fallo' };
            }
            return { success: true, ...data };
        } catch (e) {
            // If it's 200 OK but not JSON (e.g. string "OK"), treat as success
            return { success: true };
        }
    } catch (error: any) {
        console.error('Error sending quote email:', error);
        return { success: false, error: error.message };
    }
};

// Save email record to Supabase
export const saveEmailRecord = async (data: EmailRecord) => {
    const { data: record, error } = await supabase
        .from('emails_sent')
        .insert([data])
        .select()
        .single();

    if (error) {
        console.error('Error saving email record:', error);
        throw new Error(`Supabase Insert Error: ${error.message} (${error.code})`);
    }
    return record;
};

// Update email status after send
export const updateEmailStatus = async (emailId: string, status: 'sent' | 'failed') => {
    const { error } = await supabase
        .from('emails_sent')
        .update({ status })
        .eq('id', emailId);

    if (error) {
        console.error('Error updating email status:', error);
    }
};

// Get email history
export const getEmailHistory = async () => {
    const { data, error } = await supabase
        .from('emails_sent')
        .select('*, quotes(*, diagnostics(*, clients(*)))')
        .order('sent_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching email history:', error);
        return [];
    }
    return data;
};

// Get all quotes with client info for dropdown
export const getQuotesWithClients = async () => {
    const { data, error } = await supabase
        .from('quotes')
        .select('*, diagnostics(*, clients(*))')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
    return data;
};

// Generate AI email draft using Gemini
export const generateEmailDraft = async (context: {
    clientName: string;
    companyName: string;
    savingsYear: number;
    opportunities: any[];
    shareLink: string;
}): Promise<{ subject: string; body: string }> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        return {
            subject: `Propuesta de Automatización para ${context.companyName}`,
            body: `Hola ${context.clientName},\n\nAdjunto nuestra propuesta personalizada con un potencial de ahorro de $${context.savingsYear.toLocaleString()}/año.\n\nPuede revisarla aquí: ${context.shareLink}\n\nSaludos`
        };
    }

    try {
        const prompt = `Eres un consultor de automatización profesional. Genera un correo de seguimiento para enviar una propuesta comercial.

CONTEXTO:
- Cliente: ${context.clientName}
- Empresa: ${context.companyName}
- Ahorro anual identificado: $${context.savingsYear.toLocaleString()}
- Oportunidades: ${context.opportunities.map(o => o.title).join(', ')}
- Link de la propuesta: ${context.shareLink}

INSTRUCCIONES:
1. El tono debe ser profesional pero cálido
2. Menciona el ahorro potencial como gancho
3. Incluye un CTA claro para revisar la propuesta
4. Máximo 150 palabras

RESPONDE SOLO EN JSON:
{
  "subject": "...",
  "body": "..."
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7 }
                })
            }
        );

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.error('Error generating email draft:', error);
    }

    // Fallback
    return {
        subject: `Propuesta de Automatización para ${context.companyName}`,
        body: `Hola ${context.clientName},\n\nHemos preparado una propuesta personalizada para ${context.companyName} con un potencial de ahorro anual de $${context.savingsYear.toLocaleString()}.\n\nPuede revisarla en el siguiente enlace:\n${context.shareLink}\n\nQuedamos atentos a sus comentarios.\n\nSaludos cordiales`
    };
};
