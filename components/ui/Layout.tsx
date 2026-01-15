import React from 'react';
import { ViewState } from '../../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Settings, 
  Menu,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r border-surfaceHighlight bg-surface/50 backdrop-blur-md">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-surfaceHighlight">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="ml-3 font-semibold text-lg hidden lg:block">AutoFinder</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === ViewState.DASHBOARD}
            onClick={() => onChangeView(ViewState.DASHBOARD)}
          />
          <SidebarItem 
            icon={<PlusCircle size={20} />} 
            label="New Diagnostic" 
            active={currentView === ViewState.WIZARD}
            onClick={() => onChangeView(ViewState.WIZARD)}
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Reports" 
            active={currentView === ViewState.REPORT}
            onClick={() => onChangeView(ViewState.REPORT)}
          />
        </nav>

        <div className="p-4 border-t border-surfaceHighlight">
          <SidebarItem icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 flex md:hidden items-center justify-between px-4 border-b border-surfaceHighlight bg-surface/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white mr-3">
              A
            </div>
            <span className="font-semibold">AutoFinder</span>
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-lg border-t border-surfaceHighlight flex items-center justify-around z-50 pb-safe">
          <MobileNavItem 
            icon={<LayoutDashboard size={24} />} 
            active={currentView === ViewState.DASHBOARD}
            onClick={() => onChangeView(ViewState.DASHBOARD)}
          />
          <div className="relative -top-5">
            <button 
              onClick={() => onChangeView(ViewState.WIZARD)}
              className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 transform transition-transform active:scale-95"
            >
              <PlusCircle size={28} />
            </button>
          </div>
          <MobileNavItem 
            icon={<FileText size={24} />} 
            active={currentView === ViewState.REPORT}
            onClick={() => onChangeView(ViewState.REPORT)}
          />
        </nav>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-primary/10 text-primary' 
        : 'text-gray-400 hover:bg-surfaceHighlight hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`}>{icon}</span>
    <span className="ml-3 font-medium hidden lg:block">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary hidden lg:block" />}
  </button>
);

const MobileNavItem = ({ icon, active = false, onClick }: { icon: any, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      active ? 'text-primary' : 'text-gray-500'
    }`}
  >
    {icon}
  </button>
);