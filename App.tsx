import React, { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ReportView } from './components/ReportView';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderView = () => {
    switch(currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.WIZARD:
        return (
          <DiagnosticWizard 
            onComplete={() => setCurrentView(ViewState.REPORT)} 
            onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
          />
        );
      case ViewState.REPORT:
        return <ReportView onBack={() => setCurrentView(ViewState.DASHBOARD)} />;
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