import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ReportView } from './components/ReportView';
import { SettingsView } from './components/SettingsView';
import { ViewState, AnalysisResult } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  // Default to dark mode to match initial design
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Toggle class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentView(ViewState.REPORT);
  };

  const renderView = () => {
    switch(currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.WIZARD:
        return (
          <DiagnosticWizard 
            onComplete={handleAnalysisComplete} 
            onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
          />
        );
      case ViewState.REPORT:
        return (
          <ReportView 
            data={analysisResult} 
            onBack={() => setCurrentView(ViewState.DASHBOARD)} 
          />
        );
      case ViewState.SETTINGS:
        return (
          <SettingsView 
            isDarkMode={isDarkMode} 
            toggleTheme={() => setIsDarkMode(!isDarkMode)} 
          />
        );
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;