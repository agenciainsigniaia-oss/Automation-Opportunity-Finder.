import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalysisResult } from './types';

interface AppContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    analysisResult: AnalysisResult | null;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    currentDiagnosticId: string | null;
    setCurrentDiagnosticId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [currentDiagnosticId, setCurrentDiagnosticId] = useState<string | null>(null);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <AppContext.Provider value={{
            isDarkMode,
            toggleTheme,
            analysisResult,
            setAnalysisResult,
            currentDiagnosticId,
            setCurrentDiagnosticId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
