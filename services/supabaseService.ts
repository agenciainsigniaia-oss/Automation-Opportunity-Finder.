import { supabase } from '../lib/supabaseClient';
import { Client, DiagnosticData, AnalysisResult } from '../types';

export const saveDiagnostic = async (
    clientData: Partial<Client>,
    wizardData: DiagnosticData,
    analysisResult: AnalysisResult
) => {
    try {
        // 1. Check if client exists or create one (Simplified for MVP)
        let clientId: string;

        const query = supabase.from('clients').select('id');
        if (clientData.email) {
            query.eq('email', clientData.email);
        } else {
            query.eq('company_name', clientData.companyName);
        }

        const { data: client, error: clientError } = await query.maybeSingle();

        if (clientError || !client) {
            const { data: newClient, error: createError } = await supabase
                .from('clients')
                .insert([{
                    name: clientData.name || clientData.companyName,
                    company_name: clientData.companyName,
                    email: clientData.email,
                    industry: clientData.industry,
                    status: 'lead'
                }])
                .select()
                .single();

            if (createError) throw createError;
            clientId = newClient.id;
        } else {
            clientId = client.id;
        }

        // 2. Save Diagnostic
        const { data: diagnostic, error: diagError } = await supabase
            .from('diagnostics')
            .insert([{
                client_id: clientId,
                wizard_data: wizardData,
                analysis_result: analysisResult
            }])
            .select()
            .single();

        if (diagError) throw diagError;
        return diagnostic;
    } catch (error) {
        console.error('Error saving diagnostic to Supabase:', error);
        return null;
    }
};

export const getRecentDiagnostics = async () => {
    const { data, error } = await supabase
        .from('diagnostics')
        .select('*, clients(*)')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching recent diagnostics:', error);
        return [];
    }
    return data;
};

export const generateQuoteLink = async (diagnosticId: string, extraData: any = {}) => {
    try {
        const { data, error } = await supabase
            .from('quotes')
            .insert([{
                diagnostic_id: diagnosticId,
                status: 'pending',
                ...extraData
            }])
            .select()
            .single();

        if (error) throw error;

        const publicUrl = `${window.location.origin}/share/${data.public_token}`;
        return publicUrl;
    } catch (error) {
        console.error('Error generating quote link:', error);
        return null;
    }
};
export const getAllClients = async () => {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching all clients:', error);
        return [];
    }
    return data;
};

export const updateClient = async (id: string, updates: Partial<Client>) => {
    const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating client:', error);
        return null;
    }
    return data;
};
