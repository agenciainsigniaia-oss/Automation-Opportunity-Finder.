import React from 'react';
import { ViewState } from '../types';
import { Moon, Sun } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8">Configuración</h1>
      
      <div className="bg-white dark:bg-surface rounded-2xl border border-gray-200 dark:border-surfaceHighlight overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-surfaceHighlight">
          <h2 className="text-lg font-semibold">Apariencia</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Personaliza cómo se ve AutoFinder.</p>
        </div>
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-500'}`}>
              {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <p className="font-medium">Modo {isDarkMode ? 'Oscuro' : 'Claro'}</p>
              <p className="text-sm text-gray-500">Alternar entre temas claro y oscuro.</p>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};