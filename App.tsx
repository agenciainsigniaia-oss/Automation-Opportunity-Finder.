import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { ReportView } from './components/ReportView';
import { SettingsView } from './components/SettingsView';
import { PublicReportView } from './components/PublicReportView';
import { QuotesManager } from './components/QuotesManager';
import { ClientsManager } from './components/ClientsManager';
import { AppProvider, useAppContext } from './AppContext';

const AppRoutes = () => {
  const { analysisResult, setAnalysisResult, isDarkMode, toggleTheme } = useAppContext();

  return (
    <Routes>
      <Route path="/share/:token" element={<PublicReportView />} />
      <Route path="*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/wizard" element={<DiagnosticWizard />} />
            <Route
              path="/report"
              element={
                analysisResult ? <ReportView data={analysisResult} /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              }
            />
            <Route path="/quotes" element={<QuotesManager />} />
            <Route path="/clients" element={<ClientsManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;