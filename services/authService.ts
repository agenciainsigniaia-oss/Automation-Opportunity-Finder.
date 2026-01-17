import { supabase } from '../lib/supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

// Sign Up - Supabase will send verification email automatically
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/login`
        }
    });

    return {
        user: data.user,
        session: data.session,
        error
    };
};

// Sign In with email/password
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return {
        user: data.user,
        session: data.session,
        error
    };
};

// Sign Out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

// Get current session
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
};

// Get current user
export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
};

// Resend verification email
export const resendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email
    });
    return { error };
};

// Auth state change listener
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
};
