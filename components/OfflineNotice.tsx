import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineNotice: React.FC = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 md:left-auto md:w-96">
            <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5" />
                <div>
                    <p className="font-semibold">Estás offline</p>
                    <p className="text-sm opacity-90">Algunas funciones pueden no estar disponibles.</p>
                </div>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors"
            >
                Reintentar
            </button>
        </div>
    );
};
