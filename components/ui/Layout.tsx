import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Settings,
  Bell,
  Mail,
  Users
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-background text-text-main overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r border-gray-200 dark:border-surfaceHighlight bg-surface/50 backdrop-blur-md transition-colors duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200 dark:border-surfaceHighlight">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="ml-3 font-semibold text-lg hidden lg:block text-text-main">AutoFinder</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Panel"
            active={isActive('/')}
            onClick={() => navigate('/')}
          />
          <SidebarItem
            icon={<PlusCircle size={20} />}
            label="Nuevo Diagnóstico"
            active={isActive('/wizard')}
            onClick={() => navigate('/wizard')}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            label="Reportes"
            active={isActive('/report')}
            onClick={() => navigate('/report')}
          />
          <SidebarItem
            icon={<Mail size={20} />}
            label="Cotizaciones"
            active={isActive('/quotes')}
            onClick={() => navigate('/quotes')}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Clientes"
            active={isActive('/clients')}
            onClick={() => navigate('/clients')}
          />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-surfaceHighlight">
          <SidebarItem
            icon={<Settings size={20} />}
            label="Configuración"
            active={isActive('/settings')}
            onClick={() => navigate('/settings')}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 flex md:hidden items-center justify-between px-4 border-b border-gray-200 dark:border-surfaceHighlight bg-white/80 dark:bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white mr-3">
              A
            </div>
            <span className="font-semibold text-text-main">AutoFinder</span>
          </div>
          <Bell size={20} className="text-gray-400" />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-surface/90 backdrop-blur-lg border-t border-gray-200 dark:border-surfaceHighlight flex items-center justify-around z-50 pb-safe">
          <MobileNavItem
            icon={<LayoutDashboard size={24} />}
            active={isActive('/')}
            onClick={() => navigate('/')}
          />
          <div className="relative -top-5">
            <button
              onClick={() => navigate('/wizard')}
              className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 transform transition-transform active:scale-95"
            >
              <PlusCircle size={28} />
            </button>
          </div>
          <MobileNavItem
            icon={<FileText size={24} />}
            active={isActive('/report')}
            onClick={() => navigate('/report')}
          />
        </nav>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${active
      ? 'bg-primary/10 text-primary'
      : 'text-text-muted hover:bg-surfaceHighlight hover:text-text-main'
      }`}
  >
    <span className={`${active ? 'text-primary' : 'text-text-muted group-hover:text-text-main'}`}>{icon}</span>
    <span className="ml-3 font-medium hidden lg:block">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary hidden lg:block" />}
  </button>
);

const MobileNavItem = ({ icon, active = false, onClick }: { icon: any, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${active ? 'text-primary' : 'text-text-muted'
      }`}
  >
    {icon}
  </button>
);